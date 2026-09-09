# Vår Kokebok

En responsiv startside og oppskriftssamling i klassisk skandinavisk stil.

## Åpne nettsiden

1. Pakk ut ZIP-filen.
2. Dobbeltklikk på `index.html`.
3. Nettsiden åpnes i nettleseren.

## Filer

- `index.html` – forsiden
- `oppskrifter.html` – kategori- og oppskriftssiden
- `style.css` – hele designet
- `recipes.js` – eksempeloppskriftene
- `app.js` – meny, filtre og oppskriftsvindu
- `assets/favicon.svg` – lite nettleserikon

## Legge inn en ny oppskrift

Åpne `recipes.js`, kopier ett oppskriftsobjekt og endre innholdet. Hver oppskrift må ha en unik `id`.

Middagskategorier:
- `fisk`
- `kylling`
- `svin`
- `biff`
- `vegetar`

## Videre utvikling

Denne versjonen lagrer oppskriftene lokalt i JavaScript. Neste naturlige steg er å:
1. Lage en database, for eksempel MySQL eller PostgreSQL.
2. Lage et API med Java/Spring Boot, Node.js eller tilsvarende.
3. Lage en innlogget side hvor dere kan legge inn og redigere oppskrifter.
4. Publisere frontend og backend på nett og koble til et domene.

Google-fontene lastes fra nettet. Nettsiden bruker reservefonter dersom den åpnes uten internett.
