# Assigment2

# Assignment 2

Innehåll

- `index.html` – minimal HTML5-boilerplate som laddar `app.js`
- `app.js` – all logik: `fetch` + array-metoder
- `README.md` – denna fil

> Uppgiftskrav: hämta JSON via `fetch`, använd `map`, `filter`, `reduce`, `flatMap`, `some`, `every`, `sort`, `slice`, skriv ut i konsolen (inget UI krävs). Samt tre utskrifter:  
> 1) **Första 5 måltidsnamn i alfabetisk ordning**  
> 2) **Alla måltider i en given kategori (namn + kategori)**  
> 3) **Objekt med antal per kategori**  
> Stretch: **groupBy**, **reshape**, **ingredient frequency**. :contentReference[oaicite:1]{index=1}

Snabbstart

1. Klona eller skapa ett nytt repo i GitHub som heter **Assignment 2** (Publikt enligt instruktionerna). :contentReference[oaicite:2]{index=2}  
2. Öppna mappen i **WebStorm**.  
3. Kör en enkel live server (eller öppna `index.html` direkt i webbläsaren).  
4. Öppna **DevTools → Console**. All output hamnar där.

> API: [TheMealDB](https://www.themealdb.com/api.php) – jag använder `https://www.themealdb.com/api/json/v1/1/search.php?s=` som returnerar en lista av måltider med många fält (bl.a. `strMeal`, `strCategory` och `strIngredient1..20`).

Hur koden funkar (kortfattat)

- `fetchMeals()` hämtar JSON och returnerar `meals`-arrayen (eller tom array om API:t är tomt).
- Vi gör en **sanity check** med `some`/`every` för att visa att datan ser vettig ut.
- **Del 1**: Sorterar kopia av listan på `strMeal` med `localeCompare`, tar `slice(0, 5)`, och `map` till bara namn.  
- **Del 2**: `filter` på `strCategory` (case-insensitiv), `map` till `{ name, category }`, `console.table`.
- **Del 3**: `reduce` till ett objekt `{ kategori: count }`.
- **Stretch A (groupBy)**: Egen `groupBy(items, key)` som grupperar t.ex. efter `strCategory`.
- **Stretch B (reshape)**: Gör kompakta summaries `{ id, name, category, ingredients: [...] }` där `ingredients` byggs via en liten helper som plockar `strIngredient1..20`.
- **Stretch C (ingredient frequency)**: `flatMap(getIngredients)` för att få en lång lista med alla ingredienser och `reduce` till `{ ingredient: count }`.

Var hittar jag resultaten?

Allting skrivs till **konsolen**:
- “1) Första 5 namn i alfabetisk ordning” → array med 5 strängar
- “2) Alla måltider i en given kategori” → `console.table` med namn + kategori
- “3) Antal måltider per kategori” → objekt med räknare
- Stretch → separata grupper i konsolen med summeringar

Ändra kategori (Del 2)

I `app.js` finns:
```js
const givenCategory = "Beef";
