# calm-profile-spa (syrıs.)
react + vite single-page app for **calm.profile** (assessment → results-lite → $495 checkout → thank-you scheduler).

## run (dev)
```bash
npm install
npm run dev:all   # starts mock api (:5000) + vite (:3000)
# open http://localhost:3000
```

## endpoints expected (when you use the real api)
- POST `/api/assess` → `{ success, assessment_id, archetype, scores, metrics, recommendations }`
- POST `/api/create-checkout` → `{ checkout_url }`

## build
```bash
npm run build
npm run preview
```

brand: dotless **syrıs.**, inter + jetbrains mono, teal #00c9a7 used sparingly.
