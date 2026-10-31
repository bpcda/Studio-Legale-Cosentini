# Studio Legale Cosentini

Sito React, TypeScript e Tailwind con contenuti e richieste di consulenza gestiti da Appwrite.

## Sviluppo e verifiche

```sh
npm install
npm run dev
npm test
npx tsc --noEmit -p tsconfig.app.json
npm run build
npm run preview
```

Configurare `VITE_APPWRITE_ENDPOINT` e `VITE_APPWRITE_PROJECT_ID` nell'ambiente locale o di build. Per il backend consultare [APPWRITE_SETUP.md](APPWRITE_SETUP.md). Senza configurazione il modulo segnala l'indisponibilità e non simula un invio riuscito.

## Contenuti pubblici

- `src/data/services.json` alimenta homepage, pagine `/servizi/:slug` e sitemap. I codici `serviceType` corrispondono alle aree già gestite dal modulo, dal pannello e dalle funzioni email.
- Le pagine dei servizi aprono `/consulenza?servizio=...` con l'area preselezionata. I parametri non riconosciuti vengono ignorati.
- Foto e biografie dei professionisti restano gestibili nel pannello esistente, sezione Team. Quando non sono presenti profili viene mostrato il riferimento all'Avv. Sergio Cosentini e alle sue pubblicazioni, senza inventare qualifiche o fotografie.
- L'indirizzo confermato di Napoli è Via Nuova del Campo 14, 80141 Napoli. L'indirizzo completo di Roma e le nuove fotografie autentiche devono ancora essere forniti; per Roma è disponibile il contatto telefonico.
- Il telefono resta obbligatorio per preservare il contratto della collection e delle funzioni Appwrite esistenti. Non sono necessarie migrazioni del database.

Le notifiche email mantengono l'esecuzione asincrona esistente. La conferma a schermo attesta il salvataggio della richiesta, non la consegna dell'email.
