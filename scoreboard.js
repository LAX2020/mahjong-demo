(() => {
  "use strict";

  const panel = document.getElementById("scoreboardPanel");
  const panelBody = document.getElementById("scoreboardBody");
  const toggleBtn = document.getElementById("scoreboardToggleBtn");
  const titleEl = document.getElementById("scoreboardTitle");
  if (!panel || !panelBody || !toggleBtn || !titleEl || !window.RiichiEngine) return;

  const I18N = {
    zh: { title: "半庄计分板（实验）", toggleHide: "折叠计分板", toggleShow: "展开计分板", sheetTitle: "计分纸标题", startTime: "开始时间", endTime: "结束时间", startPoints: "初始点数", p0: "东位玩家", p1: "南位玩家", p2: "西位玩家", p3: "北位玩家", enableWestRound: "西入规则", allowRenchan: "允许连庄", drawDealerTenpaiRenchan: "流局庄听连庄", export: "导出JSON", import: "导入JSON", reset: "重置计分板", total: "当前点数", pot: "供托", plan: "场次总览", current: "当前局输入", done: "已完成对局", result: "结果", ron: "荣和", tsumo: "自摸", draw: "流局", winner: "和牌者", loser: "放铳者", dealer: "庄家", han: "番", fu: "符", honba: "本场", riichiDecl: "立直声明", tenpaiDecl: "流局听牌", textInput: "算番纯文本", parse: "解析文本", manual: "手动分差（优先）", nextRound: "完成并下一局", renchan: "完成并连庄", resetCurrent: "重置当前局", detail: "修改详情", hideDetail: "收起详情", autoDelta: "自动分差", finalDelta: "最终分差", parseOk: "文本解析成功", parseFail: "文本解析失败", drawRule: "流局按3000点听牌罚符分配", noScore: "自动计分: 信息不足", running: "当前总分", importDone: "导入完成", sumCheck: "总点数校验", round: "局", honbaShort: "本", windE: "东", windS: "南", windW: "西", windN: "北" },
    en: { title: "Hanchan Scoreboard (Lab)", toggleHide: "Collapse scoreboard", toggleShow: "Expand scoreboard", sheetTitle: "Sheet title", startTime: "Start", endTime: "End", startPoints: "Start points", p0: "East seat", p1: "South seat", p2: "West seat", p3: "North seat", enableWestRound: "Enable West round", allowRenchan: "Allow renchan", drawDealerTenpaiRenchan: "Dealer tenpai keeps dealer", export: "Export JSON", import: "Import JSON", reset: "Reset", total: "Current points", pot: "Riichi pot", plan: "Round plan", current: "Current round", done: "Completed rounds", result: "Result", ron: "Ron", tsumo: "Tsumo", draw: "Draw", winner: "Winner", loser: "Discarder", dealer: "Dealer", han: "Han", fu: "Fu", honba: "Honba", riichiDecl: "Riichi declarations", tenpaiDecl: "Tenpai on draw", textInput: "Calculator text", parse: "Parse text", manual: "Manual deltas", nextRound: "Finish + Next", renchan: "Finish + Renchan", resetCurrent: "Reset current", detail: "Edit details", hideDetail: "Hide details", autoDelta: "Auto delta", finalDelta: "Final delta", parseOk: "Parsed", parseFail: "Parse failed", drawRule: "Draw uses 3000 tenpai/noten split", noScore: "Auto score: insufficient data", running: "Running total", importDone: "Imported", sumCheck: "Total points check", round: "Round", honbaShort: "honba", windE: "East", windS: "South", windW: "West", windN: "North" },
    ja: { title: "半荘計分板（実験）", toggleHide: "計分板を折りたたむ", toggleShow: "計分板を展開", sheetTitle: "シート名", startTime: "開始", endTime: "終了", startPoints: "持ち点", p0: "東家", p1: "南家", p2: "西家", p3: "北家", enableWestRound: "西入", allowRenchan: "連荘あり", drawDealerTenpaiRenchan: "流局親テンパイ連荘", export: "JSON出力", import: "JSON読込", reset: "リセット", total: "現在点数", pot: "供託", plan: "局進行表", current: "現在局入力", done: "完了局", result: "結果", ron: "ロン", tsumo: "ツモ", draw: "流局", winner: "和了者", loser: "放銃者", dealer: "親", han: "翻", fu: "符", honba: "本場", riichiDecl: "立直宣言", tenpaiDecl: "テンパイ", textInput: "計算テキスト", parse: "テキスト解析", manual: "手動点差（優先）", nextRound: "確定して次局", renchan: "確定して連荘", resetCurrent: "現在局リセット", detail: "詳細編集", hideDetail: "詳細を閉じる", autoDelta: "自動点差", finalDelta: "最終点差", parseOk: "解析成功", parseFail: "解析失敗", drawRule: "流局は3000点テンパイ精算", noScore: "自動計算: 情報不足", running: "現在総点", importDone: "読込完了", sumCheck: "合計点チェック", round: "局", honbaShort: "本場", windE: "東", windS: "南", windW: "西", windN: "北" }
  };
  const EXTRA_I18N = {
    zh: {
      modeSimple: "简单模式",
      modePro: "专业模式",
      density: "紧凑度",
      densityAuto: "自动",
      simpleTableTitle: "手动计分表",
      simpleTableModeHint: "默认简单模式",
      colRound: "局",
      colType: "类型",
      colSeat: "座位",
      colNote: "备注",
      colAction: "操作",
      deleteRow: "删除",
      rowTypeNormal: "普通",
      rowTypeDraw: "流局",
      simpleNext: "下一局",
      simpleRenchan: "连庄+1本场",
      simpleDraw: "流局+1本场",
      doneHandType: "和牌牌型",
      restoreAuto: "恢复自动"
    },
    en: {
      modeSimple: "Simple mode",
      modePro: "Pro mode",
      density: "Density",
      densityAuto: "Auto",
      simpleTableTitle: "Manual score table",
      simpleTableModeHint: "default simple mode",
      colRound: "Round",
      colType: "Type",
      colSeat: "Seats",
      colNote: "Note",
      colAction: "Action",
      deleteRow: "Delete",
      rowTypeNormal: "Normal",
      rowTypeDraw: "Draw",
      simpleNext: "Next round",
      simpleRenchan: "Renchan +1 honba",
      simpleDraw: "Draw +1 honba",
      doneHandType: "Winning hand",
      restoreAuto: "Restore auto"
    },
    ja: {
      modeSimple: "簡易モード",
      modePro: "詳細モード",
      density: "密度",
      densityAuto: "自動",
      simpleTableTitle: "手動点差表",
      simpleTableModeHint: "既定: 簡易モード",
      colRound: "局",
      colType: "種別",
      colSeat: "席順",
      colNote: "メモ",
      colAction: "操作",
      deleteRow: "削除",
      rowTypeNormal: "通常",
      rowTypeDraw: "流局",
      simpleNext: "次局",
      simpleRenchan: "連荘+1本場",
      simpleDraw: "流局+1本場",
      doneHandType: "和了牌姿",
      restoreAuto: "自動に戻す"
    }
  };
  Object.keys(EXTRA_I18N).forEach((lang) => Object.assign(I18N[lang], EXTRA_I18N[lang]));

  const S = { collapsed: false, mode: "simple", sheetTitle: "", startAt: "", endAt: "", startPoints: 25000, startPointsRaw: "25000", players: ["小红", "小橙", "小黄", "小蓝"], options: { enableWestRound: false, allowRenchan: true, drawDealerTenpaiRenchan: true }, nextSpec: { wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 }, current: null, done: [], simpleRows: [], nextRowId: 1, lang: "zh", uiScale: 1, uiScaleAuto: true };
  const SCOREBOARD_SCALE_KEY = "scoreboard_ui_scale_v1";

  const tr = (k) => ((I18N[S.lang] && I18N[S.lang][k]) || I18N.zh[k] || k);
  function defaultPlayers(lang) {
    if (lang === "en") return ["P1", "P2", "P3", "P4"];
    if (lang === "ja") return ["東家", "南家", "西家", "北家"];
    return ["小红", "小橙", "小黄", "小蓝"];
  }
  const p2 = (n) => String(n).padStart(2, "0");
  const nowStamp = () => { const d = new Date(); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`; };
  const dateTitle = () => nowStamp().slice(0, 10);
  const windOrder = () => (S.options.enableWestRound ? ["E", "S", "W", "N"] : ["E", "S"]);
  const windName = (w) => tr(`wind${w}`);
  const roundTitle = (r) => `${windName(r.wind)}${r.kyoku}${tr("round")} ${r.honba}${tr("honbaShort")}`;
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function applyUiScale(scale) {
    const v = clamp(Number(scale) || 1, 0.8, 1.1);
    S.uiScale = v;
    panel.style.setProperty("--sb-scale", String(v));
  }
  function autoFitUiScale() {
    if (!S.uiScaleAuto) return;
    const w = panel.clientWidth || panelBody.clientWidth || 1200;
    const v = w < 900 ? 0.84 : w < 1100 ? 0.9 : w < 1300 ? 0.95 : 1;
    applyUiScale(v);
  }
  function tileAssetName(id) {
    if (id >= 0 && id <= 8) return `Man${id + 1}.png`;
    if (id >= 9 && id <= 17) return `Pin${id - 8}.png`;
    if (id >= 18 && id <= 26) return `Sou${id - 17}.png`;
    return ["Ton.png", "Nan.png", "Shaa.png", "Pei.png", "Chun.png", "Hatsu.png", "Haku.png"][id - 27] || "Blank.png";
  }
  function tileLabel(id) {
    if (id >= 0 && id <= 8) return `${id + 1}m`;
    if (id >= 9 && id <= 17) return `${id - 8}p`;
    if (id >= 18 && id <= 26) return `${id - 17}s`;
    const z = ["E", "S", "W", "N", "C", "F", "P"];
    return z[id - 27] || "?";
  }
  function tileHtml(id, size = "tiny") {
    return `<span class="mj-tile ${size}"><img src="assets/tiles-photo/${tileAssetName(id)}" alt="${tileLabel(id)}"></span>`;
  }
  function tilesSnapshotHtml(tiles) {
    if (!Array.isArray(tiles) || !tiles.length) return `<span class="line">-</span>`;
    return tiles.map((t) => tileHtml(t, "tiny")).join("");
  }

  function mkRound(spec) { return { wind: spec.wind, kyoku: spec.kyoku, honba: spec.honba || 0, dealerSeat: spec.dealerSeat, resultType: "ron", winnerSeat: spec.dealerSeat, loserSeat: (spec.dealerSeat + 1) % 4, han: 1, fu: 30, riichiDeclared: [false, false, false, false], drawTenpai: [false, false, false, false], textInput: "", parseStatus: "", parsed: null, parseOk: false, manual: false, manualDeltas: [0, 0, 0, 0], detailsOpen: false, rowId: null, tilesSnapshot: [] }; }
  function mkSimpleRound(spec, rowId) { return { id: rowId, wind: spec.wind, kyoku: spec.kyoku, honba: spec.honba || 0, dealerSeat: spec.dealerSeat, type: "normal", deltas: [0, 0, 0, 0], note: "" }; }

  function parseToken(tok) { const s = String(tok || "").trim().toUpperCase(); if (!s) return null; if (/^[1-9][MPS]$/.test(s)) return s[1] === "M" ? Number(s[0]) - 1 : s[1] === "P" ? Number(s[0]) + 8 : Number(s[0]) + 17; if (/^[1-7]Z$/.test(s)) return Number(s[0]) + 26; const h = ["E", "S", "W", "N", "C", "F", "P"].indexOf(s); return h >= 0 ? 27 + h : null; }
  function parseCompact(str) { const out = []; const parts = String(str || "").match(/[0-9]+[mpsz]/gi) || []; for (const p of parts) { const suit = p[p.length - 1].toLowerCase(); for (let i = 0; i < p.length - 1; i++) { const n = Number(p[i]); if (suit === "m") out.push(n - 1); else if (suit === "p") out.push(9 + n - 1); else if (suit === "s") out.push(18 + n - 1); else out.push(26 + n); } } if (!parts.length && String(str || "").trim()) { for (const t of String(str).split(/[ ,]+/).filter(Boolean)) { const x = parseToken(t); if (x == null) throw new Error("bad token"); out.push(x); } } return out; }
  function parseCalcText(txt) { const p = { hand: [], doraIndicators: [], uraIndicators: [], winTile: null, winType: "ron", seatWind: "E", roundWind: "E", dealer: false, riichi: false, ippatsu: false, doubleRiichi: false, chankan: false, rinshan: false, haitei: false, houtei: false, aka5m: false, aka5p: false, aka5s: false }; String(txt || "").split(/\r?\n/).forEach((line) => { const m = line.match(/^\s*([a-z_]+)\s*:\s*(.*)$/i); if (!m) return; const k = m[1].toLowerCase(); const v = m[2].trim(); if (k === "hand") p.hand = parseCompact(v); else if (k === "dora_ind") p.doraIndicators = parseCompact(v); else if (k === "ura_ind") p.uraIndicators = parseCompact(v); else if (k === "win_tile") p.winTile = v ? parseToken(v) : null; else if (k === "win_type") p.winType = v === "tsumo" ? "tsumo" : "ron"; else if (k === "seat") p.seatWind = ["E", "S", "W", "N"].includes(v.toUpperCase()) ? v.toUpperCase() : "E"; else if (k === "round") p.roundWind = ["E", "S", "W", "N"].includes(v.toUpperCase()) ? v.toUpperCase() : "E"; else if (k === "dealer") p.dealer = v === "1" || v.toLowerCase() === "true"; else if (k === "riichi") p.riichi = v === "1" || v.toLowerCase() === "true"; else if (k === "ippatsu") p.ippatsu = v === "1" || v.toLowerCase() === "true"; else if (k === "double_riichi") p.doubleRiichi = v === "1" || v.toLowerCase() === "true"; else if (k === "chankan") p.chankan = v === "1" || v.toLowerCase() === "true"; else if (k === "rinshan") p.rinshan = v === "1" || v.toLowerCase() === "true"; else if (k === "haitei") p.haitei = v === "1" || v.toLowerCase() === "true"; else if (k === "houtei") p.houtei = v === "1" || v.toLowerCase() === "true"; }); if (!p.hand.length) throw new Error("empty hand"); return p; }
  function applyParsed(round) {
    try {
      const parsed = parseCalcText(round.textInput || "");
      const res = RiichiEngine.evaluateRules46({
        tiles: parsed.hand.slice(), winType: parsed.winType, winTile: parsed.winTile,
        doraIndicators: parsed.doraIndicators, uraIndicators: parsed.uraIndicators, dealer: parsed.dealer,
        state: { seatWind: parsed.seatWind, roundWind: parsed.roundWind, riichi: parsed.riichi, ippatsu: parsed.ippatsu, doubleRiichi: parsed.doubleRiichi, chankan: parsed.chankan, rinshan: parsed.rinshan, haitei: parsed.haitei, houtei: parsed.houtei, aka5m: parsed.aka5m, aka5p: parsed.aka5p, aka5s: parsed.aka5s }
      });
      if (!res.ok) throw new Error(res.reason || "invalid");
      round.han = res.han; round.fu = res.fu; round.resultType = parsed.winType; round.parsed = parsed; round.parseOk = true; round.parseStatus = tr("parseOk");
      if (parsed.dealer) round.winnerSeat = round.dealerSeat;
    } catch (e) {
      round.parseOk = false; round.parseStatus = `${tr("parseFail")}: ${String((e && e.message) || e)}`;
    }
  }

  function settleRound(round, potBefore) {
    const deltas = [0, 0, 0, 0]; let pot = potBefore;
    round.riichiDeclared.forEach((x, i) => { if (x) { deltas[i] -= 1000; pot += 1000; } });
    if (round.resultType === "draw") {
      const tenpai = []; round.drawTenpai.forEach((x, i) => { if (x) tenpai.push(i); });
      if (tenpai.length > 0 && tenpai.length < 4) {
        const gain = 3000 / tenpai.length, lose = 3000 / (4 - tenpai.length);
        for (let i = 0; i < 4; i++) deltas[i] += tenpai.includes(i) ? gain : -lose;
      }
      return { deltas, potAfter: pot, summary: tr("drawRule") };
    }
    const score = scoreByHanFuLocal({
      han: round.han,
      fu: round.fu,
      winType: round.resultType === "tsumo" ? "tsumo" : "ron",
      dealer: round.winnerSeat === round.dealerSeat
    });
    if (!score || !score.ok) return { deltas, potAfter: pot, summary: tr("noScore") };
    if (round.resultType === "ron") {
      const pay = (score.point.ron || 0) + round.honba * 300; deltas[round.winnerSeat] += pay; deltas[round.loserSeat] -= pay;
    } else if (round.winnerSeat === round.dealerSeat) {
      const each = (score.point.tsumoEach || 0) + round.honba * 100;
      for (let i = 0; i < 4; i++) if (i !== round.winnerSeat) { deltas[i] -= each; deltas[round.winnerSeat] += each; }
    } else {
      const fromDealer = (score.point.tsumoFromDealer || 0) + round.honba * 100, fromOthers = (score.point.tsumoFromOthers || 0) + round.honba * 100;
      for (let i = 0; i < 4; i++) if (i !== round.winnerSeat) { const pay = i === round.dealerSeat ? fromDealer : fromOthers; deltas[i] -= pay; deltas[round.winnerSeat] += pay; }
    }
    if (pot > 0) { deltas[round.winnerSeat] += pot; pot = 0; }
    return { deltas, potAfter: pot, summary: `${score.point.total} / ${score.limitName || "-"}` };
  }

  function ceil100(n) {
    return Math.ceil(n / 100) * 100;
  }

  function scoreByHanFuLocal({ han, fu, winType, dealer }) {
    const h = Math.max(1, Number(han) || 1);
    const f = Math.max(20, Number(fu) || 20);
    let base = f * Math.pow(2, h + 2);
    let limitName = "";
    if (h >= 13) {
      base = 8000;
      limitName = "Yakuman";
    } else if (h >= 11) {
      base = 6000;
      limitName = "Sanbaiman";
    } else if (h >= 8) {
      base = 4000;
      limitName = "Baiman";
    } else if (h >= 6) {
      base = 3000;
      limitName = "Haneman";
    } else if (h >= 5 || base >= 2000) {
      base = 2000;
      limitName = "Mangan";
    }

    const point = { ron: 0, tsumoEach: 0, tsumoFromDealer: 0, tsumoFromOthers: 0, total: 0 };
    if (winType === "ron") {
      point.ron = ceil100(base * (dealer ? 6 : 4));
      point.total = point.ron;
    } else if (dealer) {
      point.tsumoEach = ceil100(base * 2);
      point.total = point.tsumoEach * 3;
    } else {
      point.tsumoFromDealer = ceil100(base * 2);
      point.tsumoFromOthers = ceil100(base);
      point.total = point.tsumoFromDealer + point.tsumoFromOthers * 2;
    }

    return { ok: true, point, limitName };
  }

  function recompute() {
    // Professional mode metadata still uses done rounds, but final points are always based on manual score rows.
    let pot = 0;
    S.done.forEach((r) => {
      const calc = settleRound(r, pot);
      r.autoDeltas = calc.deltas.slice();
      r.summary = calc.summary;
      const row = r.rowId != null ? S.simpleRows.find((x) => x.id === r.rowId) : null;
      r.finalDeltas = row ? row.deltas.slice() : r.autoDeltas.slice();
      pot = calc.potAfter;
    });
    const simpleView = recomputeSimple();
    return { running: simpleView.running, pot: simpleView.pot, sum: simpleView.sum };
  }

  function recomputeSimple() {
    const running = [S.startPoints, S.startPoints, S.startPoints, S.startPoints];
    for (const row of S.simpleRows) {
      for (let i = 0; i < 4; i++) running[i] += Number(row.deltas[i]) || 0;
      row.running = running.slice();
    }
    return { running, pot: 0, sum: running.reduce((a, b) => a + b, 0) };
  }

  function nextSpec(round) {
    if (round.kyoku < 4) return { wind: round.wind, kyoku: round.kyoku + 1, dealerSeat: (round.dealerSeat + 1) % 4, honba: 0 };
    const order = windOrder(), idx = order.indexOf(round.wind), nextWind = order[(idx + 1) % order.length];
    return { wind: nextWind, kyoku: 1, dealerSeat: 0, honba: 0 };
  }

  function nextSpecFromSpec(spec) {
    if (spec.kyoku < 4) return { wind: spec.wind, kyoku: spec.kyoku + 1, dealerSeat: (spec.dealerSeat + 1) % 4, honba: 0 };
    const order = windOrder();
    const idx = order.indexOf(spec.wind);
    const nextWind = order[(idx + 1) % order.length];
    return { wind: nextWind, kyoku: 1, dealerSeat: 0, honba: 0 };
  }

  function addSimpleRow(kind) {
    const base = S.simpleRows.length ? S.simpleRows[S.simpleRows.length - 1] : mkSimpleRound(S.nextSpec, S.nextRowId++);
    let spec;
    if (!S.simpleRows.length) {
      spec = { wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 };
    } else if (kind === "renchan" || kind === "draw") {
      spec = { wind: base.wind, kyoku: base.kyoku, dealerSeat: base.dealerSeat, honba: (base.honba || 0) + 1 };
    } else {
      spec = nextSpecFromSpec(base);
    }
    const row = mkSimpleRound(spec, S.nextRowId++);
    row.type = kind === "draw" ? "draw" : "normal";
    S.simpleRows.push(row);
  }

  function upsertSimpleRowForRound(r, deltas) {
    let row = null;
    if (r.rowId != null) row = S.simpleRows.find((x) => x.id === r.rowId) || null;
    if (!row) {
      row = mkSimpleRound({ wind: r.wind, kyoku: r.kyoku, honba: r.honba, dealerSeat: r.dealerSeat }, S.nextRowId++);
      row.type = r.resultType === "draw" ? "draw" : "normal";
      S.simpleRows.push(row);
      r.rowId = row.id;
    }
    row.wind = r.wind;
    row.kyoku = r.kyoku;
    row.honba = r.honba;
    row.dealerSeat = r.dealerSeat;
    row.type = r.resultType === "draw" ? "draw" : "normal";
    row.deltas = deltas.slice();
    return row;
  }

  function finishCurrent(renchan) {
    const r = JSON.parse(JSON.stringify(S.current));
    if (!r.parsed && String(r.textInput || "").trim()) applyParsed(r);
    const pre = recompute();
    const calc = settleRound(r, pre.pot);
    r.autoDeltas = calc.deltas.slice();
    r.finalDeltas = calc.deltas.slice();
    r.summary = calc.summary;
    r.tilesSnapshot = (r.parsed && Array.isArray(r.parsed.hand)) ? r.parsed.hand.slice() : [];
    upsertSimpleRowForRound(r, r.autoDeltas);
    r.detailsOpen = false; S.done.push(r);
    let keep = renchan && S.options.allowRenchan;
    if (!keep && S.options.drawDealerTenpaiRenchan && r.resultType === "draw" && r.drawTenpai[r.dealerSeat]) keep = true;
    S.nextSpec = keep ? { wind: r.wind, kyoku: r.kyoku, dealerSeat: r.dealerSeat, honba: r.honba + 1 } : nextSpec(r);
    S.current = mkRound(S.nextSpec);
  }

  function updateRound(round, t) {
    const f = t.dataset.field, s = Number(t.dataset.seat);
    if (f === "resultType") round.resultType = t.value;
    else if (f === "winnerSeat") round.winnerSeat = Number(t.value) || 0;
    else if (f === "loserSeat") round.loserSeat = Number(t.value) || 0;
    else if (f === "dealerSeat") round.dealerSeat = Number(t.value) || 0;
    else if (f === "han") round.han = Math.max(1, Number(t.value) || 1);
    else if (f === "fu") round.fu = Math.max(20, Number(t.value) || 20);
    else if (f === "honba") round.honba = Math.max(0, Number(t.value) || 0);
    else if (f === "manual") round.manual = !!t.checked;
    else if (f === "manualDelta" && s >= 0 && s < 4) round.manualDeltas[s] = Number(t.value) || 0;
    else if (f === "riichi" && s >= 0 && s < 4) round.riichiDeclared[s] = !!t.checked;
    else if (f === "tenpai" && s >= 0 && s < 4) round.drawTenpai[s] = !!t.checked;
    else if (f === "textInput") round.textInput = t.value;
  }

  function seatSelect(name, selected, scope, row) {
    let html = ""; for (let i = 0; i < 4; i++) html += `<option value="${i}"${i === selected ? " selected" : ""}>${S.players[i]}</option>`;
    const rowAttr = row == null ? "" : ` data-row="${row}"`;
    return `<select data-scope="${scope}"${rowAttr} data-field="${name}">${html}</select>`;
  }
  function renderPoints(view) {
    return `<div class="scoreboard-summary"><div style="margin-bottom:6px;"><b>${tr("total")}</b> | ${tr("sumCheck")}: ${view.sum} | ${tr("pot")}: ${view.pot}</div><div class="scoreboard-points">${view.running.map((v, i) => `<div class="score-chip"><div class="name">${S.players[i]}</div><div class="pts">${v}</div><div class="delta">${v - S.startPoints >= 0 ? "+" : ""}${v - S.startPoints}</div></div>`).join("")}</div></div>`;
  }

  function renderPointsStrip(view, compact = false) {
    const last = S.simpleRows.length ? S.simpleRows[S.simpleRows.length - 1] : null;
    const delta = last && Array.isArray(last.deltas) ? last.deltas : [0, 0, 0, 0];
    return `<div class="${compact ? "simple-total-strip" : ""}"><div class="scoreboard-points${compact ? " compact" : ""}">${
      view.running.map((v, i) => `<div class="score-chip"><div class="name">${S.players[i]}</div><div class="pts">${v}</div><div class="delta">${(Number(delta[i]) || 0) >= 0 ? "+" : ""}${Number(delta[i]) || 0}</div></div>`).join("")
    }</div></div>`;
  }

  function renderPlan() {
    const rows = [];
    for (const w of windOrder()) for (let k = 1; k <= 4; k++) {
      const dealerSeat = (k - 1) % 4;
      const isActive = S.current && S.current.wind === w && S.current.kyoku === k;
      const seatCells = [0, 1, 2, 3].map((seat) => {
        const idx = (seat - dealerSeat + 4) % 4;
        const wch = [tr("windE"), tr("windS"), tr("windW"), tr("windN")][idx];
        return `<td class="${idx === 0 ? "is-dealer" : ""}">${wch}</td>`;
      }).join("");
      rows.push(`<tr class="${isActive ? "is-active" : ""}"><td>${windName(w)}${k}${tr("round")}</td>${seatCells}</tr>`);
    }
    return `<div><div style="margin-bottom:6px;"><b>${tr("plan")}</b></div><div class="round-plan"><table><thead><tr><th>${tr("round")}</th><th>${S.players[0]}</th><th>${S.players[1]}</th><th>${S.players[2]}</th><th>${S.players[3]}</th></tr></thead><tbody>${rows.join("")}</tbody></table></div></div>`;
  }

  function renderSimplePlan() {
    const current = S.simpleRows.length ? S.simpleRows[S.simpleRows.length - 1] : null;
    const rows = [];
    for (const w of windOrder()) for (let k = 1; k <= 4; k++) {
      const dealerSeat = (k - 1) % 4;
      const active = current && current.wind === w && current.kyoku === k;
      const seatCells = [0, 1, 2, 3].map((seat) => {
        const idx = (seat - dealerSeat + 4) % 4;
        const wind = [tr("windE"), tr("windS"), tr("windW"), tr("windN")][idx];
        return `<td class="${idx === 0 ? "is-dealer" : ""}">${wind}</td>`;
      }).join("");
      rows.push(`<tr class="${active ? "is-active" : ""}"><td>${windName(w)}${k}${tr("round")}</td>${seatCells}</tr>`);
    }
    return `<div><div style="margin-bottom:6px;"><b>${tr("plan")}</b></div><div class="round-plan"><table><thead><tr><th>${tr("round")}</th><th>${S.players[0]}</th><th>${S.players[1]}</th><th>${S.players[2]}</th><th>${S.players[3]}</th></tr></thead><tbody>${rows.join("")}</tbody></table></div></div>`;
  }

  function renderSimpleTable(view, includeActions = true) {
    const rows = S.simpleRows.map((r, idx) => {
      const seatText = [0, 1, 2, 3].map((seat) => {
        const rel = (seat - r.dealerSeat + 4) % 4;
        return [tr("windE"), tr("windS"), tr("windW"), tr("windN")][rel];
      }).join("/");
      return `<tr>
        <td>${roundTitle(r)}</td>
        <td>
          <select data-simple="type" data-row="${idx}">
            <option value="normal"${r.type === "normal" ? " selected" : ""}>${tr("rowTypeNormal")}</option>
            <option value="draw"${r.type === "draw" ? " selected" : ""}>${tr("rowTypeDraw")}</option>
          </select>
        </td>
        <td>${seatText}</td>
        ${[0, 1, 2, 3].map((s) => `<td><input type="number" data-simple="delta" data-row="${idx}" data-seat="${s}" value="${r.deltas[s] || 0}"></td>`).join("")}
        <td><input type="text" data-simple="note" data-row="${idx}" value="${r.note || ""}"></td>
        <td><button class="ghost" data-action="simple-del" data-row="${idx}">${tr("deleteRow")}</button></td>
      </tr>`;
    }).join("");
    return `<div class="current-round-box">
      <div><b>${tr("simpleTableTitle")}</b>（${tr("simpleTableModeHint")}）</div>
      <div class="table-wrap" style="margin-top:8px;">
        <table>
          <thead><tr><th>${tr("colRound")}</th><th>${tr("colType")}</th><th>${tr("colSeat")}</th><th>${S.players[0]}</th><th>${S.players[1]}</th><th>${S.players[2]}</th><th>${S.players[3]}</th><th>${tr("colNote")}</th><th>${tr("colAction")}</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="9">-</td></tr>`}</tbody>
        </table>
      </div>
      ${renderPointsStrip(view, true)}
      <div class="round-actions ${includeActions ? "" : "hidden"}">
        <button class="ghost" data-action="simple-next">${tr("simpleNext")}</button>
        <button class="ghost" data-action="simple-renchan">${tr("simpleRenchan")}</button>
        <button class="ghost" data-action="simple-draw">${tr("simpleDraw")}</button>
      </div>
    </div>`;
  }

  function renderCurrent(view) {
    const r = S.current;
    const calc = settleRound(r, view.pot);
    const riichiChecks = [0, 1, 2, 3].map((i) => `<label><input type="checkbox" data-scope="cur" data-field="riichi" data-seat="${i}"${r.riichiDeclared[i] ? " checked" : ""}> ${S.players[i]}</label>`).join(" ");
    const tenpaiChecks = [0, 1, 2, 3].map((i) => `<label><input type="checkbox" data-scope="cur" data-field="tenpai" data-seat="${i}"${r.drawTenpai[i] ? " checked" : ""}> ${S.players[i]}</label>`).join(" ");
    return `<div class="current-round-box"><div><b>${tr("current")}</b>: ${roundTitle(r)}</div><div class="scoreboard-row" style="margin-top:8px;"><div class="scoreboard-field"><label>${tr("result")}</label><select data-scope="cur" data-field="resultType"><option value="ron"${r.resultType === "ron" ? " selected" : ""}>${tr("ron")}</option><option value="tsumo"${r.resultType === "tsumo" ? " selected" : ""}>${tr("tsumo")}</option><option value="draw"${r.resultType === "draw" ? " selected" : ""}>${tr("draw")}</option></select></div><div class="scoreboard-field"><label>${tr("winner")}</label>${seatSelect("winnerSeat", r.winnerSeat, "cur")}</div><div class="scoreboard-field"><label>${tr("loser")}</label>${seatSelect("loserSeat", r.loserSeat, "cur")}</div><div class="scoreboard-field"><label>${tr("dealer")}</label>${seatSelect("dealerSeat", r.dealerSeat, "cur")}</div><div class="scoreboard-field"><label>${tr("han")}</label><input type="number" min="1" max="26" data-scope="cur" data-field="han" value="${r.han}"></div><div class="scoreboard-field"><label>${tr("fu")}</label><input type="number" min="20" max="130" step="5" data-scope="cur" data-field="fu" value="${r.fu}"></div><div class="scoreboard-field"><label>${tr("honba")}</label><input type="number" min="0" data-scope="cur" data-field="honba" value="${r.honba}"></div></div><div class="scoreboard-row" style="margin-top:8px;"><span>${tr("riichiDecl")}: </span>${riichiChecks}</div><div class="scoreboard-row"><span>${tr("tenpaiDecl")}: </span>${tenpaiChecks}</div><div class="scoreboard-field" style="min-width:100%;margin-top:8px;"><label>${tr("textInput")}</label><textarea data-scope="cur" data-field="textInput">${r.textInput || ""}</textarea></div><div class="scoreboard-row" style="margin-top:8px;"><button class="ghost" data-action="parse-cur">${tr("parse")}</button><span>${r.parseStatus || calc.summary || "-"}</span></div><div class="round-actions"><button class="ghost" data-action="finish-next">${tr("nextRound")}</button><button class="ghost" data-action="finish-renchan">${tr("renchan")}</button><button class="ghost" data-action="reset-cur">${tr("resetCurrent")}</button></div></div>`;
  }

  function renderDoneCard(r, idx) {
    const linkedRowIdx = r.rowId != null ? S.simpleRows.findIndex((x) => x.id === r.rowId) : -1;
    const linkedRow = linkedRowIdx >= 0 ? S.simpleRows[linkedRowIdx] : null;
    const final = linkedRow ? linkedRow.deltas.slice() : (r.finalDeltas || [0, 0, 0, 0]);
    const auto = r.autoDeltas || [0, 0, 0, 0];
    const running = (linkedRow && linkedRow.running) ? linkedRow.running : (r.running || [S.startPoints, S.startPoints, S.startPoints, S.startPoints]);
    const summary = r.resultType === "draw" ? `${roundTitle(r)} | ${tr("draw")}` : `${roundTitle(r)} | ${S.players[r.winnerSeat]} ${r.resultType === "ron" ? tr("ron") : tr("tsumo")} | ${r.summary || "-"}`;
    const pointsChips = `<div class="done-points"><div class="scoreboard-points">${
      [0, 1, 2, 3].map((i) => `<div class="score-chip"><div class="name">${S.players[i]}</div><div class="pts">${running[i] || 0}</div><div class="delta">${(final[i] || 0) >= 0 ? "+" : ""}${final[i] || 0}</div></div>`).join("")
    }</div></div>`;
    const detailEdit = linkedRow ? `<div class="manual-grid" style="margin-top:8px;">${[0, 1, 2, 3].map((i) => `<div class="scoreboard-field"><label>${S.players[i]}</label><input type="number" data-simple="delta" data-row="${linkedRowIdx}" data-seat="${i}" value="${linkedRow.deltas[i] || 0}"></div>`).join("")}</div><div class="round-actions"><button class="ghost" data-action="restore-auto" data-row="${idx}">${tr("restoreAuto")}</button></div>` : "";
    return `<div class="done-card"><div class="title">${summary}</div><div class="line">${tr("doneHandType")}: <span class="tile-line">${tilesSnapshotHtml(r.tilesSnapshot)}</span></div>${pointsChips}<button class="ghost" data-action="toggle-done" data-row="${idx}" style="margin-top:6px;">${r.detailsOpen ? tr("hideDetail") : tr("detail")}</button><div class="${r.detailsOpen ? "" : "hidden"}">${detailEdit}<div class="scoreboard-row" style="margin-top:8px;"><div class="scoreboard-field"><label>${tr("result")}</label><select data-scope="done" data-row="${idx}" data-field="resultType"><option value="ron"${r.resultType === "ron" ? " selected" : ""}>${tr("ron")}</option><option value="tsumo"${r.resultType === "tsumo" ? " selected" : ""}>${tr("tsumo")}</option><option value="draw"${r.resultType === "draw" ? " selected" : ""}>${tr("draw")}</option></select></div><div class="scoreboard-field"><label>${tr("winner")}</label>${seatSelect("winnerSeat", r.winnerSeat, "done", idx)}</div><div class="scoreboard-field"><label>${tr("loser")}</label>${seatSelect("loserSeat", r.loserSeat, "done", idx)}</div><div class="scoreboard-field"><label>${tr("dealer")}</label>${seatSelect("dealerSeat", r.dealerSeat, "done", idx)}</div><div class="scoreboard-field"><label>${tr("han")}</label><input type="number" min="1" max="26" data-scope="done" data-row="${idx}" data-field="han" value="${r.han}"></div><div class="scoreboard-field"><label>${tr("fu")}</label><input type="number" min="20" max="130" step="5" data-scope="done" data-row="${idx}" data-field="fu" value="${r.fu}"></div></div><div class="scoreboard-field" style="min-width:100%;margin-top:8px;"><label>${tr("textInput")}</label><textarea data-scope="done" data-row="${idx}" data-field="textInput">${r.textInput || ""}</textarea></div><div class="scoreboard-row" style="margin-top:8px;"><button class="ghost" data-action="parse-done" data-row="${idx}">${tr("parse")}</button></div></div></div>`;
  }

  function renderPanel() {
    titleEl.textContent = tr("title");
    toggleBtn.textContent = S.collapsed ? tr("toggleShow") : tr("toggleHide");
    if (S.collapsed) { panelBody.innerHTML = ""; return; }
    autoFitUiScale();
    const modeSwitch = `<div class="round-actions" style="margin-bottom:8px;">
      <button class="ghost" data-action="mode-simple"${S.mode === "simple" ? " disabled" : ""}>${tr("modeSimple")}</button>
      <button class="ghost" data-action="mode-pro"${S.mode === "pro" ? " disabled" : ""}>${tr("modePro")}</button>
    </div>`;
    const density = `<div class="scoreboard-density"><span>${tr("density")}</span><input id="sb_density" type="range" min="80" max="110" step="1" value="${Math.round((S.uiScale || 1) * 100)}"><span id="sb_density_label">${Math.round((S.uiScale || 1) * 100)}%</span><button class="ghost" data-action="density-auto">${tr("densityAuto")}</button></div>`;
    if (S.mode === "simple") {
      const view = recomputeSimple();
      panelBody.innerHTML = `<div class="scoreboard-grid">${modeSwitch}
        <div class="scoreboard-row"><div class="scoreboard-field"><label>${tr("sheetTitle")}</label><input id="sb_sheetTitle" value="${S.sheetTitle}"></div><div class="scoreboard-field"><label>${tr("startTime")}</label><input value="${S.startAt}" readonly></div><div class="scoreboard-field"><label>${tr("endTime")}</label><input value="${S.endAt || "-"}" readonly></div><div class="scoreboard-field"><label>${tr("startPoints")}</label><input id="sb_startPoints" type="number" min="0" step="100" value="${S.startPointsRaw != null ? S.startPointsRaw : S.startPoints}"></div></div>
        <div class="scoreboard-row"><div class="scoreboard-field"><label>${tr("p0")}</label><input id="sb_p0" value="${S.players[0]}"></div><div class="scoreboard-field"><label>${tr("p1")}</label><input id="sb_p1" value="${S.players[1]}"></div><div class="scoreboard-field"><label>${tr("p2")}</label><input id="sb_p2" value="${S.players[2]}"></div><div class="scoreboard-field"><label>${tr("p3")}</label><input id="sb_p3" value="${S.players[3]}"></div></div>
        <div class="scoreboard-rules"><label><input id="sb_enableWestRound" type="checkbox" ${S.options.enableWestRound ? "checked" : ""}> ${tr("enableWestRound")}</label><label><input id="sb_allowRenchan" type="checkbox" ${S.options.allowRenchan ? "checked" : ""}> ${tr("allowRenchan")}</label><label><input id="sb_drawDealerTenpaiRenchan" type="checkbox" ${S.options.drawDealerTenpaiRenchan ? "checked" : ""}> ${tr("drawDealerTenpaiRenchan")}</label><button class="ghost" id="sb_exportBtn">${tr("export")}</button><button class="ghost" id="sb_importBtn">${tr("import")}</button><input id="sb_importFile" type="file" accept=".json,application/json" hidden><button class="ghost" id="sb_resetBtn">${tr("reset")}</button>${density}</div>
        ${renderPoints(view)}
        ${renderSimplePlan()}
        ${renderSimpleTable(view)}
      </div>`;
    } else {
      const view = recompute();
      const doneCards = [...S.done].map((_, revIdx) => { const idx = S.done.length - 1 - revIdx; return renderDoneCard(S.done[idx], idx); }).join("");
      panelBody.innerHTML = `<div class="scoreboard-grid">${modeSwitch}<div class="scoreboard-row"><div class="scoreboard-field"><label>${tr("sheetTitle")}</label><input id="sb_sheetTitle" value="${S.sheetTitle}"></div><div class="scoreboard-field"><label>${tr("startTime")}</label><input value="${S.startAt}" readonly></div><div class="scoreboard-field"><label>${tr("endTime")}</label><input value="${S.endAt || "-"}" readonly></div><div class="scoreboard-field"><label>${tr("startPoints")}</label><input id="sb_startPoints" type="number" min="0" step="100" value="${S.startPointsRaw != null ? S.startPointsRaw : S.startPoints}"></div></div><div class="scoreboard-row"><div class="scoreboard-field"><label>${tr("p0")}</label><input id="sb_p0" value="${S.players[0]}"></div><div class="scoreboard-field"><label>${tr("p1")}</label><input id="sb_p1" value="${S.players[1]}"></div><div class="scoreboard-field"><label>${tr("p2")}</label><input id="sb_p2" value="${S.players[2]}"></div><div class="scoreboard-field"><label>${tr("p3")}</label><input id="sb_p3" value="${S.players[3]}"></div></div><div class="scoreboard-rules"><label><input id="sb_enableWestRound" type="checkbox" ${S.options.enableWestRound ? "checked" : ""}> ${tr("enableWestRound")}</label><label><input id="sb_allowRenchan" type="checkbox" ${S.options.allowRenchan ? "checked" : ""}> ${tr("allowRenchan")}</label><label><input id="sb_drawDealerTenpaiRenchan" type="checkbox" ${S.options.drawDealerTenpaiRenchan ? "checked" : ""}> ${tr("drawDealerTenpaiRenchan")}</label><button class="ghost" id="sb_exportBtn">${tr("export")}</button><button class="ghost" id="sb_importBtn">${tr("import")}</button><input id="sb_importFile" type="file" accept=".json,application/json" hidden><button class="ghost" id="sb_resetBtn">${tr("reset")}</button>${density}</div>${renderPoints(view)}${renderPlan()}${renderCurrent(view)}<div><b>${tr("done")}</b></div><div class="done-list">${doneCards || `<div class=\"line\">-</div>`}</div>${renderSimpleTable(view, false)}</div>`;
    }
    bindPanelControls();
  }
  function exportState() {
    S.endAt = nowStamp();
    const payload = { version: 4, mode: S.mode, sheetTitle: S.sheetTitle, startAt: S.startAt, endAt: S.endAt, lang: S.lang, startPoints: S.startPoints, startPointsRaw: S.startPointsRaw, players: S.players, options: S.options, nextSpec: S.nextSpec, current: S.current, done: S.done, simpleRows: S.simpleRows, nextRowId: S.nextRowId, uiScale: S.uiScale, uiScaleAuto: S.uiScaleAuto };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = `scoreboard-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 300);
    renderPanel();
  }

  function importState(file) {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const x = JSON.parse(String(fr.result || "{}"));
        S.sheetTitle = String(x.sheetTitle || dateTitle());
        S.startAt = String(x.startAt || nowStamp());
        S.endAt = String(x.endAt || "");
        S.lang = ["zh", "en", "ja"].includes(x.lang) ? x.lang : S.lang;
        S.mode = x.mode === "pro" ? "pro" : "simple";
        S.startPoints = Number(x.startPoints) || 25000;
        S.startPointsRaw = String(x.startPointsRaw != null ? x.startPointsRaw : S.startPoints);
        if (Array.isArray(x.players) && x.players.length === 4) {
          const defs = defaultPlayers(S.lang);
          S.players = x.players.map((n, i) => String(n || defs[i]));
        }
        S.options = { enableWestRound: !!(x.options && x.options.enableWestRound), allowRenchan: x.options ? x.options.allowRenchan !== false : true, drawDealerTenpaiRenchan: x.options ? x.options.drawDealerTenpaiRenchan !== false : true };
        S.nextSpec = x.nextSpec || { wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 };
        S.current = x.current || mkRound(S.nextSpec);
        S.done = Array.isArray(x.done) ? x.done : [];
        S.simpleRows = Array.isArray(x.simpleRows) ? x.simpleRows : [mkSimpleRound({ wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 }, 1)];
        let mx = 0;
        S.simpleRows.forEach((r) => {
          if (r.id == null) r.id = ++mx;
          mx = Math.max(mx, Number(r.id) || 0);
          if (!Array.isArray(r.deltas)) r.deltas = [0, 0, 0, 0];
        });
        S.nextRowId = Number(x.nextRowId) || (mx + 1);
        S.uiScale = clamp(Number(x.uiScale) || S.uiScale, 0.8, 1.1);
        S.uiScaleAuto = x.uiScaleAuto !== false;
        if (!S.uiScaleAuto) {
          applyUiScale(S.uiScale);
          try { localStorage.setItem(SCOREBOARD_SCALE_KEY, String(S.uiScale)); } catch (_) {}
        }
        renderPanel();
        alert(tr("importDone"));
      } catch (e) {
        alert(`${tr("parseFail")}: ${String((e && e.message) || e)}`);
      }
    };
    fr.readAsText(file, "utf-8");
  }

  function bindPanelControls() {
    const bindDeferredInput = (id, onInput, onCommit) => {
      const n = document.getElementById(id);
      if (!n) return;
      if (onInput) n.addEventListener("input", onInput);
      const commit = (e) => { if (onCommit) onCommit(e); };
      n.addEventListener("change", commit);
      n.addEventListener("blur", commit);
    };
    bindDeferredInput("sb_sheetTitle", (e) => { S.sheetTitle = e.target.value; }, null);
    bindDeferredInput("sb_startPoints", (e) => {
      S.startPointsRaw = e.target.value;
    }, (e) => {
      S.startPointsRaw = e.target.value;
      S.startPoints = Math.max(0, Number(e.target.value) || 0);
      renderPanel();
    });
    bindDeferredInput("sb_p0", (e) => { S.players[0] = e.target.value; }, () => renderPanel());
    bindDeferredInput("sb_p1", (e) => { S.players[1] = e.target.value; }, () => renderPanel());
    bindDeferredInput("sb_p2", (e) => { S.players[2] = e.target.value; }, () => renderPanel());
    bindDeferredInput("sb_p3", (e) => { S.players[3] = e.target.value; }, () => renderPanel());
    const west = document.getElementById("sb_enableWestRound"); if (west) west.addEventListener("change", (e) => { S.options.enableWestRound = !!e.target.checked; renderPanel(); });
    const ren = document.getElementById("sb_allowRenchan"); if (ren) ren.addEventListener("change", (e) => { S.options.allowRenchan = !!e.target.checked; renderPanel(); });
    const dr = document.getElementById("sb_drawDealerTenpaiRenchan"); if (dr) dr.addEventListener("change", (e) => { S.options.drawDealerTenpaiRenchan = !!e.target.checked; renderPanel(); });
    const ex = document.getElementById("sb_exportBtn"); if (ex) ex.addEventListener("click", exportState);
    const imp = document.getElementById("sb_importBtn"), impFile = document.getElementById("sb_importFile");
    if (imp && impFile) {
      imp.addEventListener("click", () => impFile.click());
      impFile.addEventListener("change", () => { importState(impFile.files && impFile.files[0]); impFile.value = ""; });
    }
    const reset = document.getElementById("sb_resetBtn"); if (reset) reset.addEventListener("click", () => { initState(); renderPanel(); });
    const density = document.getElementById("sb_density");
    const densityLabel = document.getElementById("sb_density_label");
    if (density) {
      density.addEventListener("input", () => {
        const v = clamp(Number(density.value) / 100, 0.8, 1.1);
        applyUiScale(v);
        if (densityLabel) densityLabel.textContent = `${Math.round(v * 100)}%`;
      });
      const commit = () => {
        const v = clamp(Number(density.value) / 100, 0.8, 1.1);
        S.uiScaleAuto = false;
        applyUiScale(v);
        try { localStorage.setItem(SCOREBOARD_SCALE_KEY, String(v)); } catch (_) {}
      };
      density.addEventListener("change", commit);
      density.addEventListener("blur", commit);
    }
  }

  function bindGlobalEvents() {
    toggleBtn.addEventListener("click", () => { S.collapsed = !S.collapsed; renderPanel(); });

    document.addEventListener("change", (e) => {
      const t = e.target; if (!t || !t.dataset || !t.dataset.field) return;
      if (t.dataset.scope === "cur") updateRound(S.current, t);
      else if (t.dataset.scope === "done") { const idx = Number(t.dataset.row); if (Number.isInteger(idx) && S.done[idx]) updateRound(S.done[idx], t); }
      renderPanel();
    });

    document.addEventListener("change", (e) => {
      const t = e.target; if (!t || !t.dataset || !t.dataset.simple) return;
      const idx = Number(t.dataset.row), seat = Number(t.dataset.seat);
      if (!Number.isInteger(idx) || !S.simpleRows[idx]) return;
      if (t.dataset.simple === "type") S.simpleRows[idx].type = t.value || "normal";
      if (t.dataset.simple === "delta" && seat >= 0 && seat < 4) S.simpleRows[idx].deltas[seat] = Number(t.value) || 0;
      if (t.dataset.simple === "note") S.simpleRows[idx].note = t.value || "";
      renderPanel();
    });

    document.addEventListener("input", (e) => {
      const t = e.target; if (!t || !t.dataset || !t.dataset.field) return;
      if (t.dataset.scope === "cur") updateRound(S.current, t);
      else if (t.dataset.scope === "done") { const idx = Number(t.dataset.row); if (Number.isInteger(idx) && S.done[idx]) updateRound(S.done[idx], t); }
      // Do not re-render while typing; commit on blur/change.
    });

    document.addEventListener("input", (e) => {
      const t = e.target; if (!t || !t.dataset || !t.dataset.simple) return;
      const idx = Number(t.dataset.row), seat = Number(t.dataset.seat);
      if (!Number.isInteger(idx) || !S.simpleRows[idx]) return;
      if (t.dataset.simple === "delta" && seat >= 0 && seat < 4) S.simpleRows[idx].deltas[seat] = Number(t.value) || 0;
      if (t.dataset.simple === "note") S.simpleRows[idx].note = t.value || "";
      // Do not re-render while typing; commit on blur/change.
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]"); if (!btn) return;
      const action = btn.dataset.action;
      if (action === "mode-simple") { S.mode = "simple"; renderPanel(); return; }
      if (action === "mode-pro") { S.mode = "pro"; renderPanel(); return; }
      if (action === "density-auto") {
        S.uiScaleAuto = true;
        try { localStorage.removeItem(SCOREBOARD_SCALE_KEY); } catch (_) {}
        autoFitUiScale();
        renderPanel();
        return;
      }
      if (action === "simple-next") { addSimpleRow("next"); renderPanel(); return; }
      if (action === "simple-renchan") { addSimpleRow("renchan"); renderPanel(); return; }
      if (action === "simple-draw") { addSimpleRow("draw"); renderPanel(); return; }
      if (action === "simple-del") {
        const idxDel = Number(btn.dataset.row);
        if (Number.isInteger(idxDel) && S.simpleRows[idxDel]) {
          S.simpleRows.splice(idxDel, 1);
          if (!S.simpleRows.length) S.simpleRows.push(mkSimpleRound({ wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 }, S.nextRowId++));
          renderPanel();
        }
        return;
      }
      if (action === "restore-auto") {
        const idxDone = Number(btn.dataset.row);
        if (Number.isInteger(idxDone) && S.done[idxDone]) {
          const d = S.done[idxDone];
          const row = d.rowId != null ? S.simpleRows.find((x) => x.id === d.rowId) : null;
          if (row && Array.isArray(d.autoDeltas)) {
            row.deltas = d.autoDeltas.slice();
            renderPanel();
          }
        }
        return;
      }
      if (action === "parse-cur") { applyParsed(S.current); renderPanel(); return; }
      if (action === "finish-next") { finishCurrent(false); renderPanel(); return; }
      if (action === "finish-renchan") { finishCurrent(true); renderPanel(); return; }
      if (action === "reset-cur") { S.current = mkRound(S.nextSpec); renderPanel(); return; }
      const idx = Number(btn.dataset.row); if (!Number.isInteger(idx) || !S.done[idx]) return;
      if (action === "toggle-done") S.done[idx].detailsOpen = !S.done[idx].detailsOpen;
      else if (action === "parse-done") applyParsed(S.done[idx]);
      renderPanel();
    });

    const langSel = document.getElementById("langSelect");
    if (langSel) {
      const onLang = () => { S.lang = ["zh", "en", "ja"].includes(langSel.value) ? langSel.value : "zh"; renderPanel(); };
      langSel.addEventListener("change", onLang);
      setTimeout(onLang, 0);
    }
  }

  function initState() {
    S.mode = "simple";
    S.sheetTitle = dateTitle();
    S.startAt = nowStamp();
    S.endAt = "";
    S.startPoints = 25000;
    S.startPointsRaw = "25000";
    S.players = defaultPlayers(S.lang);
    S.options = { enableWestRound: false, allowRenchan: true, drawDealerTenpaiRenchan: true };
    S.nextSpec = { wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 };
    S.current = mkRound(S.nextSpec);
    S.done = [];
    S.nextRowId = 2;
    S.simpleRows = [mkSimpleRound({ wind: "E", kyoku: 1, dealerSeat: 0, honba: 0 }, 1)];
    S.uiScale = 1;
    S.uiScaleAuto = true;
  }

  function init() {
    const langSel = document.getElementById("langSelect");
    S.lang = langSel && ["zh", "en", "ja"].includes(langSel.value) ? langSel.value : "zh";
    initState();
    try {
      const saved = Number(localStorage.getItem(SCOREBOARD_SCALE_KEY));
      if (saved && saved >= 0.8 && saved <= 1.1) {
        S.uiScale = saved;
        S.uiScaleAuto = false;
        applyUiScale(saved);
      }
    } catch (_) {}
    bindGlobalEvents();
    renderPanel();
    window.addEventListener("resize", () => {
      if (!S.uiScaleAuto) return;
      autoFitUiScale();
    });
  }

  init();
})();
