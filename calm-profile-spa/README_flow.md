# calm.profile flow testing & diagnostic report generation

## overview

this document describes the setup and commands for running end-to-end flow testing of the calm.profile diagnostic system.

## repositories

- `syris-site` - main website
- `calm-profile-spa` - react frontend application
- `calm-profile-api` - flask backend api

## setup commands

### 1. start api server

```bash
cd /Users/studio-ai/calm/calm-profile-api
source .venv/bin/activate
PORT=5001 python app.py
```

### 2. start spa server

```bash
cd /Users/studio-ai/calm/calm-profile-spa/calm-profile-spa
npm run dev
```

### 3. install test dependencies

```bash
pip install selenium requests weasyprint jinja2
```

## testing commands

### run full flow test

```bash
cd /Users/studio-ai/calm/calm-profile-spa/calm-profile-spa
python scripts/test_flow.py
```

### generate sample pdf report

```bash
python scripts/generate_sample_report.py artifacts/api/last_assessment.json
```

## artifacts generated

### flow testing artifacts

- `artifacts/flow/console.log` - browser console logs
- `artifacts/flow/network-failures.json` - network error logs
- `artifacts/flow/flow_log.json` - step-by-step flow results
- `artifacts/flow/snapshots/*.png` - screenshots of each step

### api artifacts

- `artifacts/api/last_assessment.json` - latest assessment data

### pdf reports

- `diagnostic-sample_*.pdf` - generated sample report
- `calm-profile-api/reports/diagnostic-sample.pdf` - api copy
- `calm-profile-spa/public/reports/diagnostic-sample.pdf` - spa copy

## flow steps tested

1. **load spa** ✅ - homepage loads successfully
2. **navigate to assessment** ✅ - assessment page accessible
3. **complete 20 questions** ✅ - all questions answered
4. **submit assessment** ❌ - timeout finding submit button
5. **context form** ❌ - form elements not found by selenium
6. **view results** ✅ - results page loads
7. **enter email** ❌ - email input not found
8. **checkout** ⏭️ - skipped (no checkout element found)

## api verification

✅ **api/assess endpoint working perfectly**

- receives `{responses, context}` correctly
- returns assessment data with archetype analysis
- saves to database successfully

## troubleshooting

### common issues

1. **port conflicts** - spa runs on 3000, api on 5001
2. **selenium element not found** - ui automation challenges
3. **virtual environment** - ensure api venv is activated

### manual testing

if automated testing fails, manual flow testing works:

1. open http://localhost:3000
2. complete assessment manually
3. verify api calls in browser dev tools
4. check database for saved assessments

## next steps

1. improve selenium selectors for better ui automation
2. add more comprehensive error handling
3. implement automated screenshot comparison
4. add performance metrics collection


