(function (global) {
  "use strict";

  function countTiles(tiles) {
    var c = new Array(34).fill(0);
    for (var i = 0; i < tiles.length; i += 1) c[tiles[i]] += 1;
    return c;
  }

  function calcUkeireForWaits(hand, waits) {
    var counts = countTiles(hand);
    return waits.reduce(function (sum, id) { return sum + Math.max(0, 4 - counts[id]); }, 0);
  }

  function isTerminalOrHonor(id) {
    if (id >= 27) return true;
    var r = id % 9;
    return r === 0 || r === 8;
  }

  function getNeighborCount(counts, id) {
    if (id < 0 || id > 33 || id >= 27) return 0;
    var base = Math.floor(id / 9) * 9;
    var pos = id - base;
    var n = 0;
    if (pos - 2 >= 0) n += counts[id - 2];
    if (pos - 1 >= 0) n += counts[id - 1];
    if (pos + 1 <= 8) n += counts[id + 1];
    if (pos + 2 <= 8) n += counts[id + 2];
    return n;
  }

  function getDiscardRoleCost(originCounts, discard) {
    var c = originCounts[discard];
    var cost = 0;
    if (c >= 3) cost += 38;
    else if (c === 2) cost += 18;

    if (discard < 27) {
      var nei = getNeighborCount(originCounts, discard);
      if (nei >= 3) cost += 18;
      else if (nei >= 1) cost += 8;
      else cost -= 10;
    } else {
      if (c === 1) cost -= 14;
      if (c >= 2) cost += 14;
    }
    return cost;
  }

  function getIsolatedCount(hand13) {
    var counts = countTiles(hand13);
    var isolated = 0;
    for (var id = 0; id < 34; id += 1) {
      var c = counts[id];
      if (c !== 1) continue;
      if (id >= 27) {
        isolated += 1;
      } else if (getNeighborCount(counts, id) === 0) {
        isolated += 1;
      }
    }
    return isolated;
  }

  function isYakuhaiTile(id, heuristic) {
    if (id < 27) return false;
    if (id >= 31 && id <= 33) return true;
    var seatWind = heuristic.seatWind || "E";
    var roundWind = heuristic.roundWind || "E";
    var wm = { E: 27, S: 28, W: 29, N: 30 };
    var seatTile = wm[seatWind] || 27;
    var roundTile = wm[roundWind] || 27;
    return id === seatTile || id === roundTile;
  }

  function isGuestWind(id, heuristic) {
    if (id < 27 || id > 30) return false;
    var seatWind = heuristic.seatWind || "E";
    var roundWind = heuristic.roundWind || "E";
    var wm = { E: 27, S: 28, W: 29, N: 30 };
    var seatTile = wm[seatWind] || 27;
    var roundTile = wm[roundWind] || 27;
    return id !== seatTile && id !== roundTile;
  }

  function getOrphanPriorityScore(discard, originCounts, heuristic, mode, routePlan) {
    var c = originCounts[discard] || 0;
    if (c >= 2) return -32;
    if (discard < 27) {
      if (c !== 1) return -8;
      var nei = getNeighborCount(originCounts, discard);
      var r = discard % 9;
      if (nei === 0) {
        if (r === 0 || r === 8) return 64; // 1/9 isolated
        if (r === 1 || r === 7) return 52; // 2/8 isolated
        return 40; // 3-7 isolated
      }
      // connected singletons are less urgent
      if (r === 0 || r === 8) return 24;
      if (r === 1 || r === 7) return 18;
      return 10;
    }

    // Honors
    if (c !== 1) return -12;
    if (isGuestWind(discard, heuristic)) return 78; // strongest cut priority

    // In basic mode, singleton honors are mostly speed-negative and should go early.
    if (mode === "basic") return 70;

    var yakuhai = isYakuhaiTile(discard, heuristic);
    if (!yakuhai) return 72;

    // In riichi-like mode keep singleton yakuhai a bit only when route truly supports it.
    var hasYakuhaiPair = false;
    for (var h = 27; h < 34; h += 1) {
      if (!isYakuhaiTile(h, heuristic)) continue;
      if ((originCounts[h] || 0) >= 2) {
        hasYakuhaiPair = true;
        break;
      }
    }
    if (routePlan && routePlan.tag === "yakuhai" && hasYakuhaiPair) return 38;
    return 66;
  }

  function getBlockProtectionPenalty(discard, originCounts, mode) {
    var c = originCounts[discard] || 0;
    if (c >= 3) return 90; // don't break triplets by default
    if (c === 2) return 46; // pair protection
    if (discard >= 27 || c !== 1) return 0;

    var nei = getNeighborCount(originCounts, discard);
    var left1 = discard - 1 >= 0 ? originCounts[discard - 1] : 0;
    var right1 = discard + 1 <= 33 ? originCounts[discard + 1] : 0;
    var left2 = discard - 2 >= 0 ? originCounts[discard - 2] : 0;
    var right2 = discard + 2 <= 33 ? originCounts[discard + 2] : 0;
    var gapPartners = (left2 > 0 ? 1 : 0) + (right2 > 0 ? 1 : 0);

    // strong protection for tiles inside complete/near-complete shapes.
    if (left1 > 0 && right1 > 0) return 54; // e.g. middle of 123/234
    if ((left2 > 0 && left1 > 0) || (right1 > 0 && right2 > 0)) return 44;
    // Kanchan-like gap taatsu (e.g. 24, 68) has clear improvement value; don't treat as pure orphan.
    if (gapPartners >= 2) return mode === "basic" ? 34 : 38;
    if (gapPartners === 1) return mode === "basic" ? 26 : 30;
    if (nei >= 2) return 28;
    if (nei === 1) return mode === "basic" ? 10 : 14;
    return 0;
  }

  function honorSingletonAdjust(discard, discardCount, heuristic, mode, routePlan, originCounts) {
    if (discard < 27 || discardCount !== 1) return { speed: 0, value: 0, route: "" };
    var seatWind = heuristic.seatWind || "E";
    var roundWind = heuristic.roundWind || "E";
    var wm = { E: 27, S: 28, W: 29, N: 30 };
    var seatTile = wm[seatWind] || 27;
    var roundTile = wm[roundWind] || 27;
    var inYakuhaiRoute = routePlan && routePlan.tag === "yakuhai";
    var hasYakuhaiPair =
      (originCounts[seatTile] || 0) >= 2 ||
      (originCounts[roundTile] || 0) >= 2 ||
      (originCounts[31] || 0) >= 2 ||
      (originCounts[32] || 0) >= 2 ||
      (originCounts[33] || 0) >= 2;

    if (mode === "basic") {
      if (discard >= 31 && discard <= 33) return { speed: 22, value: 10, route: "" };
      if (discard === seatTile && discard === roundTile) return { speed: 18, value: 6, route: "" };
      if (discard === seatTile || discard === roundTile) return { speed: 20, value: 8, route: "" };
      return { speed: 30, value: 14, route: "guest_wind_cut" };
    }

    if (discard >= 31 && discard <= 33) {
      var dragonSpeed = 12;
      var dragonValue = -2;
      if (inYakuhaiRoute && hasYakuhaiPair) {
        dragonSpeed -= 8;
        dragonValue -= 10;
      }
      return { speed: dragonSpeed, value: dragonValue, route: "" };
    }
    if (discard === seatTile && discard === roundTile) {
      var dwSpeed = 8;
      var dwValue = -8;
      if (inYakuhaiRoute && hasYakuhaiPair) {
        dwSpeed -= 6;
        dwValue -= 8;
      }
      return { speed: dwSpeed, value: dwValue, route: "" };
    }
    if (discard === seatTile || discard === roundTile) {
      var rwSpeed = 14;
      var rwValue = 0;
      if (inYakuhaiRoute && hasYakuhaiPair) {
        rwSpeed -= 6;
        rwValue -= 8;
      }
      return { speed: rwSpeed, value: rwValue, route: "" };
    }
    // Guest wind singleton should be the first honor to cut in most riichi situations.
    return { speed: 24, value: 10, route: "guest_wind_cut" };
  }

  function buildRoutePlan(next13, heuristic, meldCount, mode) {
    if (mode === "basic") return { tag: "basic_speed", score: 0, dominantSuit: -1 };
    var counts = countTiles(next13);
    var seatWind = heuristic.seatWind || "E";
    var roundWind = heuristic.roundWind || "E";
    var wm = { E: 27, S: 28, W: 29, N: 30 };
    var seatTile = wm[seatWind] || 27;
    var roundTile = wm[roundWind] || 27;

    var honorCount = 0;
    var terminalCount = 0;
    var nonTerminalCount = 0;
    var seqPotential = 0;
    var suitCounts = [0, 0, 0];
    for (var id = 0; id < 34; id += 1) {
      var c = counts[id];
      if (c <= 0) continue;
      if (id >= 27) {
        honorCount += c;
      } else {
        suitCounts[Math.floor(id / 9)] += c;
        if (isTerminalOrHonor(id)) terminalCount += c;
        else nonTerminalCount += c;
        if (getNeighborCount(counts, id) > 0) seqPotential += 1;
      }
    }

    var dragonPairs = 0;
    for (var d = 31; d <= 33; d += 1) if (counts[d] >= 2) dragonPairs += 1;
    var yakuhaiPairs = (counts[seatTile] >= 2 ? 1 : 0) + (counts[roundTile] >= 2 ? 1 : 0) + dragonPairs;
    var dominantSuit = 0;
    if (suitCounts[1] > suitCounts[dominantSuit]) dominantSuit = 1;
    if (suitCounts[2] > suitCounts[dominantSuit]) dominantSuit = 2;
    var dominantCount = suitCounts[dominantSuit];

    var riichiScore = (meldCount === 0 ? 26 : -26) + seqPotential * 2.1 + (honorCount <= 2 ? 5 : -4);
    var tanyaoScore = nonTerminalCount * 2.6 - honorCount * 3.6 - terminalCount * 2.1;
    var yakuhaiScore = yakuhaiPairs * 20 + (counts[seatTile] >= 3 ? 8 : 0) + (counts[roundTile] >= 3 ? 8 : 0);
    var honitsuScore = dominantCount >= 8 && honorCount >= 1 ? (18 + (dominantCount - 8) * 4) : -20;

    var routes = [
      { tag: "riichi", score: riichiScore, dominantSuit: dominantSuit },
      { tag: "tanyao", score: tanyaoScore, dominantSuit: dominantSuit },
      { tag: "yakuhai", score: yakuhaiScore, dominantSuit: dominantSuit },
      { tag: "honitsu", score: honitsuScore, dominantSuit: dominantSuit }
    ];
    routes.sort(function (a, b) { return b.score - a.score; });
    return routes[0];
  }

  function routeDiscardAdjust(routePlan, discard, discardCount, heuristic) {
    var tag = routePlan.tag;
    var dominantSuit = routePlan.dominantSuit;
    var seatWind = heuristic.seatWind || "E";
    var roundWind = heuristic.roundWind || "E";
    var wm = { E: 27, S: 28, W: 29, N: 30 };
    var seatTile = wm[seatWind] || 27;
    var roundTile = wm[roundWind] || 27;
    var isDragon = discard >= 31 && discard <= 33;
    var out = { speed: 0, value: 0 };

    if (tag === "tanyao") {
      if (isTerminalOrHonor(discard)) { out.speed += 14; out.value += 10; }
      else { out.speed -= 5; out.value -= 6; }
      return out;
    }
    if (tag === "yakuhai") {
      if ((discard === seatTile || discard === roundTile || isDragon) && discardCount <= 2) {
        out.speed -= 22; out.value -= 34;
      }
      return out;
    }
    if (tag === "honitsu") {
      if (discard < 27) {
        var suit = Math.floor(discard / 9);
        if (suit !== dominantSuit) { out.speed += 12; out.value += 14; }
        else { out.speed -= 8; out.value -= 10; }
      } else {
        out.speed -= 2; out.value -= 2;
      }
      return out;
    }
    // riichi/default
    if (discardCount >= 2) { out.speed -= 6; out.value -= 6; }
    return out;
  }

  function getOneDrawTenpaiUkeire(nextHand, meldCount, getWinningTiles) {
    var counts = countTiles(nextHand);
    var sum = 0;
    for (var d = 0; d < 34; d += 1) {
      var left = 4 - counts[d];
      if (left <= 0) continue;
      var handPlusDraw = nextHand.concat([d]);
      var ok = false;
      var seen = new Set();
      for (var i = 0; i < handPlusDraw.length; i += 1) {
        var discard = handPlusDraw[i];
        if (seen.has(discard)) continue;
        seen.add(discard);
        var t = handPlusDraw.slice();
        t.splice(i, 1);
        if (getWinningTiles(t, meldCount).length > 0) { ok = true; break; }
      }
      if (ok) sum += left;
    }
    return sum;
  }

  function evaluateCandidate(params) {
    var hand14 = params.hand14;
    var discard = params.discard;
    var meldCount = params.meldCount || 0;
    var mode = params.mode || "riichi_lite";
    var getWinningTiles = params.getWinningTiles;
    var evaluateWin = params.evaluateWin;
    var heuristic = params.heuristic || {};
    var doraTiles = heuristic.doraTiles || [];

    var idx = hand14.indexOf(discard);
    if (idx < 0) return null;
    var originCounts = countTiles(hand14);
    var next = hand14.slice();
    next.splice(idx, 1);

    var waits = getWinningTiles(next, meldCount);
    var ukeire = calcUkeireForWaits(next, waits);
    var one = getOneDrawTenpaiUkeire(next, meldCount, getWinningTiles);

    var dist = 2;
    if (waits.length > 0) dist = 0;
    else if (one > 0) dist = 1;

    var bestHan = 0;
    var bestPoint = 0;
    var expectedPoint = 0;
    if (waits.length > 0) {
      var counts = countTiles(next);
      var weighted = 0;
      var weight = 0;
      for (var wIdx = 0; wIdx < waits.length; wIdx += 1) {
        var w = waits[wIdx];
        var avail = Math.max(0, 4 - counts[w]);
        if (avail <= 0) continue;
        var r = evaluateWin(next.concat([w]), w);
        if (!r || !r.ok) continue;
        bestHan = Math.max(bestHan, r.han || 0);
        var pts = r.point ? (r.point.total || 0) : (r.points || 0);
        bestPoint = Math.max(bestPoint, pts);
        weighted += pts * avail;
        weight += avail;
      }
      if (weight > 0) expectedPoint = weighted / weight;
    }

    var speedScore =
      (dist === 0 ? 300 : dist === 1 ? 160 : 40) +
      ukeire * 6 +
      one * 2.2 +
      waits.length * 8 +
      bestHan * 6;

    var valueScore =
      bestPoint / 32 +
      expectedPoint / 48 +
      bestHan * 20 +
      ukeire * 1.2 +
      (mode === "basic" ? 0 : 14);

    var discardCount = originCounts[discard] || 0;
    var discardNeighbor = discard < 27 ? getNeighborCount(originCounts, discard) : 0;
    var isHonorSingleton = discard >= 27 && discardCount === 1;
    var isSuitedSingleton = discard < 27 && discardCount === 1;
    var isSuitedOrphan = isSuitedSingleton && discardNeighbor === 0;
    var roleCost = getDiscardRoleCost(originCounts, discard);
    var isDoraDiscard = doraTiles.indexOf(discard) >= 0;
    var routePlan = buildRoutePlan(next, heuristic, meldCount, mode);
    var honorAdj = honorSingletonAdjust(discard, discardCount, heuristic, mode, routePlan, originCounts);
    var routeAdj = routeDiscardAdjust(routePlan, discard, discardCount, heuristic);
    var orphanPriority = getOrphanPriorityScore(discard, originCounts, heuristic, mode, routePlan);
    var blockPenalty = getBlockProtectionPenalty(discard, originCounts, mode);

    // Common efficiency layer for all modes:
    // prioritize clearing isolated tiles (especially lone honors), avoid breaking useful shapes.
    speedScore =
      speedScore +
      (isSuitedOrphan ? 12 : 0) -
      roleCost * 0.55 +
      honorAdj.speed +
      routeAdj.speed +
      orphanPriority * (mode === "basic" ? 1.05 : 0.78) -
      blockPenalty * (mode === "basic" ? 0.58 : 0.7);

    valueScore =
      valueScore +
      (isSuitedOrphan ? 4 : 0) -
      roleCost * 0.22 +
      honorAdj.value +
      routeAdj.value +
      routePlan.score * 0.12 +
      orphanPriority * (mode === "basic" ? 0.35 : 0.28) -
      blockPenalty * (mode === "basic" ? 0.28 : 0.42);

    if (mode === "basic") {
      var isHonorSingle = isHonorSingleton;
      var isolatedAfter = getIsolatedCount(next);

      // Basic fastest-mode bias: prefer clearing isolated tiles, especially lone honors.
      speedScore =
        speedScore +
        (isHonorSingle ? 34 : 0) +
        (isSuitedOrphan ? 18 : 0) -
        isolatedAfter * 5.5 -
        roleCost * 1.1 +
        orphanPriority * 0.45;
    } else {
      // In scoring-oriented modes, preserve dora unless speed/value gain is clear.
      if (isDoraDiscard) {
        var doraPenalty = discardCount >= 2 ? 26 : 42;
        valueScore -= doraPenalty;
        speedScore -= doraPenalty * 0.35;
      }
    }

    return {
      discard: discard,
      dist: dist,
      waits: waits,
      ukeire: ukeire,
      oneDrawUkeire: one,
      bestHan: bestHan,
      bestPoint: Math.round(bestPoint),
      expectedPoint: Math.round(expectedPoint),
      speedScore: speedScore,
      valueScore: valueScore,
      isHonorSingleton: isHonorSingleton,
      isSuitedOrphan: isSuitedOrphan,
      isDoraDiscard: isDoraDiscard,
      routeTag: honorAdj.route || routePlan.tag || "",
      orphanPriority: orphanPriority,
      blockPenalty: blockPenalty,
    };
  }

  function advise14(input) {
    var hand14 = input.hand14 || [];
    var meldCount = input.meldCount || 0;
    var mode = input.mode || "riichi_lite";
    var getWinningTiles = input.getWinningTiles;
    var evaluateWin = input.evaluateWin;
    var heuristic = input.heuristic || {};
    var restrict = input.restrictDiscards ? new Set(input.restrictDiscards) : null;

    var needMelds = 4 - meldCount;
    if (needMelds < 0) return null;
    var expectedPlayable = needMelds * 3 + 2;
    if (hand14.length !== expectedPlayable) return null;

    var seen = new Set();
    var candidates = [];
    for (var i = 0; i < hand14.length; i += 1) {
      var d = hand14[i];
      if (seen.has(d)) continue;
      seen.add(d);
      if (restrict && !restrict.has(d)) continue;
      var c = evaluateCandidate({
        hand14: hand14,
        discard: d,
        meldCount: meldCount,
        mode: mode,
        getWinningTiles: getWinningTiles,
        evaluateWin: evaluateWin,
        heuristic: heuristic
      });
      if (c) candidates.push(c);
    }
    if (candidates.length === 0) return null;

    var tieRank = function (x) {
      if (x.routeTag === "guest_wind_cut") return 3;
      if (x.isSuitedOrphan) return 2;
      return 0;
    };
    var tieBreak = function (a, b) {
      if ((a.orphanPriority || 0) !== (b.orphanPriority || 0)) return (b.orphanPriority || 0) - (a.orphanPriority || 0);
      if ((a.blockPenalty || 0) !== (b.blockPenalty || 0)) return (a.blockPenalty || 0) - (b.blockPenalty || 0);
      if (tieRank(a) !== tieRank(b)) return tieRank(b) - tieRank(a);
      if ((a.isSuitedOrphan ? 1 : 0) !== (b.isSuitedOrphan ? 1 : 0)) return (b.isSuitedOrphan ? 1 : 0) - (a.isSuitedOrphan ? 1 : 0);
      if ((a.isDoraDiscard ? 1 : 0) !== (b.isDoraDiscard ? 1 : 0)) return (a.isDoraDiscard ? 1 : 0) - (b.isDoraDiscard ? 1 : 0);
      return a.discard - b.discard;
    };

    var fast = candidates.slice().sort(function (a, b) {
      return a.dist - b.dist || b.ukeire - a.ukeire || b.oneDrawUkeire - a.oneDrawUkeire || b.waits.length - a.waits.length || b.speedScore - a.speedScore || tieBreak(a, b);
    })[0];

    var value = candidates.slice().sort(function (a, b) {
      return a.dist - b.dist || b.valueScore - a.valueScore || b.expectedPoint - a.expectedPoint || b.bestPoint - a.bestPoint || b.ukeire - a.ukeire || tieBreak(a, b);
    })[0];

    return { fast: fast, value: value, candidates: candidates };
  }

  function chiPatterns(hand13, claimTile) {
    if (claimTile < 0 || claimTile > 26) return [];
    var suit = Math.floor(claimTile / 9);
    var pos = claimTile % 9;
    var counts = countTiles(hand13);
    var out = [];
    var add = function (a, b, c) { out.push([a, b, c]); };
    var base = suit * 9;

    if (pos >= 2 && counts[base + pos - 2] > 0 && counts[base + pos - 1] > 0) add(base + pos - 2, base + pos - 1, claimTile);
    if (pos >= 1 && pos <= 7 && counts[base + pos - 1] > 0 && counts[base + pos + 1] > 0) add(base + pos - 1, claimTile, base + pos + 1);
    if (pos <= 6 && counts[base + pos + 1] > 0 && counts[base + pos + 2] > 0) add(claimTile, base + pos + 1, base + pos + 2);
    return out;
  }

  function evaluateCallUnknown(input) {
    var hand13 = input.hand13 || [];
    var includeRon = !!input.includeRon;
    var evaluateWin = input.evaluateWin;

    if (hand13.length !== 13) return [];

    var counts = countTiles(hand13);
    var out = [];

    var scoreOf = function (a) { return a.speed * 0.58 + a.value * 0.42; };

    for (var t = 0; t < 34; t += 1) {
      var left = 4 - counts[t];
      if (left <= 0) continue;

      var actions = [];
      if (includeRon && typeof evaluateWin === "function") {
        var ronRes = evaluateWin(hand13.concat([t]), t);
        if (ronRes && ronRes.ok) {
          var ronPts = ronRes.point ? (ronRes.point.total || 0) : (ronRes.points || 0);
          actions.push({ action: "ron", tile: t, speed: 9999, value: 9999, points: ronPts, detail: "win", pattern: [t] });
        }
      }

      if (counts[t] >= 2) actions.push({ action: "pong", tile: t, speed: 180, value: 150, points: 0, detail: "call", pattern: [t, t, t] });
      if (counts[t] >= 3) actions.push({ action: "kong", tile: t, speed: 170, value: 165, points: 0, detail: "call", pattern: [t, t, t, t] });
      if (t <= 26) {
        var chis = chiPatterns(hand13, t);
        if (chis.length > 0) actions.push({ action: "chi", tile: t, speed: 160, value: 145, points: 0, detail: "call", pattern: chis[0], chiCount: chis.length });
      }
      if (actions.length === 0) continue;

      actions.push({ action: "pass", tile: t, speed: 120, value: 120, points: 0, detail: "pass", pattern: [t] });

      actions.sort(function (a, b) { return scoreOf(b) - scoreOf(a); });
      var passAction = actions.find(function (a) { return a.action === "pass"; }) || actions[actions.length - 1];
      var bestCall = actions.find(function (a) { return a.action !== "pass"; }) || null;
      if (!bestCall) continue;

      var passScore = scoreOf(passAction);
      var bestCallScore = scoreOf(bestCall);
      var callDelta = bestCallScore - passScore;
      var best = callDelta >= 10 ? bestCall : passAction;
      var bestScore = scoreOf(best);
      out.push({
        tile: t,
        left: left,
        best: best,
        bestCall: bestCall,
        pass: passAction,
        callDelta: callDelta,
        score: bestScore + left
      });
    }

    out.sort(function (a, b) { return b.callDelta - a.callDelta || b.left - a.left || a.tile - b.tile; });
    return out.slice(0, 6);
  }

  function advise13(input) {
    var hand13 = input.hand13 || [];
    var meldCount = input.meldCount || 0;
    var mode = input.mode || "riichi_lite";
    var getWinningTiles = input.getWinningTiles;
    var evaluateWin = input.evaluateWin;
    var includeDrawAdvice = !!input.includeDrawAdvice;
    var includeRonOnClaim = !!input.includeRonOnClaim;

    if (hand13.length !== 13) return null;

    var waits = [];
    var waitUkeire = 0;
    var drawFast = null;
    var drawValue = null;

    if (includeDrawAdvice && typeof getWinningTiles === "function") {
      waits = getWinningTiles(hand13, meldCount);
      waitUkeire = calcUkeireForWaits(hand13, waits);

      var drawCand = [];
      var counts = countTiles(hand13);
      for (var d = 0; d < 34; d += 1) {
        var left = 4 - counts[d];
        if (left <= 0) continue;
        var adv14 = advise14({
          hand14: hand13.concat([d]),
          meldCount: meldCount,
          mode: mode,
          getWinningTiles: getWinningTiles,
          evaluateWin: evaluateWin,
        });
        if (!adv14) continue;
        drawCand.push({ draw: d, left: left, fast: adv14.fast, value: adv14.value });
      }

      drawCand.sort(function (a, b) {
        return b.fast.speedScore - a.fast.speedScore || b.left - a.left || a.draw - b.draw;
      });

      drawFast = drawCand.length ? drawCand[0] : null;
      drawValue = drawCand.length ? drawCand.slice().sort(function (a, b) {
        return b.value.valueScore - a.value.valueScore || b.left - a.left || a.draw - b.draw;
      })[0] : null;
    }

    var claimTop = evaluateCallUnknown({
      hand13: hand13,
      includeRon: includeRonOnClaim,
      evaluateWin: evaluateWin
    });

    return {
      waits: waits,
      waitUkeire: waitUkeire,
      drawFast: drawFast,
      drawValue: drawValue,
      claimTop: claimTop,
    };
  }

  global.AdviceEngine = {
    advise14: advise14,
    advise13: advise13,
    countTiles: countTiles,
    calcUkeireForWaits: calcUkeireForWaits,
  };
})(window);
