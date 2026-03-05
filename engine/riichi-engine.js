(function (global) {
  "use strict";

  function countTiles(tiles) {
    var c = new Array(34).fill(0);
    for (var i = 0; i < tiles.length; i += 1) c[tiles[i]] += 1;
    return c;
  }

  function isTerminalOrHonor(t) { return t >= 27 || t % 9 === 0 || t % 9 === 8; }
  function sequenceHasYaochu(start) { return start % 9 === 0 || start % 9 === 6; }

  function canChiitoitsu(tiles, meldCount) {
    if ((meldCount || 0) !== 0 || tiles.length !== 14) return false;
    var c = countTiles(tiles);
    var pairs = 0;
    for (var i = 0; i < c.length; i += 1) if (c[i] === 2) pairs += 1;
    return pairs === 7;
  }

  function canKokushi(tiles, meldCount) {
    if ((meldCount || 0) !== 0 || tiles.length !== 14) return { ok: false, pair: -1 };
    var c = countTiles(tiles), yaochu = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33], pair = -1;
    for (var i = 0; i < yaochu.length; i += 1) {
      var t = yaochu[i];
      if (c[t] === 0) return { ok: false, pair: -1 };
      if (c[t] >= 2) pair = t;
    }
    var sum = 0;
    for (var k = 0; k < c.length; k += 1) sum += c[k];
    return { ok: sum === 14 && pair !== -1, pair: pair };
  }

  function canChuuren(tiles, meldCount) {
    if ((meldCount || 0) !== 0 || tiles.length !== 14) return { ok: false, junsei: false };
    if (tiles.some(function (t) { return t >= 27; })) return { ok: false, junsei: false };
    var suit = Math.floor(tiles[0] / 9);
    for (var i = 0; i < tiles.length; i += 1) if (Math.floor(tiles[i] / 9) !== suit) return { ok: false, junsei: false };
    var c = new Array(9).fill(0);
    for (var j = 0; j < tiles.length; j += 1) c[tiles[j] % 9] += 1;
    var base = [3, 1, 1, 1, 1, 1, 1, 1, 3];
    for (var n = 0; n < 9; n += 1) if (c[n] < base[n]) return { ok: false, junsei: false };
    var extra = 0;
    for (var m = 0; m < 9; m += 1) extra += (c[m] - base[m]);
    return { ok: extra === 1, junsei: extra === 1 };
  }

  function findMeldDecomposition(counts, need, acc) {
    if (need === 0) return acc.slice();
    var i = -1;
    for (var k = 0; k < 34; k += 1) if (counts[k] > 0) { i = k; break; }
    if (i < 0) return null;

    if (counts[i] >= 3) {
      counts[i] -= 3;
      acc.push({ type: "triplet", tiles: [i, i, i] });
      var r1 = findMeldDecomposition(counts, need - 1, acc);
      if (r1) return r1;
      acc.pop();
      counts[i] += 3;
    }

    if (i <= 26 && i % 9 <= 6 && counts[i + 1] > 0 && counts[i + 2] > 0) {
      counts[i] -= 1; counts[i + 1] -= 1; counts[i + 2] -= 1;
      acc.push({ type: "sequence", tiles: [i, i + 1, i + 2] });
      var r2 = findMeldDecomposition(counts, need - 1, acc);
      if (r2) return r2;
      acc.pop();
      counts[i] += 1; counts[i + 1] += 1; counts[i + 2] += 1;
    }

    return null;
  }

  function findWinningStructure(tiles, meldCount) {
    var m = meldCount || 0;
    var needMelds = 4 - m;
    if (needMelds < 0) return null;
    if (tiles.length !== needMelds * 3 + 2) return null;
    var c = countTiles(tiles);
    for (var i = 0; i < 34; i += 1) {
      if (c[i] < 2) continue;
      c[i] -= 2;
      var melds = findMeldDecomposition(c, needMelds, []);
      c[i] += 2;
      if (melds) return { pair: i, melds: melds };
    }
    return null;
  }

  function meldHasYaochu(meld) {
    return meld.type === "triplet" ? isTerminalOrHonor(meld.tiles[0]) : sequenceHasYaochu(meld.tiles[0]);
  }

  function isChanta(structure) {
    if (!structure) return false;
    if (!isTerminalOrHonor(structure.pair)) return false;
    return structure.melds.every(meldHasYaochu);
  }

  function isJunchan(structure, allTiles) {
    if (!structure) return false;
    if (allTiles.some(function (t) { return t >= 27; })) return false;
    if (structure.pair >= 27 || !isTerminalOrHonor(structure.pair)) return false;
    return structure.melds.every(function (m) {
      return m.type === "triplet"
        ? isTerminalOrHonor(m.tiles[0]) && m.tiles[0] < 27
        : sequenceHasYaochu(m.tiles[0]);
    });
  }

  function calcFuSimple(structure, winType, chiitoi) {
    if (chiitoi) return 25;
    var fu = 20;
    if (winType === "ron") fu += 10;
    if (winType === "tsumo") fu += 2;
    if (structure && structure.pair >= 27) fu += 2;
    if (structure) {
      structure.melds.forEach(function (m) {
        if (m.type === "triplet") fu += isTerminalOrHonor(m.tiles[0]) ? 8 : 4;
      });
    }
    return Math.ceil(fu / 10) * 10;
  }

  function calcBasePoints(han, fu, yakumanTimes) {
    if (yakumanTimes > 0) return 8000 * yakumanTimes;
    var base = fu * Math.pow(2, han + 2);
    if (han >= 13) base = 8000;
    else if (han >= 11) base = 6000;
    else if (han >= 8) base = 4000;
    else if (han >= 6) base = 3000;
    else if (han >= 5 || base >= 2000) base = 2000;
    return base;
  }

  function ceil100(n) { return Math.ceil(n / 100) * 100; }

  function calcPointBreakdown(base, winType, isDealer) {
    if (winType === "ron") {
      var one = ceil100(base * (isDealer ? 6 : 4));
      return { total: one, label: (isDealer ? "庄家荣和 " : "闲家荣和 ") + one };
    }
    if (isDealer) {
      var each = ceil100(base * 2);
      return { total: each * 3, label: "庄家自摸 " + each + " all (合计" + (each * 3) + ")" };
    }
    var fromDealer = ceil100(base * 2);
    var fromOthers = ceil100(base);
    var total = fromDealer + fromOthers * 2;
    return { total: total, label: "闲家自摸 " + fromDealer + "/" + fromOthers + " (合计" + total + ")" };
  }

  function nextDora(ind) {
    if (ind <= 8) return (ind + 1) % 9;
    if (ind <= 17) return ((ind - 9 + 1) % 9) + 9;
    if (ind <= 26) return ((ind - 18 + 1) % 9) + 18;
    if (ind <= 30) return ind === 30 ? 27 : ind + 1;
    return ind === 33 ? 31 : ind + 1;
  }

  function calcDoraBonus(tiles, opts) {
    var options = opts || {};
    var doraIndicators = options.doraIndicators || [];
    var uraIndicators = options.uraIndicators || [];
    var riichi = !!options.riichi;
    var aka5m = !!options.aka5m, aka5p = !!options.aka5p, aka5s = !!options.aka5s;

    var doraTiles = doraIndicators.map(nextDora);
    var uraTiles = uraIndicators.map(nextDora);
    var doraCount = doraTiles.reduce(function (a, d) { return a + tiles.filter(function (t) { return t === d; }).length; }, 0);
    var uraCountRaw = uraTiles.reduce(function (a, d) { return a + tiles.filter(function (t) { return t === d; }).length; }, 0);
    var uraCount = riichi ? uraCountRaw : 0;
    var akaCount = 0;
    if (aka5m) akaCount += tiles.filter(function (t) { return t === 4; }).length;
    if (aka5p) akaCount += tiles.filter(function (t) { return t === 13; }).length;
    if (aka5s) akaCount += tiles.filter(function (t) { return t === 22; }).length;
    return { doraCount: doraCount, uraCount: uraCount, akaCount: akaCount, total: doraCount + uraCount + akaCount };
  }

  function concealedTripletCount(structure, winType, winTile) {
    if (!structure) return 0;
    var tri = structure.melds.filter(function (m) { return m.type === "triplet"; });
    if (winType === "tsumo") return tri.length;
    if (winType !== "ron") return tri.length;
    if (winTile === null || winTile === undefined) return Math.max(0, tri.length - 1);
    if (structure.pair === winTile) return tri.length;
    if (tri.some(function (m) { return m.tiles[0] === winTile; })) return tri.length - 1;
    return tri.length;
  }

  function evaluateRules46(input) {
    var tiles = (input.tiles || []).slice();
    var winType = input.winType === "tsumo" ? "tsumo" : "ron";
    var winTile = input.winTile;
    if (!(winTile >= 0 && winTile < 34) || tiles.indexOf(winTile) < 0) winTile = null;

    var kokushi = canKokushi(tiles, 0);
    var chuuren = canChuuren(tiles, 0);
    var chiitoi = canChiitoitsu(tiles, 0);
    var structure = findWinningStructure(tiles, 0);
    if (!kokushi.ok && !chuuren.ok && !chiitoi && !structure) return { ok: false, reason: "shape" };

    var yaku = [];
    function add(name, han) { yaku.push({ name: name, han: han }); }

    var yakumanTimes = 0;
    var c = countTiles(tiles);
    if (kokushi.ok) {
      if (kokushi.pair === winTile) { yakumanTimes = 2; add("国士无双十三面", 26); }
      else { yakumanTimes = 1; add("国士无双", 13); }
    }
    if (chuuren.ok) {
      var idx = (winTile === null || winTile === undefined) ? -1 : winTile % 9;
      var d9 = new Array(9).fill(0);
      tiles.forEach(function (t) { d9[t % 9] += 1; });
      var junsei = idx >= 0 && d9[idx] === 2;
      if (junsei) { yakumanTimes = Math.max(yakumanTimes, 2); add("纯正九莲宝灯", 26); }
      else { yakumanTimes = Math.max(yakumanTimes, 1); add("九莲宝灯", 13); }
    }

    var state = input.state || {};

    if (!yakumanTimes) {
      if (state.doubleRiichi) add("双立直", 2);
      else if (state.riichi) add("立直", 1);
      if (state.riichi && state.ippatsu) add("一发", 1);
      if (winType === "tsumo") add("门前清自摸", 1);
      if (tiles.every(function (t) { return t <= 26 && !isTerminalOrHonor(t); })) add("断幺九", 1);

      var wm = { E: 27, S: 28, W: 29, N: 30 };
      if (c[wm[state.seatWind || "E"]] >= 3) add("门风刻子", 1);
      if (c[wm[state.roundWind || "E"]] >= 3) add("场风刻子", 1);
      if (c[31] >= 3) add("三元牌刻子(中)", 1);
      if (c[32] >= 3) add("三元牌刻子(发)", 1);
      if (c[33] >= 3) add("三元牌刻子(白)", 1);
      if (chiitoi) add("七对子", 2);

      if (structure) {
        var melds = structure.melds;
        var seq = melds.filter(function (m) { return m.type === "sequence"; });
        var tri = melds.filter(function (m) { return m.type === "triplet"; });
        var concealedTri = concealedTripletCount(structure, winType, winTile);

        if (tri.length === 4) add("碰碰和", 2);
        if (concealedTri >= 3) add("三暗刻", 2);
        if (concealedTri === 4) {
          if (structure.pair === winTile) { yakumanTimes = Math.max(yakumanTimes, 2); add("四暗刻单骑", 26); }
          else { yakumanTimes = Math.max(yakumanTimes, 1); add("四暗刻", 13); }
        }

        var pair = structure.pair;
        var dragonTrip = [31, 32, 33].filter(function (t) { return c[t] >= 3; }).length;
        if (dragonTrip >= 2 && pair >= 31 && pair <= 33) add("小三元", 2);

        var triHeads = tri.map(function (m) { return m.tiles[0]; });
        for (var n = 0; n <= 8; n += 1) {
          if (triHeads.includes(n) && triHeads.includes(9 + n) && triHeads.includes(18 + n)) {
            add("三色同刻", 2);
            break;
          }
        }

        var seqHeads = seq.map(function (m) { return m.tiles[0]; });
        for (var x = 0; x <= 6; x += 1) {
          if (seqHeads.includes(x) && seqHeads.includes(9 + x) && seqHeads.includes(18 + x)) { add("三色同顺", 2); break; }
        }
        for (var s = 0; s < 3; s += 1) {
          var b = s * 9;
          if (seqHeads.includes(b) && seqHeads.includes(b + 3) && seqHeads.includes(b + 6)) { add("一气通贯", 2); break; }
        }

        var map = new Map();
        seqHeads.forEach(function (h) { map.set(h, (map.get(h) || 0) + 1); });
        var p = Array.from(map.values()).filter(function (v) { return v >= 2; }).length;
        if (p >= 2) add("两杯口", 3); else if (p === 1) add("一杯口", 1);

        if (melds.every(function (m) { return m.type === "sequence"; }) && pair < 27 && !isTerminalOrHonor(pair)) add("平和", 1);

        if (isJunchan(structure, tiles)) add("纯全带幺九", 3);
        else if (isChanta(structure)) add("混全带幺九", 2);
      }

      var termHonor = tiles.every(function (t) { return t >= 27 || t % 9 === 0 || t % 9 === 8; });
      if (termHonor) {
        if (tiles.some(function (t) { return t >= 27; })) add("混老头", 2);
        else { yakumanTimes = Math.max(yakumanTimes, 1); add("清老头", 13); }
      }
      if (tiles.every(function (t) { return t >= 27; })) { yakumanTimes = Math.max(yakumanTimes, 1); add("字一色", 13); }
      var green = new Set([19, 20, 21, 23, 25, 32]);
      if (tiles.every(function (t) { return green.has(t); })) { yakumanTimes = Math.max(yakumanTimes, 1); add("绿一色", 13); }

      var suit = [0, 0, 0], honor = 0;
      tiles.forEach(function (t) {
        if (t <= 8) suit[0] += 1;
        else if (t <= 17) suit[1] += 1;
        else if (t <= 26) suit[2] += 1;
        else honor += 1;
      });
      var suitCnt = suit.filter(function (x) { return x > 0; }).length;
      if (suitCnt === 1 && honor === 0) add("清一色", 6);
      else if (suitCnt === 1 && honor > 0) add("混一色", 3);

      if ([31, 32, 33].filter(function (t) { return c[t] >= 3; }).length === 3) { yakumanTimes = Math.max(yakumanTimes, 1); add("大三元", 13); }
      var wTrip = [27, 28, 29, 30].filter(function (t) { return c[t] >= 3; }).length;
      var wPair = [27, 28, 29, 30].some(function (t) { return c[t] === 2; });
      if (wTrip === 4) { yakumanTimes = Math.max(yakumanTimes, 2); add("大四喜", 26); }
      else if (wTrip === 3 && wPair) { yakumanTimes = Math.max(yakumanTimes, 1); add("小四喜", 13); }

      var kanCnt = 0;
      if (structure) kanCnt = structure.melds.filter(function (m) { return m.type === "triplet" && c[m.tiles[0]] === 4; }).length;
      if (kanCnt >= 3) add("三杠子", 2);
      if (kanCnt === 4) { yakumanTimes = Math.max(yakumanTimes, 1); add("四杠子", 13); }

      var honorPairs = 0;
      for (var h = 27; h < 34; h += 1) if (c[h] === 2) honorPairs += 1;
      if (honorPairs === 7) { yakumanTimes = Math.max(yakumanTimes, 2); add("大七星", 26); }

      if (state.chankan) add("抢杠", 1);
      if (state.rinshan) add("岭上开花", 1);
      if (state.haitei || state.houtei) add("海底捞月/河底捞鱼", 1);
      if (state.tenhou) { yakumanTimes = Math.max(yakumanTimes, 1); add("天和", 13); }
      if (state.chiihou) { yakumanTimes = Math.max(yakumanTimes, 1); add("地和", 13); }
    }

    var dora = calcDoraBonus(tiles, {
      doraIndicators: input.doraIndicators,
      uraIndicators: input.uraIndicators,
      riichi: !!state.riichi,
      aka5m: !!state.aka5m,
      aka5p: !!state.aka5p,
      aka5s: !!state.aka5s
    });

    var baseYakuHan = yaku.filter(function (x) { return !x.name.includes("宝牌") && !x.name.includes("ドラ"); })
      .reduce(function (a, b) { return a + b.han; }, 0);
    if (!yakumanTimes && baseYakuHan <= 0) return { ok: false, reason: "no_yaku", dora: dora };

    var han = yakumanTimes ? yakumanTimes * 13 : yaku.reduce(function (a, b) { return a + b.han; }, 0);
    if (!yakumanTimes) {
      if (dora.doraCount > 0) { yaku.push({ name: "宝牌x" + dora.doraCount, han: dora.doraCount }); han += dora.doraCount; }
      if (dora.uraCount > 0) { yaku.push({ name: "里宝牌x" + dora.uraCount, han: dora.uraCount }); han += dora.uraCount; }
      if (dora.akaCount > 0) { yaku.push({ name: "红宝牌x" + dora.akaCount, han: dora.akaCount }); han += dora.akaCount; }
    }

    var fu = calcFuSimple(structure, winType, chiitoi);
    var base = calcBasePoints(han, fu, yakumanTimes);
    var dealerFlag = (typeof input.dealer === "boolean") ? input.dealer : !!state.dealer;
    var point = calcPointBreakdown(base, winType, !!dealerFlag);
    var limitName = "";
    if (yakumanTimes > 0) limitName = yakumanTimes >= 2 ? "双倍役满" : "役满";
    else if (han >= 13) limitName = "役满";
    else if (han >= 11) limitName = "三倍满";
    else if (han >= 8) limitName = "倍满";
    else if (han >= 6) limitName = "跳满";
    else if (han >= 5 || base >= 2000) limitName = "满贯";

    return { ok: true, han: han, fu: fu, yaku: yaku, dora: dora, limitName: limitName, basePoints: base, point: point };
  }

  function evaluateRiichiLite(input) {
    var handWithWin = (input.tiles || []).slice();
    var winType = input.winType === "tsumo" ? "tsumo" : "ron";
    var winTile = input.winTile;
    var melds = input.melds || [];
    var riichi = !!input.riichi;
    var doraIndicators = input.doraIndicators || [];

    var hasOpen = melds.some(function (m) { return m.type === "chi" || m.type === "pong" || m.type === "kong_open"; });
    var isChiitoi = canChiitoitsu(handWithWin, melds.length);
    var isKokushi = canKokushi(handWithWin, melds.length).ok;
    var isRegular = !!findWinningStructure(handWithWin, melds.length);
    if (!isRegular && !isChiitoi && !isKokushi) return { ok: false };

    if (isKokushi) {
      var yk = ["Kokushi Musou"];
      if (riichi) yk.push("Riichi");
      return { ok: true, han: 13, fu: 0, points: winType === "tsumo" ? 16000 : 32000, yaku: yk, winType: winType, winTile: winTile };
    }

    var structure = isRegular ? findWinningStructure(handWithWin, melds.length) : null;
    if (!structure && !isChiitoi) return { ok: false };

    var han = 0;
    var fu = isChiitoi ? 25 : 20;
    var yaku = [];
    var baseYakuHan = 0;
    function addYaku(name, h) { han += h; baseYakuHan += h; yaku.push(name); }

    if (riichi) addYaku("Riichi", 1);
    if (!hasOpen && winType === "tsumo") addYaku("Menzen Tsumo", 1);

    var allTiles = handWithWin.slice();
    melds.forEach(function (m) { allTiles.push.apply(allTiles, m.tiles); });

    var allNoTH = allTiles.every(function (t) { return t < 27 && !isTerminalOrHonor(t); });
    if (allNoTH) addYaku("Tanyao", 1);

    var counts = countTiles(allTiles);
    if (counts[31] >= 3) addYaku("Yakuhai Chun", 1);
    if (counts[32] >= 3) addYaku("Yakuhai Hatsu", 1);
    if (counts[33] >= 3) addYaku("Yakuhai Haku", 1);

    if (isChiitoi) addYaku("Chiitoitsu", 2);
    else {
      var closedMelds = structure.melds;
      var allMelds = closedMelds.concat(melds.map(function (m) {
        return { type: m.type === "chi" ? "sequence" : "triplet", tiles: m.tiles };
      }));
      var onlySeq = allMelds.every(function (m) { return m.type === "sequence"; });
      var pairTile = structure.pair;
      var pairValue = pairTile >= 31 && pairTile <= 33;
      if (!hasOpen && onlySeq && !pairValue && !isTerminalOrHonor(pairTile)) addYaku("Pinfu", 1);

      if (allMelds.every(function (m) { return m.type === "triplet"; })) addYaku("Toitoi", 2);
      var concealedTri = concealedTripletCount(structure, winType, winTile);
      if (concealedTri >= 3) addYaku("Sanankou", 2);

      var dragonTriplets = [31, 32, 33].filter(function (d) { return counts[d] >= 3; }).length;
      if (dragonTriplets >= 2 && pairTile >= 31 && pairTile <= 33) addYaku("Shousangen", 2);

      var seqKeys = allMelds.filter(function (m) { return m.type === "sequence"; }).map(function (m) { return m.tiles[0]; });
      for (var n = 0; n <= 6; n += 1) {
        if (seqKeys.includes(n) && seqKeys.includes(9 + n) && seqKeys.includes(18 + n)) {
          addYaku("Sanshoku Doujun", hasOpen ? 1 : 2);
          break;
        }
      }
      for (var s = 0; s < 3; s += 1) {
        var b = s * 9;
        if (seqKeys.includes(b) && seqKeys.includes(b + 3) && seqKeys.includes(b + 6)) {
          addYaku("Ittsuu", hasOpen ? 1 : 2);
          break;
        }
      }
      if (!hasOpen) {
        var map = new Map();
        closedMelds.filter(function (m) { return m.type === "sequence"; })
          .forEach(function (m) { map.set(m.tiles[0], (map.get(m.tiles[0]) || 0) + 1); });
        var pairSeq = Array.from(map.values()).filter(function (v) { return v >= 2; }).length;
        if (pairSeq >= 2) addYaku("Ryanpeikou", 3);
        else if (pairSeq === 1) addYaku("Iipeikou", 1);
      }
    }

    var suitHas = [0, 0, 0], honorHas = 0;
    allTiles.forEach(function (t) {
      if (t <= 8) suitHas[0] += 1;
      else if (t <= 17) suitHas[1] += 1;
      else if (t <= 26) suitHas[2] += 1;
      else honorHas += 1;
    });
    var suitsUsed = suitHas.filter(function (x) { return x > 0; }).length;
    if (suitsUsed === 1 && honorHas === 0) addYaku("Chinitsu", hasOpen ? 5 : 6);
    else if (suitsUsed === 1 && honorHas > 0) addYaku("Honitsu", hasOpen ? 2 : 3);

    if (baseYakuHan <= 0) return { ok: false, reason: "no_yaku" };

    if (!isChiitoi) {
      var allM = structure.melds.concat(melds.map(function (m) { return { type: m.type === "chi" ? "sequence" : "triplet", tiles: m.tiles }; }));
      var pairT = structure.pair;
      var pairVal = pairT >= 31 && pairT <= 33;
      if (!hasOpen && winType === "ron") fu += 10;
      if (pairVal) fu += 2;
      allM.forEach(function (m) {
        if (m.type !== "triplet") return;
        fu += isTerminalOrHonor(m.tiles[0]) ? 8 : 4;
      });
      fu = Math.ceil(fu / 10) * 10;
    }

    var dora = 0;
    if (doraIndicators.length > 0) {
      var doraTile = nextDora(doraIndicators[0]);
      dora = allTiles.filter(function (t) { return t === doraTile; }).length;
    }
    if (dora > 0) { han += dora; yaku.push("Dora x" + dora); }

    var basePoints = calcBasePoints(han, fu, 0);
    var points = winType === "tsumo" ? ceil100(basePoints * 2) : ceil100(basePoints * 4);
    return { ok: true, han: han, fu: fu, points: points, yaku: yaku, winType: winType, winTile: winTile };
  }

  function canHuByRule(tiles, meldCount) {
    return !!findWinningStructure(tiles, meldCount || 0) || canChiitoitsu(tiles, meldCount || 0) || canKokushi(tiles, meldCount || 0).ok;
  }

  global.RiichiEngine = {
    countTiles: countTiles,
    isTerminalOrHonor: isTerminalOrHonor,
    findWinningStructure: findWinningStructure,
    canHuByRule: canHuByRule,
    evaluateRules46: evaluateRules46,
    evaluateRiichiLite: evaluateRiichiLite,
    nextDora: nextDora
  };
})(window);
