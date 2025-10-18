
/**
 * @typedef {Object} Meal
 * @property {string} idMeal
 * @property {string} strMeal
 * @property {string=} strCategory
 * @property {string=} strArea
 * @property {string=} strInstructions
 * @property {string=} strMealThumb
 * @property {string=} strTags
 * @property {string=} strYoutube
 * // TheMealDB har strIngredient1..20 – vi hanterar dem via helpern getIngredients().
 */

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

/** Liten helper för snyggare konsolloggning */
const log = {
  title: (t) => console.log("\n%c" + t, "font-weight:bold; font-size:14px;"),
  group: (t, fn) => {
    console.groupCollapsed(t);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  },
};

/**
 * Hämtar måltider från TheMealDB.
 * @returns {Promise<Meal[]>}
 */
async function fetchMeals() {
  const res = await fetch(API_URL, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Fetch misslyckades: ${res.status} ${res.statusText}`);
  }
  /** @type {{ meals: Meal[] | null }} */
  const data = await res.json();
  return data.meals ?? [];
}

/**
 * Plockar ut ingredienser från ett Meal-objekt (strIngredient1..20).
 * @param {Meal} meal
 * @returns {string[]}
 */
function getIngredients(meal) {
  /** @type {string[]} */
  const ings = [];
  for (let i = 1; i <= 20; i += 1) {
    // @ts-ignore – fälten finns dynamiskt
    const val = (meal[`strIngredient${i}`] || "").trim();
    if (val) ings.push(val);
  }
  return ings;
}

/**
 * Enkel groupBy: grupperar items på given nyckel.
 * @template T
 * @param {T[]} items
 * @param {keyof T} key
 * @returns {Record<string, T[]>}
 */
/**
 * Grupperar items på en nyckel.
 * @template T
 * @param {T[]} items
 * @param {keyof T} key
 * @returns {Record<string, T[]>}
 */
function groupBy(items, key) {
  /** @type {Record<string, T[]>} */
  const acc = {};
  for (const item of items) {
    // @ts-ignore – key är keyof T men JavaScript tillåter inte indexering strikt
    const k = item[key];
    const bucket = k == null ? "Unknown" : String(k);
    if (!acc[bucket]) acc[bucket] = [];
    acc[bucket].push(item);
  }
  return acc;
}

/** Huvudflödet */
async function main() {
  log.title("Assignment 2 – Fetch + Array Methods");

  /** @type {Meal[]} */
  let meals = [];
  try {
    meals = await fetchMeals();
  } catch (err) {
    console.error("Kunde inte hämta data:", err);
    return;
  }

  if (meals.length === 0) {
    console.warn("API:t gav inga måltider. Testa igen senare. 🙏");
    return;
  }

  // 0) Sanity check med some/every
  log.group("Sanity check (some/every)", () => {
    const anyBeef = meals.some(
      (m) => (m.strCategory || "").toLowerCase() === "beef",
    );
    const allHaveNames = meals.every(
      (m) => typeof m.strMeal === "string" && m.strMeal.length > 0,
    );
    console.log("Finns minst en 'Beef'? ->", anyBeef);
    console.log("Har alla ett namn? ->", allHaveNames);
  });

  // 1) Första 5 namn i alfabetisk ordning
  log.group("1) Första 5 namn i alfabetisk ordning", () => {
    const firstFiveAlpha = [...meals]
      .sort((a, b) => a.strMeal.localeCompare(b.strMeal))
      .slice(0, 5)
      .map((m) => m.strMeal);
    console.log(firstFiveAlpha);
  });

  // 2) Filtrera på given kategori (namn + kategori)
  log.group("2) Alla måltider i en given kategori (namn + kategori)", () => {
    const givenCategory = "Beef"; // ändra om du vill: "Chicken", "Dessert", etc.
    const matches = meals
      .filter(
        (m) => (m.strCategory || "").toLowerCase() === givenCategory.toLowerCase(),
      )
      .map((m) => ({ name: m.strMeal, category: m.strCategory || "Unknown" }));
    console.log(`Kategori: ${givenCategory} — antal: ${matches.length}`);
    console.table(matches);
  });

  // 3) Antal måltider per kategori (reduce -> frequency map)
  log.group("3) Antal måltider per kategori (frequency map)", () => {
    const byCategoryCount = meals.reduce((acc, meal) => {
      const cat = meal.strCategory ?? "Unknown";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, /** @type {Record<string, number>} */ ({}));
    console.log(byCategoryCount);
  });

  // ----------------------------
  // STRETCH GOALS (VG)
  // ----------------------------

  // A) groupBy på strCategory
  log.group("VG A) groupBy(meals, 'strCategory')", () => {
    const grouped = groupBy(meals, "strCategory");
    const summary = Object.fromEntries(
      Object.entries(grouped).map(([k, arr]) => [k, arr.length]),
    );
    console.log(summary);
  });

  // B) Reshape – kompakta summaries
  log.group("VG B) Kompakta 'meal summaries'", () => {
    const summaries = meals.map((m) => ({
      id: m.idMeal,
      name: m.strMeal,
      category: m.strCategory ?? "Unknown",
      ingredients: getIngredients(m),
    }));
    console.dir(summaries.slice(0, 5), { depth: null });
  });

  // C) Ingredient frequency över alla rätter
  log.group("VG C) Ingredient frequency (alla måltider)", () => {
    const ingredientCounts = meals
      .flatMap((m) => getIngredients(m))
      .reduce((acc, ing) => {
        acc[ing] = (acc[ing] || 0) + 1;
        return acc;
      }, /** @type {Record<string, number>} */ ({}));
    console.log(ingredientCounts);
  });

  // Bonus: tre längsta matnamnen
  log.group("Bonus) De 3 längsta matnamnen", () => {
    const longestNames = [...meals]
      .sort((a, b) => b.strMeal.length - a.strMeal.length)
      .slice(0, 3)
      .map((m) => m.strMeal);
    console.log(longestNames);
  });

  log.title("Klart! 🎉 Kolla konsolen för alla delar.");
}

// Starta och fånga ev. fel (släcker IDE-varningen om “ignored promise”)
main().catch((err) => {
  console.error("Ov�ntat fel i main():", err);
});
