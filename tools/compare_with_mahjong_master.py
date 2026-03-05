#!/usr/bin/env python3
"""Compare riichi-lite reference cases against MahjongRepository/mahjong.

Usage:
  python tools/compare_with_mahjong_master.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MAHJONG_MASTER = ROOT.parent / "mahjong-master"
if str(MAHJONG_MASTER) not in sys.path:
    sys.path.insert(0, str(MAHJONG_MASTER))

from mahjong.hand_calculating.hand import HandCalculator  # type: ignore
from mahjong.hand_calculating.hand_config import HandConfig, OptionalRules  # type: ignore
from mahjong.constants import EAST  # type: ignore


def to_136_tiles(ids34: list[int]) -> list[int]:
    """Convert 34-index tiles to a deterministic 136-index list."""
    used = [0] * 34
    out: list[int] = []
    for t in ids34:
      if t < 0 or t > 33:
          raise ValueError(f"invalid tile id: {t}")
      if used[t] >= 4:
          raise ValueError(f"tile {t} appears >4 times")
      out.append(t * 4 + used[t])
      used[t] += 1
    return out


def run_case(case: dict[str, Any]) -> tuple[bool, str]:
    calc = HandCalculator()
    tiles136 = to_136_tiles(case["tiles34"])
    win_tile_34 = int(case["win_tile"])

    # Pick one concrete 136-id of the winning tile from tiles list.
    win_tile_136 = next((x for x in tiles136 if x // 4 == win_tile_34), None)
    if win_tile_136 is None:
        return False, f"{case['id']}: win tile {win_tile_34} is not in hand"

    cfg = HandConfig(
        is_tsumo=case.get("win_type") == "tsumo",
        is_riichi=bool(case.get("riichi", False)),
        player_wind=EAST,
        round_wind=EAST,
        options=OptionalRules(
            has_open_tanyao=True,
            has_double_yakuman=True,
            has_aka_dora=False,
        ),
    )

    result = calc.estimate_hand_value(tiles136, win_tile_136, config=cfg)
    if result.error:
        return False, f"{case['id']}: engine error -> {result.error}"

    exp = case.get("expected", {})
    if "han" in exp and result.han != exp["han"]:
        return False, f"{case['id']}: han expected {exp['han']} got {result.han}"
    if "fu" in exp and result.fu != exp["fu"]:
        return False, f"{case['id']}: fu expected {exp['fu']} got {result.fu}"

    return True, f"{case['id']}: ok (han={result.han}, fu={result.fu})"


def main() -> int:
    ref = ROOT / "tools" / "reference" / "riichi_lite_cases.json"
    cases = json.loads(ref.read_text(encoding="utf-8-sig"))
    ok = 0
    for case in cases:
        passed, msg = run_case(case)
        print(msg)
        if passed:
            ok += 1
    print(f"\nPassed {ok}/{len(cases)} cases")
    return 0 if ok == len(cases) else 1


if __name__ == "__main__":
    raise SystemExit(main())
