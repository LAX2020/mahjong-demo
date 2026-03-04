const HANZI_NUM = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const WINDS = ["东", "南", "西", "北"];
const DRAGONS = ["中", "發", "白"];

const state = {
  players: [],
  wall: [],
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
  logEntries: [],
  logCounter: 0,
  currentRoundLogId: null,
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
  hand: document.getElementById("hand"),
  handActionsCol: document.getElementById("handActionsCol"),
  actionBar: document.getElementById("actionBar"),
  kongBar: document.getElementById("kongBar"),
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
    resultPoints: "得点: {points}",
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
    actionAdviceRec: "推荐",
    actionAdviceOk: "中立",
    actionAdviceNo: "谨慎",
    actionAdviceFmt: "{label} 速{speed} 价{value}",
    actionReasonHu: "当前可直接和牌, 优先和了。",
    actionReasonPass: "保留门清与立直路线, 价值更稳定。",
    actionReasonPassBasic: "保留手牌弹性, 继续摸牌通常更稳。",
    actionReasonCallFast: "副露可提速, 更快进入可和状态。",
    actionReasonCallValue: "副露会损失部分打点潜力。",
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
    resultPoints: "Points: {points}",
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
    actionAdviceRec: "Recommended",
    actionAdviceOk: "Neutral",
    actionAdviceNo: "Caution",
    actionAdviceFmt: "{label} S{speed} V{value}",
    actionReasonHu: "You can win now. Prioritize winning.",
    actionReasonPass: "Keeps menzen and riichi routes for stable value.",
    actionReasonPassBasic: "Keeps hand flexibility and stable progression.",
    actionReasonCallFast: "Call speeds up hand progression.",
    actionReasonCallValue: "Open call reduces some value potential.",
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
    actionAdviceRec: "推奨",
    actionAdviceOk: "中立",
    actionAdviceNo: "慎重",
    actionAdviceFmt: "{label} 速{speed} 価{value}",
    actionReasonHu: "今すぐ和了可能. 和了優先。",
    actionReasonPass: "門前と立直ルートを維持し, 価値が安定。",
    actionReasonPassBasic: "手牌の柔軟性を維持し, 進行を安定。",
    actionReasonCallFast: "副露で速度が上がりやすい。",
    actionReasonCallValue: "副露で打点期待が一部下がる。",
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
      const eventText = row.textKey ? tr(row.textKey, row.textVars || {}) : row.text || "";
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

function drawTile() {
  return state.wall.pop() ?? null;
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

function evaluateDiscardCandidate(hand14, discard, meldCount, hasOpenMeld, memoWins, mode = "riichi_lite") {
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
  const doraTile = state.doraIndicator !== null ? nextDoraFromIndicator(state.doraIndicator) : -1;
  const doraCount = doraTile >= 0 ? next13.filter((t) => t === doraTile).length : 0;

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
    speedScore: finalSpeedScore,
    valueScore: finalValueScore,
  };
}

function getDiscardAdvice(hand, melds, mode = "riichi_lite", restrictDiscards = null) {
  const meldCount = melds.length;
  const hasOpenMeld = melds.some((m) => m.type === "chi" || m.type === "pong" || m.type === "kong_open");
  const restrict = restrictDiscards ? new Set(restrictDiscards) : null;
  const seen = new Set();
  const candidates = [];
  const memoWins = new Map();
  for (const d of hand) {
    if (seen.has(d)) continue;
    seen.add(d);
    if (restrict && !restrict.has(d)) continue;
    candidates.push(evaluateDiscardCandidate(hand, d, meldCount, hasOpenMeld, memoWins, mode));
  }
  if (candidates.length === 0) return null;

  const fast = candidates.slice().sort((a, b) => b.speedScore - a.speedScore || b.ukeire - a.ukeire || a.discard - b.discard)[0];
  const value = candidates.slice().sort((a, b) => b.valueScore - a.valueScore || b.speedScore - a.speedScore || a.discard - b.discard)[0];
  return { fast, value };
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

function evaluateCallAction(type, baseHand, melds, claimTile, pattern = null, mode = "riichi_lite") {
  const hand = baseHand.slice();
  const removeList = [];
  if (type === "pong") removeList.push(claimTile, claimTile);
  if (type === "kong") removeList.push(claimTile, claimTile, claimTile);
  if (type === "chi" && pattern) {
    const need = pattern.filter((id) => id !== claimTile).slice(0, 2);
    removeList.push(...need);
  }

  for (const t of removeList) {
    const i = hand.indexOf(t);
    if (i < 0) return { speed: -999, value: -999, reason: tr("actionReasonCallValue") };
    hand.splice(i, 1);
  }

  let nextMeldType = "chi";
  if (type === "pong") nextMeldType = "pong";
  if (type === "kong") nextMeldType = "kong_open";
  const nextMelds = [...melds, { type: nextMeldType, tiles: [] }];

  let speed = -999;
  let value = -999;
  if (type === "kong") {
    const counts = countTiles(hand);
    let weightedSpeed = 0;
    let weightedValue = 0;
    let totalW = 0;
    for (let d = 0; d < 34; d += 1) {
      const avail = Math.max(0, 4 - counts[d]);
      if (avail === 0) continue;
      const handAfterDraw = hand.slice();
      handAfterDraw.push(d);
      const adv = getDiscardAdvice(handAfterDraw, nextMelds, mode);
      if (!adv) continue;
      weightedSpeed += adv.fast.speedScore * avail;
      weightedValue += adv.value.valueScore * avail;
      totalW += avail;
    }
    if (totalW > 0) {
      speed = weightedSpeed / totalW;
      value = weightedValue / totalW - 12;
    }
  } else {
    const adv = getDiscardAdvice(hand, nextMelds, mode);
    if (adv) {
      speed = adv.fast.speedScore;
      value = adv.value.valueScore - 10;
    }
  }
  const reason = speed > value ? tr("actionReasonCallFast") : tr("actionReasonCallValue");
  return { speed, value, reason };
}

function buildClaimActionHints(options, claimTile, mode = "riichi_lite") {
  const human = state.players[0];
  const evalu = [];
  const basePass = evaluatePassAction(human.hand, human.melds, mode);
  evalu.push({ key: "pass", speed: basePass.speed, value: basePass.value, reason: basePass.reason });

  if (options.pong) {
    const e = evaluateCallAction("pong", human.hand, human.melds, claimTile, null, mode);
    evalu.push({ key: "pong", speed: e.speed, value: e.value, reason: e.reason });
  }
  if (options.kong) {
    const e = evaluateCallAction("kong", human.hand, human.melds, claimTile, null, mode);
    evalu.push({ key: "kong", speed: e.speed, value: e.value, reason: e.reason });
  }
  if (options.chi?.length) {
    options.chi.forEach((p, idx) => {
      const e = evaluateCallAction("chi", human.hand, human.melds, claimTile, p, mode);
      evalu.push({ key: `chi_${idx}`, speed: e.speed, value: e.value, reason: e.reason });
    });
  }
  if (options.hu) {
    evalu.push({ key: "hu", speed: 9999, value: 9999, reason: tr("actionReasonHu") });
  }

  const withCombined = evalu.map((x) => ({ ...x, combined: x.speed * 0.58 + x.value * 0.42 }));
  const best = withCombined.reduce((a, b) => (a.combined >= b.combined ? a : b), withCombined[0]);

  const out = {};
  withCombined.forEach((x) => {
    let label = tr("actionAdviceOk");
    if (x.key === "hu") label = tr("actionAdviceRec");
    else if (x.combined >= best.combined - 6) label = tr("actionAdviceRec");
    else if (x.combined <= best.combined - 22) label = tr("actionAdviceNo");
    out[x.key] = `${tr("actionAdviceFmt", { label, speed: Math.round(x.speed), value: Math.round(x.value) })} · ${x.reason}`;
  });
  return out;
}

function distLabel(dist) {
  if (dist === 0) return tr("adviceDist0");
  if (dist === 1) return tr("adviceDist1");
  return tr("adviceDist2");
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
    riichi: false,
    riichiDiscardIndex: -1,
  }));
  state.wall = makeWall();
  state.currentPlayer = 0;
  state.gameOver = false;
  state.waitingClaim = false;
  state.claimTile = null;
  state.claimFrom = null;
  state.claimOptions = null;
  state.humanMustDiscard = false;
  state.pendingRiichi = false;
  state.riichiDiscardCandidates = [];
  state.lastResult = null;
  clearLog();

  for (let r = 0; r < 13; r += 1) {
    for (let p = 0; p < 4; p += 1) {
      state.players[p].hand.push(drawTile());
    }
  }
  for (const p of state.players) sortHand(p.hand);

  state.players[0].hand.push(drawTile());
  sortHand(state.players[0].hand);
  state.humanMustDiscard = true;
  state.doraIndicator = drawTile();
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
  if (canHu(hand, meldCount)) return true;
  if (state.ruleSet === "riichi_lite") {
    if (canChiitoitsu(hand, meldCount)) return true;
    if (canKokushi(hand, meldCount)) return true;
  }
  return false;
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
  const hasOpen = player.melds.some((m) => m.type === "chi" || m.type === "pong" || m.type === "kong_open");
  const isChiitoi = canChiitoitsu(handWithWin, player.melds.length);
  const isKokushi = canKokushi(handWithWin, player.melds.length);
  const isRegular = canHu(handWithWin, player.melds.length);
  if (!isRegular && !isChiitoi && !isKokushi) return { ok: false };

  if (isKokushi) {
    const yaku = ["Kokushi Musou"];
    if (player.riichi) yaku.push("Riichi");
    return { ok: true, han: 13, fu: 0, points: winType === "tsumo" ? 16000 : 32000, yaku, winType, winTile };
  }

  const structure = isRegular ? findWinningStructure(handWithWin, player.melds.length) : null;
  if (!structure && !isChiitoi) return { ok: false };

  let han = 0;
  let fu = isChiitoi ? 25 : 20;
  const yaku = [];
  let baseYakuHan = 0;
  const addYaku = (name, h) => {
    han += h;
    baseYakuHan += h;
    yaku.push(name);
  };

  if (player.riichi) {
    addYaku("Riichi", 1);
  }
  if (!hasOpen && winType === "tsumo") {
    addYaku("Menzen Tsumo", 1);
  }

  const allTiles = getAllTilesForScore(player, handWithWin);
  const allNoTH = allTiles.every((t) => t < 27 && !isTerminalOrHonor(t));
  if (allNoTH) {
    addYaku("Tanyao", 1);
  }

  const counts = countTiles(allTiles);
  if (counts[31] >= 3) addYaku("Yakuhai Chun", 1);
  if (counts[32] >= 3) addYaku("Yakuhai Hatsu", 1);
  if (counts[33] >= 3) addYaku("Yakuhai Haku", 1);

  if (isChiitoi) {
    addYaku("Chiitoitsu", 2);
  } else {
    const closedMelds = structure.melds;
    const allMelds = [...closedMelds, ...player.melds.map((m) => ({ type: m.type === "chi" ? "sequence" : "triplet", tiles: m.tiles }))];
    const onlySeq = allMelds.every((m) => m.type === "sequence");
    const pairTile = structure.pair;
    const pairValue = pairTile >= 31 && pairTile <= 33;
    if (!hasOpen && onlySeq && !pairValue && !isTerminalOrHonor(pairTile)) addYaku("Pinfu", 1);

    if (allMelds.every((m) => m.type === "triplet")) addYaku("Toitoi", 2);
    if (closedMelds.filter((m) => m.type === "triplet").length >= 3) addYaku("Sanankou", 2);

    const dragonTriplets = [31, 32, 33].filter((d) => counts[d] >= 3).length;
    if (dragonTriplets >= 2 && pairTile >= 31 && pairTile <= 33) addYaku("Shousangen", 2);

    const seqKeys = allMelds
      .filter((m) => m.type === "sequence")
      .map((m) => m.tiles[0]);
    // Sanshoku doujun
    for (let n = 0; n <= 6; n += 1) {
      if (seqKeys.includes(n) && seqKeys.includes(9 + n) && seqKeys.includes(18 + n)) {
        addYaku("Sanshoku Doujun", hasOpen ? 1 : 2);
        break;
      }
    }
    // Ittsuu
    for (let s = 0; s < 3; s += 1) {
      const b = s * 9;
      if (seqKeys.includes(b) && seqKeys.includes(b + 3) && seqKeys.includes(b + 6)) {
        addYaku("Ittsuu", hasOpen ? 1 : 2);
        break;
      }
    }
    // Iipeikou / Ryanpeikou
    if (!hasOpen) {
      const map = new Map();
      closedMelds
        .filter((m) => m.type === "sequence")
        .forEach((m) => map.set(m.tiles[0], (map.get(m.tiles[0]) || 0) + 1));
      const pairSeq = [...map.values()].filter((v) => v >= 2).length;
      if (pairSeq >= 2) addYaku("Ryanpeikou", 3);
      else if (pairSeq === 1) addYaku("Iipeikou", 1);
    }
  }

  // Honitsu / Chinitsu
  const suitHas = [0, 0, 0];
  let honorHas = 0;
  allTiles.forEach((t) => {
    if (t <= 8) suitHas[0] += 1;
    else if (t <= 17) suitHas[1] += 1;
    else if (t <= 26) suitHas[2] += 1;
    else honorHas += 1;
  });
  const suitsUsed = suitHas.filter((x) => x > 0).length;
  if (suitsUsed === 1 && honorHas === 0) addYaku("Chinitsu", hasOpen ? 5 : 6);
  else if (suitsUsed === 1 && honorHas > 0) addYaku("Honitsu", hasOpen ? 2 : 3);

  if (baseYakuHan <= 0) return { ok: false, reason: "no_yaku" };

  if (!isChiitoi) {
    const closedMelds = structure.melds;
    const allMelds = [...closedMelds, ...player.melds.map((m) => ({ type: m.type === "chi" ? "sequence" : "triplet", tiles: m.tiles }))];
    const pairTile = structure.pair;
    const pairValue = pairTile >= 31 && pairTile <= 33;
    if (!hasOpen && winType === "ron") fu += 10;
    if (pairValue) fu += 2;
    allMelds.forEach((m) => {
      if (m.type !== "triplet") return;
      const t = m.tiles[0];
      const terminal = isTerminalOrHonor(t);
      fu += terminal ? 8 : 4;
    });
    fu = Math.ceil(fu / 10) * 10;
  }

  let dora = 0;
  if (state.doraIndicator !== null) {
    const doraTile = nextDoraFromIndicator(state.doraIndicator);
    dora = allTiles.filter((t) => t === doraTile).length;
  }
  if (dora > 0) {
    han += dora;
    yaku.push(`Dora x${dora}`);
  }

  let basePoints = fu * Math.pow(2, han + 2);
  // Basic riichi limits.
  if (han >= 13) basePoints = 8000;
  else if (han >= 11) basePoints = 6000;
  else if (han >= 8) basePoints = 4000;
  else if (han >= 6) basePoints = 3000;
  else if (han >= 5 || basePoints >= 2000) basePoints = 2000;
  const points = winType === "tsumo" ? Math.ceil((basePoints * 2) / 100) * 100 : Math.ceil((basePoints * 4) / 100) * 100;
  return { ok: true, han, fu, points, yaku, winType, winTile };
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
  if (!canHu(hand, player.melds.length)) return false;
  if (state.ruleSet !== "riichi_lite") return true;
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

function refreshHumanActions() {
  el.actionBar.innerHTML = "";
  el.kongBar.innerHTML = "";
  if (el.handActionsCol) el.handActionsCol.classList.remove("active");

  if (state.gameOver) return;

  const human = state.players[0];
  if (state.currentPlayer === 0 && canPlayerWinNow(human, "tsumo")) {
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
      el.actionBar.appendChild(actionItem(actionButton(tr("ron"), [state.claimTile], () => claimHu()), hints.hu || ""));
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

  if (el.handActionsCol) {
    const hasAny = el.actionBar.children.length > 0 || el.kongBar.children.length > 0;
    el.handActionsCol.classList.toggle("active", hasAny);
  }
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
  }

  if (state.wall.length === 0) {
    endGame(tr("logWallEmpty"));
    return;
  }

  if (playerIdx === 0) {
    if (needDraw) {
      const tile = drawTile();
      state.players[0].hand.push(tile);
      sortHand(state.players[0].hand);
    }

    state.humanMustDiscard = true;
    state.waitingClaim = false;

    // Riichi locked state: auto tsumogiri unless tsumo is available.
    const human = state.players[0];
    if (state.ruleSet === "riichi_lite" && human.riichi && !state.pendingRiichi) {
      if (canPlayerWinNow(human, "tsumo")) {
        finalizeHumanTsumo();
        return;
      }
      const lastTile = human.hand[human.hand.length - 1];
      if (lastTile !== undefined) {
        human.hand.pop();
        human.discards.push(lastTile);
        logAction(0, "discardTo", [lastTile], "riichi", true);
        state.humanMustDiscard = false;
        processDiscard(0, lastTile);
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

    if (needDraw) {
      const tile = drawTile();
      if (tile === null) {
        endGame(tr("logWallEmpty"));
        return;
      }
      bot.hand.push(tile);
      sortHand(bot.hand);
    }

    if (canPlayerWinNow(bot, "tsumo")) {
      endGame(tr("logBotWin", { name: bot.name }));
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
    logAction(0, "ron", [tile]);
    endGame(tr("logRon", { tile: tileLabel(tile) }));
  }
}

function finalizeHumanTsumo() {
  const human = state.players[0];
  if (state.ruleSet === "riichi_lite") {
    const r = evaluateRiichiLiteWin(human, human.hand.slice(), "tsumo");
    if (!r.ok) return;
    state.lastResult = r;
  } else {
    state.lastResult = null;
  }
  logAction(0, "selfDraw");
  endGame(tr("logTsumo"));
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

  const draw = drawTile();
  if (draw === null) {
    endGame(tr("logWallEmpty"));
    return;
  }

  human.hand.push(draw);
  sortHand(human.hand);
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

  const draw = drawTile();
  if (draw === null) {
    endGame(tr("logWallEmpty"));
    return;
  }

  human.hand.push(draw);
  sortHand(human.hand);
  logAction(0, "concealedKong", [tile, tile, tile, tile, draw]);

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
      const doraTile = state.doraIndicator !== null ? nextDoraFromIndicator(state.doraIndicator) : null;
      const doraText = doraTile !== null ? tr("doraInfo", { ind: tileLabel(state.doraIndicator), dora: tileLabel(doraTile) }) : "";
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
      el.expectInfo.textContent = tr("expectNow", { han: r.han, yaku: r.yaku.join(", ") || "-" });
      return;
    }
  }
  const best = estimateMaxHanPotential(human);
  if (best) {
    el.expectInfo.textContent = tr("expectMax", { han: best.han, yaku: best.yaku.join(", ") || "-" });
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
        if (r.ok && r.points > best) best = r.points;
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
      return { wait: w, han: r.han, fu: r.fu, points: r.points };
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
  el.resultInfo.innerHTML = `
    <div class="result-card">
      <div class="result-title">${tr("resultTitle")}</div>
      <div class="result-line">${tr("resultHanFu", { han: r.han, fu: r.fu })}</div>
      <div class="result-line">${tr("resultPoints", { points: r.points })}</div>
      <div class="result-line">${tr("resultYaku", { yaku: r.yaku.join(", ") || "-" })}</div>
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
    return `
      <div class="advice-card">
        <div class="advice-title">${title}</div>
        <div class="advice-line">${tr("adviceDiscard")} ${tileHtml(data.discard, "small")}</div>
        <div class="advice-line">${tr("adviceMetricSpeed", { dist: distLabel(data.dist), ukeire: data.ukeire, waits: data.waits.length })}</div>
        <div class="advice-line">${tr("adviceMetricValue", { value: data.valueScore.toFixed(1), speed: data.speedScore.toFixed(1) })}</div>
        <div class="advice-line">${tr("waitFor")} ${waitsHtml}</div>
        <div class="advice-line">${reason}</div>
      </div>
    `;
  };

  const fastReason = advice.fast.dist === 0 ? tr("adviceReasonFast0") : tr("adviceReasonFast1");
  if (state.ruleSet === "basic") {
    el.adviceInfo.innerHTML = `
      <div class="ting-row">${tr("adviceHeaderBasic")}</div>
      <div class="advice-grid">
        <div class="advice-card">
          <div class="advice-title">${tr("adviceFast")}</div>
          <div class="advice-line">${tr("adviceDiscard")} ${tileHtml(advice.fast.discard, "small")}</div>
          <div class="advice-line">${tr("adviceMetricSpeed", {
            dist: distLabel(advice.fast.dist),
            ukeire: advice.fast.ukeire,
            waits: advice.fast.waits.length,
          })}</div>
          <div class="advice-line">${fastReason}</div>
        </div>
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

el.newGameBtn.addEventListener("click", initGame);
initTheme();
initLang();
initRuleSet();
startClock();
initGame();
