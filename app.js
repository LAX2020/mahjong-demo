const HANZI_NUM = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const WINDS = ["东", "南", "西", "北"];
const DRAGONS = ["中", "發", "白"];

const state = {
  players: [],
  wall: [],
  deadWall: [],
  doraIndicators: [],
  uraIndicators: [],
  openDoraCount: 1,
  kanCount: 0,
  deadSupplementIndex: 0,
  initialLiveWallCount: 0,
  currentPlayer: 0,
  lang: "zh",
  ruleSet: "basic",
  doraIndicator: null,
  pendingRiichi: false,
  riichiDiscardCandidates: [],
  lastResult: null,
  gameOver: false,
  waitingClaim: false,
  claimTile: null,
  claimFrom: null,
  claimOptions: null,
  humanMustDiscard: false,
  lastDrawTile: null,
  lastDrawFromDeadWall: false,
  logEntries: [],
  logCounter: 0,
  currentRoundLogId: null,
  autoHu: true,
  autoTsumogiri: false,
  autoTickScheduled: false,
};

const LOG_LIMIT = 60;

const el = {
  newGameBtn: document.getElementById("newGameBtn"),
  ruleSelect: document.getElementById("ruleSelect"),
  themeSelect: document.getElementById("themeSelect"),
  langSelect: document.getElementById("langSelect"),
  titleMain: document.getElementById("titleMain"),
  subText: document.getElementById("subText"),
  handTitle: document.getElementById("handTitle"),
  logTitle: document.getElementById("logTitle"),
  themeLabel: document.getElementById("themeLabel"),
  ruleLabel: document.getElementById("ruleLabel"),
  langLabel: document.getElementById("langLabel"),
  ruleInfo: document.getElementById("ruleInfo"),
  wallInfo: document.getElementById("wallInfo"),
  turnInfo: document.getElementById("turnInfo"),
  clockTime: document.getElementById("clockTime"),
  clockDate: document.getElementById("clockDate"),
  riichiInfo: document.getElementById("riichiInfo"),
  expectInfo: document.getElementById("expectInfo"),
  waitValueInfo: document.getElementById("waitValueInfo"),
  tingInfo: document.getElementById("tingInfo"),
  adviceInfo: document.getElementById("adviceInfo"),
  resultInfo: document.getElementById("resultInfo"),
  roundStatePanel: document.getElementById("roundStatePanel"),
  hand: document.getElementById("hand"),
  handActionsCol: document.getElementById("handActionsCol"),
  actionBar: document.getElementById("actionBar"),
  kongBar: document.getElementById("kongBar"),
  autoOps: document.getElementById("autoOps"),
  autoHuToggle: document.getElementById("autoHuToggle"),
  autoTsumogiriToggle: document.getElementById("autoTsumogiriToggle"),
  autoHuLabel: document.getElementById("autoHuLabel"),
  autoTsumogiriLabel: document.getElementById("autoTsumogiriLabel"),
  log: document.getElementById("log"),
  p0: document.getElementById("p0"),
  p1: document.getElementById("p1"),
  p2: document.getElementById("p2"),
  p3: document.getElementById("p3"),
};

const I18N = {
  zh: {
    title: "Mahjong Demo",
    sub: "基础规则: 摸牌, 打牌, 吃, 碰, 杠, 简化胡牌判定(4面子+1雀头)",
    newGame: "新开一局",
    handTitle: "你的手牌",
    logTitle: "日志",
    ruleLabel: "规则",
    ruleBasic: "基础",
    ruleRiichiLite: "立直Lite",
    ruleInfo: "规则: {name}",
    ruleConfirm: "切换到 {name} 后将刷新页面并重新开局. 是否继续?",
    themeLabel: "主题",
    themeRegular: "普通",
    themeDark: "夜间",
    langLabel: "语言",
    langZh: "中文",
    langEn: "英语",
    langJa: "日语",
    wall: "牌墙: {n}",
    turn: "回合: {name}",
    turnEnd: "回合: 结束",
    you: "你",
    bot: "电脑{n}",
    handCount: "手牌数: {n}",
    melds: "副露: {v}",
    noDiscard: "暂无弃牌",
    selfDraw: "自摸胡",
    concealedKong: "暗杠",
    ron: "荣和",
    ronBasic: "胡",
    ronRiichi: "荣",
    kong: "杠",
    pong: "碰",
    chi: "吃",
    pass: "过",
    logNew: "新局开始. 你先打牌.",
    logDiscardYou: "你打出 {tile}",
    logDrawYou: "你摸牌 {tile}",
    logOps: "可操作: {ops}",
    logWallEmpty: "牌墙已空, 流局.",
    logBotWin: "{name} 胡牌, 对局结束.",
    logBotDiscard: "{name} 打出 {tile}",
    logPass: "你选择过.",
    logRon: "你荣和 {tile}, 对局结束.",
    logRonBasic: "你胡 {tile}, 对局结束.",
    logRonRiichi: "你荣 {tile}, 对局结束.",
    logPong: "你碰 {tile}.",
    logTsumo: "你自摸胡牌, 对局结束.",
    logMingKong: "你明杠 {tile}, 补牌后打出一张.",
    logChi: "你吃 {tiles}.",
    logAnKong: "你暗杠 {tile}, 补牌 {draw}.",
    riichi: "立直",
    cancelRiichi: "取消立直",
    riichiOn: "立直: 已宣言",
    riichiPending: "立直: 待打牌(可取消)",
    riichiOff: "立直: 未宣言",
    doraInfo: "宝牌指示: {ind} -> 宝牌 {dora}",
    expectNow: "当前可和预估: {han}番 ({yaku})",
    expectMax: "最高潜力: {han}番 ({yaku})",
    expectNone: "当前预估: 需先听牌/成型",
    logRiichiDeclare: "你宣言立直, 请选择立直打牌.",
    logRiichiDone: "你已立直, 打出 {tile}.",
    logRiichiTsumogiri: "立直中摸切 {tile}.",
    resultTitle: "和牌结算",
    resultHanFu: "{han}番 {fu}符",
    resultLimit: "打点: {limit}",
    resultPoints: "得点: {points}",
    resultPointLabel: "分摊: {label}",
    resultYaku: "役种: {yaku}",
    waitValueTitle: "听牌点数预期:",
    waitValueItem: "{han}番{fu}符 {points}点",
    waitValueNone: "听牌点数预期: 当前未听牌",
    waitValuePending: "立直候选预期:",
    waitValuePendingItem: "打{tile} 听{n}种 最高{points}点",
    tingDash: "听牌提示: -",
    tingEnd: "听牌提示: 本局已结束",
    tingWinNow: "听牌提示: 当前已成和牌, 可自摸胡",
    tingNow: "听牌提示: 听 {n} 种 -",
    tingNot: "听牌提示: 当前未听牌",
    tingSuggest: "听牌建议:",
    tingSuggestNone: "听牌建议: 当前无一打听牌",
    adviceHidden: "",
    adviceHeaderBasic: "基础模式出牌建议",
    adviceHeader: "Riichi Lite 出牌建议",
    adviceFast: "最快和牌",
    adviceValue: "最高点数",
    adviceDiscard: "建议打",
    adviceMetricSpeed: "速度: {dist} / 受入: {ukeire} / 待牌: {waits}",
    adviceMetricValue: "价值评分: {value} / 速度评分: {speed}",
    adviceDist0: "听牌",
    adviceDist1: "一向听",
    adviceDist2: "二向听+",
    adviceReasonFast0: "优先保持高受入, 尽快自摸或荣和。",
    adviceReasonFast1: "更接近听牌, 下巡进入可和状态概率更高。",
    adviceReasonValue: "保留门清与高打点役种潜力, 点数期望更高。",
    adviceRoutePrefix: "路线",
    routeRiichi: "立直门清路线",
    routeTanyao: "断幺九路线",
    routeYakuhai: "役牌路线",
    routeHonitsu: "混一色路线",
    routeGuestWindCut: "先处理客风孤张",
    routeWindKeep: "保留门风/场风潜力",
    routeDoubleWindKeep: "保留连风潜力",
    routeYakuhaiKeep: "保留三元牌潜力",
    actionAdviceRec: "推荐",
    actionAdviceOk: "中立",
    actionAdviceNo: "谨慎",
    actionAdviceFmt: "{label} 速{speed} 价{value}",
    actionReasonHu: "当前可直接和牌, 优先和了。",
    actionReasonPass: "保留门清与立直路线, 价值更稳定。",
    actionReasonPassBasic: "保留手牌弹性, 继续摸牌通常更稳。",
    actionReasonCallFast: "副露可提速, 更快进入可和状态。",
    actionReasonCallValue: "副露会损失部分打点潜力。",
    autoHu: "自动和牌",
    autoTsumogiri: "自动摸切",
    statePanelTitle: "对局状态",
    wallProgress: "牌山进度: 已摸{used}/{total}, 剩余{remain}",
    doraOpen: "宝牌指示",
    uraOpen: "里宝牌指示",
    deadWallInfo: "王牌: 14张（杠补牌剩余{left}）",
    basicWallInfo: "基础模式: 无王牌/宝牌，136张牌持续消耗",
    discardTo: "打",
    waitFor: "听",
    meldTypeChi: "吃",
    meldTypePong: "碰",
    meldTypeKongOpen: "明杠",
    meldTypeKongClosed: "暗杠",
  },
  en: {
    title: "Mahjong Demo",
    sub: "Basic rules: draw, discard, chi, pong, kong, simplified win check (4 melds + 1 pair)",
    newGame: "New Round",
    handTitle: "Your Hand",
    logTitle: "Log",
    ruleLabel: "Rules",
    ruleBasic: "Basic",
    ruleRiichiLite: "Riichi Lite",
    ruleInfo: "Rules: {name}",
    ruleConfirm: "Switching to {name} will reload the page and start a new round. Continue?",
    themeLabel: "Theme",
    themeRegular: "Regular",
    themeDark: "Dark",
    langLabel: "Language",
    langZh: "Chinese",
    langEn: "English",
    langJa: "Japanese",
    wall: "Wall: {n}",
    turn: "Turn: {name}",
    turnEnd: "Turn: Ended",
    you: "You",
    bot: "Bot {n}",
    handCount: "Tiles in hand: {n}",
    melds: "Melds: {v}",
    noDiscard: "No discards yet",
    selfDraw: "Tsumo",
    concealedKong: "Concealed Kong",
    ron: "Ron",
    ronBasic: "Ron",
    ronRiichi: "Ron",
    kong: "Kong",
    pong: "Pong",
    chi: "Chi",
    pass: "Pass",
    logNew: "New round started. You play first.",
    logDiscardYou: "You discarded {tile}",
    logDrawYou: "You drew {tile}",
    logOps: "Available actions: {ops}",
    logWallEmpty: "Wall is empty. Draw game.",
    logBotWin: "{name} wins. Round over.",
    logBotDiscard: "{name} discarded {tile}",
    logPass: "You passed.",
    logRon: "You won by Ron on {tile}. Round over.",
    logRonBasic: "You won on {tile}. Round over.",
    logRonRiichi: "You won by Ron on {tile}. Round over.",
    logPong: "You called Pong on {tile}.",
    logTsumo: "You won by Tsumo. Round over.",
    logMingKong: "You called open Kong on {tile}. Draw a supplement tile and discard.",
    logChi: "You called Chi {tiles}.",
    logAnKong: "You called concealed Kong on {tile}, drew {draw}.",
    riichi: "Riichi",
    cancelRiichi: "Cancel Riichi",
    riichiOn: "Riichi: Declared",
    riichiPending: "Riichi: pending discard (cancelable)",
    riichiOff: "Riichi: Not declared",
    doraInfo: "Dora indicator: {ind} -> Dora {dora}",
    expectNow: "Current winning estimate: {han} han ({yaku})",
    expectMax: "Max potential: {han} han ({yaku})",
    expectNone: "Current estimate: need tenpai/shape first",
    logRiichiDeclare: "Riichi declared. Select a riichi-legal discard.",
    logRiichiDone: "Riichi set. You discarded {tile}.",
    logRiichiTsumogiri: "Riichi tsumogiri {tile}.",
    resultTitle: "Win Result",
    resultHanFu: "{han} han {fu} fu",
    resultLimit: "Limit: {limit}",
    resultPoints: "Points: {points}",
    resultPointLabel: "Breakdown: {label}",
    resultYaku: "Yaku: {yaku}",
    waitValueTitle: "Wait value estimate:",
    waitValueItem: "{han} han {fu} fu {points} pts",
    waitValueNone: "Wait value estimate: not in tenpai",
    waitValuePending: "Riichi candidate estimate:",
    waitValuePendingItem: "Discard {tile} wait {n} max {points} pts",
    tingDash: "Ready hand hint: -",
    tingEnd: "Ready hand hint: round ended",
    tingWinNow: "Ready hand hint: complete hand now, you can Tsumo",
    tingNow: "Ready hand hint: waiting on {n} tiles -",
    tingNot: "Ready hand hint: not in tenpai",
    tingSuggest: "Tenpai suggestions:",
    tingSuggestNone: "Tenpai suggestions: no one-discard tenpai route",
    adviceHidden: "",
    adviceHeaderBasic: "Basic Discard Advice",
    adviceHeader: "Riichi Lite Discard Advice",
    adviceFast: "Fastest Win",
    adviceValue: "Highest Value",
    adviceDiscard: "Discard",
    adviceMetricSpeed: "Speed: {dist} / Ukeire: {ukeire} / Waits: {waits}",
    adviceMetricValue: "Value score: {value} / Speed score: {speed}",
    adviceDist0: "Tenpai",
    adviceDist1: "1-shanten",
    adviceDist2: "2+ shanten",
    adviceReasonFast0: "Keeps strong ukeire to win as soon as possible.",
    adviceReasonFast1: "Moves closer to tenpai with better near-term win chances.",
    adviceReasonValue: "Keeps menzen and higher-value yaku potential for better expected points.",
    adviceRoutePrefix: "Route",
    routeRiichi: "Menzen riichi route",
    routeTanyao: "Tanyao route",
    routeYakuhai: "Yakuhai route",
    routeHonitsu: "Honitsu route",
    routeGuestWindCut: "Cut guest wind singleton first",
    routeWindKeep: "Keep seat/round wind potential",
    routeDoubleWindKeep: "Keep double-wind potential",
    routeYakuhaiKeep: "Keep dragon yakuhai potential",
    actionAdviceRec: "Recommended",
    actionAdviceOk: "Neutral",
    actionAdviceNo: "Caution",
    actionAdviceFmt: "{label} S{speed} V{value}",
    actionReasonHu: "You can win now. Prioritize winning.",
    actionReasonPass: "Keeps menzen and riichi routes for stable value.",
    actionReasonPassBasic: "Keeps hand flexibility and stable progression.",
    actionReasonCallFast: "Call speeds up hand progression.",
    actionReasonCallValue: "Open call reduces some value potential.",
    autoHu: "Auto Win",
    autoTsumogiri: "Auto Tsumogiri",
    statePanelTitle: "Round State",
    wallProgress: "Wall progress: used {used}/{total}, remain {remain}",
    doraOpen: "Dora Indicators",
    uraOpen: "Ura Indicators",
    deadWallInfo: "Dead wall: 14 tiles (rinshan left {left})",
    basicWallInfo: "Basic mode: no dead wall / dora, 136-tile live wall",
    discardTo: "Discard",
    waitFor: "wait",
    meldTypeChi: "Chi",
    meldTypePong: "Pong",
    meldTypeKongOpen: "Open Kong",
    meldTypeKongClosed: "Concealed Kong",
  },
  ja: {
    title: "Mahjong Demo",
    sub: "基本ルール: ツモ, 打牌, チー, ポン, カン, 簡易和了判定(4面子+1雀頭)",
    newGame: "新局",
    handTitle: "あなたの手牌",
    logTitle: "ログ",
    ruleLabel: "ルール",
    ruleBasic: "基本",
    ruleRiichiLite: "立直Lite",
    ruleInfo: "ルール: {name}",
    ruleConfirm: "{name} に切り替えるとページを再読み込みして新局開始します. 続行しますか?",
    themeLabel: "テーマ",
    themeRegular: "通常",
    themeDark: "ダーク",
    langLabel: "言語",
    langZh: "中国語",
    langEn: "英語",
    langJa: "日本語",
    wall: "山: {n}",
    turn: "手番: {name}",
    turnEnd: "手番: 終了",
    you: "あなた",
    bot: "CPU{n}",
    handCount: "手牌数: {n}",
    melds: "副露: {v}",
    noDiscard: "捨て牌なし",
    selfDraw: "ツモ",
    concealedKong: "暗槓",
    ron: "ロン",
    ronBasic: "和了",
    ronRiichi: "ロン",
    kong: "カン",
    pong: "ポン",
    chi: "チー",
    pass: "スルー",
    logNew: "新局開始. あなたが先手です.",
    logDiscardYou: "あなたは {tile} を切った",
    logDrawYou: "あなたは {tile} をツモ",
    logOps: "選択可能: {ops}",
    logWallEmpty: "山が尽きました. 流局.",
    logBotWin: "{name} が和了. 対局終了.",
    logBotDiscard: "{name} は {tile} を切った",
    logPass: "スルーしました.",
    logRon: "{tile} でロン和了. 対局終了.",
    logRonBasic: "{tile} で和了. 対局終了.",
    logRonRiichi: "{tile} でロン和了. 対局終了.",
    logPong: "{tile} をポン.",
    logTsumo: "ツモ和了. 対局終了.",
    logMingKong: "{tile} を明槓. 補充牌を引いて打牌.",
    logChi: "{tiles} をチー.",
    logAnKong: "{tile} を暗槓, {draw} を補充.",
    riichi: "立直",
    cancelRiichi: "立直取消",
    riichiOn: "立直: 宣言済み",
    riichiPending: "立直: 打牌待ち(取消可)",
    riichiOff: "立直: 未宣言",
    doraInfo: "ドラ表示: {ind} -> ドラ {dora}",
    expectNow: "現在和了見込み: {han}翻 ({yaku})",
    expectMax: "最高打点見込み: {han}翻 ({yaku})",
    expectNone: "現在見込み: まず聴牌/形作りが必要",
    logRiichiDeclare: "立直宣言. 立直可能な打牌を選択してください.",
    logRiichiDone: "立直成立, {tile} を打牌.",
    logRiichiTsumogiri: "立直中ツモ切り {tile}.",
    resultTitle: "和了結果",
    resultHanFu: "{han}翻 {fu}符",
    resultPoints: "得点: {points}",
    resultLimit: "打点: {limit}",
    resultPointLabel: "内訳: {label}",
    resultYaku: "役: {yaku}",
    waitValueTitle: "待ち牌点数見込み:",
    waitValueItem: "{han}翻{fu}符 {points}点",
    waitValueNone: "待ち牌点数見込み: まだ聴牌していません",
    waitValuePending: "立直候補見込み:",
    waitValuePendingItem: "{tile}切り {n}種待ち 最高{points}点",
    tingDash: "聴牌ヒント: -",
    tingEnd: "聴牌ヒント: 対局終了",
    tingWinNow: "聴牌ヒント: 既に和了形です, ツモ可能",
    tingNow: "聴牌ヒント: {n} 種待ち -",
    tingNot: "聴牌ヒント: まだ聴牌していません",
    tingSuggest: "聴牌提案:",
    tingSuggestNone: "聴牌提案: 一打聴牌ルートなし",
    adviceHidden: "",
    adviceHeaderBasic: "基本モード打牌提案",
    adviceHeader: "Riichi Lite 打牌提案",
    adviceFast: "最速和了",
    adviceValue: "最高打点",
    adviceDiscard: "切り",
    adviceMetricSpeed: "速度: {dist} / 受け入れ: {ukeire} / 待ち: {waits}",
    adviceMetricValue: "価値スコア: {value} / 速度スコア: {speed}",
    adviceDist0: "聴牌",
    adviceDist1: "一向聴",
    adviceDist2: "二向聴以上",
    adviceReasonFast0: "受け入れを重視して最短和了を狙います。",
    adviceReasonFast1: "聴牌に近づき, 次巡以降の和了率を上げます。",
    adviceReasonValue: "門前維持と高打点役の可能性を残し, 期待打点を重視します。",
    adviceRoutePrefix: "ルート",
    routeRiichi: "門前立直ルート",
    routeTanyao: "断么九ルート",
    routeYakuhai: "役牌ルート",
    routeHonitsu: "混一色ルート",
    routeGuestWindCut: "客風の孤立牌を先切り",
    routeWindKeep: "自風/場風の可能性を保持",
    routeDoubleWindKeep: "連風牌の可能性を保持",
    routeYakuhaiKeep: "三元牌の可能性を保持",
    actionAdviceRec: "推奨",
    actionAdviceOk: "中立",
    actionAdviceNo: "慎重",
    actionAdviceFmt: "{label} 速{speed} 価{value}",
    actionReasonHu: "今すぐ和了可能. 和了優先。",
    actionReasonPass: "門前と立直ルートを維持し, 価値が安定。",
    actionReasonPassBasic: "手牌の柔軟性を維持し, 進行を安定。",
    actionReasonCallFast: "副露で速度が上がりやすい。",
    actionReasonCallValue: "副露で打点期待が一部下がる。",
    autoHu: "自動和了",
    autoTsumogiri: "自動ツモ切り",
    statePanelTitle: "局面情報",
    wallProgress: "山進行: 消費{used}/{total}, 残り{remain}",
    doraOpen: "ドラ表示牌",
    uraOpen: "裏ドラ表示牌",
    deadWallInfo: "王牌: 14枚（嶺上補充残り{left}）",
    basicWallInfo: "基本モード: 王牌/ドラなし、136枚を消費",
    discardTo: "切る",
    waitFor: "待ち",
    meldTypeChi: "チー",
    meldTypePong: "ポン",
    meldTypeKongOpen: "明槓",
    meldTypeKongClosed: "暗槓",
  },
};

function tr(key, vars = {}) {
  const dict = I18N[state.lang] || I18N.zh;
  let s = dict[key] ?? I18N.zh[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    s = s.replaceAll(`{${k}}`, String(v));
  });
  return s;
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "regular";
  document.body.setAttribute("data-theme", next);
  if (el.themeSelect) el.themeSelect.value = next;
  try {
    localStorage.setItem("mahjong_theme", next);
  } catch (_) {
    // ignore storage failures
  }
}

function initTheme() {
  let theme = "regular";
  try {
    const saved = localStorage.getItem("mahjong_theme");
    if (saved === "dark" || saved === "regular") theme = saved;
  } catch (_) {
    // ignore storage failures
  }
  applyTheme(theme);
}

function getRuleDisplayName(ruleSet) {
  return ruleSet === "riichi_lite" ? tr("ruleRiichiLite") : tr("ruleBasic");
}

function getRonActionKey() {
  if (state.ruleSet === "riichi_lite") return "ronRiichi";
  return "ronBasic";
}

function getRonResultKey() {
  if (state.ruleSet === "riichi_lite") return "logRonRiichi";
  return "logRonBasic";
}

function applyRuleSet(ruleSet, persist = true) {
  const next = ruleSet === "riichi_lite" ? "riichi_lite" : "basic";
  state.ruleSet = next;
  document.body.dataset.rule = next;
  if (el.ruleSelect) el.ruleSelect.value = next;
  if (persist) {
    try {
      localStorage.setItem("mahjong_rule_set", next);
    } catch (_) {
      // ignore storage failures
    }
  }
  updateRuleInfo();
}

function initRuleSet() {
  let ruleSet = "basic";
  try {
    const saved = localStorage.getItem("mahjong_rule_set");
    if (saved === "basic" || saved === "riichi_lite") ruleSet = saved;
  } catch (_) {
    // ignore storage failures
  }
  applyRuleSet(ruleSet, false);
}

function applyLang(lang) {
  const next = ["zh", "en", "ja"].includes(lang) ? lang : "zh";
  state.lang = next;
  if (el.langSelect) el.langSelect.value = next;
  try {
    localStorage.setItem("mahjong_lang", next);
  } catch (_) {
    // ignore storage failures
  }
  renderStaticText();
  refreshPlayerNames();
  renderLogEntries();
  if (state.players.length === 4) {
    renderAll();
    refreshHumanActions();
  } else if (el.tingInfo) {
    el.tingInfo.textContent = tr("tingDash");
  }
}

function initLang() {
  let lang = "zh";
  try {
    const saved = localStorage.getItem("mahjong_lang");
    if (saved === "zh" || saved === "en" || saved === "ja") lang = saved;
  } catch (_) {
    // ignore storage failures
  }
  applyLang(lang);
}

function updateRuleInfo() {
  if (el.ruleInfo) el.ruleInfo.textContent = tr("ruleInfo", { name: getRuleDisplayName(state.ruleSet) });
}

function renderStaticText() {
  if (el.titleMain) el.titleMain.textContent = tr("title");
  if (el.subText) el.subText.textContent = tr("sub");
  if (el.newGameBtn) el.newGameBtn.textContent = tr("newGame");
  if (el.handTitle) el.handTitle.textContent = tr("handTitle");
  if (el.logTitle) el.logTitle.textContent = tr("logTitle");
  if (el.ruleLabel) el.ruleLabel.textContent = tr("ruleLabel");
  if (el.themeLabel) el.themeLabel.textContent = tr("themeLabel");
  if (el.langLabel) el.langLabel.textContent = tr("langLabel");
  if (el.autoHuLabel) el.autoHuLabel.textContent = tr("autoHu");
  if (el.autoTsumogiriLabel) el.autoTsumogiriLabel.textContent = tr("autoTsumogiri");
  if (el.ruleSelect && el.ruleSelect.options.length >= 2) {
    el.ruleSelect.options[0].text = tr("ruleBasic");
    el.ruleSelect.options[1].text = tr("ruleRiichiLite");
  }
  if (el.themeSelect && el.themeSelect.options.length >= 2) {
    el.themeSelect.options[0].text = tr("themeRegular");
    el.themeSelect.options[1].text = tr("themeDark");
  }
  if (el.langSelect && el.langSelect.options.length >= 3) {
    el.langSelect.options[0].text = tr("langZh");
    el.langSelect.options[1].text = tr("langEn");
    el.langSelect.options[2].text = tr("langJa");
  }
  updateRuleInfo();
}

function syncAutoToggles() {
  if (el.autoHuToggle) el.autoHuToggle.checked = !!state.autoHu;
  if (el.autoTsumogiriToggle) el.autoTsumogiriToggle.checked = !!state.autoTsumogiri;
}

function refreshPlayerNames() {
  if (!state.players || state.players.length === 0) return;
  state.players.forEach((p, i) => {
    p.name = i === 0 ? tr("you") : tr("bot", { n: i });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nowStamp() {
  const t = new Date();
  return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}

function clockParts() {
  const t = new Date();
  return {
    hm: `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`,
    ymd: `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()}`,
  };
}

function renderClock() {
  const p = clockParts();
  if (el.clockTime) el.clockTime.textContent = p.hm;
  if (el.clockDate) el.clockDate.textContent = p.ymd;
}

function startClock() {
  renderClock();
  setInterval(renderClock, 1000);
}

function resolveLogVars(vars = {}) {
  const out = {};
  Object.entries(vars).forEach(([k, v]) => {
    if (k.endsWith("Id")) {
      const base = k.slice(0, -2);
      if (base.toLowerCase().includes("tile")) out[base] = tileLabel(v);
      else if (base.toLowerCase().includes("name") || base.toLowerCase().includes("actor")) {
        out[base] = Number(v) === 0 ? tr("you") : tr("bot", { n: Number(v) });
      } else out[base] = v;
    } else {
      out[k] = v;
    }
  });
  return out;
}

function renderLogEntries() {
  if (!el.log) return;
  if (!state.logEntries.length) {
    el.log.innerHTML = "";
    return;
  }
  el.log.innerHTML = state.logEntries
    .map((row) => {
      if (row.kind === "round") {
        const actions = row.actions
          .map((a, i) => {
            const actorName =
              Number.isInteger(a.actorId) ? (a.actorId === 0 ? tr("you") : tr("bot", { n: a.actorId })) : a.actor || "";
            const actor = actorName ? `<span class="log-actor">${escapeHtml(actorName)}</span>` : "";
            const actionText = a.actionKey ? tr(a.actionKey) : a.action || "";
            const action = actionText ? `<span class="log-action">${escapeHtml(actionText)}</span>` : "";
            const tiles = a.tiles?.length ? `<span class="log-tiles">${a.tiles.map((id) => tileHtml(id, "tiny")).join("")}</span>` : "";
            const extraText = a.extraKey ? tr(a.extraKey) : a.extra || "";
            const extra = extraText ? `<span class="log-extra">${escapeHtml(extraText)}</span>` : "";
            const sep = i > 0 ? `<span class="log-sep">|</span>` : "";
            return `${sep}<span class="log-chunk">${actor}${action}${tiles}${extra}</span>`;
          })
          .join("");
        return `<div class="log-row"><span class="log-turn">#${row.idx}</span><span class="log-time">[${row.stamp}]</span><span class="log-round-actions">${actions}</span></div>`;
      }
      const eventVars = resolveLogVars(row.textVars || {});
      const eventText = row.textKey ? tr(row.textKey, eventVars) : row.text || "";
      const text = eventText ? `<span class="log-action">${escapeHtml(eventText)}</span>` : "";
      return `<div class="log-row"><span class="log-turn">#${row.idx}</span><span class="log-time">[${row.stamp}]</span>${text}</div>`;
    })
    .join("");
  el.log.scrollTop = el.log.scrollHeight;
}

function clearLog() {
  state.logEntries = [];
  state.logCounter = 0;
  state.currentRoundLogId = null;
  renderLogEntries();
}

function trimLogLimit() {
  if (state.logEntries.length > LOG_LIMIT) {
    state.logEntries = state.logEntries.slice(state.logEntries.length - LOG_LIMIT);
    if (state.currentRoundLogId && !state.logEntries.some((x) => x.id === state.currentRoundLogId)) {
      state.currentRoundLogId = null;
    }
  }
}

function pushEventLog({ text = "", key = "", vars = {} }) {
  state.logCounter += 1;
  state.logEntries.push({
    id: `e_${state.logCounter}_${Date.now()}`,
    idx: state.logCounter,
    stamp: nowStamp(),
    kind: "event",
    text,
    textKey: key,
    textVars: vars,
  });
  trimLogLimit();
  renderLogEntries();
}

function getCurrentRoundEntry() {
  if (!state.currentRoundLogId) return null;
  return state.logEntries.find((x) => x.id === state.currentRoundLogId) || null;
}

function beginRoundLog(actor, action, tiles = [], extra = "") {
  state.logCounter += 1;
  const entry = {
    id: `r_${state.logCounter}_${Date.now()}`,
    idx: state.logCounter,
    stamp: nowStamp(),
    kind: "round",
    actions: [
      {
        actorId: Number.isInteger(actor) ? actor : null,
        actor: Number.isInteger(actor) ? "" : actor,
        actionKey: action,
        action: "",
        tiles: Array.isArray(tiles) ? tiles.slice() : [],
        extraKey: extra || "",
        extra: "",
      },
    ],
  };
  state.logEntries.push(entry);
  state.currentRoundLogId = entry.id;
  trimLogLimit();
  renderLogEntries();
}

function appendRoundLog(actor, action, tiles = [], extra = "") {
  const row = getCurrentRoundEntry();
  if (!row) {
    beginRoundLog(actor, action, tiles, extra);
    return;
  }
  row.actions.push({
    actorId: Number.isInteger(actor) ? actor : null,
    actor: Number.isInteger(actor) ? "" : actor,
    actionKey: action,
    action: "",
    tiles: Array.isArray(tiles) ? tiles.slice() : [],
    extraKey: extra || "",
    extra: "",
  });
  renderLogEntries();
}

function logAction(actor, action, tiles = [], extra = "", startRound = false) {
  if (startRound) {
    beginRoundLog(actor, action, tiles, extra);
    return;
  }
  appendRoundLog(actor, action, tiles, extra);
}

function log(msg) {
  pushEventLog({ text: msg });
}

function logI18n(key, vars = {}) {
  pushEventLog({ key, vars });
}

function makeWall() {
  const wall = [];
  for (let id = 0; id < 34; id += 1) {
    for (let k = 0; k < 4; k += 1) wall.push(id);
  }
  for (let i = wall.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [wall[i], wall[j]] = [wall[j], wall[i]];
  }
  return wall;
}

function setupWallWithDeadWall() {
  const full = makeWall();
  state.deadWall = full.splice(0, 14);
  state.wall = full;
  state.initialLiveWallCount = state.wall.length;
  state.deadSupplementIndex = 0;
  state.kanCount = 0;
  state.openDoraCount = 1;
  state.doraIndicators = state.deadWall.slice(4, 9);
  state.uraIndicators = state.deadWall.slice(9, 14);
}

function setupRoundResources() {
  if (state.ruleSet === "riichi_lite") {
    setupWallWithDeadWall();
    state.doraIndicator = state.doraIndicators[0] ?? null;
    return;
  }
  state.wall = makeWall();
  state.deadWall = [];
  state.doraIndicators = [];
  state.uraIndicators = [];
  state.openDoraCount = 0;
  state.kanCount = 0;
  state.deadSupplementIndex = 0;
  state.initialLiveWallCount = state.wall.length;
  state.doraIndicator = null;
}

function drawLiveTile() {
  return state.wall.pop() ?? null;
}

function drawRinshanTile() {
  const idx = state.deadSupplementIndex;
  if (idx < 0 || idx >= 4) return null;
  const tile = state.deadWall[idx];
  state.deadWall[idx] = null;
  state.deadSupplementIndex += 1;
  return tile ?? null;
}

function drawTile() {
  return drawLiveTile();
}

function getOpenedDoraIndicators() {
  return state.doraIndicators.slice(0, Math.max(0, Math.min(5, state.openDoraCount)));
}

function getOpenedUraIndicators() {
  return state.uraIndicators.slice(0, Math.max(0, Math.min(5, state.openDoraCount)));
}

function getWallProgress() {
  const total = state.initialLiveWallCount || 0;
  const remain = state.wall.length;
  const used = Math.max(0, total - remain);
  const ratio = total > 0 ? remain / total : 0;
  return { total, remain, used, ratio };
}

function getRinshanRemain() {
  return Math.max(0, 4 - state.deadSupplementIndex);
}

function yakuText(result) {
  if (!result || !Array.isArray(result.yaku)) return "-";
  return result.yaku
    .map((y) => (typeof y === "string" ? y : `${y.name}(${y.han})`))
    .join(", ") || "-";
}

function pointTotal(result) {
  if (!result) return 0;
  if (result.point && typeof result.point.total === "number") return result.point.total;
  if (typeof result.points === "number") return result.points;
  return 0;
}

function sortHand(hand) {
  hand.sort((a, b) => a - b);
}

function tileLabel(id) {
  if (state.lang === "en") {
    if (id >= 0 && id <= 8) return `${id + 1}m`;
    if (id >= 9 && id <= 17) return `${id - 8}p`;
    if (id >= 18 && id <= 26) return `${id - 17}s`;
    if (id >= 27 && id <= 30) return ["E", "S", "W", "N"][id - 27];
    if (id >= 31 && id <= 33) return ["Chun", "Hatsu", "Haku"][id - 31];
  }
  if (state.lang === "ja") {
    if (id >= 0 && id <= 8) return `${id + 1}萬`;
    if (id >= 9 && id <= 17) return `${id - 8}筒`;
    if (id >= 18 && id <= 26) return `${id - 17}索`;
    if (id >= 27 && id <= 30) return ["東", "南", "西", "北"][id - 27];
    if (id >= 31 && id <= 33) return ["中", "發", "白"][id - 31];
  }
  if (id >= 0 && id <= 8) return `${HANZI_NUM[id]}万`;
  if (id >= 9 && id <= 17) return `${id - 8}筒`;
  if (id >= 18 && id <= 26) return `${id - 17}条`;
  if (id >= 27 && id <= 30) return WINDS[id - 27];
  if (id >= 31 && id <= 33) return DRAGONS[id - 31];
  return `?${id}`;
}

function tileAssetName(id) {
  if (id >= 0 && id <= 8) return `Man${id + 1}.png`;
  if (id >= 9 && id <= 17) return `Pin${id - 8}.png`;
  if (id >= 18 && id <= 26) return `Sou${id - 17}.png`;
  if (id === 27) return "Ton.png";
  if (id === 28) return "Nan.png";
  if (id === 29) return "Shaa.png";
  if (id === 30) return "Pei.png";
  if (id === 31) return "Chun.png";
  if (id === 32) return "Hatsu.png";
  if (id === 33) return "Haku.png";
  return "Blank.png";
}

function tileHtml(id, size = "small") {
  const src = `assets/tiles-photo/${tileAssetName(id)}`;
  const special = id === 33 ? " tile-haku" : "";
  return `<span class="mj-tile ${size}${special}" title="${tileLabel(id)}"><img class="mj-tile-img" src="${src}" alt="${tileLabel(id)}"></span>`;
}

function actionButton(label, tiles, onClick) {
  const b = document.createElement("button");
  b.className = "action-btn";
  const tilesHtml = (tiles || []).map((id) => tileHtml(id, "tiny")).join("");
  b.innerHTML = `<span class="action-label">${label}</span>${tilesHtml ? `<span class="action-tiles">${tilesHtml}</span>` : ""}`;
  b.onclick = onClick;
  return b;
}

function actionItem(button, hintText = "") {
  const wrap = document.createElement("div");
  wrap.className = "action-item";
  wrap.appendChild(button);
  if (hintText) {
    const hint = document.createElement("div");
    hint.className = "action-hint";
    hint.textContent = hintText;
    wrap.appendChild(hint);
  }
  return wrap;
}

function isTerminalOrHonor(id) {
  if (id >= 27) return true;
  const r = id % 9;
  return r === 0 || r === 8;
}

function tileSuit(id) {
  if (id < 0 || id > 33) return -1;
  if (id <= 8) return 0;
  if (id <= 17) return 1;
  if (id <= 26) return 2;
  return 3;
}

function getNeighborCount(counts, id) {
  if (id >= 27) return 0;
  const s = Math.floor(id / 9) * 9;
  const p = id - s;
  let n = 0;
  if (p - 2 >= 0) n += counts[id - 2];
  if (p - 1 >= 0) n += counts[id - 1];
  if (p + 1 <= 8) n += counts[id + 1];
  if (p + 2 <= 8) n += counts[id + 2];
  return n;
}

function getHandProfile(hand, melds = []) {
  const counts = countTiles(hand);
  const suitCounts = [0, 0, 0];
  let honorCount = 0;
  let pairCount = 0;
  let tripletCount = 0;
  let isolated = 0;
  let seqLink = 0;

  for (let id = 0; id < 34; id += 1) {
    const c = counts[id];
    if (c === 0) continue;
    const s = tileSuit(id);
    if (s <= 2) suitCounts[s] += c;
    else honorCount += c;
    if (c >= 2) pairCount += 1;
    if (c >= 3) tripletCount += 1;

    if (id < 27) {
      const nei = getNeighborCount(counts, id);
      if (c === 1 && nei === 0) isolated += 1;
      if (c > 0 && nei > 0) seqLink += 1;
    } else if (c === 1) {
      isolated += 1;
    }
  }

  const dominantSuit = suitCounts.indexOf(Math.max(...suitCounts));
  const dominantCount = suitCounts[dominantSuit];
  const hasOpen = melds.some((m) => m.type === "chi" || m.type === "pong" || m.type === "kong_open");
  return {
    counts,
    suitCounts,
    honorCount,
    pairCount,
    tripletCount,
    isolated,
    seqLink,
    dominantSuit,
    dominantCount,
    hasOpen,
  };
}

function getDiscardRoleCost(originCounts, discard) {
  const c = originCounts[discard];
  let cost = 0;
  if (c >= 3) cost += 38;
  else if (c === 2) cost += 18;

  if (discard < 27) {
    const nei = getNeighborCount(originCounts, discard);
    if (nei >= 3) cost += 18;
    else if (nei >= 1) cost += 8;
    else cost -= 10;
  } else {
    if (c === 1) cost -= 14;
    if (c >= 2) cost += 14;
  }
  return cost;
}

function calcUkeireForWaits(hand, waits) {
  const counts = countTiles(hand);
  return waits.reduce((sum, id) => sum + Math.max(0, 4 - counts[id]), 0);
}

function getTenpaiAfterOneDrawUkeire(hand, meldCount, memoWins) {
  const counts = countTiles(hand);
  let drawUkeire = 0;
  const bestWaits = new Set();

  for (let draw = 0; draw < 34; draw += 1) {
    if (counts[draw] >= 4) continue;
    const hand14 = hand.slice();
    hand14.push(draw);
    let canReachTenpai = false;

    const seenDiscard = new Set();
    for (let i = 0; i < hand14.length; i += 1) {
      const d = hand14[i];
      if (seenDiscard.has(d)) continue;
      seenDiscard.add(d);
      const next13 = hand14.slice();
      next13.splice(i, 1);
      const key = `${next13.slice().sort((a, b) => a - b).join(",")}|${meldCount}`;
      const waits = memoWins.get(key) ?? getWinningTiles(next13, meldCount);
      memoWins.set(key, waits);
      if (waits.length > 0) {
        canReachTenpai = true;
        waits.forEach((w) => bestWaits.add(w));
      }
    }
    if (canReachTenpai) drawUkeire += 4 - counts[draw];
  }

  return { drawUkeire, bestWaitsCount: bestWaits.size };
}

function evaluateDiscardCandidate(hand14, discard, meldCount, hasOpenMeld, memoWins, mode = "riichi_lite", melds = []) {
  const originCounts = countTiles(hand14);
  const idx = hand14.indexOf(discard);
  const next13 = hand14.slice();
  next13.splice(idx, 1);
  const key = `${next13.slice().sort((a, b) => a - b).join(",")}|${meldCount}`;
  const waits = memoWins.get(key) ?? getWinningTiles(next13, meldCount);
  memoWins.set(key, waits);
  const ukeire = calcUkeireForWaits(next13, waits);

  let dist = 2;
  let nearTenpaiUkeire = 0;
  let nearWaits = 0;
  if (waits.length > 0) {
    dist = 0;
  } else {
    const oneStep = getTenpaiAfterOneDrawUkeire(next13, meldCount, memoWins);
    nearTenpaiUkeire = oneStep.drawUkeire;
    nearWaits = oneStep.bestWaitsCount;
    if (nearTenpaiUkeire > 0) dist = 1;
  }

  const terminalHonorCount = next13.filter((t) => isTerminalOrHonor(t)).length;
  const nonTH = next13.length - terminalHonorCount;
  const tanyaoPotential = nonTH / next13.length;
  const profile = getHandProfile(next13);
  const honorCounts = profile.counts.slice(27);
  const yakuhaiPotential = honorCounts.reduce((s, c) => s + (c >= 2 ? 1 : 0), 0);
  const menzenPotential = hasOpenMeld ? 0 : 1;
  const pairPotential = profile.pairCount;
  const openedDoraTiles = getOpenedDoraIndicators().map((ind) => nextDoraFromIndicator(ind));
  const doraCount = openedDoraTiles.reduce((sum, d) => sum + next13.filter((t) => t === d).length, 0);

  const flushPotential =
    profile.honorCount === 0 && profile.dominantCount >= 9
      ? 1.0 + Math.max(0, profile.dominantCount - 9) * 0.2
      : profile.honorCount > 0 && profile.dominantCount >= 8
      ? 0.7 + Math.max(0, profile.dominantCount - 8) * 0.15
      : 0;

  const structureScore =
    profile.tripletCount * 14 +
    profile.pairCount * 7 +
    profile.seqLink * 2.2 -
    profile.isolated * 8.5;

  const discardRoleCost = getDiscardRoleCost(originCounts, discard);
  let bestPoint = 0;
  let expectedPoint = 0;
  if (mode === "riichi_lite" && waits.length > 0) {
    const nextCounts = countTiles(next13);
    let weighted = 0;
    let weight = 0;
    for (const w of waits) {
      const avail = Math.max(0, 4 - nextCounts[w]);
      if (avail <= 0) continue;
      const fakePlayer = {
        ...(state.players?.[0] || {}),
        melds: melds.slice(),
        riichi: !!state.players?.[0]?.riichi
      };
      const r = evaluateRiichiLiteWin(fakePlayer, [...next13, w], "ron", w);
      if (!r.ok) continue;
      const pts = pointTotal(r);
      if (pts > bestPoint) bestPoint = pts;
      weighted += pts * avail;
      weight += avail;
    }
    if (weight > 0) expectedPoint = weighted / weight;
  }

  const speedScore =
    (dist === 0 ? 260 : dist === 1 ? 145 : 35) +
    ukeire * 5.5 +
    nearTenpaiUkeire * 2.1 +
    waits.length * 6 +
    nearWaits * 2.8 +
    structureScore -
    discardRoleCost;

  const valueScore =
    menzenPotential * 48 +
    tanyaoPotential * 28 +
    yakuhaiPotential * 20 +
    pairPotential * 5 +
    flushPotential * 80 +
    doraCount * 22 +
    bestPoint / 38 +
    expectedPoint / 55 +
    structureScore * 0.55 +
    (dist === 0 ? 35 : dist === 1 ? 12 : 0) +
    ukeire * 1.4 -
    discardRoleCost * 0.75;

  const basicSpeedScore =
    (dist === 0 ? 320 : dist === 1 ? 175 : 45) +
    ukeire * 6.6 +
    nearTenpaiUkeire * 2.8 +
    waits.length * 7.5 +
    nearWaits * 3.2 +
    structureScore * 1.05 -
    discardRoleCost * 1.15;

  const finalSpeedScore = mode === "basic" ? basicSpeedScore : speedScore;
  const finalValueScore = mode === "basic" ? basicSpeedScore : valueScore;

  return {
    discard,
    dist,
    waits,
    ukeire,
    nearTenpaiUkeire,
    structureScore,
    flushPotential,
    doraCount,
    bestPoint,
    expectedPoint,
    speedScore: finalSpeedScore,
    valueScore: finalValueScore,
  };
}

function getDiscardAdvice(hand, melds, mode = "riichi_lite", restrictDiscards = null) {
  const meldCount = melds.length;
  const human = state.players[0] || { riichi: false, melds: [] };
  const doraTiles = getOpenedDoraIndicators().map((ind) => nextDoraFromIndicator(ind));

  const getWins = (handN, mc) => {
    const needMelds = 4 - mc;
    if (needMelds < 0) return [];
    if (handN.length !== needMelds * 3 + 1) return [];
    const counts = countTiles(handN);
    const wins = [];
    for (let id = 0; id < 34; id += 1) {
      if (counts[id] >= 4) continue;
      const test = handN.concat(id);
      const shapeOk = mode === "riichi_lite" ? RiichiEngine.canHuByRule(test, mc) : canHu(test, mc);
      if (!shapeOk) continue;
      if (mode !== "riichi_lite") {
        wins.push(id);
        continue;
      }
      const r = evaluateRiichiLiteWin({ ...human, melds: melds.slice() }, test, "ron", id);
      if (r.ok) wins.push(id);
    }
    return wins;
  };

  const evaluateWin = (tiles14, winTile) => {
    if (mode === "riichi_lite") return evaluateRiichiLiteWin({ ...human, melds: melds.slice() }, tiles14, "ron", winTile);
    return { ok: canHu(tiles14, meldCount), han: 0, fu: 0, points: 0 };
  };

  return DecisionEngine.evaluateDiscardAdvice({
    hand,
    meldCount,
    mode,
    restrictDiscards,
    heuristic: { doraTiles, seatWind: "E", roundWind: "E" },
    getWinningTiles: getWins,
    evaluateWin,
  });
}

function evaluatePassAction(hand, melds, mode = "riichi_lite") {
  const meldCount = melds.length;
  const waits = getWinningTiles(hand, meldCount);
  const ukeire = calcUkeireForWaits(hand, waits);
  const passReason = mode === "basic" ? tr("actionReasonPassBasic") : tr("actionReasonPass");
  if (waits.length > 0) {
    return {
      speed: (mode === "basic" ? 240 : 220) + ukeire * 4,
      value: (mode === "basic" ? 210 : 185) + waits.length * 8,
      reason: passReason,
    };
  }
  const oneStep = getTenpaiAfterOneDrawUkeire(hand, meldCount, new Map());
  const speed = (mode === "basic" ? 92 : 80) + oneStep.drawUkeire * 1.2;
  const value = (mode === "basic" ? 178 : 165) + oneStep.bestWaitsCount * 6;
  return { speed, value, reason: passReason };
}

function evaluateTenpaiValueAfterCall(hand10, melds, mode = "riichi_lite") {
  const waits = getWinningTiles(hand10, melds.length);
  const ukeire = calcUkeireForWaits(hand10, waits);
  if (mode === "basic") {
    return {
      waits,
      waitsViable: waits,
      ukeire,
      bestPoint: 0,
      expectedPoint: 0,
      hasYakuWin: waits.length > 0,
    };
  }

  const fakePlayer = { ...state.players[0], melds: melds.slice(), riichi: false };
  const waitsViable = [];
  let bestPoint = 0;
  let weighted = 0;
  let weight = 0;
  const counts = countTiles(hand10);
  for (const w of waits) {
    const r = evaluateRiichiLiteWin(fakePlayer, hand10.concat([w]), "ron", w);
    if (!r.ok) continue;
    waitsViable.push(w);
    const pts = pointTotal(r);
    if (pts > bestPoint) bestPoint = pts;
    const avail = Math.max(0, 4 - counts[w]);
    if (avail > 0) {
      weighted += pts * avail;
      weight += avail;
    }
  }
  return {
    waits,
    waitsViable,
    ukeire,
    bestPoint,
    expectedPoint: weight > 0 ? weighted / weight : 0,
    hasYakuWin: waitsViable.length > 0,
  };
}

function evaluateCallAfterMeldConcealed(handAfterCall, nextMelds, mode) {
  if (handAfterCall.length !== 11) return { valid: false };
  const uniq = [...new Set(handAfterCall)];
  let best = null;
  const memoWins = new Map();
  for (const d of uniq) {
    const next10 = handAfterCall.slice();
    const i = next10.indexOf(d);
    if (i < 0) continue;
    next10.splice(i, 1);

    const tenpai = evaluateTenpaiValueAfterCall(next10, nextMelds, mode);
    const one = getTenpaiAfterOneDrawUkeire(next10, nextMelds.length, memoWins);
    const dist = tenpai.waits.length > 0 ? 0 : one.drawUkeire > 0 ? 1 : 2;
    const tenpaiUkeire = mode === "riichi_lite" ? calcUkeireForWaits(next10, tenpai.waitsViable) : tenpai.ukeire;

    let speed =
      (dist === 0 ? 270 : dist === 1 ? 138 : 52) +
      tenpaiUkeire * 6 +
      one.drawUkeire * 2.1 +
      (dist === 0 ? 18 : 0);
    let value;
    if (mode === "basic") {
      value = speed * 0.88 + tenpaiUkeire * 0.6;
    } else {
      value =
        speed * 0.35 +
        tenpai.bestPoint / 40 +
        tenpai.expectedPoint / 55 +
        tenpai.waitsViable.length * 9;
      if (tenpai.waits.length > 0 && !tenpai.hasYakuWin) {
        // Open hand tenpai but no yaku-win route: major risk in riichi-like play.
        speed -= 44;
        value -= 78;
      }
    }

    const cand = {
      discard: d,
      dist,
      tenpaiUkeire,
      waits: tenpai.waits,
      waitsViable: tenpai.waitsViable,
      speed,
      value,
      bestPoint: tenpai.bestPoint,
      expectedPoint: tenpai.expectedPoint,
      hasYakuWin: tenpai.hasYakuWin,
    };
    const score = mode === "basic" ? cand.speed * 0.84 + cand.value * 0.16 : cand.speed * 0.58 + cand.value * 0.42;
    cand.score = score;
    if (!best || cand.score > best.score) best = cand;
  }
  if (!best) return { valid: false };
  return { valid: true, ...best };
}

function evaluateCallAction(type, baseHand, melds, claimTile, pattern = null, mode = "riichi_lite") {
  const basePass = evaluatePassAction(baseHand, melds, mode);
  const tx = DecisionEngine.transitionByCall({
    type,
    baseHand,
    melds,
    claimTile,
    pattern
  });
  if (!tx) return { valid: false, speed: -999, value: -999, reason: tr("actionReasonCallValue") };
  const hand = tx.handAfterCall;
  const nextMelds = tx.nextMelds;

  let speed = 0;
  let value = 0;
  let reason = tr("actionReasonCallFast");
  if (type === "chi" || type === "pong") {
    const r = evaluateCallAfterMeldConcealed(hand, nextMelds, mode);
    if (!r.valid) return { valid: false, speed: -999, value: -999, reason: tr("actionReasonCallValue") };
    speed = r.speed;
    value = r.value;

    if (type === "chi" && pattern) {
      const beforeCounts = countTiles(baseHand);
      const hasOwnClaimTile = beforeCounts[claimTile] > 0;
      const hasFullSeqBefore = pattern.every((t) => beforeCounts[t] > 0);
      const weakSpeedGain = speed <= basePass.speed + (mode === "basic" ? 14 : 18);
      // Redundant chi: already had the same 3-tile block and call doesn't bring clear speed gain.
      if (hasOwnClaimTile && hasFullSeqBefore && weakSpeedGain) {
        speed -= mode === "basic" ? 42 : 36;
        value -= mode === "basic" ? 30 : 58;
      }
      // Generic anti-overcall guard for chi when speed gain is marginal.
      if (weakSpeedGain) {
        speed -= mode === "basic" ? 16 : 12;
        value -= mode === "basic" ? 10 : 20;
      }
    }

    if (mode === "basic") {
      // Basic mode is pure speed-oriented. Give explicit bonus for immediate meld completion.
      speed += type === "pong" ? 28 : 18;
      if (r.dist === 0) speed += 22;
      value = speed;
    }
    if (r.dist === 0 && (mode === "basic" || r.hasYakuWin)) reason = tr("actionReasonCallFast");
    else reason = tr("actionReasonCallValue");
  } else if (type === "kong") {
    // Open kong adds a replacement draw, then discard.
    if (hand.length !== 10) return { valid: false, speed: -999, value: -999, reason: tr("actionReasonCallValue") };
    const counts = countTiles(hand);
    let weightedSpeed = 0;
    let weightedValue = 0;
    let totalW = 0;
    for (let draw = 0; draw < 34; draw += 1) {
      const avail = Math.max(0, 4 - counts[draw]);
      if (avail <= 0) continue;
      const hand11 = hand.slice();
      hand11.push(draw);
      const r = evaluateCallAfterMeldConcealed(hand11, nextMelds, mode);
      if (!r.valid) continue;
      weightedSpeed += r.speed * avail;
      weightedValue += r.value * avail;
      totalW += avail;
    }
    if (totalW <= 0) return { valid: false, speed: -999, value: -999, reason: tr("actionReasonCallValue") };
    speed = weightedSpeed / totalW;
    value = weightedValue / totalW - 10;
    if (mode === "basic") value = speed;
    reason = speed >= value ? tr("actionReasonCallFast") : tr("actionReasonCallValue");
  }

  if (!Number.isFinite(speed) || !Number.isFinite(value) || speed < 0 || value < 0) {
    return { valid: false, speed: -999, value: -999, reason: tr("actionReasonCallValue") };
  }

  // Final conservative gate: if calling is not faster than pass in basic mode, demote it.
  if (mode === "basic" && speed <= basePass.speed + 2) {
    speed -= 18;
    value = speed;
    reason = tr("actionReasonPassBasic");
  }
  return { valid: true, speed, value, reason };
}

function buildClaimActionHints(options, claimTile, mode = "riichi_lite") {
  const human = state.players[0];
  const evalu = [];
  const actions = DecisionEngine.generateClaimActions(options, claimTile);
  for (const a of actions) {
    if (a.type === "pass") {
      const p = evaluatePassAction(human.hand, human.melds, mode);
      evalu.push({ key: a.key, speed: p.speed, value: p.value, reason: p.reason });
      continue;
    }
    if (a.type === "hu") {
      evalu.push({ key: a.key, speed: 300, value: 300, reason: tr("actionReasonHu"), isHu: true });
      continue;
    }
    const e = evaluateCallAction(a.type, human.hand, human.melds, claimTile, a.pattern || null, mode);
    evalu.push({ key: a.key, speed: e.valid === false ? 1 : e.speed, value: e.valid === false ? 1 : e.value, reason: e.reason });
  }

  const withCombined = evalu.map((x) => ({
    ...x,
    combined: mode === "basic" ? x.speed : x.speed * 0.58 + x.value * 0.42
  }));
  const best = withCombined.reduce((a, b) => (a.combined >= b.combined ? a : b), withCombined[0]);

  const out = {};
  withCombined.forEach((x) => {
    let label = tr("actionAdviceOk");
    if (x.key === "hu") label = tr("actionAdviceRec");
    else if (x.combined >= best.combined - 6) label = tr("actionAdviceRec");
    else if (x.combined <= best.combined - 22) label = tr("actionAdviceNo");
    if (x.isHu) {
      out[x.key] = `${label} · ${x.reason}`;
    } else {
      out[x.key] = `${tr("actionAdviceFmt", { label, speed: Math.round(x.speed), value: Math.round(x.value) })} · ${x.reason}`;
    }
  });
  return out;
}

function distLabel(dist) {
  if (dist === 0) return tr("adviceDist0");
  if (dist === 1) return tr("adviceDist1");
  return tr("adviceDist2");
}

function routeLabel(routeTag) {
  if (routeTag === "riichi") return tr("routeRiichi");
  if (routeTag === "tanyao") return tr("routeTanyao");
  if (routeTag === "yakuhai") return tr("routeYakuhai");
  if (routeTag === "honitsu") return tr("routeHonitsu");
  if (routeTag === "guest_wind_cut") return tr("routeGuestWindCut");
  if (routeTag === "wind_keep") return tr("routeWindKeep");
  if (routeTag === "double_wind_keep") return tr("routeDoubleWindKeep");
  if (routeTag === "yakuhai_keep") return tr("routeYakuhaiKeep");
  return "";
}

function countTiles(hand) {
  const c = Array(34).fill(0);
  for (const id of hand) c[id] += 1;
  return c;
}

function initGame() {
  state.players = [0, 1, 2, 3].map((i) => ({
    name: i === 0 ? tr("you") : tr("bot", { n: i }),
    hand: [],
    discards: [],
    melds: [],
    dealer: i === 0,
    riichi: false,
    riichiDiscardIndex: -1,
  }));
  setupRoundResources();
  state.currentPlayer = 0;
  state.gameOver = false;
  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.humanMustDiscard = false;
  state.lastDrawTile = null;
  state.lastDrawFromDeadWall = false;
  state.pendingRiichi = false;
  state.riichiDiscardCandidates = [];
  state.lastResult = null;
  clearLog();

  for (let r = 0; r < 13; r += 1) {
    for (let p = 0; p < 4; p += 1) {
      state.players[p].hand.push(drawLiveTile());
    }
  }
  for (const p of state.players) sortHand(p.hand);

  state.players[0].hand.push(drawLiveTile());
  sortHand(state.players[0].hand);
  state.humanMustDiscard = true;
  state.doraIndicator = state.ruleSet === "riichi_lite" ? (state.doraIndicators[0] ?? null) : null;
  logI18n("logNew");

  renderAll();
  refreshHumanActions();
}

function updateHeader() {
  el.wallInfo.textContent = tr("wall", { n: state.wall.length });
  el.turnInfo.textContent = state.gameOver
    ? tr("turnEnd")
    : tr("turn", { name: state.players[state.currentPlayer].name });
}

function renderPlayerPanel(idx) {
  const p = state.players[idx];
  const node = el[`p${idx}`];
  const discards = p.discards
    .map((id, i) => {
      const cls = i === p.riichiDiscardIndex ? "discard-riichi" : "";
      return `<span class="${cls}">${tileHtml(id, "small")}</span>`;
    })
    .join("");
  const meldLabel = (type) => {
    if (type === "chi") return tr("meldTypeChi");
    if (type === "pong") return tr("meldTypePong");
    if (type === "kong_open") return tr("meldTypeKongOpen");
    if (type === "kong_closed") return tr("meldTypeKongClosed");
    return type || "-";
  };
  const melds = p.melds
    .map((m) => `<span class="meld"><b>${meldLabel(m.type)}</b>${m.tiles.map((x) => tileHtml(x, "tiny")).join("")}</span>`)
    .join(" ");

  node.innerHTML = `
    <h3>${p.name}${p.riichi ? `<span class="riichi-tag">${tr("riichi")}</span>` : ""}</h3>
    <div class="meta">${tr("handCount", { n: p.hand.length })}</div>
    <div class="meta">${tr("melds", { v: melds || "-" })}</div>
    <div>${discards || `<span class="meta">${tr("noDiscard")}</span>`}</div>
  `;
}

function renderHand() {
  const hand = state.players[0].hand;
  el.hand.innerHTML = "";
  hand.forEach((id, i) => {
    const btn = document.createElement("button");
    btn.className = "tile-btn";
    btn.innerHTML = tileHtml(id, "large");
    const normalPlayable = state.currentPlayer === 0 && state.humanMustDiscard && !state.gameOver && !state.waitingClaim;
    const riichiRestrict =
      state.pendingRiichi &&
      !state.riichiDiscardCandidates.includes(id);
    const riichiLocked = state.players[0]?.riichi && !state.pendingRiichi;
    btn.disabled = !normalPlayable || riichiRestrict || riichiLocked;
    btn.onclick = () => humanDiscard(i);
    el.hand.appendChild(btn);
  });
}

function renderAll() {
  updateHeader();
  renderPlayerPanel(1);
  renderPlayerPanel(2);
  renderPlayerPanel(3);
  renderPlayerPanel(0);
  renderHand();
  renderRiichiAndExpectInfo();
  renderWaitValueInfo();
  renderTingInfo();
  renderAdviceInfo();
  renderResultInfo();
  renderRoundStatePanel();
}

function isSuit(id) {
  return id >= 0 && id < 27;
}

function canFormMelds(counts, needMelds) {
  if (needMelds === 0) return counts.every((x) => x === 0);

  let i = 0;
  while (i < 34 && counts[i] === 0) i += 1;
  if (i >= 34) return false;

  if (counts[i] >= 3) {
    counts[i] -= 3;
    if (canFormMelds(counts, needMelds - 1)) {
      counts[i] += 3;
      return true;
    }
    counts[i] += 3;
  }

  if (isSuit(i)) {
    const suitStart = Math.floor(i / 9) * 9;
    const pos = i - suitStart;
    if (pos <= 6 && counts[i + 1] > 0 && counts[i + 2] > 0) {
      counts[i] -= 1;
      counts[i + 1] -= 1;
      counts[i + 2] -= 1;
      if (canFormMelds(counts, needMelds - 1)) {
        counts[i] += 1;
        counts[i + 1] += 1;
        counts[i + 2] += 1;
        return true;
      }
      counts[i] += 1;
      counts[i + 1] += 1;
      counts[i + 2] += 1;
    }
  }

  return false;
}

function canHu(hand, meldCount) {
  const needMelds = 4 - meldCount;
  if (needMelds < 0) return false;
  if (hand.length !== needMelds * 3 + 2) return false;

  const counts = countTiles(hand);
  for (let i = 0; i < 34; i += 1) {
    if (counts[i] < 2) continue;
    counts[i] -= 2;
    if (canFormMelds(counts, needMelds)) {
      counts[i] += 2;
      return true;
    }
    counts[i] += 2;
  }
  return false;
}

function canChiitoitsu(hand, meldCount) {
  if (meldCount !== 0 || hand.length !== 14) return false;
  const counts = countTiles(hand);
  const pairs = counts.filter((c) => c === 2).length;
  const others = counts.filter((c) => c !== 0 && c !== 2).length;
  return pairs === 7 && others === 0;
}

function canKokushi(hand, meldCount) {
  if (meldCount !== 0 || hand.length !== 14) return false;
  const need = new Set([0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33]);
  const counts = countTiles(hand);
  let pairFound = false;
  for (const id of need) {
    if (counts[id] === 0) return false;
    if (counts[id] >= 2) pairFound = true;
  }
  // Must not contain outside tiles.
  for (let i = 0; i < 34; i += 1) {
    if (!need.has(i) && counts[i] > 0) return false;
  }
  return pairFound;
}

function canHuByRule(hand, meldCount) {
  if (state.ruleSet === "riichi_lite") return RiichiEngine.canHuByRule(hand, meldCount);
  return canHu(hand, meldCount);
}

function nextDoraFromIndicator(ind) {
  if (ind <= 26) {
    const base = Math.floor(ind / 9) * 9;
    const pos = ind - base;
    return base + ((pos + 1) % 9);
  }
  if (ind >= 27 && ind <= 30) return 27 + ((ind - 27 + 1) % 4);
  if (ind === 33) return 32;
  if (ind === 32) return 31;
  if (ind === 31) return 33;
  return ind;
}

function canDeclareRiichi(player) {
  if (state.ruleSet !== "riichi_lite") return { ok: false, discards: [] };
  if (player.riichi) return { ok: false, discards: [] };
  const hasOpen = player.melds.some((m) => m.type === "chi" || m.type === "pong" || m.type === "kong_open");
  if (hasOpen) return { ok: false, discards: [] };
  if (state.wall.length < 4) return { ok: false, discards: [] };
  const opts = getDiscardToTenpaiOptions(player.hand, player.melds.length);
  const discards = opts.map((x) => x.discard);
  return { ok: discards.length > 0, discards };
}

function findMeldDecomposition(counts, needMelds, acc = []) {
  if (needMelds === 0) return counts.every((x) => x === 0) ? acc.slice() : null;
  let i = 0;
  while (i < 34 && counts[i] === 0) i += 1;
  if (i >= 34) return null;

  if (counts[i] >= 3) {
    counts[i] -= 3;
    acc.push({ type: "triplet", tile: i, tiles: [i, i, i] });
    const r = findMeldDecomposition(counts, needMelds - 1, acc);
    if (r) {
      counts[i] += 3;
      acc.pop();
      return r;
    }
    counts[i] += 3;
    acc.pop();
  }

  if (isSuit(i)) {
    const suitStart = Math.floor(i / 9) * 9;
    const pos = i - suitStart;
    if (pos <= 6 && counts[i + 1] > 0 && counts[i + 2] > 0) {
      counts[i] -= 1;
      counts[i + 1] -= 1;
      counts[i + 2] -= 1;
      acc.push({ type: "sequence", tiles: [i, i + 1, i + 2] });
      const r = findMeldDecomposition(counts, needMelds - 1, acc);
      if (r) {
        counts[i] += 1;
        counts[i + 1] += 1;
        counts[i + 2] += 1;
        acc.pop();
        return r;
      }
      counts[i] += 1;
      counts[i + 1] += 1;
      counts[i + 2] += 1;
      acc.pop();
    }
  }
  return null;
}

function findWinningStructure(hand, meldCount) {
  const needMelds = 4 - meldCount;
  if (needMelds < 0) return null;
  if (hand.length !== needMelds * 3 + 2) return null;
  const counts = countTiles(hand);
  for (let i = 0; i < 34; i += 1) {
    if (counts[i] < 2) continue;
    counts[i] -= 2;
    const melds = findMeldDecomposition(counts, needMelds, []);
    counts[i] += 2;
    if (melds) return { pair: i, melds };
  }
  return null;
}

function getAllTilesForScore(player, handWithWin) {
  const all = handWithWin.slice();
  player.melds.forEach((m) => all.push(...m.tiles));
  return all;
}

function evaluateRiichiLiteWin(player, handWithWin, winType, winTile) {
  const inputTile = winTile === null ? handWithWin[handWithWin.length - 1] : winTile;
  const openedDora = getOpenedDoraIndicators();
  const openedUra = getOpenedUraIndicators();
  const rinshan = winType === "tsumo" && !!state.lastDrawFromDeadWall;
  const haitei = winType === "tsumo" && state.wall.length === 0;
  const houtei = winType === "ron" && state.wall.length === 0;
  return RiichiEngine.evaluateRules46({
    tiles: handWithWin,
    winType,
    winTile: inputTile,
    dealer: !!player.dealer,
    doraIndicators: openedDora,
    uraIndicators: player.riichi ? openedUra : [],
    state: {
      seatWind: "E",
      roundWind: "E",
      dealer: !!player.dealer,
      riichi: !!player.riichi,
      doubleRiichi: false,
      ippatsu: false,
      aka5m: false,
      aka5p: false,
      aka5s: false,
      chankan: false,
      rinshan,
      haitei,
      houtei,
      tenhou: false,
      chiihou: false
    }
  });
}

function estimateMaxHanPotential(player) {
  const hand = player.hand;
  if (!hand || hand.length === 0) return null;
  let best = null;
  const seen = new Set();
  for (let i = 0; i < hand.length; i += 1) {
    const discard = hand[i];
    if (seen.has(discard)) continue;
    seen.add(discard);
    const next = hand.slice();
    next.splice(i, 1);
    const waits = getWinningTiles(next, player.melds.length);
    for (const w of waits) {
      const winHand = next.concat([w]);
      const fakePlayer = { ...player };
      if (!fakePlayer.riichi) {
        const hasOpen = fakePlayer.melds.some((m) => m.type === "chi" || m.type === "pong" || m.type === "kong_open");
        if (!hasOpen) fakePlayer.riichi = true;
      }
      const r = evaluateRiichiLiteWin(fakePlayer, winHand, "ron", w);
      if (!r.ok) continue;
      if (!best || r.han > best.han) best = { ...r, discard, wait: w };
    }
  }
  return best;
}

function canPlayerWinNow(player, winType, winTile = null, handOverride = null) {
  const hand = handOverride || player.hand;
  if (state.ruleSet !== "riichi_lite") return canHu(hand, player.melds.length);
  const r = evaluateRiichiLiteWin(player, hand, winType, winTile);
  return !!r.ok;
}

function getWinningTiles(hand, meldCount) {
  const needMelds = 4 - meldCount;
  if (needMelds < 0) return [];
  if (hand.length !== needMelds * 3 + 1) return [];

  const counts = countTiles(hand);
  const wins = [];
  for (let id = 0; id < 34; id += 1) {
    if (counts[id] >= 4) continue;
    const test = hand.slice();
    test.push(id);
    if (canHuByRule(test, meldCount)) wins.push(id);
  }
  return wins;
}

function getDiscardToTenpaiOptions(hand, meldCount) {
  const needMelds = 4 - meldCount;
  if (needMelds < 0) return [];
  if (hand.length !== needMelds * 3 + 2) return [];

  const seenDiscard = new Set();
  const out = [];
  for (let i = 0; i < hand.length; i += 1) {
    const discard = hand[i];
    if (seenDiscard.has(discard)) continue;
    seenDiscard.add(discard);

    const next = hand.slice();
    next.splice(i, 1);
    const wins = getWinningTiles(next, meldCount);
    if (wins.length > 0) out.push({ discard, wins });
  }

  out.sort((a, b) => b.wins.length - a.wins.length || a.discard - b.discard);
  return out;
}

function getClaimOptionsForHuman(tile, from) {
  const player = state.players[0];
  const hand = player.hand;
  const counts = countTiles(hand);
  const options = { chi: [], pong: false, kong: false, hu: false };

  options.hu = canPlayerWinNow(player, "ron", tile, [...hand, tile]);

  if (state.ruleSet === "riichi_lite" && player.riichi) {
    options.chi = [];
    options.pong = false;
    options.kong = false;
    return options;
  }

  if (counts[tile] >= 2) options.pong = true;
  if (counts[tile] >= 3) options.kong = true;

  const leftDiscarder = 3;
  if (from === leftDiscarder && isSuit(tile)) {
    const suitStart = Math.floor(tile / 9) * 9;
    const pos = tile - suitStart;

    if (pos >= 2) {
      const a = tile - 2;
      const b = tile - 1;
      if (counts[a] > 0 && counts[b] > 0) options.chi.push([a, b, tile]);
    }
    if (pos >= 1 && pos <= 7) {
      const a = tile - 1;
      const c = tile + 1;
      if (counts[a] > 0 && counts[c] > 0) options.chi.push([a, tile, c]);
    }
    if (pos <= 6) {
      const b = tile + 1;
      const c = tile + 2;
      if (counts[b] > 0 && counts[c] > 0) options.chi.push([tile, b, c]);
    }
  }

  return options;
}

function removeOne(hand, tile) {
  const i = hand.indexOf(tile);
  if (i >= 0) hand.splice(i, 1);
  return i >= 0;
}

function endGame(msg) {
  state.gameOver = true;
  state.humanMustDiscard = false;
  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  log(msg);
  refreshHumanActions();
  renderAll();
}

function endGameI18n(key, vars = {}) {
  state.gameOver = true;
  state.humanMustDiscard = false;
  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  logI18n(key, vars);
  refreshHumanActions();
  renderAll();
}

function refreshHumanActions() {
  el.actionBar.innerHTML = "";
  el.kongBar.innerHTML = "";
  if (el.handActionsCol) el.handActionsCol.classList.remove("active");

  if (!state.gameOver) {
    const human = state.players[0];
    if (state.currentPlayer === 0 && canPlayerWinNow(human, "tsumo", state.lastDrawTile)) {
      el.actionBar.appendChild(actionItem(actionButton(tr("selfDraw"), [], () => finalizeHumanTsumo())));
    }

    if (state.currentPlayer === 0 && state.humanMustDiscard && !state.waitingClaim && state.ruleSet === "riichi_lite") {
      const ri = canDeclareRiichi(human);
      if (state.pendingRiichi) {
        el.actionBar.appendChild(
          actionItem(
            actionButton(tr("cancelRiichi"), [], () => {
              state.pendingRiichi = false;
              state.riichiDiscardCandidates = [];
              renderAll();
              refreshHumanActions();
            })
          )
        );
      } else if (ri.ok && !human.riichi) {
        el.actionBar.appendChild(
          actionItem(
            actionButton(tr("riichi"), [], () => {
              state.pendingRiichi = true;
              state.riichiDiscardCandidates = ri.discards.slice();
              logI18n("logRiichiDeclare");
              renderAll();
              refreshHumanActions();
            })
          )
        );
      }
    }

    if (state.currentPlayer === 0 && state.humanMustDiscard && !state.waitingClaim) {
      const counts = countTiles(human.hand);
      for (let id = 0; id < 34; id += 1) {
        if (counts[id] === 4) {
          el.kongBar.appendChild(actionButton(tr("concealedKong"), [id, id, id, id], () => doConcealedKong(id)));
        }
      }
    }

    if (state.waitingClaim && state.claimOptions) {
      const { chi, pong, kong, hu } = state.claimOptions;
      const hints = buildClaimActionHints(state.claimOptions, state.claimTile, state.ruleSet);

      if (hu) {
        el.actionBar.appendChild(actionItem(actionButton(tr(getRonActionKey()), [state.claimTile], () => claimHu()), hints.hu || ""));
      }

      if (kong) {
        el.actionBar.appendChild(
          actionItem(
            actionButton(tr("kong"), [state.claimTile, state.claimTile, state.claimTile, state.claimTile], () => claimKong()),
            hints.kong || ""
          )
        );
      }

      if (pong) {
        el.actionBar.appendChild(
          actionItem(actionButton(tr("pong"), [state.claimTile, state.claimTile, state.claimTile], () => claimPong()), hints.pong || "")
        );
      }

      if (chi.length > 0) {
        chi.forEach((pattern, i) => {
          el.actionBar.appendChild(actionItem(actionButton(tr("chi"), pattern, () => claimChi(i)), hints[`chi_${i}`] || ""));
        });
      }

      const pass = document.createElement("button");
      pass.textContent = tr("pass");
      pass.onclick = passClaim;
      el.actionBar.appendChild(actionItem(pass, hints.pass || ""));
    }
  }

  if (el.handActionsCol) {
    const hasAny = el.actionBar.children.length > 0 || el.kongBar.children.length > 0;
    const hasAutoOps = !!el.autoOps;
    el.handActionsCol.classList.toggle("active", hasAny || hasAutoOps);
  }

  if (!state.gameOver) scheduleAutoPlay();
}

function scheduleAutoPlay() {
  if (state.autoTickScheduled) return;
  state.autoTickScheduled = true;
  setTimeout(() => {
    state.autoTickScheduled = false;
    runAutoPlayTick();
  }, 0);
}

function runAutoPlayTick() {
  if (state.gameOver || state.currentPlayer !== 0) return;
  const human = state.players[0];
  if (!human) return;

  if (state.waitingClaim && state.claimOptions) {
    if (state.autoHu && state.claimOptions.hu) {
      claimHu();
      return;
    }
    if (state.autoTsumogiri) {
      passClaim();
      return;
    }
    return;
  }

  if (!state.humanMustDiscard) return;

  if (state.autoHu && canPlayerWinNow(human, "tsumo", state.lastDrawTile)) {
    finalizeHumanTsumo();
    return;
  }

  if (!state.autoTsumogiri || state.pendingRiichi) return;
  if (state.lastDrawTile === null || state.lastDrawTile === undefined) return;

  let idx = human.hand.lastIndexOf(state.lastDrawTile);
  if (idx < 0) idx = human.hand.length - 1;
  if (idx >= 0) humanDiscard(idx);
}

function nextPlayer(i) {
  return (i + 1) % 4;
}

function humanDiscard(index) {
  if (state.gameOver || state.currentPlayer !== 0 || !state.humanMustDiscard || state.waitingClaim) return;
  const human = state.players[0];
  if (state.ruleSet === "riichi_lite" && human.riichi && !state.pendingRiichi) return;
  const [tile] = human.hand.splice(index, 1);
  sortHand(human.hand);
  human.discards.push(tile);
  state.humanMustDiscard = false;
  if (state.pendingRiichi) {
    const okTile = state.riichiDiscardCandidates.includes(tile);
    if (!okTile) {
      human.discards.pop();
      human.hand.push(tile);
      sortHand(human.hand);
      state.humanMustDiscard = true;
      return;
    }
    human.riichi = true;
    human.riichiDiscardIndex = human.discards.length - 1;
    state.pendingRiichi = false;
    state.riichiDiscardCandidates = [];
    logAction(0, "riichi", [tile], "", true);
  } else {
    logAction(0, "discardTo", [tile], "", true);
  }
  state.lastDrawTile = null;
  state.lastDrawFromDeadWall = false;

  processDiscard(0, tile);
}

function processDiscard(from, tile) {
  renderAll();

  if (from !== 0) {
    const options = getClaimOptionsForHuman(tile, from);
    if (options.hu || options.kong || options.pong || options.chi.length > 0) {
      state.waitingClaim = true;
      state.claimTile = tile;
      state.claimFrom = from;
      state.claimOptions = options;
      refreshHumanActions();
      renderAll();
      return;
    }
  }

  const next = nextPlayer(from);
  startTurn(next, true);
}

function startTurn(playerIdx, needDraw) {
  if (state.gameOver) return;
  state.currentPlayer = playerIdx;
  if (playerIdx !== 0) {
    state.pendingRiichi = false;
    state.riichiDiscardCandidates = [];
    state.lastDrawTile = null;
    state.lastDrawFromDeadWall = false;
  }

  if (state.wall.length === 0) {
    endGameI18n("logWallEmpty");
    return;
  }

  if (playerIdx === 0) {
    state.lastDrawTile = null;
    state.lastDrawFromDeadWall = false;
    if (needDraw) {
      const tile = drawLiveTile();
      if (tile === null) {
        endGameI18n("logWallEmpty");
        return;
      }
      state.lastDrawTile = tile;
      state.players[0].hand.push(tile);
      sortHand(state.players[0].hand);
    }

    state.humanMustDiscard = true;
    state.waitingClaim = false;

    // Riichi locked state: auto tsumogiri unless tsumo is available.
    const human = state.players[0];
    if (state.ruleSet === "riichi_lite" && human.riichi && !state.pendingRiichi) {
      const canTsumoNow = canPlayerWinNow(human, "tsumo", state.lastDrawTile);
      if (canTsumoNow) {
        if (state.autoHu) {
          finalizeHumanTsumo();
          return;
        }
        refreshHumanActions();
        renderAll();
        return;
      }
      const tsumogiriTile = state.lastDrawTile;
      if (tsumogiriTile !== null && tsumogiriTile !== undefined) {
        if (!removeOne(human.hand, tsumogiriTile)) {
          const fallback = human.hand.pop();
          if (fallback === undefined) return;
          human.discards.push(fallback);
          logAction(0, "discardTo", [fallback], "riichi", true);
          state.humanMustDiscard = false;
          processDiscard(0, fallback);
          return;
        }
        human.discards.push(tsumogiriTile);
        logAction(0, "discardTo", [tsumogiriTile], "riichi", true);
        state.humanMustDiscard = false;
        state.lastDrawTile = null;
        state.lastDrawFromDeadWall = false;
        processDiscard(0, tsumogiriTile);
        return;
      }
    }

    refreshHumanActions();
    renderAll();
    return;
  }

  runBotTurn(playerIdx, needDraw);
}

function runBotTurn(idx, needDraw) {
  if (state.gameOver) return;

  setTimeout(() => {
    const bot = state.players[idx];
    let drawTileForTurn = null;

    if (needDraw) {
      const tile = drawLiveTile();
      if (tile === null) {
        endGameI18n("logWallEmpty");
        return;
      }
      drawTileForTurn = tile;
      bot.hand.push(tile);
      sortHand(bot.hand);
    }

    if (canPlayerWinNow(bot, "tsumo", drawTileForTurn)) {
      endGameI18n("logBotWin", { nameId: idx });
      return;
    }

    const discardIdx = Math.floor(Math.random() * bot.hand.length);
    const [tile] = bot.hand.splice(discardIdx, 1);
    bot.discards.push(tile);
    logAction(idx, "discardTo", [tile]);

    processDiscard(idx, tile);
    refreshHumanActions();
    renderAll();
  }, 450);
}

function passClaim() {
  if (!state.waitingClaim) return;
  const next = nextPlayer(state.claimFrom);
  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  logAction(0, "pass");
  refreshHumanActions();
  startTurn(next, true);
}

function claimHu() {
  if (!state.waitingClaim || !state.claimOptions?.hu) return;
  const tile = state.claimTile;
  const human = state.players[0];
  const r =
    state.ruleSet === "riichi_lite"
      ? evaluateRiichiLiteWin(human, [...human.hand, tile], "ron", tile)
      : { ok: true, han: 0, fu: 0, points: 0, yaku: [] };
  if (r.ok) {
    state.lastResult = r;
    logAction(0, getRonActionKey(), [tile]);
    endGameI18n(getRonResultKey(), { tileId: tile });
  }
}

function finalizeHumanTsumo() {
  const human = state.players[0];
  if (state.ruleSet === "riichi_lite") {
    const r = evaluateRiichiLiteWin(human, human.hand.slice(), "tsumo", state.lastDrawTile);
    if (!r.ok) return;
    state.lastResult = r;
  } else {
    state.lastResult = null;
  }
  logAction(0, "selfDraw");
  endGameI18n("logTsumo");
}

function claimPong() {
  if (!state.waitingClaim || !state.claimOptions?.pong) return;
  const tile = state.claimTile;
  const human = state.players[0];

  removeOne(human.hand, tile);
  removeOne(human.hand, tile);
  human.melds.push({ type: "pong", tiles: [tile, tile, tile] });
  sortHand(human.hand);

  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.currentPlayer = 0;
  state.humanMustDiscard = true;

  logAction(0, "pong", [tile, tile, tile]);
  refreshHumanActions();
  renderAll();
}

function claimKong() {
  if (!state.waitingClaim || !state.claimOptions?.kong) return;
  const tile = state.claimTile;
  const human = state.players[0];

  removeOne(human.hand, tile);
  removeOne(human.hand, tile);
  removeOne(human.hand, tile);
  human.melds.push({ type: "kong_open", tiles: [tile, tile, tile, tile] });

  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.currentPlayer = 0;

  logAction(0, "kong", [tile, tile, tile, tile]);

  const draw = state.ruleSet === "riichi_lite" ? drawRinshanTile() : drawLiveTile();
  if (draw === null) {
    endGameI18n("logWallEmpty");
    return;
  }

  if (state.ruleSet === "riichi_lite") {
    state.kanCount = Math.min(4, state.kanCount + 1);
    state.openDoraCount = Math.min(5, 1 + state.kanCount);
  }
  human.hand.push(draw);
  sortHand(human.hand);
  state.lastDrawTile = draw;
  state.lastDrawFromDeadWall = state.ruleSet === "riichi_lite";
  state.humanMustDiscard = true;

  refreshHumanActions();
  renderAll();
}

function claimChi(patternIndex) {
  if (!state.waitingClaim) return;
  const patterns = state.claimOptions?.chi || [];
  const pattern = patterns[patternIndex];
  if (!pattern) return;

  const tile = state.claimTile;
  const human = state.players[0];
  const need = pattern.filter((id) => id !== tile);

  if (need.length !== 2) return;
  if (!removeOne(human.hand, need[0]) || !removeOne(human.hand, need[1])) return;

  human.melds.push({ type: "chi", tiles: [...pattern] });
  sortHand(human.hand);

  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.currentPlayer = 0;
  state.humanMustDiscard = true;

  logAction(0, "chi", pattern);
  refreshHumanActions();
  renderAll();
}

function doConcealedKong(tile) {
  if (state.gameOver || state.currentPlayer !== 0 || !state.humanMustDiscard || state.waitingClaim) return;
  const human = state.players[0];
  const counts = countTiles(human.hand);
  if (counts[tile] < 4) return;

  for (let i = 0; i < 4; i += 1) removeOne(human.hand, tile);
  human.melds.push({ type: "kong_closed", tiles: [tile, tile, tile, tile] });

  const draw = state.ruleSet === "riichi_lite" ? drawRinshanTile() : drawLiveTile();
  if (draw === null) {
    endGameI18n("logWallEmpty");
    return;
  }

  if (state.ruleSet === "riichi_lite") {
    state.kanCount = Math.min(4, state.kanCount + 1);
    state.openDoraCount = Math.min(5, 1 + state.kanCount);
  }
  human.hand.push(draw);
  sortHand(human.hand);
  logAction(0, "concealedKong", [tile, tile, tile, tile, draw]);

  state.lastDrawTile = draw;
  state.lastDrawFromDeadWall = state.ruleSet === "riichi_lite";
  state.humanMustDiscard = true;
  refreshHumanActions();
  renderAll();
}

function renderTingInfo() {
  if (!el.tingInfo) return;
  const human = state.players[0];
  if (!human) {
    el.tingInfo.textContent = tr("tingDash");
    return;
  }

  if (state.gameOver) {
    el.tingInfo.textContent = tr("tingEnd");
    return;
  }

  if (canHuByRule(human.hand, human.melds.length)) {
    el.tingInfo.textContent = tr("tingWinNow");
    return;
  }

  const wins = getWinningTiles(human.hand, human.melds.length);

  if (state.ruleSet === "basic") {
    const rows = [];
    if (wins.length > 0) {
      const winTiles = wins.map((id) => tileHtml(id, "tiny")).join("");
      rows.push(`<div class="ting-row">${tr("tingNow", { n: wins.length })} ${winTiles}</div>`);
    } else {
      rows.push(`<div class="ting-row">${tr("tingNot")}</div>`);
    }

    if (state.currentPlayer === 0 && state.humanMustDiscard && !state.waitingClaim) {
      const options = getDiscardToTenpaiOptions(human.hand, human.melds.length);
      if (options.length > 0) {
        const optionHtml = options
          .map((op) => `${tr("discardTo")} ${tileHtml(op.discard, "tiny")} ${tr("waitFor")} ${op.wins.length}`)
          .map((txt, idx) => {
            const waits = options[idx].wins.map((id) => tileHtml(id, "tiny")).join("");
            return `<span class="ting-discard-item">${txt} ${waits}</span>`;
          })
          .join("");
        rows.push(`<div class="ting-row">${tr("tingSuggest")} ${optionHtml}</div>`);
      } else if (wins.length === 0) {
        rows.push(`<div class="ting-row">${tr("tingSuggestNone")}</div>`);
      }
    }

    el.tingInfo.innerHTML = rows.join("");
    return;
  }

  const rows = [];

  if (wins.length > 0) {
    const html = wins.map((id) => `<span class="ting-win-tile">${tileHtml(id, "small")}</span>`).join("");
    rows.push(`<div class="ting-row">${tr("tingNow", { n: wins.length })} ${html}</div>`);
  } else {
    rows.push(`<div class="ting-row">${tr("tingNot")}</div>`);
  }

  if (state.currentPlayer === 0 && state.humanMustDiscard && !state.waitingClaim) {
    const options = getDiscardToTenpaiOptions(human.hand, human.melds.length);
    if (options.length > 0) {
      const optionHtml = options
        .map((op) => {
          const waits = op.wins.map((id) => tileHtml(id, "tiny")).join("");
          return `<span class="ting-discard-item">${tr("discardTo")} ${tileHtml(op.discard, "tiny")} ${tr("waitFor")} ${waits}</span>`;
        })
        .join("");
      rows.push(`<div class="ting-row">${tr("tingSuggest")} ${optionHtml}</div>`);
    } else if (wins.length === 0) {
      rows.push(`<div class="ting-row">${tr("tingSuggestNone")}</div>`);
    }
  }

  el.tingInfo.innerHTML = rows.join("");
}

function renderRiichiAndExpectInfo() {
  if (el.riichiInfo) {
    if (state.ruleSet !== "riichi_lite") {
      el.riichiInfo.textContent = "";
    } else {
      const human = state.players[0];
      const status = state.pendingRiichi ? tr("riichiPending") : human?.riichi ? tr("riichiOn") : tr("riichiOff");
      const opened = getOpenedDoraIndicators();
      const head = opened.length > 0 ? opened[0] : null;
      const doraTile = head !== null && head !== undefined ? nextDoraFromIndicator(head) : null;
      const doraText = doraTile !== null ? tr("doraInfo", { ind: tileLabel(head), dora: tileLabel(doraTile) }) : "";
      el.riichiInfo.textContent = `${status}${doraText ? " | " + doraText : ""}`;
    }
  }

  if (!el.expectInfo) return;
  if (state.ruleSet !== "riichi_lite") {
    el.expectInfo.textContent = "";
    return;
  }
  const human = state.players[0];
  if (!human) {
    el.expectInfo.textContent = "";
    return;
  }
  if (canHu(human.hand, human.melds.length)) {
    const r = evaluateRiichiLiteWin(human, human.hand.slice(), "tsumo");
    if (r.ok) {
      el.expectInfo.textContent = tr("expectNow", { han: r.han, yaku: yakuText(r) });
      return;
    }
  }
  const best = estimateMaxHanPotential(human);
  if (best) {
    el.expectInfo.textContent = tr("expectMax", { han: best.han, yaku: yakuText(best) });
  } else {
    el.expectInfo.textContent = tr("expectNone");
  }
}

function renderWaitValueInfo() {
  if (!el.waitValueInfo) return;
  if (state.ruleSet !== "riichi_lite") {
    el.waitValueInfo.innerHTML = "";
    return;
  }
  const human = state.players[0];
  if (!human) {
    el.waitValueInfo.innerHTML = "";
    return;
  }

  if (state.pendingRiichi && state.riichiDiscardCandidates.length > 0) {
    const seen = new Set();
    const items = [];
    for (const d of state.riichiDiscardCandidates) {
      if (seen.has(d)) continue;
      seen.add(d);
      const i = human.hand.indexOf(d);
      if (i < 0) continue;
      const next = human.hand.slice();
      next.splice(i, 1);
      const waits = getWinningTiles(next, human.melds.length);
      let best = 0;
      for (const w of waits) {
        const r = evaluateRiichiLiteWin({ ...human, riichi: true }, [...next, w], "ron", w);
        if (r.ok && pointTotal(r) > best) best = pointTotal(r);
      }
      items.push(`<span class="wait-item">${tr("waitValuePendingItem", { tile: tileLabel(d), n: waits.length, points: best })}</span>`);
    }
    el.waitValueInfo.innerHTML = `<div class="ting-row">${tr("waitValuePending")}</div><div class="wait-grid">${items.join("")}</div>`;
    return;
  }

  const waits = getWinningTiles(human.hand, human.melds.length);
  if (waits.length === 0) {
    el.waitValueInfo.textContent = tr("waitValueNone");
    return;
  }

  const rows = waits
    .map((w) => {
      const r = evaluateRiichiLiteWin(human, [...human.hand, w], "ron", w);
      if (!r.ok) return { wait: w, han: 0, fu: 0, points: 0 };
      return { wait: w, han: r.han, fu: r.fu, points: pointTotal(r) };
    })
    .sort((a, b) => b.points - a.points || b.han - a.han || a.wait - b.wait);

  const html = rows
    .map((x) => `<span class="wait-item">${tileHtml(x.wait, "tiny")} ${tr("waitValueItem", { han: x.han, fu: x.fu, points: x.points })}</span>`)
    .join("");
  el.waitValueInfo.innerHTML = `<div class="ting-row">${tr("waitValueTitle")}</div><div class="wait-grid">${html}</div>`;
}

function renderResultInfo() {
  if (!el.resultInfo) return;
  if (!state.lastResult || state.ruleSet !== "riichi_lite") {
    el.resultInfo.innerHTML = "";
    return;
  }
  const r = state.lastResult;
  const totalPoints = pointTotal(r);
  const pointLabel = r?.point?.label || "-";
  const limitLine = r.limitName ? `<div class="result-line">${tr("resultLimit", { limit: r.limitName })}</div>` : "";
  el.resultInfo.innerHTML = `
    <div class="result-card">
      <div class="result-title">${tr("resultTitle")}</div>
      <div class="result-line">${tr("resultHanFu", { han: r.han, fu: r.fu })}</div>
      ${limitLine}
      <div class="result-line">${tr("resultPoints", { points: totalPoints })}</div>
      <div class="result-line">${tr("resultPointLabel", { label: pointLabel })}</div>
      <div class="result-line">${tr("resultYaku", { yaku: yakuText(r) })}</div>
    </div>
  `;
}

function renderRoundStatePanel() {
  if (!el.roundStatePanel) return;
  const prog = getWallProgress();
  const pct = Math.max(0, Math.min(100, prog.total > 0 ? (prog.remain / prog.total) * 100 : 0));
  const lowClass = pct <= 20 ? " low" : "";
  let extra = `<div class="wall-meta">${tr("basicWallInfo")}</div>`;
  if (state.ruleSet === "riichi_lite") {
    const backTile = tileHtml(-1, "tiny");
    const doraTiles = new Array(5).fill(0).map((_, i) => {
      if (i < state.openDoraCount) {
        const ind = state.doraIndicators[i];
        return ind === null || ind === undefined ? backTile : tileHtml(ind, "tiny");
      }
      return backTile;
    }).join("");
    const uraTiles = new Array(5).fill(0).map((_, i) => {
      if (state.gameOver && state.lastResult?.ok && state.players[0]?.riichi && i < state.openDoraCount) {
        const ind = state.uraIndicators[i];
        return ind === null || ind === undefined ? backTile : tileHtml(ind, "tiny");
      }
      return backTile;
    }).join("");
    extra = `
      <div class="wall-meta">${tr("deadWallInfo", { left: getRinshanRemain() })}</div>
      <div class="dora-grid">
        <div class="dora-box">
          <div class="dora-box-title">${tr("doraOpen")}</div>
          <div class="dora-tiles">${doraTiles}</div>
        </div>
        <div class="dora-box">
          <div class="dora-box-title">${tr("uraOpen")}</div>
          <div class="dora-tiles">${uraTiles}</div>
        </div>
      </div>
    `;
  }
  el.roundStatePanel.style.display = "";
  el.roundStatePanel.innerHTML = `
    <div class="state-title">${tr("statePanelTitle")}</div>
    <div class="wall-row">
      <div class="wall-meta">${tr("wallProgress", { used: prog.used, total: prog.total, remain: prog.remain })}</div>
      <div class="wall-track"><div class="wall-fill${lowClass}" style="width:${pct.toFixed(1)}%"></div></div>
      ${extra}
    </div>
  `;
}

function renderAdviceInfo() {
  if (!el.adviceInfo) return;
  const handLayout = document.getElementById("handLayout");

  const human = state.players[0];
  if (!human || state.gameOver || state.currentPlayer !== 0 || !state.humanMustDiscard || state.waitingClaim) {
    el.adviceInfo.style.display = "none";
    if (handLayout) handLayout.classList.add("no-advice");
    el.adviceInfo.innerHTML = "";
    return;
  }

  const restrict = state.pendingRiichi ? state.riichiDiscardCandidates : null;
  const advice = getDiscardAdvice(human.hand, human.melds, state.ruleSet, restrict);
  if (!advice) {
    el.adviceInfo.style.display = "none";
    if (handLayout) handLayout.classList.add("no-advice");
    el.adviceInfo.innerHTML = "";
    return;
  }
  el.adviceInfo.style.display = "";
  if (handLayout) handLayout.classList.remove("no-advice");

  const renderCard = (title, data, reason) => {
    const waitsHtml = data.waits.map((id) => tileHtml(id, "tiny")).join("") || "-";
    const route = routeLabel(data.routeTag || "");
    return `
      <div class="advice-card">
        <div class="advice-title">${title}</div>
        <div class="advice-line">${tr("adviceDiscard")} ${tileHtml(data.discard, "small")}</div>
        <div class="advice-line">${tr("adviceMetricSpeed", { dist: distLabel(data.dist), ukeire: data.ukeire, waits: data.waits.length })}</div>
        <div class="advice-line">${tr("adviceMetricValue", { value: data.valueScore.toFixed(1), speed: data.speedScore.toFixed(1) })}</div>
        <div class="advice-line">${tr("waitFor")} ${waitsHtml}</div>
        ${route ? `<div class="advice-line">${tr("adviceRoutePrefix")}: ${route}</div>` : ""}
        <div class="advice-line">${reason}</div>
      </div>
    `;
  };

  const fastReason = advice.fast.dist === 0 ? tr("adviceReasonFast0") : tr("adviceReasonFast1");
  if (state.ruleSet === "basic") {
    el.adviceInfo.innerHTML = `
      <div class="ting-row">${tr("adviceHeaderBasic")}</div>
      <div class="advice-grid">
        ${renderCard(tr("adviceFast"), advice.fast, fastReason)}
      </div>
    `;
    return;
  }

  const valueReason = tr("adviceReasonValue");
  el.adviceInfo.innerHTML = `
    <div class="ting-row">${tr("adviceHeader")}</div>
    <div class="advice-grid">
      ${renderCard(tr("adviceFast"), advice.fast, fastReason)}
      ${renderCard(tr("adviceValue"), advice.value, valueReason)}
    </div>
  `;
}

if (el.themeSelect) {
  el.themeSelect.addEventListener("change", (e) => {
    applyTheme(e.target.value);
  });
}

if (el.langSelect) {
  el.langSelect.addEventListener("change", (e) => {
    applyLang(e.target.value);
  });
}

if (el.ruleSelect) {
  el.ruleSelect.addEventListener("change", (e) => {
    const next = e.target.value === "riichi_lite" ? "riichi_lite" : "basic";
    if (next === state.ruleSet) return;
    const ok = window.confirm(tr("ruleConfirm", { name: getRuleDisplayName(next) }));
    if (!ok) {
      e.target.value = state.ruleSet;
      return;
    }
    try {
      localStorage.setItem("mahjong_rule_set", next);
    } catch (_) {
      // ignore storage failures
    }
    window.location.reload();
  });
}

if (el.autoHuToggle) {
  el.autoHuToggle.addEventListener("change", (e) => {
    state.autoHu = !!e.target.checked;
    scheduleAutoPlay();
  });
}

if (el.autoTsumogiriToggle) {
  el.autoTsumogiriToggle.addEventListener("change", (e) => {
    state.autoTsumogiri = !!e.target.checked;
    scheduleAutoPlay();
  });
}

syncAutoToggles();
el.newGameBtn.addEventListener("click", initGame);
initTheme();
initLang();
initRuleSet();
startClock();
initGame();
