(function (global) {
  "use strict";

  function normalizeMode(mode) {
    return mode === "basic" ? "basic" : "riichi_lite";
  }

  function expectedPlayableLength(meldCount) {
    var needMelds = 4 - meldCount;
    if (needMelds < 0) return -1;
    return needMelds * 3 + 2;
  }

  function isPlayableHand(hand, meldCount) {
    return Array.isArray(hand) && hand.length === expectedPlayableLength(meldCount);
  }

  function generateDiscardActions(hand, restrictDiscards) {
    if (!Array.isArray(hand)) return [];
    var restrict = restrictDiscards ? new Set(restrictDiscards) : null;
    var seen = new Set();
    var out = [];
    for (var i = 0; i < hand.length; i += 1) {
      var t = hand[i];
      if (seen.has(t)) continue;
      seen.add(t);
      if (restrict && !restrict.has(t)) continue;
      out.push({ type: "discard", tile: t });
    }
    return out;
  }

  function transitionByDiscard(hand, tile) {
    if (!Array.isArray(hand)) return null;
    var i = hand.indexOf(tile);
    if (i < 0) return null;
    var next = hand.slice();
    next.splice(i, 1);
    return next;
  }

  function evaluateDiscardAdvice(input) {
    var hand = input.hand || [];
    var meldCount = input.meldCount || 0;
    var mode = normalizeMode(input.mode);
    var getWinningTiles = input.getWinningTiles;
    var evaluateWin = input.evaluateWin;
    var heuristic = input.heuristic || {};
    var restrictDiscards = input.restrictDiscards || null;

    if (typeof getWinningTiles !== "function" || typeof evaluateWin !== "function") return null;
    if (!isPlayableHand(hand, meldCount)) return null;
    return global.AdviceEngine.advise14({
      hand14: hand,
      meldCount: meldCount,
      mode: mode,
      restrictDiscards: restrictDiscards,
      heuristic: heuristic,
      getWinningTiles: getWinningTiles,
      evaluateWin: evaluateWin,
    });
  }

  function generateClaimActions(options, claimTile) {
    var out = [{ key: "pass", type: "pass", claimTile: claimTile }];
    if (!options) return out;
    if (options.hu) out.push({ key: "hu", type: "hu", claimTile: claimTile });
    if (options.kong) out.push({ key: "kong", type: "kong", claimTile: claimTile });
    if (options.pong) out.push({ key: "pong", type: "pong", claimTile: claimTile });
    if (Array.isArray(options.chi)) {
      for (var i = 0; i < options.chi.length; i += 1) {
        out.push({ key: "chi_" + i, type: "chi", claimTile: claimTile, pattern: options.chi[i], index: i });
      }
    }
    return out;
  }

  function transitionByCall(input) {
    var type = input.type;
    var baseHand = input.baseHand || [];
    var melds = input.melds || [];
    var claimTile = input.claimTile;
    var pattern = input.pattern || null;
    var hand = baseHand.slice();
    var removeList = [];
    if (type === "pong") removeList.push(claimTile, claimTile);
    if (type === "kong") removeList.push(claimTile, claimTile, claimTile);
    if (type === "chi" && pattern) {
      var need = pattern.filter(function (id) { return id !== claimTile; }).slice(0, 2);
      removeList = removeList.concat(need);
    }

    for (var i = 0; i < removeList.length; i += 1) {
      var t = removeList[i];
      var idx = hand.indexOf(t);
      if (idx < 0) return null;
      hand.splice(idx, 1);
    }

    var nextMeldType = "chi";
    if (type === "pong") nextMeldType = "pong";
    if (type === "kong") nextMeldType = "kong_open";
    var nextMelds = melds.concat([{ type: nextMeldType, tiles: [] }]);
    return { handAfterCall: hand, nextMelds: nextMelds };
  }

  global.DecisionEngine = {
    normalizeMode: normalizeMode,
    expectedPlayableLength: expectedPlayableLength,
    isPlayableHand: isPlayableHand,
    generateDiscardActions: generateDiscardActions,
    transitionByDiscard: transitionByDiscard,
    evaluateDiscardAdvice: evaluateDiscardAdvice,
    generateClaimActions: generateClaimActions,
    transitionByCall: transitionByCall,
  };
})(window);

