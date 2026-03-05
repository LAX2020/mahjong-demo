
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
    dora: "宝牌", ura: "里宝牌", aka: "红宝牌", doraOff: "未立直不计", doraTotal: "宝牌加番合计",
    specialWin: "和牌事件", chankan: "抢杠", rinshan: "岭上开花", haitei: "海底捞月", houtei: "河底捞鱼",
    claim13Title: "13张吃碰杠建议", actionChi: "吃", actionPong: "碰", actionKong: "杠", actionRon: "荣和", actionPass: "不吃碰杠",
    levelRecommend: "推荐", levelNeutral: "中立", levelCaution: "谨慎",
    tenpaiTitle: "13张听牌点数预览", ronLabel: "荣和", tsumoLabel: "自摸", winRouteOnly: "当前已和牌，显示和牌计算结果。",
    yakuDetail: "符合条件", none: "无", refTableTitle: "计分规则表", refNonDealer: "闲家点数表（1-4番）", refDealer: "庄家点数表（1-4番）", refLimit: "满贯以上总番数查表", refFu: "符数计算表", refDora: "宝牌规则表",
    colFu: "符", colHan1: "1番", colHan2: "2番", colHan3: "3番", colHan4: "4番", colRange: "番数区间", colLimit: "限定名", colRon: "荣和", colTsumo: "自摸", colRule: "规则", colDesc: "说明",
    limitMangan: "满贯", limitHaneman: "跳满", limitBaiman: "倍满", limitSanbaiman: "三倍满", limitYakuman: "役满"
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
    dora: "Dora", ura: "Ura dora", aka: "Aka dora", doraOff: "Requires riichi", doraTotal: "Dora bonus total",
    specialWin: "Win event", chankan: "Chankan", rinshan: "Rinshan", haitei: "Haitei", houtei: "Houtei",
    claim13Title: "13-tile call suggestions", actionChi: "Chi", actionPong: "Pong", actionKong: "Kong", actionRon: "Ron", actionPass: "Pass",
    levelRecommend: "Recommend", levelNeutral: "Neutral", levelCaution: "Caution",
    tenpaiTitle: "13-tile tenpai value preview", ronLabel: "Ron", tsumoLabel: "Tsumo", winRouteOnly: "Hand is already winning. Showing score calculation.",
    yakuDetail: "Yaku details", none: "None", refTableTitle: "Scoring Tables", refNonDealer: "Non-dealer table (1-4 han)", refDealer: "Dealer table (1-4 han)", refLimit: "Mangan and above", refFu: "Fu table", refDora: "Dora rules",
    colFu: "Fu", colHan1: "1 han", colHan2: "2 han", colHan3: "3 han", colHan4: "4 han", colRange: "Han range", colLimit: "Limit", colRon: "Ron", colTsumo: "Tsumo", colRule: "Rule", colDesc: "Description",
    limitMangan: "Mangan", limitHaneman: "Haneman", limitBaiman: "Baiman", limitSanbaiman: "Sanbaiman", limitYakuman: "Yakuman"
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
    dora: "ドラ", ura: "裏ドラ", aka: "赤ドラ", doraOff: "立直時のみ", doraTotal: "ドラ加算合計",
    specialWin: "和了状況", chankan: "槍槓", rinshan: "嶺上開花", haitei: "海底摸月", houtei: "河底撈魚",
    claim13Title: "13枚 鳴き提案", actionChi: "チー", actionPong: "ポン", actionKong: "カン", actionRon: "ロン", actionPass: "見送り",
    levelRecommend: "推奨", levelNeutral: "中立", levelCaution: "慎重",
    tenpaiTitle: "13枚 聴牌打点プレビュー", ronLabel: "ロン", tsumoLabel: "ツモ", winRouteOnly: "和了形のため、和了計算のみ表示します。",
    yakuDetail: "役詳細", none: "なし", refTableTitle: "点数計算表", refNonDealer: "子の点数表（1-4翻）", refDealer: "親の点数表（1-4翻）", refLimit: "満貫以上一覧", refFu: "符計算表", refDora: "ドラ規則",
    colFu: "符", colHan1: "1翻", colHan2: "2翻", colHan3: "3翻", colHan4: "4翻", colRange: "翻数区間", colLimit: "打点名", colRon: "ロン", colTsumo: "ツモ", colRule: "規則", colDesc: "説明",
    limitMangan: "満貫", limitHaneman: "跳満", limitBaiman: "倍満", limitSanbaiman: "三倍満", limitYakuman: "役満"
  }
};

const state = {
  lang: "zh", theme: "regular", autoSort: true, target: "hand",
  hand: [], winTile: null, winType: "ron", seatWind: "E", roundWind: "E", dealer: false,
  riichi: false, ippatsu: false, doubleRiichi: false,
  chankan: false, rinshan: false, haitei: false, houtei: false,
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
  chankan: document.getElementById("chankan"), rinshan: document.getElementById("rinshan"), haitei: document.getElementById("haitei"), houtei: document.getElementById("houtei"),
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
function tileNameZh(id) {
  if (id <= 8) return `${id + 1}万`;
  if (id <= 17) return `${id - 8}筒`;
  if (id <= 26) return `${id - 17}索`;
  return ["东", "南", "西", "北", "中", "发", "白"][id - 27];
}
function tileHtml(id, size = "") {
  const special = id === 33 ? " tile-haku" : "";
  return `<span class="mj-tile ${size}${special}"><img src="assets/tiles-photo/${tileAssetName(id)}" alt="${tileLabel(id)}"></span>`;
}
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

function normalizeWinEventFlags(target) {
  if (target.winType === "tsumo") {
    target.chankan = false;
    target.houtei = false;
  } else {
    target.rinshan = false;
    target.haitei = false;
  }
  if (target.haitei) {
    target.houtei = false;
    target.rinshan = false;
  }
  if (target.houtei) {
    target.haitei = false;
    target.chankan = false;
  }
  if (target.rinshan) target.haitei = false;
  if (target.chankan) target.houtei = false;
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
    `chankan: ${state.chankan ? 1 : 0}`,
    `rinshan: ${state.rinshan ? 1 : 0}`,
    `haitei: ${state.haitei ? 1 : 0}`,
    `houtei: ${state.houtei ? 1 : 0}`,
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
    else if (key === "chankan") draft.chankan = val === "1" || val.toLowerCase() === "true";
    else if (key === "rinshan") draft.rinshan = val === "1" || val.toLowerCase() === "true";
    else if (key === "haitei") draft.haitei = val === "1" || val.toLowerCase() === "true";
    else if (key === "houtei") draft.houtei = val === "1" || val.toLowerCase() === "true";
  }
  normalizeWinEventFlags(draft);
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
  // Always evaluate based on explicit hand tiles only.
  // `winTile` is only a scoring context hint, not an implicit 14th tile.
  return state.hand.slice();
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

function evaluateHandWin(tiles, winTileOverride = null, winTypeOverride = null) {
  const resolvedWinTile = winTileOverride !== null ? winTileOverride : state.winTile;
  return RiichiEngine.evaluateRules46({
    tiles,
    winTile: resolvedWinTile,
    winType: winTypeOverride || state.winType,
    dealer: state.dealer,
    doraIndicators: state.doraIndicators,
    uraIndicators: state.uraIndicators,
    state: {
      riichi: state.riichi,
      doubleRiichi: state.doubleRiichi,
      ippatsu: state.ippatsu,
      chankan: state.chankan,
      rinshan: state.rinshan,
      haitei: state.haitei,
      houtei: state.houtei,
      seatWind: state.seatWind,
      roundWind: state.roundWind,
      aka5m: state.aka5m,
      aka5p: state.aka5p,
      aka5s: state.aka5s
    }
  });
}
function canWinTiles(tiles13) {
  if (tiles13.length !== 13) return [];
  const c = countTiles(tiles13); const out = [];
  for (let i = 0; i < 34; i += 1) {
    if (c[i] >= 4) continue;
    const ron = evaluateHandWin(tiles13.concat(i), i, "ron");
    const tsumo = evaluateHandWin(tiles13.concat(i), i, "tsumo");
    if (ron.ok || tsumo.ok) out.push(i);
  }
  return out;
}
function evaluateAnyWinRoute(tiles, winTile) {
  const preferred = evaluateHandWin(tiles, winTile, state.winType);
  if (preferred.ok) return { ok: true, result: preferred, usedType: state.winType };
  const altType = state.winType === "ron" ? "tsumo" : "ron";
  const alt = evaluateHandWin(tiles, winTile, altType);
  if (alt.ok) return { ok: true, result: alt, usedType: altType };
  return { ok: false, result: preferred, usedType: state.winType };
}

function getWinningTilesByMeldCount(handN, meldCount = 0) {
  const needMelds = 4 - meldCount;
  if (needMelds < 0) return [];
  if (handN.length !== needMelds * 3 + 1) return [];
  const counts = countTiles(handN);
  const out = [];
  for (let i = 0; i < 34; i += 1) {
    if (counts[i] >= 4) continue;
    const test = handN.concat(i);
    if (RiichiEngine.canHuByRule(test, meldCount)) {
      if (meldCount === 0) {
        const routed = evaluateAnyWinRoute(test, i);
        if (routed.ok) out.push(i);
      } else {
        out.push(i);
      }
    }
  }
  return out;
}

function getDiscardAdvice(hand14) {
  if (hand14.length !== 14) return null;
  const doraTiles = state.doraIndicators.map(nextDora);
  return AdviceEngine.advise14({
    hand14,
    meldCount: 0,
    mode: "rules46",
    heuristic: { doraTiles, seatWind: state.seatWind, roundWind: state.roundWind },
    getWinningTiles: getWinningTilesByMeldCount,
    evaluateWin: (tiles14, winTile) => evaluateAnyWinRoute(tiles14, winTile).result,
  });
}

function getThirteenAdvice(hand13) {
  if (hand13.length !== 13) return null;
  return AdviceEngine.advise13({
    hand13,
    meldCount: 0,
    mode: "rules46",
    includeDrawAdvice: false,
    includeRonOnClaim: false,
  });
}

function claimActionLabel(action) {
  if (action === "chi") return tr("actionChi");
  if (action === "pong") return tr("actionPong");
  if (action === "kong") return tr("actionKong");
  if (action === "ron") return tr("actionRon");
  return tr("actionPass");
}
function claimLevel(delta) {
  if (delta >= 22) return tr("levelRecommend");
  if (delta <= 8) return tr("levelCaution");
  return tr("levelNeutral");
}
function claimReason(row) {
  if (row.best.action === "pass") return "鸣牌提升有限，建议先观察。";
  if (row.best.action === "chi") return "可加速顺子成型，提升和牌速度。";
  if (row.best.action === "pong") return "可固定刻子结构，路线更直接。";
  if (row.best.action === "kong") return "可扩展打点潜力，但注意风险。";
  if (row.best.action === "ron") return "当前可直接荣和。";
  return "建议保持当前形。";
}
function claimPatternHtml(row) {
  const pattern = (row.best && row.best.pattern && row.best.pattern.length) ? row.best.pattern : [row.tile];
  return pattern.map((t) => tileHtml(t, "tiny")).join("");
}
function formatResultSummary(r) {
  if (!r || !r.ok) return "-";
  const yakuText = r.yaku && r.yaku.length ? r.yaku.map((y) => `${y.name}(${y.han})`).join(", ") : tr("none");
  const limit = r.limitName ? `, ${r.limitName}` : "";
  return {
    scoreLine: `${r.point.total}（${r.han}番${r.fu}符${limit}） ${r.point.label}`,
    yakuLine: `${tr("yakuDetail")}: ${yakuText}`
  };
}
function buildTenpaiValueRows(hand13, waits) {
  const out = [];
  waits.slice().sort((a, b) => a - b).forEach((w) => {
    try {
      const hand14 = hand13.concat([w]);
      const ron = evaluateHandWin(hand14, w, "ron");
      const tsumo = evaluateHandWin(hand14, w, "tsumo");
      const ronInfo = formatResultSummary(ron);
      const tsumoInfo = formatResultSummary(tsumo);
      out.push(`<div class="tenpai-row">
        <div class="tenpai-head">${tileHtml(w, "small")} ${tileNameZh(w)}</div>
        <div class="tenpai-line">${tr("ronLabel")}: ${ronInfo.scoreLine}</div>
        <div class="tenpai-line">${ronInfo.yakuLine}</div>
        <div class="tenpai-line">${tr("tsumoLabel")}: ${tsumoInfo.scoreLine}</div>
        <div class="tenpai-line">${tsumoInfo.yakuLine}</div>
      </div>`);
    } catch (_) {
      out.push(`<div class="tenpai-row">
        <div class="tenpai-head">${tileHtml(w, "small")} ${tileNameZh(w)}</div>
        <div class="tenpai-line">${tr("ronLabel")}: -</div>
        <div class="tenpai-line">${tr("tsumoLabel")}: -</div>
      </div>`);
    }
  });
  return out;
}

function renderReferenceTables() {
  const fuList = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  const ceil100 = (x) => Math.ceil(x / 100) * 100;
  const cellHtml = (fu, han, dealer) => {
    if ((fu === 20 && han === 1) || (fu === 25 && han === 1)) return `${tr("ronLabel")} -<br/>${tr("tsumoLabel")} -`;
    const base = calcBasePoints(han, fu, 0);
    const ron = fu === 20 ? "-" : String(ceil100(base * (dealer ? 6 : 4)));
    const tsumo = dealer ? `${ceil100(base * 2)} all` : `${ceil100(base * 2)}/${ceil100(base)}`;
    return `${tr("ronLabel")} ${ron}<br/>${tr("tsumoLabel")} ${tsumo}`;
  };
  const buildTable = (id, headers, rows) => {
    const elTable = document.getElementById(id);
    if (!elTable) return;
    const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
    elTable.innerHTML = thead + tbody;
  };

  const hanHeaders = [tr("colFu"), tr("colHan1"), tr("colHan2"), tr("colHan3"), tr("colHan4")];
  const nonDealerRows = fuList.map((fu) => [String(fu), cellHtml(fu, 1, false), cellHtml(fu, 2, false), cellHtml(fu, 3, false), cellHtml(fu, 4, false)]);
  const dealerRows = fuList.map((fu) => [String(fu), cellHtml(fu, 1, true), cellHtml(fu, 2, true), cellHtml(fu, 3, true), cellHtml(fu, 4, true)]);
  buildTable("refNonDealerTable", hanHeaders, nonDealerRows);
  buildTable("refDealerTable", hanHeaders, dealerRows);

  buildTable(
    "refLimitTable",
    [tr("colRange"), tr("colLimit"), `闲家${tr("ronLabel")}`, `闲家${tr("tsumoLabel")}(庄/闲)`, `庄家${tr("ronLabel")}`, `庄家${tr("tsumoLabel")}(all)`],
    [
      ["5番", tr("limitMangan"), "8000", "4000/2000", "12000", "4000 all"],
      ["6-7番", tr("limitHaneman"), "12000", "6000/3000", "18000", "6000 all"],
      ["8-10番", tr("limitBaiman"), "16000", "8000/4000", "24000", "8000 all"],
      ["11-12番", tr("limitSanbaiman"), "24000", "12000/6000", "36000", "12000 all"],
      ["13番及以上", tr("limitYakuman"), "32000", "16000/8000", "48000", "16000 all"]
    ]
  );

  buildTable(
    "refFuTable",
    [tr("colRule"), "符值", tr("colDesc")],
    [
      ["底符", "+20", "固定底符"],
      ["门前荣和", "+10", "门清状态下荣和"],
      ["自摸", "+2", "自摸和牌"],
      ["雀头：自风/场风/三元", "+2", "自风牌、场风牌、中发白对子"],
      ["雀头：连风", "+4", "自风与场风相同"],
      ["明刻(中张/幺九)", "+2/+4", "2-8数牌 / 1-9与字牌"],
      ["暗刻(中张/幺九)", "+4/+8", "2-8数牌 / 1-9与字牌"],
      ["明杠(中张/幺九)", "+8/+16", "2-8数牌 / 1-9与字牌"],
      ["暗杠(中张/幺九)", "+16/+32", "2-8数牌 / 1-9与字牌"],
      ["听牌形：单骑/边张/嵌张", "+2", "任一成立则加符"],
      ["符数进位", "向上取整到10", "例如32符->40符"],
      ["特例", "固定符", "平和自摸20符；七对子25符；副露不足30符按30符"]
    ]
  );

  buildTable(
    "refDoraTable",
    [tr("colRule"), tr("colDesc")],
    [
      ["宝牌定义", "宝牌指示牌的下一张为宝牌（顺序循环）"],
      ["数牌循环", "1-9循环（9后回1）"],
      ["风牌循环", "东→南→西→北→东"],
      ["三元牌循环", "中→发→白→中"],
      ["赤宝牌", "赤5万/赤5筒/赤5索，各+1番"],
      ["里宝牌", "仅立直和牌时计入"],
      ["宝牌性质", "宝牌只加番，不能单独作为和牌役"]
    ]
  );
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
    const routed = evaluateAnyWinRoute(hand, state.winTile);
    const r = routed.result;
    if (routed.ok) {
      resultLines.push(`<div class="result-title">${tr("winReady")}</div>`);
      const hanFuText = `${r.han}番 ${r.fu}符${r.limitName ? ` (${r.limitName})` : ""}`;
      resultLines.push(`<div class="result-line">${tr("hanFu")}: ${hanFuText}</div>`);
      resultLines.push(`<div class="result-line">${tr("points")}: ${r.point.total}</div>`);
      resultLines.push(`<div class="result-line">${r.point.label}</div>`);
      resultLines.push(`<div class="result-line">${tr("yaku")}: ${r.yaku.map((y) => `${y.name}(${y.han})`).join(", ") || "-"}</div>`);
      adviceLines.push(`<div class="result-line">${tr("winRouteOnly")}</div>`);
    } else {
      resultLines.push(`<div class="result-title">${tr("notWin")}</div>`);
      if (r.reason === "no_yaku") resultLines.push(`<div class="result-line">${tr("noYaku")}</div>`);
      const adv = getDiscardAdvice(hand);
      if (adv) {
        const card = (title, x) => `<div class="result-title">${title}</div><div class="result-line">${tr("suggestDiscard")}: ${tileHtml(x.discard, "small")}</div><div class="result-line">${tr("suggestWaits")}: ${x.waits.map((w) => tileHtml(w, "tiny")).join("") || "-"}</div><div class="result-line">${tr("suggestUkeire")}: ${x.ukeire}</div><div class="result-line">${tr("suggestOneDraw")}: ${x.oneDrawUkeire}</div><div class="result-line">best han: ${x.bestHan}</div><div class="result-line">best pts: ${x.bestPoint || 0} / exp pts: ${x.expectedPoint || 0}</div>`;
        adviceLines.push(card(tr("suggestFast"), adv.fast));
        adviceLines.push(card(tr("suggestValue"), adv.value));
      } else adviceLines.push(`<div class="result-line">-</div>`);
    }
  } else if (hand.length === 13) {
    // 13-tile branch has only 2 routes:
    // 1) has winning waits -> show tenpai value preview
    // 2) no winning waits -> show call (chi/pong/kong) suggestions
    const waits = canWinTiles(hand);
    const adv13 = waits.length === 0 ? getThirteenAdvice(hand) : null;
    resultLines.push(`<div class="result-title">${tr("notWin")}</div>`);
    resultLines.push(`<div class="result-line">${tr("waiting")}: ${waits.length ? waits.map((w) => tileHtml(w, "small")).join("") : "-"}</div>`);
    if (waits.length > 0) {
      const rows = buildTenpaiValueRows(hand, waits);
      adviceLines.push(`<div class="result-title">${tr("tenpaiTitle")}</div>`);
      if (rows && rows.length) adviceLines.push(rows.join(""));
      else {
        // Never fall back to '-' for waits branch.
        const compact = waits.map((w) => `<div class="result-line">${tileHtml(w, "small")} ${tileNameZh(w)}</div>`).join("");
        adviceLines.push(compact);
      }
    } else {
      adviceLines.push(`<div class="result-title">${tr("claim13Title")}</div>`);
      if (adv13 && adv13.claimTop && adv13.claimTop.length) {
        const rows = adv13.claimTop.slice(0, 5).map((x) => {
          const level = claimLevel(x.callDelta || 0);
          return `<div class="claim-advice-row">
            <div class="claim-advice-main">${tileHtml(x.tile, "small")} <span class="claim-name">${tileNameZh(x.tile)}</span> | ${claimPatternHtml(x)} | ${claimActionLabel(x.best.action)} | <span class="claim-level">${level}</span></div>
            <div class="claim-advice-sub">${claimReason(x)}</div>
          </div>`;
        }).join("");
        adviceLines.push(rows);
      } else {
        adviceLines.push(`<div class="result-line">当前无可鸣牌建议（13张阶段仅显示吃/碰/杠）。</div>`);
      }
    }
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
  set("specialWinLabel", "specialWin"); set("chankanLabel", "chankan"); set("rinshanLabel", "rinshan"); set("haiteiLabel", "haitei"); set("houteiLabel", "houtei");
  set("referenceTableTitle", "refTableTitle"); set("refNonDealerTitle", "refNonDealer"); set("refDealerTitle", "refDealer"); set("refLimitTitle", "refLimit"); set("refFuTitle", "refFu"); set("refDoraTitle", "refDora");
  const th = document.getElementById("textHeader"); if (th) th.textContent = state.lang === "en" ? "Text Input" : state.lang === "ja" ? "テキスト入力" : "文本输入";
  const ah = document.getElementById("adviceHeader"); if (ah) ah.textContent = state.lang === "en" ? "Discard Advice" : state.lang === "ja" ? "打牌提案" : "出牌建议";
  el.backBtn.textContent = tr("back"); el.themeSelect.options[0].text = tr("themeRegular"); el.themeSelect.options[1].text = tr("themeDark");
  renderReferenceTables();
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
  el.chankan.checked = state.chankan; el.rinshan.checked = state.rinshan; el.haitei.checked = state.haitei; el.houtei.checked = state.houtei;
  el.chankan.disabled = state.winType !== "ron" || state.houtei;
  el.houtei.disabled = state.winType !== "ron" || state.chankan;
  el.rinshan.disabled = state.winType !== "tsumo" || state.haitei;
  el.haitei.disabled = state.winType !== "tsumo" || state.rinshan;
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
  el.winType.addEventListener("change", () => { state.winType = el.winType.value; normalizeWinEventFlags(state); syncFromState(); });
  el.seatWind.addEventListener("change", () => { state.seatWind = el.seatWind.value; syncFromState(); });
  el.roundWind.addEventListener("change", () => { state.roundWind = el.roundWind.value; syncFromState(); });
  el.dealer.addEventListener("change", () => { state.dealer = el.dealer.checked; syncFromState(); });
  el.riichi.addEventListener("change", () => { state.riichi = el.riichi.checked; syncFromState(); });
  el.ippatsu.addEventListener("change", () => { state.ippatsu = el.ippatsu.checked; syncFromState(); });
  el.doubleRiichi.addEventListener("change", () => { state.doubleRiichi = el.doubleRiichi.checked; syncFromState(); });
  el.chankan.addEventListener("change", () => { state.chankan = el.chankan.checked; normalizeWinEventFlags(state); syncFromState(); });
  el.rinshan.addEventListener("change", () => { state.rinshan = el.rinshan.checked; normalizeWinEventFlags(state); syncFromState(); });
  el.haitei.addEventListener("change", () => { state.haitei = el.haitei.checked; normalizeWinEventFlags(state); syncFromState(); });
  el.houtei.addEventListener("change", () => { state.houtei = el.houtei.checked; normalizeWinEventFlags(state); syncFromState(); });
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
  renderReferenceTables();
  reflectControls();
  syncFromState();
  bindEvents();
  updateClock();
  setInterval(updateClock, 1000);
}

init();
