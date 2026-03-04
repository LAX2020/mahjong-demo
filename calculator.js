
const RULES_46 = [[1,"立直","1","门前清限定","门前清限定"],[2,"一发","1","门前清限定","立直后一巡且无人鸣牌"],[3,"断幺九","1","可鸣牌","可鸣牌"],[4,"门前清自摸（不求人）","1","门前清限定","门前清限定"],[5,"门风刻子","1","可鸣牌","可鸣牌"],[6,"场风刻子","1","可鸣牌","可鸣牌"],[7,"三元牌刻子","1","可鸣牌","可鸣牌"],[8,"平和","1","门前清限定","门前清限定"],[9,"一杯口（一连顺）","1","门前清限定","门前清限定"],[10,"抢杠","1","可鸣牌","可鸣牌"],[11,"岭上开花（杠上开花）","1","可鸣牌","可鸣牌"],[12,"海底捞月/河底捞鱼","1","可鸣牌","可鸣牌"],[13,"宝牌","1","不算役","只能加番，不能解锁和牌"],[14,"红宝牌（赤宝牌）","1","不算役","只能加番，不能解锁和牌"],[15,"里宝牌（立直限定）","1","不算役","只能加番，不能解锁和牌"],[16,"双立直（一巡立直）","2","门前清限定","门前清限定"],[17,"三色同刻","2","可鸣牌","可鸣牌"],[18,"三杠子","2","可鸣牌","可鸣牌"],[19,"碰碰和（对对和）","2","可鸣牌","可鸣牌"],[20,"三暗刻","2","可鸣牌","可鸣牌"],[21,"小三元","2","可鸣牌","可鸣牌"],[22,"混老头（混一九）","2","可鸣牌","可鸣牌"],[23,"七对子","2","门前清限定","门前清限定"],[24,"混全带幺九（带字牌）","2","可鸣牌","鸣牌减1番"],[25,"一气通贯（一气贯通）","2","可鸣牌","鸣牌减1番"],[26,"三色同顺","2","可鸣牌","鸣牌减1番"],[27,"两杯口（二连顺）","3","门前清限定","门前清限定"],[28,"纯全带幺九（不带字牌）","3","可鸣牌","鸣牌减1番"],[29,"混一色","3","可鸣牌","鸣牌减1番"],[30,"清一色","6","可鸣牌","鸣牌减1番"],[31,"天和","13","门前清限定","庄家限定"],[32,"地和","13","门前清限定","闲家限定"],[33,"大三元","13","可鸣牌","可鸣牌"],[34,"四暗刻","13","门前清限定","门前清限定"],[35,"字一色","13","可鸣牌","可鸣牌"],[36,"绿一色","13","可鸣牌","无发也可"],[37,"清老头（纯清一九刻）","13","可鸣牌","可鸣牌"],[38,"国士无双（十三幺）","13","门前清限定","门前清限定"],[39,"小四喜","13","可鸣牌","可鸣牌"],[40,"四杠子","13","可鸣牌","可鸣牌"],[41,"九莲宝灯","13","门前清限定","门前清限定"],[42,"四暗刻单骑","26","门前清限定","双倍役满"],[43,"国士无双十三面","26","门前清限定","双倍役满"],[44,"纯正九莲宝灯（听9张）","26","门前清限定","双倍役满"],[45,"大四喜","26","可鸣牌","双倍役满"],[46,"大七星（古役）","26","门前清限定","7个字牌对子"]];

const I18N = {
  zh: {
    pageTitle: "算番算符", sub: "点击或文本都可以输入牌。文本自动同步图形输入。",
    inputTitle: "输入区", targetHand: "手牌", targetDora: "宝牌指示牌", targetUra: "里宝牌指示牌", targetWin: "和牌牌",
    autoSort: "自动排序", winType: "和牌方式", seat: "自风", round: "场风", dealer: "我是庄家", riichi: "立直", ippatsu: "一发", doubleRiichi: "双立直",
    palette: "点击牌面输入", handTitle: "当前手牌", clearHand: "清空手牌", clearDora: "清空宝牌指示牌", clearUra: "清空里宝牌指示牌",
    copyText: "复制文本", applyText: "手动刷新手牌", resultHeader: "计算结果", doraHeader: "宝牌计算", rulesTitle: "规则表（46条）",
    lang: "语言", theme: "主题", themeRegular: "普通", themeDark: "夜间", clock: "时间", back: "返回主页面", akaLabel: "红宝牌",
    notWin: "当前未和牌", waiting: "可和牌张", suggestFast: "最快速度建议", suggestValue: "预期番数最大建议", suggestDiscard: "建议打",
    suggestWaits: "听牌", suggestUkeire: "受入", suggestOneDraw: "一巡内进听受入", winReady: "当前可和", yaku: "役种", hanFu: "番符",
    points: "点数", noYaku: "无有效役（宝牌不能单独和牌）", parseOk: "文本解析成功",
    dora: "宝牌", ura: "里宝牌", aka: "红宝牌", doraOff: "未立直不计", doraTotal: "宝牌加番合计"
  },
  en: {
    pageTitle: "Han/Fu Calculator", sub: "Input by tile-click or text. Both stay synchronized.",
    inputTitle: "Input", targetHand: "Hand", targetDora: "Dora indicator", targetUra: "Ura dora indicator", targetWin: "Winning tile",
    autoSort: "Auto sort", winType: "Win type", seat: "Seat wind", round: "Round wind", dealer: "Dealer", riichi: "Riichi", ippatsu: "Ippatsu", doubleRiichi: "Double Riichi",
    palette: "Click tiles", handTitle: "Current hand", clearHand: "Clear hand", clearDora: "Clear dora indicators", clearUra: "Clear ura indicators",
    copyText: "Copy text", applyText: "Refresh Hand", resultHeader: "Result", doraHeader: "Dora Summary", rulesTitle: "Rule Table (46)",
    lang: "Language", theme: "Theme", themeRegular: "Regular", themeDark: "Dark", clock: "Clock", back: "Back", akaLabel: "Aka dora",
    notWin: "Not winning yet", waiting: "Winning tiles", suggestFast: "Fastest suggestion", suggestValue: "Max expected han", suggestDiscard: "Discard",
    suggestWaits: "Waits", suggestUkeire: "Ukeire", suggestOneDraw: "One-draw tenpai ukeire", winReady: "Winning hand", yaku: "Yaku", hanFu: "Han/Fu",
    points: "Points", noYaku: "No valid yaku (dora alone is not enough)", parseOk: "Text parsed",
    dora: "Dora", ura: "Ura dora", aka: "Aka dora", doraOff: "Requires riichi", doraTotal: "Dora bonus total"
  },
  ja: {
    pageTitle: "翻符計算", sub: "牌クリック入力とテキスト入力を同期します。",
    inputTitle: "入力", targetHand: "手牌", targetDora: "ドラ表示牌", targetUra: "裏ドラ表示牌", targetWin: "和了牌",
    autoSort: "自動整列", winType: "和了方法", seat: "自風", round: "場風", dealer: "親番", riichi: "立直", ippatsu: "一発", doubleRiichi: "ダブル立直",
    palette: "牌をクリック", handTitle: "現在手牌", clearHand: "手牌クリア", clearDora: "ドラ表示牌クリア", clearUra: "裏ドラ表示牌クリア",
    copyText: "テキストコピー", applyText: "手牌更新", resultHeader: "結果", doraHeader: "ドラ計算", rulesTitle: "ルール表（46）",
    lang: "言語", theme: "テーマ", themeRegular: "通常", themeDark: "ダーク", clock: "時間", back: "戻る", akaLabel: "赤ドラ",
    notWin: "未和了", waiting: "和了牌", suggestFast: "最速提案", suggestValue: "最大期待翻数提案", suggestDiscard: "打牌",
    suggestWaits: "待ち", suggestUkeire: "受け入れ", suggestOneDraw: "一巡テンパイ受け入れ", winReady: "和了可能", yaku: "役", hanFu: "翻符",
    points: "点数", noYaku: "有効役なし（ドラのみ不可）", parseOk: "解析成功",
    dora: "ドラ", ura: "裏ドラ", aka: "赤ドラ", doraOff: "立直時のみ", doraTotal: "ドラ加算合計"
  }
};

const state = {
  lang: "zh", theme: "regular", autoSort: true, target: "hand",
  hand: [], winTile: null, winType: "ron", seatWind: "E", roundWind: "E", dealer: false,
  riichi: false, ippatsu: false, doubleRiichi: false,
  doraIndicators: [], uraIndicators: [],
  aka5m: false, aka5p: false, aka5s: false,
  suppressText: false, clockEnabled: true,
};

const el = {
  backBtn: document.getElementById("backBtn"), langSelect: document.getElementById("langSelect"), themeSelect: document.getElementById("themeSelect"),
  clockToggle: document.getElementById("clockToggle"), clock: document.getElementById("clock"), clockTime: document.getElementById("clockTime"), clockDate: document.getElementById("clockDate"),
  tilePalette: document.getElementById("tilePalette"), handMeta: document.getElementById("handMeta"), handZone: document.getElementById("handZone"),
  textInput: document.getElementById("textInput"), textError: document.getElementById("textError"),
  result: document.getElementById("result"), advice: document.getElementById("advice"), doraCalc: document.getElementById("doraCalc"), rulesBody: document.getElementById("rulesBody"),
  autoSort: document.getElementById("autoSort"), winType: document.getElementById("winType"), seatWind: document.getElementById("seatWind"), roundWind: document.getElementById("roundWind"),
  dealer: document.getElementById("dealer"), riichi: document.getElementById("riichi"), ippatsu: document.getElementById("ippatsu"), doubleRiichi: document.getElementById("doubleRiichi"),
  aka5m: document.getElementById("aka5m"), aka5p: document.getElementById("aka5p"), aka5s: document.getElementById("aka5s"),
  clearHandBtn: document.getElementById("clearHandBtn"), clearDoraBtn: document.getElementById("clearDoraBtn"), clearUraBtn: document.getElementById("clearUraBtn"),
  copyTextBtn: document.getElementById("copyTextBtn"), applyTextBtn: document.getElementById("applyTextBtn"),
};

const tr = (k) => (I18N[state.lang] && I18N[state.lang][k]) || I18N.zh[k] || k;

function tileAssetName(id) {
  if (id <= 8) return `Man${id + 1}.png`;
  if (id <= 17) return `Pin${id - 8}.png`;
  if (id <= 26) return `Sou${id - 17}.png`;
  return ["Ton.png", "Nan.png", "Shaa.png", "Pei.png", "Chun.png", "Hatsu.png", "Haku.png"][id - 27] || "Blank.png";
}
function tileLabel(id) {
  if (id <= 8) return `${id + 1}m`; if (id <= 17) return `${id - 8}p`; if (id <= 26) return `${id - 17}s`;
  return ["E", "S", "W", "N", "C", "F", "P"][id - 27];
}
function tileHtml(id, size = "") { return `<span class="mj-tile ${size}"><img src="assets/tiles-photo/${tileAssetName(id)}" alt="${tileLabel(id)}"></span>`; }
function countTiles(tiles) { const c = new Array(34).fill(0); for (const t of tiles) c[t] += 1; return c; }
function isTerminalOrHonor(t) { return t >= 27 || t % 9 === 0 || t % 9 === 8; }
function sortHand() { if (state.autoSort) state.hand.sort((a, b) => a - b); }
function renderRules() { el.rulesBody.innerHTML = RULES_46.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join("")}</tr>`).join(""); }

function handToCompact(tiles) {
  const suits = [[], [], [], []];
  for (const t of tiles.slice().sort((a, b) => a - b)) {
    if (t <= 8) suits[0].push(String(t + 1));
    else if (t <= 17) suits[1].push(String(t - 8));
    else if (t <= 26) suits[2].push(String(t - 17));
    else suits[3].push(String(t - 26));
  }
  const out = [];
  if (suits[0].length) out.push(`${suits[0].join("")}m`);
  if (suits[1].length) out.push(`${suits[1].join("")}p`);
  if (suits[2].length) out.push(`${suits[2].join("")}s`);
  if (suits[3].length) out.push(`${suits[3].join("")}z`);
  return out.join(" ");
}

function parseToken(tok) {
  const s = tok.trim().toUpperCase();
  if (!s) return null;
  if (/^[1-9][MPS]$/.test(s)) {
    const n = Number(s[0]);
    return s[1] === "M" ? n - 1 : s[1] === "P" ? 9 + n - 1 : 18 + n - 1;
  }
  if (/^[1-7]Z$/.test(s)) return 26 + Number(s[0]);
  if (["E", "S", "W", "N", "C", "F", "P"].includes(s)) return 27 + ["E", "S", "W", "N", "C", "F", "P"].indexOf(s);
  return null;
}

function parseCompactHand(str) {
  const out = [];
  const parts = str.match(/[0-9]+[mpsz]/gi) || [];
  for (const p of parts) {
    const suit = p[p.length - 1].toLowerCase();
    for (const ch of p.slice(0, -1)) {
      const n = Number(ch);
      if (!Number.isInteger(n) || n < 1 || n > 9) throw new Error(`非法数字 ${ch}`);
      if (suit === "m") out.push(n - 1);
      else if (suit === "p") out.push(9 + n - 1);
      else if (suit === "s") out.push(18 + n - 1);
      else { if (n > 7) throw new Error("z只能1-7"); out.push(26 + n); }
    }
  }
  if (!parts.length && str.trim()) {
    for (const f of str.split(/[ ,]+/).filter(Boolean)) {
      const t = parseToken(f); if (t === null) throw new Error(`无法识别牌 ${f}`); out.push(t);
    }
  }
  return out;
}

function parseTokenList(str) {
  if (!str.trim()) return [];
  const fromCompact = parseCompactHand(str);
  if (fromCompact.length) return fromCompact;
  return str.split(/[ ,]+/).filter(Boolean).map((x) => {
    const t = parseToken(x); if (t === null) throw new Error(`无法识别牌 ${x}`); return t;
  });
}

function stateToText() {
  const aka = [];
  if (state.aka5m) aka.push("5m");
  if (state.aka5p) aka.push("5p");
  if (state.aka5s) aka.push("5s");
  return [
    `hand: ${handToCompact(state.hand)}`,
    `dora_ind: ${state.doraIndicators.map(tileLabel).join(" ")}`,
    `ura_ind: ${state.uraIndicators.map(tileLabel).join(" ")}`,
    `aka: ${aka.join(" ")}`,
    `win_tile: ${state.winTile === null ? "" : tileLabel(state.winTile)}`,
    `win_type: ${state.winType}`,
    `seat: ${state.seatWind}`,
    `round: ${state.roundWind}`,
    `dealer: ${state.dealer ? 1 : 0}`,
    `riichi: ${state.riichi ? 1 : 0}`,
    `ippatsu: ${state.ippatsu ? 1 : 0}`,
    `double_riichi: ${state.doubleRiichi ? 1 : 0}`,
  ].join("\n");
}

function parseTextToState(text) {
  const draft = { ...state, hand: state.hand.slice(), doraIndicators: state.doraIndicators.slice(), uraIndicators: state.uraIndicators.slice() };
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([a-z_]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === "hand") draft.hand = parseCompactHand(val);
    else if (key === "dora_ind") draft.doraIndicators = parseTokenList(val);
    else if (key === "ura_ind") draft.uraIndicators = parseTokenList(val);
    else if (key === "aka") {
      const items = val.toLowerCase();
      draft.aka5m = items.includes("5m"); draft.aka5p = items.includes("5p"); draft.aka5s = items.includes("5s");
    } else if (key === "win_tile") draft.winTile = val ? parseToken(val) : null;
    else if (key === "win_type") draft.winType = val === "tsumo" ? "tsumo" : "ron";
    else if (key === "seat") draft.seatWind = ["E", "S", "W", "N"].includes(val.toUpperCase()) ? val.toUpperCase() : "E";
    else if (key === "round") draft.roundWind = ["E", "S", "W", "N"].includes(val.toUpperCase()) ? val.toUpperCase() : "E";
    else if (key === "dealer") draft.dealer = val === "1" || val.toLowerCase() === "true";
    else if (key === "riichi") draft.riichi = val === "1" || val.toLowerCase() === "true";
    else if (key === "ippatsu") draft.ippatsu = val === "1" || val.toLowerCase() === "true";
    else if (key === "double_riichi") draft.doubleRiichi = val === "1" || val.toLowerCase() === "true";
  }
  if (draft.hand.length > 14) throw new Error("手牌超过14张");
  if (countTiles(draft.hand).some((x) => x > 4)) throw new Error("同牌超过4张");
  if (draft.doraIndicators.some((x) => x < 0 || x > 33) || draft.uraIndicators.some((x) => x < 0 || x > 33)) throw new Error("宝牌指示牌非法");
  Object.assign(state, draft);
  sortHand();
}

function renderPalette() {
  const groups = [{ t: "万子", ids: [...Array(9)].map((_, i) => i) }, { t: "筒子", ids: [...Array(9)].map((_, i) => 9 + i) }, { t: "索子", ids: [...Array(9)].map((_, i) => 18 + i) }, { t: "字牌", ids: [27, 28, 29, 30, 31, 32, 33] }];
  el.tilePalette.innerHTML = groups.map((g) => `<div class="tile-group"><div class="tile-group-title">${g.t}</div><div class="tile-wrap">${g.ids.map((id) => `<button class="tile-btn" data-add="${id}" type="button">${tileHtml(id)}</button>`).join("")}</div></div>`).join("");
  el.tilePalette.querySelectorAll("button[data-add]").forEach((b) => b.addEventListener("click", () => onTileAdd(Number(b.dataset.add))));
}

function renderHand() {
  el.handMeta.textContent = `${state.hand.length}/14`;
  el.handZone.innerHTML = state.hand.map((id, i) => `<button class="tile-btn" data-remove="${i}" type="button">${tileHtml(id)}</button>`).join("") || `<span style="color:var(--sub)">-</span>`;
  el.handZone.querySelectorAll("button[data-remove]").forEach((b) => b.addEventListener("click", () => { state.hand.splice(Number(b.dataset.remove), 1); syncFromState(); }));
}

function allTilesForCount() {
  const tiles = state.hand.slice();
  if (tiles.length === 13 && state.winTile !== null) tiles.push(state.winTile);
  return tiles;
}
function nextDora(ind) {
  if (ind <= 8) return (ind + 1) % 9;
  if (ind <= 17) return ((ind - 9 + 1) % 9) + 9;
  if (ind <= 26) return ((ind - 18 + 1) % 9) + 18;
  if (ind <= 30) return ind === 30 ? 27 : ind + 1;
  return ind === 33 ? 31 : ind + 1;
}

function calcDoraBonus(tiles) {
  const doraTiles = state.doraIndicators.map(nextDora);
  const uraTiles = state.uraIndicators.map(nextDora);
  const doraCount = doraTiles.reduce((a, d) => a + tiles.filter((t) => t === d).length, 0);
  const uraCountRaw = uraTiles.reduce((a, d) => a + tiles.filter((t) => t === d).length, 0);
  const uraCount = state.riichi ? uraCountRaw : 0;
  const c = countTiles(tiles);
  const akaCount = (state.aka5m && c[4] > 0 ? 1 : 0) + (state.aka5p && c[13] > 0 ? 1 : 0) + (state.aka5s && c[22] > 0 ? 1 : 0);
  return { doraTiles, uraTiles, doraCount, uraCount, uraCountRaw, akaCount, total: doraCount + uraCount + akaCount };
}

function canChiitoitsu(tiles) { if (tiles.length !== 14) return false; const c = countTiles(tiles); return c.filter((x) => x === 2).length === 7; }
function canKokushi(tiles) {
  if (tiles.length !== 14) return { ok: false, thirteenWait: false };
  const need = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
  const c = countTiles(tiles);
  if (c.some((v, i) => v > 0 && !need.includes(i))) return { ok: false, thirteenWait: false };
  if (!need.every((t) => c[t] > 0)) return { ok: false, thirteenWait: false };
  const pairs = need.filter((t) => c[t] >= 2).length;
  if (pairs !== 1) return { ok: false, thirteenWait: false };
  return { ok: true, thirteenWait: true };
}
function canChuuren(tiles) {
  if (tiles.length !== 14 || tiles.some((t) => t >= 27)) return { ok: false, junsei: false };
  const suit = Math.floor(tiles[0] / 9);
  if (!tiles.every((t) => Math.floor(t / 9) === suit)) return { ok: false, junsei: false };
  const c = new Array(9).fill(0); tiles.forEach((t) => { c[t % 9] += 1; });
  const base = [3, 1, 1, 1, 1, 1, 1, 1, 3];
  for (let i = 0; i < 9; i += 1) if (c[i] < base[i]) return { ok: false, junsei: false };
  const diffs = c.map((x, i) => x - base[i]);
  const extra = diffs.reduce((a, b) => a + b, 0);
  return { ok: extra === 1, junsei: extra === 1 };
}

function findMeldDecomposition(counts, need, acc) {
  if (need === 0) return acc.slice();
  let i = -1; for (let k = 0; k < 34; k += 1) if (counts[k] > 0) { i = k; break; }
  if (i < 0) return null;
  if (counts[i] >= 3) {
    counts[i] -= 3; acc.push({ type: "triplet", tiles: [i, i, i] });
    const r = findMeldDecomposition(counts, need - 1, acc); if (r) return r;
    acc.pop(); counts[i] += 3;
  }
  if (i <= 26 && i % 9 <= 6 && counts[i + 1] > 0 && counts[i + 2] > 0) {
    counts[i] -= 1; counts[i + 1] -= 1; counts[i + 2] -= 1; acc.push({ type: "sequence", tiles: [i, i + 1, i + 2] });
    const r = findMeldDecomposition(counts, need - 1, acc); if (r) return r;
    acc.pop(); counts[i] += 1; counts[i + 1] += 1; counts[i + 2] += 1;
  }
  return null;
}
function findWinningStructure(tiles) {
  if (tiles.length !== 14) return null;
  const c = countTiles(tiles);
  for (let i = 0; i < 34; i += 1) {
    if (c[i] < 2) continue;
    c[i] -= 2; const melds = findMeldDecomposition(c, 4, []); c[i] += 2;
    if (melds) return { pair: i, melds };
  }
  return null;
}

function sequenceHasYaochu(start) { return start % 9 === 0 || start % 9 === 6; }
function meldHasYaochu(meld) { return meld.type === "triplet" ? isTerminalOrHonor(meld.tiles[0]) : sequenceHasYaochu(meld.tiles[0]); }
function isChanta(structure) {
  if (!structure) return false;
  if (!isTerminalOrHonor(structure.pair)) return false;
  return structure.melds.every(meldHasYaochu);
}
function isJunchan(structure, allTiles) {
  if (!structure) return false;
  if (allTiles.some((t) => t >= 27)) return false;
  if (structure.pair >= 27 || !isTerminalOrHonor(structure.pair)) return false;
  return structure.melds.every((m) => (m.type === "triplet" ? isTerminalOrHonor(m.tiles[0]) && m.tiles[0] < 27 : sequenceHasYaochu(m.tiles[0])));
}

function calcFu(structure, winType, chiitoi) {
  if (chiitoi) return 25;
  let fu = 20; if (winType === "ron") fu += 10; if (winType === "tsumo") fu += 2;
  if (structure && structure.pair >= 27) fu += 2;
  if (structure) structure.melds.forEach((m) => { if (m.type === "triplet") fu += isTerminalOrHonor(m.tiles[0]) ? 8 : 4; });
  return Math.ceil(fu / 10) * 10;
}
function calcBasePoints(han, fu, yakumanTimes) {
  if (yakumanTimes > 0) return 8000 * yakumanTimes;
  let base = fu * Math.pow(2, han + 2);
  if (han >= 13) base = 8000; else if (han >= 11) base = 6000; else if (han >= 8) base = 4000; else if (han >= 6) base = 3000; else if (han >= 5 || base >= 2000) base = 2000;
  return base;
}

function getLimitName(han, yakumanTimes, base) {
  if (yakumanTimes > 0) return yakumanTimes >= 2 ? "双倍役满" : "役满";
  if (han >= 13) return "役满";
  if (han >= 11) return "三倍满";
  if (han >= 8) return "倍满";
  if (han >= 6) return "跳满";
  if (han >= 5 || base >= 2000) return "满贯";
  return "";
}

function calcPointBreakdown(base, winType, isDealer) {
  const ceil100 = (x) => Math.ceil(x / 100) * 100;
  if (winType === "ron") {
    const total = isDealer ? ceil100(base * 6) : ceil100(base * 4);
    return { total, label: isDealer ? `庄家荣和 ${total}` : `闲家荣和 ${total}` };
  }
  if (isDealer) {
    const each = ceil100(base * 2);
    return { total: each * 3, label: `庄家自摸 ${each} all (合计${each * 3})` };
  }
  const fromDealer = ceil100(base * 2);
  const fromOthers = ceil100(base);
  const total = fromDealer + fromOthers * 2;
  return { total, label: `闲家自摸 ${fromDealer}/${fromOthers} (合计${total})` };
}

function evaluateHandWin(tiles) {
  const kokushi = canKokushi(tiles), chuuren = canChuuren(tiles), chiitoi = canChiitoitsu(tiles), structure = findWinningStructure(tiles);
  if (!kokushi.ok && !chuuren.ok && !chiitoi && !structure) return { ok: false, reason: "shape" };
  const yaku = []; const add = (n, h) => yaku.push({ name: n, han: h });
  let yakumanTimes = 0; const c = countTiles(tiles);

  if (kokushi.ok) { yakumanTimes = 2; add("国士无双十三面", 26); }
  if (chuuren.ok) { yakumanTimes = Math.max(yakumanTimes, 2); add("纯正九莲宝灯", 26); }

  if (!yakumanTimes) {
    if (state.doubleRiichi) add("双立直", 2); else if (state.riichi) add("立直", 1);
    if (state.riichi && state.ippatsu) add("一发", 1);
    if (state.winType === "tsumo") add("门前清自摸", 1);
    if (tiles.every((t) => t <= 26 && !isTerminalOrHonor(t))) add("断幺九", 1);
    const wm = { E: 27, S: 28, W: 29, N: 30 };
    if (c[wm[state.seatWind]] >= 3) add("门风刻子", 1);
    if (c[wm[state.roundWind]] >= 3) add("场风刻子", 1);
    if (c[31] >= 3) add("三元牌刻子(中)", 1); if (c[32] >= 3) add("三元牌刻子(发)", 1); if (c[33] >= 3) add("三元牌刻子(白)", 1);
    if (chiitoi) add("七对子", 2);

    if (structure) {
      const melds = structure.melds, seq = melds.filter((m) => m.type === "sequence"), tri = melds.filter((m) => m.type === "triplet");
      if (tri.length === 4) add("碰碰和", 2);
      if (tri.length >= 3) add("三暗刻", 2);
      const pair = structure.pair;
      const dragonTrip = [31, 32, 33].filter((t) => c[t] >= 3).length;
      if (dragonTrip >= 2 && pair >= 31 && pair <= 33) add("小三元", 2);
      const heads = seq.map((m) => m.tiles[0]);
      for (let n = 0; n <= 6; n += 1) { if (heads.includes(n) && heads.includes(9 + n) && heads.includes(18 + n)) { add("三色同顺", 2); break; } }
      for (let s = 0; s < 3; s += 1) { const b = s * 9; if (heads.includes(b) && heads.includes(b + 3) && heads.includes(b + 6)) { add("一气通贯", 2); break; } }
      const map = new Map(); heads.forEach((h) => map.set(h, (map.get(h) || 0) + 1)); const p = [...map.values()].filter((x) => x >= 2).length;
      if (p >= 2) add("两杯口", 3); else if (p === 1) add("一杯口", 1);
      if (melds.every((m) => m.type === "sequence") && pair < 27 && !isTerminalOrHonor(pair)) add("平和", 1);
      if (isJunchan(structure, tiles)) add("纯全带幺九", 3); else if (isChanta(structure)) add("混全带幺九", 2);
    }

    const termHonor = tiles.every((t) => t >= 27 || t % 9 === 0 || t % 9 === 8);
    if (termHonor) { if (tiles.some((t) => t >= 27)) add("混老头", 2); else { yakumanTimes = Math.max(yakumanTimes, 1); add("清老头", 13); } }
    if (tiles.every((t) => t >= 27)) { yakumanTimes = Math.max(yakumanTimes, 1); add("字一色", 13); }
    const green = new Set([19, 20, 21, 23, 25, 32]); if (tiles.every((t) => green.has(t))) { yakumanTimes = Math.max(yakumanTimes, 1); add("绿一色", 13); }
    const suit = [0, 0, 0]; let honor = 0; tiles.forEach((t) => { if (t <= 8) suit[0] += 1; else if (t <= 17) suit[1] += 1; else if (t <= 26) suit[2] += 1; else honor += 1; });
    const suitCnt = suit.filter((x) => x > 0).length; if (suitCnt === 1 && honor === 0) add("清一色", 6); else if (suitCnt === 1 && honor > 0) add("混一色", 3);
    if ([31, 32, 33].filter((t) => c[t] >= 3).length === 3) { yakumanTimes = Math.max(yakumanTimes, 1); add("大三元", 13); }
    const wTrip = [27, 28, 29, 30].filter((t) => c[t] >= 3).length; const wPair = [27, 28, 29, 30].some((t) => c[t] === 2);
    if (wTrip === 4) { yakumanTimes = Math.max(yakumanTimes, 2); add("大四喜", 26); } else if (wTrip === 3 && wPair) { yakumanTimes = Math.max(yakumanTimes, 1); add("小四喜", 13); }
  }

  const dora = calcDoraBonus(tiles);
  const baseYakuHan = yaku.filter((x) => !x.name.includes("宝牌") && !x.name.includes("ドラ")).reduce((a, b) => a + b.han, 0);
  if (!yakumanTimes && baseYakuHan <= 0) return { ok: false, reason: "no_yaku", dora };

  let han = yakumanTimes ? yakumanTimes * 13 : yaku.reduce((a, b) => a + b.han, 0);
  if (!yakumanTimes) {
    if (dora.doraCount > 0) { yaku.push({ name: `宝牌x${dora.doraCount}`, han: dora.doraCount }); han += dora.doraCount; }
    if (dora.uraCount > 0) { yaku.push({ name: `里宝牌x${dora.uraCount}`, han: dora.uraCount }); han += dora.uraCount; }
    if (dora.akaCount > 0) { yaku.push({ name: `红宝牌x${dora.akaCount}`, han: dora.akaCount }); han += dora.akaCount; }
  }
  const fu = calcFu(structure, state.winType, chiitoi);
  const base = calcBasePoints(han, fu, yakumanTimes);
  const isDealer = state.dealer;
  const point = calcPointBreakdown(base, state.winType, isDealer);
  const limitName = getLimitName(han, yakumanTimes, base);
  return { ok: true, han, fu, yaku, dora, limitName, basePoints: base, point };
}
function canWinTiles(tiles13) {
  if (tiles13.length !== 13) return [];
  const c = countTiles(tiles13); const out = [];
  for (let i = 0; i < 34; i += 1) {
    if (c[i] >= 4) continue;
    const r = evaluateHandWin(tiles13.concat(i));
    if (r.ok) out.push(i);
  }
  return out;
}

function getOneDrawTenpaiUkeire(next13) {
  const c = countTiles(next13); let sum = 0;
  for (let d = 0; d < 34; d += 1) {
    const left = 4 - c[d]; if (left <= 0) continue;
    const h14 = next13.concat(d); let ok = false;
    for (let i = 0; i < h14.length; i += 1) { const t = h14.slice(); t.splice(i, 1); if (canWinTiles(t).length > 0) { ok = true; break; } }
    if (ok) sum += left;
  }
  return sum;
}

function getDiscardAdvice(hand14) {
  if (hand14.length !== 14) return null;
  const c = countTiles(hand14); const seen = new Set(); const cand = [];
  for (let i = 0; i < hand14.length; i += 1) {
    const discard = hand14[i]; if (seen.has(discard)) continue; seen.add(discard);
    const next13 = hand14.slice(); next13.splice(next13.indexOf(discard), 1);
    const waits = canWinTiles(next13);
    const ukeire = waits.reduce((a, w) => a + (4 - c[w]), 0);
    const one = getOneDrawTenpaiUkeire(next13);
    let bestHan = 0; for (const w of waits) { const r = evaluateHandWin(next13.concat(w)); if (r.ok && r.han > bestHan) bestHan = r.han; }
    cand.push({ discard, waits, ukeire, oneDrawUkeire: one, bestHan, speedScore: waits.length * 100 + ukeire * 3 + one, valueScore: bestHan * 120 + waits.length * 10 + ukeire });
  }
  if (!cand.length) return null;
  const fast = cand.slice().sort((a, b) => b.speedScore - a.speedScore || b.ukeire - a.ukeire || a.discard - b.discard)[0];
  const value = cand.slice().sort((a, b) => b.valueScore - a.valueScore || b.bestHan - a.bestHan || a.discard - b.discard)[0];
  return { fast, value };
}

function renderDoraPanel(tiles) {
  const d = calcDoraBonus(tiles);
  const doraMap = state.doraIndicators.map((ind) => `${tileLabel(ind)}→${tileLabel(nextDora(ind))}`).join(" ") || "-";
  const uraMap = state.uraIndicators.map((ind) => `${tileLabel(ind)}→${tileLabel(nextDora(ind))}`).join(" ") || "-";
  el.doraCalc.innerHTML = [
    `<div class="dora-line"><b>${tr("dora")}</b>: ${doraMap} | +${d.doraCount}</div>`,
    `<div class="dora-line"><b>${tr("ura")}</b>: ${uraMap} | +${state.riichi ? d.uraCount : 0}${state.riichi ? "" : ` (${tr("doraOff")})`}</div>`,
    `<div class="dora-line"><b>${tr("aka")}</b>: ${state.aka5m ? "5m " : ""}${state.aka5p ? "5p " : ""}${state.aka5s ? "5s" : ""} | +${d.akaCount}</div>`,
    `<div class="dora-line"><b>${tr("doraTotal")}</b>: +${d.total}</div>`
  ].join("");
}

function renderResult() {
  const hand = allTilesForCount();
  const resultLines = []; const adviceLines = [];
  renderDoraPanel(hand);
  if (hand.length === 14) {
    const r = evaluateHandWin(hand);
    if (r.ok) {
      resultLines.push(`<div class="result-title">${tr("winReady")}</div>`);
      const hanFuText = `${r.han}番 ${r.fu}符${r.limitName ? ` (${r.limitName})` : ""}`;
      resultLines.push(`<div class="result-line">${tr("hanFu")}: ${hanFuText}</div>`);
      resultLines.push(`<div class="result-line">${tr("points")}: ${r.point.total}</div>`);
      resultLines.push(`<div class="result-line">${r.point.label}</div>`);
      resultLines.push(`<div class="result-line">${tr("yaku")}: ${r.yaku.map((y) => `${y.name}(${y.han})`).join(", ") || "-"}</div>`);
    } else {
      resultLines.push(`<div class="result-title">${tr("notWin")}</div>`);
      if (r.reason === "no_yaku") resultLines.push(`<div class="result-line">${tr("noYaku")}</div>`);
    }
    const adv = getDiscardAdvice(hand);
    if (adv) {
      const card = (title, x) => `<div class="result-title">${title}</div><div class="result-line">${tr("suggestDiscard")}: ${tileHtml(x.discard, "small")}</div><div class="result-line">${tr("suggestWaits")}: ${x.waits.map((w) => tileHtml(w, "tiny")).join("") || "-"}</div><div class="result-line">${tr("suggestUkeire")}: ${x.ukeire}</div><div class="result-line">${tr("suggestOneDraw")}: ${x.oneDrawUkeire}</div><div class="result-line">best han: ${x.bestHan}</div>`;
      adviceLines.push(card(tr("suggestFast"), adv.fast));
      adviceLines.push(card(tr("suggestValue"), adv.value));
    } else adviceLines.push(`<div class="result-line">-</div>`);
  } else if (hand.length === 13) {
    const waits = canWinTiles(hand);
    resultLines.push(`<div class="result-title">${tr("notWin")}</div>`);
    resultLines.push(`<div class="result-line">${tr("waiting")}: ${waits.length ? waits.map((w) => tileHtml(w, "small")).join("") : "-"}</div>`);
    adviceLines.push(`<div class="result-line">-</div>`);
  } else {
    resultLines.push(`<div class="result-title">${tr("notWin")}</div><div class="result-line">hand tiles: ${hand.length} (need 13 or 14)</div>`);
    adviceLines.push(`<div class="result-line">-</div>`);
  }
  resultLines.push(`<div class="tags"><span class="tag">dora:${state.doraIndicators.length}</span><span class="tag">ura:${state.uraIndicators.length}</span><span class="tag">${state.winType}</span><span class="tag">${state.dealer ? "dealer" : "non-dealer"}</span><span class="tag">seat ${state.seatWind}</span><span class="tag">round ${state.roundWind}</span></div>`);
  el.result.innerHTML = resultLines.join(""); el.advice.innerHTML = adviceLines.join("");
}

function applyTheme() { document.body.setAttribute("data-theme", state.theme === "dark" ? "dark" : "regular"); }
function applyLanguage() {
  const set = (id, key) => { const n = document.getElementById(id); if (n) n.textContent = tr(key); };
  set("pageTitle", "pageTitle"); set("subText", "sub"); set("inputTitle", "inputTitle"); set("targetHand", "targetHand"); set("targetDora", "targetDora"); set("targetUra", "targetUra"); set("targetWin", "targetWin");
  set("autoSortLabel", "autoSort"); set("winTypeLabel", "winType"); set("seatLabel", "seat"); set("roundLabel", "round"); set("dealerLabel", "dealer"); set("riichiLabel", "riichi"); set("ippatsuLabel", "ippatsu"); set("doubleRiichiLabel", "doubleRiichi");
  set("akaLabel", "akaLabel"); set("paletteTitle", "palette"); set("handTitle", "handTitle"); set("clearHandBtn", "clearHand"); set("clearDoraBtn", "clearDora"); set("clearUraBtn", "clearUra");
  set("copyTextBtn", "copyText"); set("applyTextBtn", "applyText"); set("resultHeader", "resultHeader"); set("doraHeader", "doraHeader"); set("rulesTitle", "rulesTitle"); set("langLabel", "lang"); set("themeLabel", "theme"); set("clockLabel", "clock");
  const th = document.getElementById("textHeader"); if (th) th.textContent = state.lang === "en" ? "Text Input" : state.lang === "ja" ? "テキスト入力" : "文本输入";
  const ah = document.getElementById("adviceHeader"); if (ah) ah.textContent = state.lang === "en" ? "Discard Advice" : state.lang === "ja" ? "打牌提案" : "出牌建议";
  el.backBtn.textContent = tr("back"); el.themeSelect.options[0].text = tr("themeRegular"); el.themeSelect.options[1].text = tr("themeDark");
}

function updateClock() {
  const d = new Date();
  el.clockTime.textContent = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  el.clockDate.textContent = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  el.clock.style.display = state.clockEnabled ? "block" : "none";
}

function syncTextFromState() { if (!state.suppressText) el.textInput.value = stateToText(); }
function reflectControls() {
  el.langSelect.value = state.lang; el.themeSelect.value = state.theme; el.autoSort.checked = state.autoSort; el.winType.value = state.winType; el.seatWind.value = state.seatWind; el.roundWind.value = state.roundWind;
  el.dealer.checked = state.dealer; el.riichi.checked = state.riichi; el.ippatsu.checked = state.ippatsu; el.doubleRiichi.checked = state.doubleRiichi;
  el.aka5m.checked = state.aka5m; el.aka5p.checked = state.aka5p; el.aka5s.checked = state.aka5s; el.clockToggle.checked = state.clockEnabled;
}
function recomputeAndRender() { sortHand(); renderHand(); syncTextFromState(); renderResult(); }
function syncFromState() { recomputeAndRender(); }

function onTileAdd(id) {
  if (state.target === "dora") { state.doraIndicators.push(id); syncFromState(); return; }
  if (state.target === "ura") { state.uraIndicators.push(id); syncFromState(); return; }
  if (state.target === "win") { state.winTile = id; syncFromState(); return; }
  const c = countTiles(state.hand); if (c[id] >= 4 || state.hand.length >= 14) return;
  state.hand.push(id); syncFromState();
}
function restorePrefs() {
  const lang = localStorage.getItem("mahjong_calc_lang"); if (["zh", "en", "ja"].includes(lang)) state.lang = lang;
  const theme = localStorage.getItem("mahjong_calc_theme"); if (["regular", "dark"].includes(theme)) state.theme = theme;
  if (localStorage.getItem("mahjong_calc_auto_sort") === "0") state.autoSort = false;
  if (localStorage.getItem("mahjong_calc_clock") === "0") state.clockEnabled = false;
}

function bindEvents() {
  document.querySelectorAll("input[name='target']").forEach((r) => r.addEventListener("change", () => { state.target = document.querySelector("input[name='target']:checked").value; }));
  el.backBtn.addEventListener("click", () => { window.location.href = "index.html"; });
  el.langSelect.addEventListener("change", () => { state.lang = el.langSelect.value; localStorage.setItem("mahjong_calc_lang", state.lang); applyLanguage(); syncFromState(); });
  el.themeSelect.addEventListener("change", () => { state.theme = el.themeSelect.value; localStorage.setItem("mahjong_calc_theme", state.theme); applyTheme(); });
  el.clockToggle.addEventListener("change", () => { state.clockEnabled = el.clockToggle.checked; localStorage.setItem("mahjong_calc_clock", state.clockEnabled ? "1" : "0"); updateClock(); });
  el.autoSort.addEventListener("change", () => { state.autoSort = el.autoSort.checked; localStorage.setItem("mahjong_calc_auto_sort", state.autoSort ? "1" : "0"); syncFromState(); });
  el.winType.addEventListener("change", () => { state.winType = el.winType.value; syncFromState(); });
  el.seatWind.addEventListener("change", () => { state.seatWind = el.seatWind.value; syncFromState(); });
  el.roundWind.addEventListener("change", () => { state.roundWind = el.roundWind.value; syncFromState(); });
  el.dealer.addEventListener("change", () => { state.dealer = el.dealer.checked; syncFromState(); });
  el.riichi.addEventListener("change", () => { state.riichi = el.riichi.checked; syncFromState(); });
  el.ippatsu.addEventListener("change", () => { state.ippatsu = el.ippatsu.checked; syncFromState(); });
  el.doubleRiichi.addEventListener("change", () => { state.doubleRiichi = el.doubleRiichi.checked; syncFromState(); });
  el.aka5m.addEventListener("change", () => { state.aka5m = el.aka5m.checked; syncFromState(); });
  el.aka5p.addEventListener("change", () => { state.aka5p = el.aka5p.checked; syncFromState(); });
  el.aka5s.addEventListener("change", () => { state.aka5s = el.aka5s.checked; syncFromState(); });
  el.clearHandBtn.addEventListener("click", () => { state.hand = []; state.winTile = null; syncFromState(); });
  el.clearDoraBtn.addEventListener("click", () => { state.doraIndicators = []; syncFromState(); });
  el.clearUraBtn.addEventListener("click", () => { state.uraIndicators = []; syncFromState(); });
  el.copyTextBtn.addEventListener("click", async () => { try { await navigator.clipboard.writeText(el.textInput.value); el.textError.textContent = tr("parseOk"); } catch (e) { el.textError.textContent = String(e.message || e); } });
  el.applyTextBtn.addEventListener("click", () => { try { parseTextToState(el.textInput.value); el.textError.textContent = tr("parseOk"); reflectControls(); syncFromState(); } catch (e) { el.textError.textContent = String(e.message || e); } });

  let timer = null;
  el.textInput.addEventListener("input", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        state.suppressText = true;
        parseTextToState(el.textInput.value);
        el.textError.textContent = tr("parseOk");
        reflectControls();
        recomputeAndRender();
      } catch (e) {
        el.textError.textContent = String(e.message || e);
      } finally {
        state.suppressText = false;
      }
    }, 260);
  });
}

function init() {
  restorePrefs();
  applyTheme();
  applyLanguage();
  renderPalette();
  renderRules();
  reflectControls();
  syncFromState();
  bindEvents();
  updateClock();
  setInterval(updateClock, 1000);
}

init();
