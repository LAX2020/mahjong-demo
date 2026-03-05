https://lax2020.github.io/mahjong-demo/

## Unified Engine

- Shared engine file: `engine/riichi-engine.js`
- Calculator page uses: `RiichiEngine.evaluateRules46(...)`
- In-game riichi-lite scoring uses: `RiichiEngine.evaluateRiichiLite(...)`

## Reference Check Against `mahjong-master`

This repo includes a lightweight comparison script for riichi-lite baseline cases:

```powershell
python tools/compare_with_mahjong_master.py
```

Reference cases live in:

- `tools/reference/riichi_lite_cases.json`

The script imports `../mahjong-master` directly and validates expected `han/fu`.
