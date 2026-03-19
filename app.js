const HANZI_NUM = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const WINDS = ["东", "南", "西", "北"];
const DRAGONS = ["中", "發", "白"];
const AKA_IDS = { m: 34, p: 35, s: 36 };

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
  roundWind: "E",
  kyoku: 1,
  honba: 0,
  kyotaku: 0,
  dealerIndex: 0,
  scores: [25000, 25000, 25000, 25000],
  hanchanEnded: false,
  hanchanEndReason: "",
  hanchanLedger: [],
  lastScoreDelta: [0, 0, 0, 0],
  autoHu: true,
  autoTsumogiri: false,
  tobiEndEnabled: true,
  autoTickScheduled: false,
  lastTingInfoHtml: "",
  lastWaitValueInfoHtml: "",
};

function baseTileId(id) {
  if (id === AKA_IDS.m) return 4;
  if (id === AKA_IDS.p) return 13;
  if (id === AKA_IDS.s) return 22;
  return id;
}

function isAkaTileId(id) {
  return id === AKA_IDS.m || id === AKA_IDS.p || id === AKA_IDS.s;
}

function windLetterByOffset(offset) {
  return ["E", "S", "W", "N"][((offset % 4) + 4) % 4];
}

function windTileByLetter(w) {
  if (w === "E") return 27;
  if (w === "S") return 28;
  if (w === "W") return 29;
  if (w === "N") return 30;
  return 27;
}

function windLabelByLetter(w) {
  if (state.lang === "ja") {
    if (w === "E") return "東";
    if (w === "S") return "南";
    if (w === "W") return "西";
    if (w === "N") return "北";
  }
  if (state.lang === "en") {
    if (w === "E") return "East";
    if (w === "S") return "South";
    if (w === "W") return "West";
    if (w === "N") return "North";
  }
  if (w === "E") return "东";
  if (w === "S") return "南";
  if (w === "W") return "西";
  if (w === "N") return "北";
  return "东";
}

function getSeatWindByPlayerIndex(playerIdx) {
  const off = (playerIdx - state.dealerIndex + 4) % 4;
  return windLetterByOffset(off);
}

function leftWindOf(w) {
  if (w === "E") return "N";
  if (w === "S") return "E";
  if (w === "W") return "S";
  if (w === "N") return "W";
  return "N";
}

function getHumanLeftDiscarderIndex() {
  const humanWind = getSeatWindByPlayerIndex(0);
  const needWind = leftWindOf(humanWind);
  for (let i = 0; i < 4; i += 1) {
    if (getSeatWindByPlayerIndex(i) === needWind) return i;
  }
  return 3;
}

function getRoundWindLabel() {
  return windLabelByLetter(state.roundWind || "E");
}

function roundLabelByState(roundWind, kyoku) {
  return `${windLabelByLetter(roundWind)}${kyoku}`;
}

function getCurrentRoundLabel() {
  return roundLabelByState(state.roundWind || "E", state.kyoku || 1);
}

function getRoundStepIndex(roundWind, kyoku) {
  const base = roundWind === "S" ? 4 : 0;
  const k = Math.max(1, Math.min(4, kyoku || 1));
  return base + (k - 1);
}

function playerShortName(i) {
  return i === 0 ? tr("you") : tr("bot", { n: i });
}

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
  roundInfo: document.getElementById("roundInfo"),
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
  nextHandBar: document.getElementById("nextHandBar"),
  actionBar: document.getElementById("actionBar"),
  kongBar: document.getElementById("kongBar"),
  autoOps: document.getElementById("autoOps"),
  autoHuToggle: document.getElementById("autoHuToggle"),
  autoTsumogiriToggle: document.getElementById("autoTsumogiriToggle"),
  tobiEndToggle: document.getElementById("tobiEndToggle"),
  autoHuLabel: document.getElementById("autoHuLabel"),
  autoTsumogiriLabel: document.getElementById("autoTsumogiriLabel"),
  tobiEndLabel: document.getElementById("tobiEndLabel"),
  calcNavBtn: document.getElementById("calcNavBtn"),
  log: document.getElementById("log"),
  riichiScoreboard: document.getElementById("riichiScoreboard"),
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
    calcNav: "算番算符",
    handTitle: "你的手牌",
    logTitle: "日志",
    sbTitle: "半庄计分板",
    sbCurrent: "当前点数",
    sbCheck: "总点数校验",
    sbKyotaku: "供托",
    sbOverview: "场次总览",
    sbFinished: "已完成对局",
    sbColRound: "局",
    sbColResult: "结果",
    sbColWinner: "和牌信息",
    sbColFrom: "放铳者/扣分",
    sbColDelta: "和牌类型",
    sbResultRon: "荣和",
    sbResultTsumo: "自摸",
    sbResultDraw: "流局",
    ruleLabel: "规则",
    ruleBasic: "基础",
    ruleRiichiLite: "立直Lite",
    ruleInfo: "规则: {name}",
    roundInfo: "{wind}{kyoku}局 {honba}本场 供托{kyotaku}",
    nextKyoku: "下一局",
    newHanchan: "新半庄",
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
    seatWind: "门风: {wind}",
    scoreNow: "点数: {score}",
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
    logTsumo: "你自摸 {tile}, 对局结束.",
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
    resultMetaTitle: "和牌信息",
    resultMetaRiichiOn: "立直",
    resultMetaRiichiOff: "未立直",
    resultMetaWinRon: "荣和",
    resultMetaWinTsumo: "自摸",
    resultMetaWinTile: "和了牌",
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
    tobiEnd: "击飞结束",
    logTobiEnd: "发生击飞, 半庄结束.",
    statePanelTitle: "对局状态",
    wallProgress: "牌山进度: 剩余{remain}/{total}, 已摸{used}",
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
    calcNav: "Han/Fu Calculator",
    handTitle: "Your Hand",
    logTitle: "Log",
    sbTitle: "Hanchan Scoreboard",
    sbCurrent: "Current Scores",
    sbCheck: "Total Check",
    sbKyotaku: "Riichi Sticks",
    sbOverview: "Round Overview",
    sbFinished: "Finished Hands",
    sbColRound: "Round",
    sbColResult: "Result",
    sbColWinner: "Win Info",
    sbColFrom: "From/Pays",
    sbColDelta: "Type",
    sbResultRon: "Ron",
    sbResultTsumo: "Tsumo",
    sbResultDraw: "Draw",
    ruleLabel: "Rules",
    ruleBasic: "Basic",
    ruleRiichiLite: "Riichi Lite",
    ruleInfo: "Rules: {name}",
    roundInfo: "{wind} {kyoku} | Honba {honba} | Riichi sticks {kyotaku}",
    nextKyoku: "Next Hand",
    newHanchan: "New Hanchan",
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
    seatWind: "Seat wind: {wind}",
    scoreNow: "Score: {score}",
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
    logTsumo: "You won by Tsumo on {tile}. Round over.",
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
    resultMetaTitle: "Win Meta",
    resultMetaRiichiOn: "Riichi",
    resultMetaRiichiOff: "No Riichi",
    resultMetaWinRon: "Ron",
    resultMetaWinTsumo: "Tsumo",
    resultMetaWinTile: "Win Tile",
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
    tobiEnd: "Tobi Ends Match",
    logTobiEnd: "Tobi triggered. Hanchan ended.",
    statePanelTitle: "Round State",
    wallProgress: "Wall progress: remain {remain}/{total}, used {used}",
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
    calcNav: "翻符計算",
    handTitle: "あなたの手牌",
    logTitle: "ログ",
    sbTitle: "半荘スコアボード",
    sbCurrent: "現在点数",
    sbCheck: "合計点数検証",
    sbKyotaku: "供託",
    sbOverview: "局サマリー",
    sbFinished: "完了局",
    sbColRound: "局",
    sbColResult: "結果",
    sbColWinner: "和了情報",
    sbColFrom: "放銃者/支払",
    sbColDelta: "和了種別",
    sbResultRon: "ロン",
    sbResultTsumo: "ツモ",
    sbResultDraw: "流局",
    ruleLabel: "ルール",
    ruleBasic: "基本",
    ruleRiichiLite: "立直Lite",
    ruleInfo: "ルール: {name}",
    roundInfo: "{wind}{kyoku}局 {honba}本場 供託{kyotaku}",
    nextKyoku: "次局へ",
    newHanchan: "新半荘",
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
    seatWind: "自風: {wind}",
    scoreNow: "点数: {score}",
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
    logTsumo: "{tile} でツモ和了. 対局終了.",
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
    resultMetaTitle: "和了情報",
    resultMetaRiichiOn: "立直",
    resultMetaRiichiOff: "立直なし",
    resultMetaWinRon: "ロン",
    resultMetaWinTsumo: "ツモ",
    resultMetaWinTile: "和了牌",
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
    tobiEnd: "トビ終了",
    logTobiEnd: "トビ発生. 半荘終了.",
    statePanelTitle: "局面情報",
    wallProgress: "山進行: 残り{remain}/{total}, 消費{used}",
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

const YAKU_LABELS = {
  Riichi: { zh: "立直", en: "Riichi", ja: "立直" },
  Ippatsu: { zh: "一发", en: "Ippatsu", ja: "一発" },
  "Menzen Tsumo": { zh: "门前清自摸和", en: "Menzen Tsumo", ja: "門前清自摸和" },
  Tanyao: { zh: "断幺九", en: "Tanyao", ja: "断么九" },
  "Yakuhai Seat Wind": { zh: "役牌: 自风", en: "Yakuhai: Seat Wind", ja: "役牌: 自風" },
  "Yakuhai Round Wind": { zh: "役牌: 场风", en: "Yakuhai: Round Wind", ja: "役牌: 場風" },
  "Yakuhai Chun": { zh: "役牌: 中", en: "Yakuhai: Chun", ja: "役牌: 中" },
  "Yakuhai Hatsu": { zh: "役牌: 发", en: "Yakuhai: Hatsu", ja: "役牌: 發" },
  "Yakuhai Haku": { zh: "役牌: 白", en: "Yakuhai: Haku", ja: "役牌: 白" },
  Chiitoitsu: { zh: "七对子", en: "Chiitoitsu", ja: "七対子" },
  Pinfu: { zh: "平和", en: "Pinfu", ja: "平和" },
  Toitoi: { zh: "对对和", en: "Toitoi", ja: "対々和" },
  Sanankou: { zh: "三暗刻", en: "Sanankou", ja: "三暗刻" },
  Shousangen: { zh: "小三元", en: "Shousangen", ja: "小三元" },
  "Sanshoku Doujun": { zh: "三色同顺", en: "Sanshoku Doujun", ja: "三色同順" },
  Ittsuu: { zh: "一气通贯", en: "Ittsuu", ja: "一気通貫" },
  Ryanpeikou: { zh: "两杯口", en: "Ryanpeikou", ja: "二盃口" },
  Iipeikou: { zh: "一杯口", en: "Iipeikou", ja: "一盃口" },
  Chinitsu: { zh: "清一色", en: "Chinitsu", ja: "清一色" },
  Honitsu: { zh: "混一色", en: "Honitsu", ja: "混一色" },
  "Kokushi Musou": { zh: "国士无双", en: "Kokushi Musou", ja: "国士無双" },
};

const BONUS_YAKU_PATTERNS = [
  {
    patterns: [/^Dora x(\d+)$/i, /^宝牌x(\d+)$/, /^ドラx(\d+)$/],
    labels: { zh: "宝牌 x{n}", en: "Dora x{n}", ja: "ドラ x{n}" },
  },
  {
    patterns: [/^Ura Dora x(\d+)$/i, /^里宝牌x(\d+)$/, /^裏ドラx(\d+)$/],
    labels: { zh: "里宝牌 x{n}", en: "Ura Dora x{n}", ja: "裏ドラ x{n}" },
  },
  {
    patterns: [/^Aka Dora x(\d+)$/i, /^红宝牌x(\d+)$/, /^赤ドラx(\d+)$/],
    labels: { zh: "赤宝牌 x{n}", en: "Aka Dora x{n}", ja: "赤ドラ x{n}" },
  },
];

const LIMIT_NAME_LABELS = {
  满贯: { zh: "满贯", en: "Mangan", ja: "満貫" },
  跳满: { zh: "跳满", en: "Haneman", ja: "跳満" },
  倍满: { zh: "倍满", en: "Baiman", ja: "倍満" },
  三倍满: { zh: "三倍满", en: "Sanbaiman", ja: "三倍満" },
  役满: { zh: "役满", en: "Yakuman", ja: "役満" },
  双倍役满: { zh: "双倍役满", en: "Double Yakuman", ja: "ダブル役満" },
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

function initTobiRule() {
  let enabled = true;
  try {
    const saved = localStorage.getItem("mahjong_tobi_end");
    if (saved === "0") enabled = false;
    if (saved === "1") enabled = true;
  } catch (_) {
    // ignore storage failures
  }
  state.tobiEndEnabled = enabled;
}

function updateRuleInfo() {
  if (el.ruleInfo) el.ruleInfo.textContent = tr("ruleInfo", { name: getRuleDisplayName(state.ruleSet) });
}

function renderStaticText() {
  if (el.titleMain) el.titleMain.textContent = tr("title");
  if (el.subText) el.subText.textContent = tr("sub");
  if (el.newGameBtn) el.newGameBtn.textContent = tr("newGame");
  if (el.calcNavBtn) el.calcNavBtn.textContent = tr("calcNav");
  if (el.handTitle) el.handTitle.textContent = tr("handTitle");
  if (el.logTitle) el.logTitle.textContent = tr("logTitle");
  if (el.ruleLabel) el.ruleLabel.textContent = tr("ruleLabel");
  if (el.themeLabel) el.themeLabel.textContent = tr("themeLabel");
  if (el.langLabel) el.langLabel.textContent = tr("langLabel");
  if (el.autoHuLabel) el.autoHuLabel.textContent = tr("autoHu");
  if (el.autoTsumogiriLabel) el.autoTsumogiriLabel.textContent = tr("autoTsumogiri");
  if (el.tobiEndLabel) el.tobiEndLabel.textContent = tr("tobiEnd");
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
  if (el.tobiEndToggle) el.tobiEndToggle.checked = !!state.tobiEndEnabled;
}

function resetAutoPlayForNewHand() {
  // Auto tsumogiri must always start disabled for each new hand.
  state.autoTsumogiri = false;
  syncAutoToggles();
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

function makeWall(includeAka = false) {
  const wall = [];
  for (let id = 0; id < 34; id += 1) {
    if (includeAka && id === 4) {
      wall.push(AKA_IDS.m, id, id, id);
      continue;
    }
    if (includeAka && id === 13) {
      wall.push(AKA_IDS.p, id, id, id);
      continue;
    }
    if (includeAka && id === 22) {
      wall.push(AKA_IDS.s, id, id, id);
      continue;
    }
    for (let k = 0; k < 4; k += 1) wall.push(id);
  }
  for (let i = wall.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [wall[i], wall[j]] = [wall[j], wall[i]];
  }
  return wall;
}

function setupWallWithDeadWall() {
  const full = makeWall(true);
  state.deadWall = full.splice(0, 14);
  state.wall = full;
  state.initialLiveWallCount = state.wall.length;
  state.deadSupplementIndex = 0;
  state.kanCount = 0;
  state.openDoraCount = 1;
  state.doraIndicators = state.deadWall.slice(4, 9).map((t) => baseTileId(t));
  state.uraIndicators = state.deadWall.slice(9, 14).map((t) => baseTileId(t));
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
    .map((y) => formatYakuLabel(y))
    .join(", ") || "-";
}

function localizeSimpleYakuName(name) {
  if (!name) return "-";
  const entry = YAKU_LABELS[name];
  if (entry) return entry[state.lang] || entry.zh || name;
  return name;
}

function localizeBonusYakuName(name) {
  if (!name) return "-";
  for (const entry of BONUS_YAKU_PATTERNS) {
    for (const pattern of entry.patterns) {
      const match = name.match(pattern);
      if (!match) continue;
      const template = entry.labels[state.lang] || entry.labels.zh || name;
      return template.replace("{n}", match[1]);
    }
  }
  return null;
}

function formatYakuLabel(yaku) {
  if (typeof yaku === "string") {
    return localizeBonusYakuName(yaku) || localizeSimpleYakuName(yaku);
  }
  if (!yaku || typeof yaku !== "object") return "-";
  const name = localizeBonusYakuName(yaku.name) || localizeSimpleYakuName(yaku.name);
  return typeof yaku.han === "number" ? `${name}(${yaku.han})` : name;
}

function localizeLimitName(name) {
  if (!name) return "";
  const entry = LIMIT_NAME_LABELS[name];
  if (entry) return entry[state.lang] || entry.zh || name;
  return name;
}

function pointTotal(result) {
  if (!result) return 0;
  if (result.point && typeof result.point.total === "number") return result.point.total;
  if (typeof result.points === "number") return result.points;
  return 0;
}

function sortHand(hand) {
  hand.sort((a, b) => {
    const ba = baseTileId(a);
    const bb = baseTileId(b);
    if (ba !== bb) return ba - bb;
    // Keep red fives before normal fives for stable display.
    if (isAkaTileId(a) !== isAkaTileId(b)) return isAkaTileId(a) ? -1 : 1;
    return a - b;
  });
}

function tileLabel(id) {
  const isAka = isAkaTileId(id);
  const t = baseTileId(id);
  if (state.lang === "en") {
    if (t >= 0 && t <= 8) return `${isAka ? "Aka " : ""}${t + 1}m`;
    if (t >= 9 && t <= 17) return `${isAka ? "Aka " : ""}${t - 8}p`;
    if (t >= 18 && t <= 26) return `${isAka ? "Aka " : ""}${t - 17}s`;
    if (t >= 27 && t <= 30) return ["E", "S", "W", "N"][t - 27];
    if (t >= 31 && t <= 33) return ["Chun", "Hatsu", "Haku"][t - 31];
  }
  if (state.lang === "ja") {
    if (t >= 0 && t <= 8) return `${isAka ? "赤" : ""}${t + 1}萬`;
    if (t >= 9 && t <= 17) return `${isAka ? "赤" : ""}${t - 8}筒`;
    if (t >= 18 && t <= 26) return `${isAka ? "赤" : ""}${t - 17}索`;
    if (t >= 27 && t <= 30) return ["東", "南", "西", "北"][t - 27];
    if (t >= 31 && t <= 33) return ["中", "發", "白"][t - 31];
  }
  if (t >= 0 && t <= 8) return `${isAka ? "赤" : ""}${HANZI_NUM[t]}万`;
  if (t >= 9 && t <= 17) return `${isAka ? "赤" : ""}${t - 8}筒`;
  if (t >= 18 && t <= 26) return `${isAka ? "赤" : ""}${t - 17}条`;
  if (t >= 27 && t <= 30) return WINDS[t - 27];
  if (t >= 31 && t <= 33) return DRAGONS[t - 31];
  return `?${id}`;
}

function tileAssetName(id) {
  if (id === AKA_IDS.m) return "Man5-Dora.png";
  if (id === AKA_IDS.p) return "Pin5-Dora.png";
  if (id === AKA_IDS.s) return "Sou5-Dora.png";
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
  const t = baseTileId(id);
  if (t >= 27) return true;
  const r = t % 9;
  return r === 0 || r === 8;
}

function tileSuit(id) {
  const t = baseTileId(id);
  if (t < 0 || t > 33) return -1;
  if (t <= 8) return 0;
  if (t <= 17) return 1;
  if (t <= 26) return 2;
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
  const handNorm = hand.map((t) => baseTileId(t));
  const meldsNorm = (melds || []).map((m) => ({ ...m, tiles: (m.tiles || []).map((t) => baseTileId(t)) }));
  const restrictNorm = Array.isArray(restrictDiscards) ? restrictDiscards.map((t) => baseTileId(t)) : restrictDiscards;
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
      const r = evaluateRiichiLiteWin({ ...human, melds: meldsNorm.slice() }, test, "ron", id);
      if (r.ok) wins.push(id);
    }
    return wins;
  };

  const evaluateWin = (tiles14, winTile) => {
    if (mode === "riichi_lite") return evaluateRiichiLiteWin({ ...human, melds: meldsNorm.slice() }, tiles14, "ron", winTile);
    return { ok: canHu(tiles14, meldCount), han: 0, fu: 0, points: 0 };
  };

  return DecisionEngine.evaluateDiscardAdvice({
    hand: handNorm,
    meldCount,
    mode,
    restrictDiscards: restrictNorm,
    heuristic: { doraTiles, seatWind: human.seatWind || "E", roundWind: state.roundWind || "E" },
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
  for (const id of hand) {
    const t = baseTileId(id);
    if (t >= 0 && t < 34) c[t] += 1;
  }
  return c;
}

function clearIppatsuForAll() {
  if (!Array.isArray(state.players)) return;
  state.players.forEach((p) => {
    p.riichiIppatsuEligible = false;
  });
}

function resetMatchState() {
  state.roundWind = "E";
  state.kyoku = 1;
  state.honba = 0;
  state.kyotaku = 0;
  state.dealerIndex = 0;
  state.scores = [25000, 25000, 25000, 25000];
  state.hanchanEnded = false;
  state.hanchanEndReason = "";
  state.hanchanLedger = [];
  state.lastScoreDelta = [0, 0, 0, 0];
}

function rebuildPlayersForHand() {
  state.players = [0, 1, 2, 3].map((i) => ({
    name: i === 0 ? tr("you") : tr("bot", { n: i }),
    hand: [],
    discards: [],
    melds: [],
    dealer: i === state.dealerIndex,
    seatWind: getSeatWindByPlayerIndex(i),
    score: state.scores[i] || 25000,
    riichi: false,
    riichiDiscardIndex: -1,
    riichiIppatsuEligible: false,
    riichiDeclaredThisTurn: false,
    tenpaiAtDraw: false,
  }));
}

function initGame() {
  resetAutoPlayForNewHand();
  resetMatchState();
  rebuildPlayersForHand();
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
  state.lastTingInfoHtml = "";
  state.lastWaitValueInfoHtml = "";
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

function startNextHand() {
  if (state.hanchanEnded) return;
  resetAutoPlayForNewHand();
  state.hanchanEndReason = "";
  rebuildPlayersForHand();
  setupRoundResources();
  state.currentPlayer = state.dealerIndex;
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
  state.lastTingInfoHtml = "";
  state.lastWaitValueInfoHtml = "";

  for (let r = 0; r < 13; r += 1) {
    for (let p = 0; p < 4; p += 1) {
      state.players[p].hand.push(drawLiveTile());
    }
  }
  for (const p of state.players) sortHand(p.hand);
  const first = state.dealerIndex;
  state.players[first].hand.push(drawLiveTile());
  sortHand(state.players[first].hand);
  state.currentPlayer = first;
  state.humanMustDiscard = first === 0;
  state.doraIndicator = state.ruleSet === "riichi_lite" ? (state.doraIndicators[0] ?? null) : null;
  logI18n("logNew");

  renderAll();
  refreshHumanActions();
  if (first !== 0) startTurn(first, false);
}

function updateHeader() {
  el.wallInfo.textContent = tr("wall", { n: state.wall.length });
  if (el.roundInfo) {
    el.roundInfo.textContent = tr("roundInfo", {
      wind: getRoundWindLabel(),
      kyoku: state.kyoku,
      honba: state.honba,
      kyotaku: state.kyotaku,
    });
  }
  el.turnInfo.textContent = state.gameOver
    ? tr("turnEnd")
    : tr("turn", { name: state.players[state.currentPlayer].name });
}

function renderPlayerPanel(idx) {
  const p = state.players[idx];
  const node = el[`p${idx}`];
  const seatWindLetter = p.seatWind || getSeatWindByPlayerIndex(idx);
  const seatWindTile = tileHtml(windTileByLetter(seatWindLetter), "tiny");
  const seatWindLabel = tr("seatWind", { wind: "" });
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
    <div class="meta">${escapeHtml(seatWindLabel)}${seatWindTile} | ${tr("scoreNow", { score: p.score || 0 })}</div>
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
  renderRiichiScoreboard();
}

function isSuit(id) {
  const t = baseTileId(id);
  return t >= 0 && t < 27;
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
  if (state.ruleSet === "riichi_lite") return RiichiEngine.canHuByRule(hand.map((t) => baseTileId(t)), meldCount);
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
  const score = state.scores[0] || 0;
  if (score < 1000) return { ok: false, discards: [] };
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

function payRiichiDeposit(playerIdx) {
  if (state.ruleSet !== "riichi_lite") return true;
  const score = state.scores[playerIdx] || 0;
  if (score < 1000) return false;
  state.scores[playerIdx] = score - 1000;
  if (state.players[playerIdx]) state.players[playerIdx].score = state.scores[playerIdx];
  state.kyotaku += 1;
  return true;
}

function getAkaCountByTile(allTiles) {
  const out = { 4: 0, 13: 0, 22: 0 };
  for (const t of allTiles || []) {
    if (t === AKA_IDS.m) out[4] += 1;
    else if (t === AKA_IDS.p) out[13] += 1;
    else if (t === AKA_IDS.s) out[22] += 1;
  }
  return out;
}

function evaluateRiichiLiteWin(player, handWithWin, winType, winTile) {
  const inputTileRaw = winTile === null ? handWithWin[handWithWin.length - 1] : winTile;
  const inputTile = baseTileId(inputTileRaw);
  const openedDora = getOpenedDoraIndicators();
  const openedUra = getOpenedUraIndicators();
  const rinshan = winType === "tsumo" && !!state.lastDrawFromDeadWall;
  const haitei = winType === "tsumo" && state.wall.length === 0;
  const houtei = winType === "ron" && state.wall.length === 0;
  const melds = Array.isArray(player?.melds) ? player.melds.slice() : [];
  const seatWind = player?.seatWind || "E";
  const roundWind = state.roundWind || "E";
  const dealerFlag = !!player?.dealer;
  const normalizedHand = handWithWin.map((t) => baseTileId(t));
  const normalizedMelds = melds.map((m) => ({ ...m, tiles: (m.tiles || []).map((t) => baseTileId(t)) }));
  const allTilesRaw = handWithWin.concat(...melds.map((m) => m.tiles || []));
  const akaCountByTile = getAkaCountByTile(allTilesRaw);
  const ippatsu = !!player.riichiIppatsuEligible;

  // Riichi Lite evaluator supports open meld context directly.
  // Without this, open-hand tanyao and similar yaku can be misjudged.
  if (melds.length > 0 && RiichiEngine?.evaluateRiichiLite) {
    const lite = RiichiEngine.evaluateRiichiLite({
      tiles: normalizedHand,
      melds: normalizedMelds,
      winType,
      winTile: inputTile,
      riichi: !!player.riichi,
      dealer: dealerFlag,
      seatWind,
      roundWind,
      doraIndicators: openedDora,
      uraIndicators: player.riichi ? openedUra : [],
      ippatsu,
      akaCountByTile,
    });
    if (!lite || !lite.ok) return lite || { ok: false };
    const total = typeof lite.points === "number" ? lite.points : 0;
    return {
      ...lite,
      point: lite.point || { total, label: String(total) },
      points: total,
    };
  }

  return RiichiEngine.evaluateRules46({
    tiles: normalizedHand,
    winType,
    winTile: inputTile,
    dealer: dealerFlag,
    doraIndicators: openedDora,
    uraIndicators: player.riichi ? openedUra : [],
    state: {
      roundWind,
      dealer: dealerFlag,
      seatWind,
      riichi: !!player.riichi,
      doubleRiichi: false,
      ippatsu,
      aka5m: false,
      aka5p: false,
      aka5s: false,
      akaCountByTile,
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
  const tileBase = baseTileId(tile);

  options.hu = canPlayerWinNow(player, "ron", tile, [...hand, tile]);

  if (state.ruleSet === "riichi_lite" && player.riichi) {
    options.chi = [];
    options.pong = false;
    options.kong = false;
    return options;
  }

  if (counts[tileBase] >= 2) options.pong = true;
  if (counts[tileBase] >= 3) options.kong = true;

  const leftDiscarder = getHumanLeftDiscarderIndex();
  if (from === leftDiscarder && isSuit(tileBase)) {
    const suitStart = Math.floor(tileBase / 9) * 9;
    const pos = tileBase - suitStart;

    if (pos >= 2) {
      const a = tileBase - 2;
      const b = tileBase - 1;
      if (counts[a] > 0 && counts[b] > 0) options.chi.push([a, b, tileBase]);
    }
    if (pos >= 1 && pos <= 7) {
      const a = tileBase - 1;
      const c = tileBase + 1;
      if (counts[a] > 0 && counts[c] > 0) options.chi.push([a, tileBase, c]);
    }
    if (pos <= 6) {
      const b = tileBase + 1;
      const c = tileBase + 2;
      if (counts[b] > 0 && counts[c] > 0) options.chi.push([tileBase, b, c]);
    }
  }

  return options;
}

function removeOne(hand, tile) {
  let i = hand.indexOf(tile);
  if (i >= 0) {
    hand.splice(i, 1);
    return true;
  }
  const t = baseTileId(tile);
  i = hand.findIndex((x) => baseTileId(x) === t);
  if (i >= 0) hand.splice(i, 1);
  return i >= 0;
}

function takeTilesFromHandByBase(hand, needTiles) {
  if (!Array.isArray(hand) || !Array.isArray(needTiles)) return null;
  const removed = [];
  const pickIndexForNeed = (need) => {
    const b = baseTileId(need);
    const exact = hand.indexOf(need);
    if (exact >= 0) return exact;
    let candidate = -1;
    for (let i = 0; i < hand.length; i += 1) {
      if (baseTileId(hand[i]) !== b) continue;
      if (candidate < 0) candidate = i;
      // Prefer non-aka tile if specific aka tile is not required.
      if (!isAkaTileId(need) && !isAkaTileId(hand[i])) return i;
    }
    return candidate;
  };
  for (const need of needTiles) {
    const idx = pickIndexForNeed(need);
    if (idx < 0) {
      for (let i = removed.length - 1; i >= 0; i -= 1) {
        const r = removed[i];
        hand.splice(Math.min(r.idx, hand.length), 0, r.tile);
      }
      return null;
    }
    removed.push({ idx, tile: hand[idx] });
    hand.splice(idx, 1);
  }
  return removed.map((x) => x.tile);
}

function canTakeTilesFromHandByBase(hand, needTiles) {
  const counts = countTiles(hand || []);
  for (const t of needTiles || []) {
    const b = baseTileId(t);
    if ((counts[b] || 0) <= 0) return false;
    counts[b] -= 1;
  }
  return true;
}

function getAddedKongCandidates(player) {
  const out = [];
  if (!player || !Array.isArray(player.melds) || !Array.isArray(player.hand)) return out;
  player.melds.forEach((m) => {
    if (!m || m.type !== "pong" || !Array.isArray(m.tiles) || m.tiles.length !== 3) return;
    const t = baseTileId(m.tiles[0]);
    if (player.hand.some((x) => baseTileId(x) === t) && !out.includes(t)) out.push(t);
  });
  return out;
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

function endGameDraw() {
  const snap = captureRoundSnapshot();
  const drawSettle = settleDrawScores();
  const tenpaiDetail = (drawSettle.tenpai || []).map((i) => {
    const info = detectTenpaiDisplayForPlayer(i);
    return {
      player: i,
      waits: info.waits || [],
      hand: info.hand || [],
      melds: info.melds || [],
    };
  });
  appendLedgerEntry({
    roundLabel: roundLabelByState(snap.roundWind, snap.kyoku),
    honba: snap.honba,
    kyotaku: snap.kyotaku,
    dealer: snap.dealerIndex,
    resultType: "draw",
    winner: null,
    loser: null,
    tenpai: drawSettle.tenpai || [],
    tenpaiDetail,
    delta: (drawSettle.delta || [0, 0, 0, 0]).slice(),
    scoresAfter: (state.scores || []).slice(),
  });
  if (!state.hanchanEnded) {
    const dealerTenpai = !!state.players[state.dealerIndex]?.tenpaiAtDraw;
    advanceKyoku(dealerTenpai);
  }
  endGameI18n("logWallEmpty");
}

function refreshHumanActions() {
  if (el.nextHandBar) el.nextHandBar.innerHTML = "";
  el.actionBar.innerHTML = "";
  el.kongBar.innerHTML = "";
  if (el.handActionsCol) el.handActionsCol.classList.remove("active");

  if (state.gameOver && el.nextHandBar) {
    const btn = document.createElement("button");
    btn.className = "next-hand-btn";
    btn.textContent = state.hanchanEnded ? tr("newHanchan") : tr("nextKyoku");
    btn.onclick = () => {
      if (state.hanchanEnded) initGame();
      else startNextHand();
    };
    el.nextHandBar.appendChild(btn);
  }

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
      if (!(state.ruleSet === "riichi_lite" && human.riichi)) {
        const added = getAddedKongCandidates(human);
        added.forEach((id) => {
          el.kongBar.appendChild(actionButton(tr("kong"), [id, id, id, id], () => doAddedKong(id)));
        });
      }
    }

    if (state.waitingClaim && state.claimOptions) {
      const { chi, pong, kong, hu } = state.claimOptions;
      const hints = buildClaimActionHints(state.claimOptions, state.claimTile, state.ruleSet);

      if (hu) {
        el.actionBar.appendChild(actionItem(actionButton(tr(getRonActionKey()), [state.claimTile], () => claimHu()), hints.hu || ""));
      }

      if (kong) {
        const b = baseTileId(state.claimTile);
        el.actionBar.appendChild(
          actionItem(
            actionButton(tr("kong"), [b, b, b, b], () => claimKong()),
            hints.kong || ""
          )
        );
      }

      if (pong) {
        const b = baseTileId(state.claimTile);
        el.actionBar.appendChild(
          actionItem(actionButton(tr("pong"), [b, b, b], () => claimPong()), hints.pong || "")
        );
      }

      if (chi.length > 0) {
        chi.forEach((pattern, i) => {
          const need = (pattern || []).filter((id) => baseTileId(id) !== baseTileId(state.claimTile));
          if (!canTakeTilesFromHandByBase(state.players[0]?.hand || [], need)) return;
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
    const hasAny = el.actionBar.children.length > 0 || el.kongBar.children.length > 0 || (el.nextHandBar && el.nextHandBar.children.length > 0);
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

function ceil100(n) {
  return Math.ceil(n / 100) * 100;
}

function calcBasePointsByHanFu(han, fu) {
  let base = fu * Math.pow(2, han + 2);
  if (han >= 13) base = 8000;
  else if (han >= 11) base = 6000;
  else if (han >= 8) base = 4000;
  else if (han >= 6) base = 3000;
  else if (han >= 5 || base >= 2000) base = 2000;
  return base;
}

function getBasePointsFromResult(r) {
  if (!r) return 0;
  if (typeof r.basePoints === "number" && r.basePoints > 0) return r.basePoints;
  if (typeof r.han === "number" && typeof r.fu === "number" && r.han > 0 && r.fu > 0) {
    return calcBasePointsByHanFu(r.han, r.fu);
  }
  return 0;
}

function applyScoreDelta(delta) {
  for (let i = 0; i < 4; i += 1) {
    state.scores[i] = (state.scores[i] || 0) + (delta[i] || 0);
    if (state.players[i]) state.players[i].score = state.scores[i];
  }
}

function captureRoundSnapshot() {
  return {
    roundWind: state.roundWind,
    kyoku: state.kyoku,
    honba: state.honba,
    kyotaku: state.kyotaku,
    dealerIndex: state.dealerIndex,
    scoresBefore: (state.scores || []).slice(),
  };
}

function appendLedgerEntry(entry) {
  state.hanchanLedger.push(entry);
  if (state.hanchanLedger.length > 120) state.hanchanLedger = state.hanchanLedger.slice(-120);
}

function detectTenpaiDisplayForPlayer(playerIdx) {
  const p = state.players[playerIdx];
  if (!p) return { waits: [] };
  const hand = (p.hand || []).slice();
  const melds = (p.melds || []).map((m) => (m.tiles || []).slice());
  if (hand.length % 3 === 2) {
    const seen = new Set();
    let best = [];
    for (let i = 0; i < hand.length; i += 1) {
      const d = hand[i];
      if (seen.has(d)) continue;
      seen.add(d);
      const next = hand.slice();
      next.splice(i, 1);
      const w = getWinningTiles(next, p.melds.length);
      if (w.length > best.length) best = w.slice();
    }
    return { waits: best, hand, melds };
  }
  return { waits: getWinningTiles(hand, p.melds.length), hand, melds };
}

function checkTobiEnd() {
  if (state.ruleSet !== "riichi_lite") return false;
  if (!state.tobiEndEnabled) return false;
  if (state.hanchanEnded) return true;
  if (!(state.scores || []).some((s) => (s || 0) < 0)) return false;
  state.hanchanEnded = true;
  state.hanchanEndReason = "tobi";
  logI18n("logTobiEnd");
  return true;
}

function settleWinScores(winnerIdx, winType, loserIdx, result) {
  const delta = [0, 0, 0, 0];
  const base = getBasePointsFromResult(result);
  const dealerWin = winnerIdx === state.dealerIndex;
  if (winType === "ron") {
    const pay = ceil100(base * (dealerWin ? 6 : 4)) + state.honba * 300;
    if (Number.isInteger(loserIdx) && loserIdx >= 0) delta[loserIdx] -= pay;
    delta[winnerIdx] += pay;
  } else {
    if (dealerWin) {
      const each = ceil100(base * 2) + state.honba * 100;
      for (let i = 0; i < 4; i += 1) {
        if (i === winnerIdx) continue;
        delta[i] -= each;
        delta[winnerIdx] += each;
      }
    } else {
      const fromDealer = ceil100(base * 2) + state.honba * 100;
      const fromOther = ceil100(base) + state.honba * 100;
      for (let i = 0; i < 4; i += 1) {
        if (i === winnerIdx) continue;
        const pay = i === state.dealerIndex ? fromDealer : fromOther;
        delta[i] -= pay;
        delta[winnerIdx] += pay;
      }
    }
  }
  if (state.kyotaku > 0) {
    delta[winnerIdx] += state.kyotaku * 1000;
    state.kyotaku = 0;
  }
  applyScoreDelta(delta);
  state.lastScoreDelta = delta.slice();
  checkTobiEnd();
  return delta;
}

function settleDrawScores() {
  const tenpai = [];
  for (let i = 0; i < 4; i += 1) {
    const p = state.players[i];
    const waits = getWinningTiles(p.hand, p.melds.length);
    p.tenpaiAtDraw = waits.length > 0;
    if (p.tenpaiAtDraw) tenpai.push(i);
  }
  const n = tenpai.length;
  if (n <= 0 || n >= 4) {
    state.lastScoreDelta = [0, 0, 0, 0];
    return { delta: [0, 0, 0, 0], tenpai };
  }
  const delta = [0, 0, 0, 0];
  const gain = Math.floor(3000 / n);
  const loss = Math.floor(3000 / (4 - n));
  for (let i = 0; i < 4; i += 1) {
    if (tenpai.includes(i)) delta[i] += gain;
    else delta[i] -= loss;
  }
  applyScoreDelta(delta);
  state.lastScoreDelta = delta.slice();
  checkTobiEnd();
  return { delta, tenpai };
}

function advanceKyoku(dealerKeeps) {
  if (dealerKeeps) {
    state.honba += 1;
    return;
  }
  state.honba = 0;
  state.dealerIndex = nextPlayer(state.dealerIndex);
  state.kyoku += 1;
  if (state.kyoku <= 4) return;
  state.kyoku = 1;
  if (state.roundWind === "E") {
    state.roundWind = "S";
    return;
  }
  state.hanchanEnded = true;
}

function onRoundEndAfterWin(winnerIdx) {
  if (state.hanchanEnded) return;
  const dealerKeeps = winnerIdx === state.dealerIndex;
  advanceKyoku(dealerKeeps);
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
    if (!payRiichiDeposit(0)) {
      human.discards.pop();
      human.hand.push(tile);
      sortHand(human.hand);
      state.humanMustDiscard = true;
      state.pendingRiichi = false;
      state.riichiDiscardCandidates = [];
      return;
    }
    human.riichi = true;
    human.riichiDiscardIndex = human.discards.length - 1;
    human.riichiIppatsuEligible = true;
    human.riichiDeclaredThisTurn = true;
    state.pendingRiichi = false;
    state.riichiDiscardCandidates = [];
    logAction(0, "riichi", [tile], "", true);
  } else {
    if (human.riichi && human.riichiIppatsuEligible) {
      human.riichiIppatsuEligible = false;
      human.riichiDeclaredThisTurn = false;
    }
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
    endGameDraw();
    return;
  }

  if (playerIdx === 0) {
    state.lastDrawTile = null;
    state.lastDrawFromDeadWall = false;
    if (needDraw) {
      const tile = drawLiveTile();
      if (tile === null) {
        endGameDraw();
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
          if (human.riichi && human.riichiIppatsuEligible) {
            human.riichiIppatsuEligible = false;
            human.riichiDeclaredThisTurn = false;
          }
          logAction(0, "discardTo", [fallback], "riichi", true);
          state.humanMustDiscard = false;
          processDiscard(0, fallback);
          return;
        }
        human.discards.push(tsumogiriTile);
        if (human.riichi && human.riichiIppatsuEligible) {
          human.riichiIppatsuEligible = false;
          human.riichiDeclaredThisTurn = false;
        }
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
        endGameDraw();
        return;
      }
      drawTileForTurn = tile;
      bot.hand.push(tile);
      sortHand(bot.hand);
    }

    if (canPlayerWinNow(bot, "tsumo", drawTileForTurn)) {
      const snap = captureRoundSnapshot();
      if (state.ruleSet === "riichi_lite") {
        const r = evaluateRiichiLiteWin(bot, bot.hand.slice(), "tsumo", drawTileForTurn);
        if (r.ok) {
          const delta = settleWinScores(idx, "tsumo", null, r);
          appendLedgerEntry({
            roundLabel: roundLabelByState(snap.roundWind, snap.kyoku),
            honba: snap.honba,
            kyotaku: snap.kyotaku,
            dealer: snap.dealerIndex,
            resultType: "tsumo",
            winner: idx,
            loser: null,
            winTile: drawTileForTurn,
            winHand: bot.hand.slice(),
            winMelds: (bot.melds || []).map((m) => (m.tiles || []).slice()),
            settle: {
              han: r.han,
              fu: r.fu,
              limitName: r.limitName || "",
              points: pointTotal(r),
              pointLabel: (r.point && r.point.label) ? r.point.label : (r.pointLabel || ""),
              yaku: Array.isArray(r.yaku) ? r.yaku.slice() : [],
            },
            delta: delta.slice(),
            scoresAfter: (state.scores || []).slice(),
          });
        }
      }
      onRoundEndAfterWin(idx);
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
  const from = state.claimFrom;
  const human = state.players[0];
  const snap = captureRoundSnapshot();
  const r =
    state.ruleSet === "riichi_lite"
      ? evaluateRiichiLiteWin(human, [...human.hand, tile], "ron", tile)
      : { ok: true, han: 0, fu: 0, points: 0, yaku: [] };
  if (r.ok) {
    const delta = settleWinScores(0, "ron", from, r);
    appendLedgerEntry({
      roundLabel: roundLabelByState(snap.roundWind, snap.kyoku),
      honba: snap.honba,
      kyotaku: snap.kyotaku,
      dealer: snap.dealerIndex,
      resultType: "ron",
      winner: 0,
      loser: from,
      winTile: tile,
      winHand: [...human.hand, tile],
      winMelds: (human.melds || []).map((m) => (m.tiles || []).slice()),
      settle: {
        han: r.han,
        fu: r.fu,
        limitName: r.limitName || "",
        points: pointTotal(r),
        pointLabel: (r.point && r.point.label) ? r.point.label : (r.pointLabel || ""),
        yaku: Array.isArray(r.yaku) ? r.yaku.slice() : [],
      },
      delta: delta.slice(),
      scoresAfter: (state.scores || []).slice(),
    });
    onRoundEndAfterWin(0);
    state.lastResult = { ...r, winType: "ron", winTile: tile, riichi: !!human.riichi };
    logAction(0, getRonActionKey(), [tile]);
    endGameI18n(getRonResultKey(), { tileId: tile });
  }
}

function finalizeHumanTsumo() {
  const human = state.players[0];
  const snap = captureRoundSnapshot();
  if (state.ruleSet === "riichi_lite") {
    const r = evaluateRiichiLiteWin(human, human.hand.slice(), "tsumo", state.lastDrawTile);
    if (!r.ok) return;
    const delta = settleWinScores(0, "tsumo", null, r);
    appendLedgerEntry({
      roundLabel: roundLabelByState(snap.roundWind, snap.kyoku),
      honba: snap.honba,
      kyotaku: snap.kyotaku,
      dealer: snap.dealerIndex,
      resultType: "tsumo",
      winner: 0,
      loser: null,
      winTile: state.lastDrawTile,
      winHand: human.hand.slice(),
      winMelds: (human.melds || []).map((m) => (m.tiles || []).slice()),
      settle: {
        han: r.han,
        fu: r.fu,
        limitName: r.limitName || "",
        points: pointTotal(r),
        pointLabel: (r.point && r.point.label) ? r.point.label : (r.pointLabel || ""),
        yaku: Array.isArray(r.yaku) ? r.yaku.slice() : [],
      },
      delta: delta.slice(),
      scoresAfter: (state.scores || []).slice(),
    });
    state.lastResult = { ...r, winType: "tsumo", winTile: state.lastDrawTile, riichi: !!human.riichi };
  } else {
    state.lastResult = null;
  }
  onRoundEndAfterWin(0);
  const tsumoTile = state.lastDrawTile;
  logAction(0, "selfDraw", tsumoTile === null || tsumoTile === undefined ? [] : [tsumoTile]);
  endGameI18n("logTsumo", tsumoTile === null || tsumoTile === undefined ? {} : { tileId: tsumoTile });
}

function claimPong() {
  if (!state.waitingClaim || !state.claimOptions?.pong) return;
  clearIppatsuForAll();
  const tile = state.claimTile;
  const human = state.players[0];
  const take = takeTilesFromHandByBase(human.hand, [tile, tile]);
  if (!take || take.length !== 2) {
    passClaim();
    return;
  }
  const meldTiles = [tile, ...take];
  human.melds.push({ type: "pong", tiles: meldTiles });
  sortHand(human.hand);

  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.currentPlayer = 0;
  state.humanMustDiscard = true;

  logAction(0, "pong", meldTiles);
  refreshHumanActions();
  renderAll();
}

function claimKong() {
  if (!state.waitingClaim || !state.claimOptions?.kong) return;
  clearIppatsuForAll();
  const tile = state.claimTile;
  const human = state.players[0];
  const take = takeTilesFromHandByBase(human.hand, [tile, tile, tile]);
  if (!take || take.length !== 3) {
    passClaim();
    return;
  }
  const meldTiles = [tile, ...take];
  human.melds.push({ type: "kong_open", tiles: meldTiles });

  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.currentPlayer = 0;

  logAction(0, "kong", meldTiles);

  const draw = state.ruleSet === "riichi_lite" ? drawRinshanTile() : drawLiveTile();
  if (draw === null) {
    endGameDraw();
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
  clearIppatsuForAll();
  const patterns = state.claimOptions?.chi || [];
  const pattern = patterns[patternIndex];
  if (!pattern) return;

  const tile = state.claimTile;
  const human = state.players[0];
  const need = pattern.filter((id) => baseTileId(id) !== baseTileId(tile));

  if (need.length !== 2) {
    passClaim();
    return;
  }
  if (!canTakeTilesFromHandByBase(human.hand, need)) {
    passClaim();
    return;
  }
  const removedTiles = takeTilesFromHandByBase(human.hand, need);
  if (!removedTiles || removedTiles.length !== 2) {
    passClaim();
    return;
  }
  const meldTiles = [tile, ...removedTiles].sort((a, b) => {
    const ba = baseTileId(a);
    const bb = baseTileId(b);
    if (ba !== bb) return ba - bb;
    if (isAkaTileId(a) !== isAkaTileId(b)) return isAkaTileId(a) ? -1 : 1;
    return a - b;
  });
  human.melds.push({ type: "chi", tiles: meldTiles });
  sortHand(human.hand);

  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.currentPlayer = 0;
  state.humanMustDiscard = true;

  logAction(0, "chi", meldTiles);
  refreshHumanActions();
  renderAll();
}

function doConcealedKong(tile) {
  if (state.gameOver || state.currentPlayer !== 0 || !state.humanMustDiscard || state.waitingClaim) return;
  clearIppatsuForAll();
  const human = state.players[0];
  const counts = countTiles(human.hand);
  if (counts[tile] < 4) return;
  const removedTiles = takeTilesFromHandByBase(human.hand, [tile, tile, tile, tile]);
  if (!removedTiles || removedTiles.length !== 4) return;
  human.melds.push({ type: "kong_closed", tiles: removedTiles });

  const draw = state.ruleSet === "riichi_lite" ? drawRinshanTile() : drawLiveTile();
  if (draw === null) {
    endGameDraw();
    return;
  }

  if (state.ruleSet === "riichi_lite") {
    state.kanCount = Math.min(4, state.kanCount + 1);
    state.openDoraCount = Math.min(5, 1 + state.kanCount);
  }
  human.hand.push(draw);
  sortHand(human.hand);
  logAction(0, "concealedKong", [...removedTiles, draw]);

  state.lastDrawTile = draw;
  state.lastDrawFromDeadWall = state.ruleSet === "riichi_lite";
  state.humanMustDiscard = true;
  refreshHumanActions();
  renderAll();
}

function doAddedKong(tile) {
  if (state.gameOver || state.currentPlayer !== 0 || !state.humanMustDiscard || state.waitingClaim) return;
  clearIppatsuForAll();
  const human = state.players[0];
  if (!human || !Array.isArray(human.melds)) return;

  const t = baseTileId(tile);
  const meld = human.melds.find((m) => m && m.type === "pong" && Array.isArray(m.tiles) && m.tiles.length === 3 && baseTileId(m.tiles[0]) === t);
  if (!meld) return;
  const removedTiles = takeTilesFromHandByBase(human.hand, [t]);
  if (!removedTiles || removedTiles.length !== 1) return;

  meld.type = "kong_open";
  meld.tiles.push(removedTiles[0]);

  logAction(0, "kong", meld.tiles.slice());

  const draw = state.ruleSet === "riichi_lite" ? drawRinshanTile() : drawLiveTile();
  if (draw === null) {
    endGameDraw();
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

function renderTingInfo() {
  if (!el.tingInfo) return;
  const human = state.players[0];
  if (!human) {
    el.tingInfo.textContent = tr("tingDash");
    return;
  }

  if (state.gameOver) {
    if (state.lastResult?.ok && state.lastTingInfoHtml) {
      el.tingInfo.innerHTML = state.lastTingInfoHtml;
    } else {
      el.tingInfo.textContent = tr("tingEnd");
    }
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

    const html = rows.join("");
    el.tingInfo.innerHTML = html;
    if (wins.length > 0) state.lastTingInfoHtml = html;
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

  const html = rows.join("");
  el.tingInfo.innerHTML = html;
  if (wins.length > 0) state.lastTingInfoHtml = html;
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
      const doraText = doraTile !== null
        ? `${tr("doraOpen")}: ${tileHtml(head, "tiny")} -> ${tileHtml(doraTile, "tiny")}`
        : "";
      el.riichiInfo.innerHTML = `${escapeHtml(status)}${doraText ? ` | <span class="riichi-dora-inline">${doraText}</span>` : ""}`;
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
  if (state.gameOver && state.lastResult?.ok && state.lastWaitValueInfoHtml) {
    el.waitValueInfo.innerHTML = state.lastWaitValueInfoHtml;
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
    const html = `<div class="ting-row">${tr("waitValuePending")}</div><div class="wait-grid">${items.join("")}</div>`;
    el.waitValueInfo.innerHTML = html;
    if (items.length > 0) state.lastWaitValueInfoHtml = html;
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
  const box = `<div class="ting-row">${tr("waitValueTitle")}</div><div class="wait-grid">${html}</div>`;
  el.waitValueInfo.innerHTML = box;
  if (rows.length > 0) state.lastWaitValueInfoHtml = box;
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
  const hanFuWithLimit = `${tr("resultHanFu", { han: r.han, fu: r.fu })}${r.limitName ? ` ${localizeLimitName(r.limitName)}` : ""}`;
  const winTypeText = r.winType === "ron" ? tr("resultMetaWinRon") : tr("resultMetaWinTsumo");
  const riichiText = r.riichi ? tr("resultMetaRiichiOn") : tr("resultMetaRiichiOff");
  const winTile = r.winTile === null || r.winTile === undefined ? "-" : tileHtml(r.winTile, "large");
  const doraIndicators = getOpenedDoraIndicators();
  const doraChains = doraIndicators
    .map((ind) => `<span class="result-dora-chain">${tileHtml(ind, "tiny")}<span class="result-dora-arrow">-></span>${tileHtml(nextDoraFromIndicator(ind), "tiny")}</span>`)
    .join("");
  const showUra = !!state.lastResult?.ok && !!state.players[0]?.riichi;
  const uraIndicators = showUra ? getOpenedUraIndicators() : [];
  const uraChains = uraIndicators
    .map((ind) => `<span class="result-dora-chain">${tileHtml(ind, "tiny")}<span class="result-dora-arrow">-></span>${tileHtml(nextDoraFromIndicator(ind), "tiny")}</span>`)
    .join("");
  el.resultInfo.innerHTML = `
    <div class="result-grid">
      <div class="result-card result-card-main">
        <div class="result-title">${tr("resultTitle")}</div>
        <div class="result-line">${hanFuWithLimit}</div>
        <div class="result-line">${tr("resultPoints", { points: totalPoints })}</div>
        <div class="result-line">${tr("resultPointLabel", { label: pointLabel })}</div>
        <div class="result-line">${tr("resultYaku", { yaku: yakuText(r) })}</div>
      </div>
      <div class="result-card result-card-meta">
        <div class="result-meta-grid">
          <div class="result-meta-left">
            <div class="result-side-title">${tr("resultMetaTitle")}</div>
            <div class="result-badges">
              <span class="result-badge">${riichiText}</span>
              <span class="result-badge">${winTypeText}</span>
            </div>
            <div class="result-win-tile">
              <div class="result-win-label">${tr("resultMetaWinTile")}</div>
              <div class="result-win-tile-box">${winTile}</div>
            </div>
          </div>
          <div class="result-meta-right">
            <div class="result-dora-row">
              <span class="result-dora-label">${tr("doraOpen")}</span>
              <span class="result-dora-list">${doraChains || "-"}</span>
            </div>
            <div class="result-dora-row">
              <span class="result-dora-label">${tr("uraOpen")}</span>
              <span class="result-dora-list">${uraChains || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRoundStatePanel() {
  if (!el.roundStatePanel) return;
  const prog = getWallProgress();
  const remainPct = Math.max(0, Math.min(100, prog.total > 0 ? (prog.remain / prog.total) * 100 : 0));
  const lowClass = remainPct <= 20 ? " low" : "";
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
      <div class="wall-track"><div class="wall-fill${lowClass}" style="width:${remainPct.toFixed(1)}%"></div></div>
      ${extra}
    </div>
  `;
}

function formatDelta(d) {
  if (!d) return "0";
  return d > 0 ? `+${d}` : String(d);
}

function renderRiichiScoreboard() {
  if (!el.riichiScoreboard) return;
  if (state.ruleSet !== "riichi_lite") {
    el.riichiScoreboard.innerHTML = "";
    return;
  }
  const scores = state.scores || [0, 0, 0, 0];
  const deltas = state.lastScoreDelta || [0, 0, 0, 0];
  const baseScore = 25000;
  const total = scores.reduce((a, b) => a + (b || 0), 0);
  const withKyotaku = total + (state.kyotaku || 0) * 1000;
  const curIdx = getRoundStepIndex(state.roundWind, state.kyoku);
  const playerNames = [0, 1, 2, 3].map((i) => playerShortName(i));

  const scoreCards = [0, 1, 2, 3].map((i) => `
      <div class="sb-score-card">
        <div class="sb-name">${escapeHtml(playerNames[i])}</div>
        <div class="sb-score">${scores[i] || 0}</div>
      <div class="sb-delta ${(scores[i] - baseScore) > 0 ? "pos" : (scores[i] - baseScore) < 0 ? "neg" : ""}">${formatDelta((scores[i] || 0) - baseScore)}</div>
      <div class="sb-delta-sub ${deltas[i] > 0 ? "pos" : deltas[i] < 0 ? "neg" : ""}">本局 ${formatDelta(deltas[i] || 0)}</div>
    </div>
  `).join("");

  const overviewRows = [];
  for (let step = 0; step < 8; step += 1) {
    const rw = step < 4 ? "E" : "S";
    const ky = (step % 4) + 1;
    const dealer = step % 4;
    const rowCells = [0, 1, 2, 3].map((i) => {
      const seat = windLabelByLetter(windLetterByOffset((i - dealer + 4) % 4));
      const cls = i === dealer ? "dealer" : "";
      return `<td class="${cls}">${seat}</td>`;
    }).join("");
    overviewRows.push(`<tr class="${step === curIdx ? "current" : ""}"><td>${roundLabelByState(rw, ky)}局</td>${rowCells}</tr>`);
  }

  const finishedRows = (state.hanchanLedger || []).slice(-24).reverse().map((x) => {
    const result = x.resultType === "tsumo" ? tr("sbResultTsumo") : x.resultType === "ron" ? tr("sbResultRon") : tr("sbResultDraw");
    const drawWaitsInline = (x.resultType === "draw" && Array.isArray(x.tenpaiDetail))
      ? x.tenpaiDetail
        .map((d) => (d.waits || []).slice(0, 6).map((id) => tileHtml(id, "tiny")).join(""))
        .filter((s) => !!s)
        .join("")
      : "";

    const drawHandInline = (x.resultType === "draw" && Array.isArray(x.tenpaiDetail))
      ? x.tenpaiDetail.map((d) => {
        const closed = (d.hand || []).map((id) => tileHtml(id, "tiny")).join("");
        const melds = (d.melds || []).map((g) => `<span class="sb-meld-group">${(g || []).map((id) => tileHtml(id, "tiny")).join("")}</span>`).join("");
        return `<div class="sb-draw-hand-line">${closed}${melds ? `<span class="sb-draw-hand-melds">${melds}</span>` : ""}</div>`;
      }).join("")
      : "";

    const winHandClosedHtml = (x.winHand || []).map((id) => tileHtml(id, "tiny")).join("");
    const winMeldHtml = (x.winMelds || []).map((g) => `<span class="sb-meld-group">${(g || []).map((id) => tileHtml(id, "tiny")).join("")}</span>`).join("");
    const winHandAllHtml = `${winHandClosedHtml}${winMeldHtml ? `<span class="sb-inline-melds">${winMeldHtml}</span>` : ""}`;
    const winHandHtml =
      (x.resultType === "ron" || x.resultType === "tsumo")
        ? `<div class="sb-hand-one-line">${winHandAllHtml || (Number.isInteger(x.winTile) ? tileHtml(x.winTile, "tiny") : "")}</div>`
        : "";
    const typeBadge = (x.resultType === "ron" || x.resultType === "tsumo")
      ? `<span class="sb-win-hand">${winHandHtml}</span>`
      : `<span class="sb-type-badge draw">${escapeHtml(tr("sbResultDraw"))}</span>${drawHandInline ? `<span class="sb-draw-hands">${drawHandInline}</span>` : ""}${drawWaitsInline ? `<span class="sb-draw-waits">${drawWaitsInline}</span>` : ""}`;

    let winnerHtml = "-";
    if (x.resultType === "draw") {
      const details = Array.isArray(x.tenpaiDetail) ? x.tenpaiDetail : [];
      if (details.length > 0) {
        const lineA = details.map((d) => {
          const closed = (d.hand || []).map((id) => tileHtml(id, "tiny")).join("");
          const melds = (d.melds || []).map((g) => `<span class="sb-meld-group">${(g || []).map((id) => tileHtml(id, "tiny")).join("")}</span>`).join("");
          return `<div class="sb-draw-hand-line">${closed}${melds ? `<span class="sb-draw-hand-melds">${melds}</span>` : ""}</div>`;
        }).join("");
        const lineB = details.map((d) => {
          const p = Number(d.player);
          const dd = (x.delta || [])[p] || 0;
          const waits = (d.waits || []).slice(0, 6).map((id) => tileHtml(id, "tiny")).join("");
          return `<div class="sb-tenpai-line"><span>${escapeHtml(playerShortName(p))}</span><span class="sb-winner-delta ${dd > 0 ? "pos" : dd < 0 ? "neg" : ""}">${formatDelta(dd)}</span>${waits ? `<span class="sb-draw-waits">${waits}</span>` : ""}</div>`;
        }).join("");
        winnerHtml = `<div class="sb-info-cell"><div class="sb-line-a">${lineA}</div><div class="sb-line-b">${lineB}</div></div>`;
      }
    } else if (Number.isInteger(x.winner)) {
      const wd = (x.delta || [])[x.winner] || 0;
      const winTileIcon = Number.isInteger(x.winTile) ? tileHtml(x.winTile, "tiny") : "";
      winnerHtml = `<div class="sb-info-cell"><div class="sb-line-a">${typeBadge}</div><div class="sb-line-b sb-winner-line"><span>${escapeHtml(playerShortName(x.winner))}</span><span>${escapeHtml(result)}</span><span class="sb-winner-tile">${winTileIcon}</span><span class="sb-winner-delta ${wd > 0 ? "pos" : wd < 0 ? "neg" : ""}">${formatDelta(wd)}</span></div></div>`;
    }

    let fromHtml = "-";
    if (x.resultType === "ron") {
      if (Number.isInteger(x.loser)) {
        const d = (x.delta || [])[x.loser] || 0;
        fromHtml = `${escapeHtml(playerShortName(x.loser))}(ID:${x.loser}) ${formatDelta(d)}`;
      }
    } else {
      const lossLines = [];
      for (let i = 0; i < 4; i += 1) {
        const d = (x.delta || [])[i] || 0;
        if (d < 0) lossLines.push(`<div>${escapeHtml(playerShortName(i))}(ID:${i}) ${formatDelta(d)}</div>`);
      }
      fromHtml = lossLines.length > 0 ? lossLines.join("") : "-";
    }

    const honbaText = (x.honba || 0) > 0 ? ` ${x.honba}本` : "";
    if (x.resultType === "draw" && winnerHtml === "-") {
      winnerHtml = `<div class="sb-info-cell"><div class="sb-line-a">${typeBadge}</div><div class="sb-line-b">-</div></div>`;
    }
    let resultHtml = escapeHtml(result);
    if (x.resultType !== "draw" && x.settle) {
      const settle = x.settle;
      const yakuLine = Array.isArray(settle.yaku) ? yakuText({ yaku: settle.yaku }) : "-";
      const hanFuWithLimit = `${tr("resultHanFu", { han: settle.han || 0, fu: settle.fu || 0 })}${settle.limitName ? ` ${localizeLimitName(settle.limitName)}` : ""}`;
      resultHtml = `<div class="sb-result-lines">
        <div>${escapeHtml(tr("resultTitle"))}</div>
        <div>${escapeHtml(hanFuWithLimit)}</div>
        <div>${escapeHtml(tr("resultPoints", { points: settle.points || 0 }))}</div>
        <div>${escapeHtml(tr("resultPointLabel", { label: settle.pointLabel || "-" }))}</div>
        <div>${escapeHtml(tr("resultYaku", { yaku: yakuLine }))}</div>
      </div>`;
    }
    return `<tr><td>${escapeHtml(x.roundLabel)}${honbaText}</td><td>${winnerHtml}</td><td class="sb-from-cell">${fromHtml}</td><td class="sb-result-cell">${resultHtml}</td></tr>`;
  }).join("");

  el.riichiScoreboard.innerHTML = `
    <div class="riichi-scoreboard-panel">
      <h3>${tr("sbTitle")}</h3>
      <div class="sb-meta">${tr("sbCurrent")} | ${tr("sbCheck")}: ${total} | ${tr("sbCheck")}+${tr("sbKyotaku")}: ${withKyotaku} | ${tr("sbKyotaku")}: ${state.kyotaku}</div>
      <div class="sb-score-grid">${scoreCards}</div>
    </div>
    <div class="riichi-scoreboard-panel">
      <h3>${tr("sbOverview")}</h3>
      <table class="sb-table">
        <thead><tr><th>${tr("sbColRound")}</th><th>${escapeHtml(playerNames[0])}</th><th>${escapeHtml(playerNames[1])}</th><th>${escapeHtml(playerNames[2])}</th><th>${escapeHtml(playerNames[3])}</th></tr></thead>
        <tbody>${overviewRows.join("")}</tbody>
      </table>
    </div>
    <div class="riichi-scoreboard-panel">
      <h3>${tr("sbFinished")}</h3>
      <table class="sb-table sb-finished-table">
        <thead><tr><th>${tr("sbColRound")}</th><th>${tr("sbColWinner")}</th><th>${tr("sbColFrom")}</th><th>${tr("sbColResult")}</th></tr></thead>
        <tbody>${finishedRows || `<tr><td colspan="4">-</td></tr>`}</tbody>
      </table>
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

if (el.tobiEndToggle) {
  el.tobiEndToggle.addEventListener("change", (e) => {
    state.tobiEndEnabled = !!e.target.checked;
    try {
      localStorage.setItem("mahjong_tobi_end", state.tobiEndEnabled ? "1" : "0");
    } catch (_) {
      // ignore storage failures
    }
  });
}

initTobiRule();
syncAutoToggles();
el.newGameBtn.addEventListener("click", initGame);
initTheme();
initLang();
initRuleSet();
startClock();
initGame();
