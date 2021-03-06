function JPEGEncoder(aW) {
    function ap(v) {
        var t,
            s,
            r,
            q,
            h,
            g,
            f,
            e,
            d,
            u = [
                16,
                11,
                10,
                16,
                24,
                40,
                51,
                61,
                12,
                12,
                14,
                19,
                26,
                58,
                60,
                55,
                14,
                13,
                16,
                24,
                40,
                57,
                69,
                56,
                14,
                17,
                22,
                29,
                51,
                87,
                80,
                62,
                18,
                22,
                37,
                56,
                68,
                109,
                103,
                77,
                24,
                35,
                55,
                64,
                81,
                104,
                113,
                92,
                49,
                64,
                78,
                87,
                103,
                121,
                120,
                101,
                72,
                92,
                95,
                98,
                112,
                100,
                103,
                99
            ];
        for (t = 0; 64 > t; t++) {
            s = aV((u[t] * v + 50) / 100),
                1 > s ? s = 1 : s > 255 && (s = 255),
                aU[az[t]] = s
        }
        for (r = [
            17,
            18,
            24,
            47,
            99,
            99,
            99,
            99,
            18,
            21,
            26,
            66,
            99,
            99,
            99,
            99,
            24,
            26,
            56,
            99,
            99,
            99,
            99,
            99,
            47,
            66,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99,
            99
        ], q = 0; 64 > q; q++) {
            h = aV((r[q] * v + 50) / 100),
                1 > h ? h = 1 : h > 255 && (h = 255),
                aT[az[q]] = h
        }
        for (g = [
            1,
            1.387039845,
            1.306562965,
            1.175875602,
            1,
            0.785694958,
            0.5411961,
            0.275899379
        ], f = 0, e = 0; 8 > e; e++) {
            for (d = 0; 8 > d; d++) {
                aS[f] = 1 / (8 * aU[az[f]] * g[e] * g[d]),
                    aR[f] = 1 / (8 * aT[az[f]] * g[e] * g[d]),
                    f++
            }
        }
    }

    function ao(i, h) {
        var k,
            j,
            n = 0,
            m = 0,
            l = new Array;
        for (k = 1; 16 >= k; k++) {
            for (j = 1; j <= i[k]; j++) {
                l[h[m]] = [],
                    l[h[m]][0] = n,
                    l[h[m]][1] = k,
                    m++,
                    n++
            }
            n *= 2
        }
        return l
    }

    function an() {
        aQ = ao(ay, ax),
            aP = ao(au, at),
            aO = ao(aw, av),
            aN = ao(ar, aq)
    }

    function am() {
        var j,
            i,
            h,
            g = 1,
            f = 2;
        for (j = 1; 15 >= j; j++) {
            for (i = g; f > i; i++) {
                aL[32767 + i] = j,
                    aM[32767 + i] = [],
                    aM[32767 + i][1] = j,
                    aM[32767 + i][0] = i
            }
            for (h = -(f - 1); -g >= h; h++) {
                aL[32767 + h] = j,
                    aM[32767 + h] = [],
                    aM[32767 + h][1] = j,
                    aM[32767 + h][0] = f - 1 + h
            }
            g <<= 1,
                f <<= 1
        }
    }

    function al() {
        for (var d = 0; 256 > d; d++) {
            aB[d] = 19595 * d,
                aB[d + 256 >> 0] = 38470 * d,
                aB[d + 512 >> 0] = 7471 * d + 32768,
                aB[d + 768 >> 0] = -11059 * d,
                aB[d + 1024 >> 0] = -21709 * d,
                aB[d + 1280 >> 0] = 32768 * d + 8421375,
                aB[d + 1536 >> 0] = -27439 * d,
                aB[d + 1792 >> 0] = -5329 * d
        }
    }

    function ak(e) {
        for (var d = e[0], f = e[1] - 1; f >= 0;) {
            d & 1 << f && (aH |= 1 << aG),
                f--,
                aG--,
            0 > aG && (255 == aH ? (aj(255), aj(0)) : aj(aH), aG = 7, aH = 0)
        }
    }

    function aj(d) {
        aI.push(aC[d])
    }

    function ai(d) {
        aj(255 & d >> 8),
            aj(255 & d)
    }

    function ah(bL, bK) {
        var bJ,
            bI,
            bH,
            bG,
            bF,
            bE,
            bD,
            bC,
            bA,
            bx,
            bw,
            bv,
            bu,
            bt,
            bs,
            br,
            bq,
            bp,
            bo,
            bn,
            bl,
            bk,
            bj,
            bi,
            bh,
            bg,
            bf,
            be,
            bd,
            bc,
            bb,
            ba,
            a9,
            a8,
            a7,
            a6,
            a5,
            a4,
            a3,
            a2,
            a1,
            a0,
            aZ,
            aY,
            aX,
            o,
            bm,
            bM,
            bB = 0;
        var bz = 8,
            by = 64;
        for (bA = 0; bz > bA; ++bA) {
            bJ = bL[bB],
                bI = bL[bB + 1],
                bH = bL[bB + 2],
                bG = bL[bB + 3],
                bF = bL[bB + 4],
                bE = bL[bB + 5],
                bD = bL[bB + 6],
                bC = bL[bB + 7],
                bx = bJ + bC,
                bw = bJ - bC,
                bv = bI + bD,
                bu = bI - bD,
                bt = bH + bE,
                bs = bH - bE,
                br = bG + bF,
                bq = bG - bF,
                bp = bx + br,
                bo = bx - br,
                bn = bv + bt,
                bl = bv - bt,
                bL[bB] = bp + bn,
                bL[bB + 4] = bp - bn,
                bk = 0.707106781 * (bl + bo),
                bL[bB + 2] = bo + bk,
                bL[bB + 6] = bo - bk,
                bp = bq + bs,
                bn = bs + bu,
                bl = bu + bw,
                bj = 0.382683433 * (bp - bl),
                bi = 0.5411961 * bp + bj,
                bh = 1.306562965 * bl + bj,
                bg = 0.707106781 * bn,
                bf = bw + bg,
                be = bw - bg,
                bL[bB + 5] = be + bi,
                bL[bB + 3] = be - bi,
                bL[bB + 1] = bf + bh,
                bL[bB + 7] = bf - bh,
                bB += 8
        }
        for (bB = 0, bA = 0; bz > bA; ++bA) {
            bJ = bL[bB],
                bI = bL[bB + 8],
                bH = bL[bB + 16],
                bG = bL[bB + 24],
                bF = bL[bB + 32],
                bE = bL[bB + 40],
                bD = bL[bB + 48],
                bC = bL[bB + 56],
                bd = bJ + bC,
                bc = bJ - bC,
                bb = bI + bD,
                ba = bI - bD,
                a9 = bH + bE,
                a8 = bH - bE,
                a7 = bG + bF,
                a6 = bG - bF,
                a5 = bd + a7,
                a4 = bd - a7,
                a3 = bb + a9,
                a2 = bb - a9,
                bL[bB] = a5 + a3,
                bL[bB + 32] = a5 - a3,
                a1 = 0.707106781 * (a2 + a4),
                bL[bB + 16] = a4 + a1,
                bL[bB + 48] = a4 - a1,
                a5 = a6 + a8,
                a3 = a8 + ba,
                a2 = ba + bc,
                a0 = 0.382683433 * (a5 - a2),
                aZ = 0.5411961 * a5 + a0,
                aY = 1.306562965 * a2 + a0,
                aX = 0.707106781 * a3,
                o = bc + aX,
                bm = bc - aX,
                bL[bB + 40] = bm + aZ,
                bL[bB + 24] = bm - aZ,
                bL[bB + 8] = o + aY,
                bL[bB + 56] = o - aY,
                bB++
        }
        for (bA = 0; by > bA; ++bA) {
            bM = bL[bA] * bK[bA],
                aK[bA] = bM > 0 ? 0 | bM + 0.5 : 0 | bM - 0.5
        }
        return aK
    }

    function ag() {
        ai(65504),
            ai(16),
            aj(74),
            aj(70),
            aj(73),
            aj(70),
            aj(0),
            aj(1),
            aj(1),
            aj(0),
            ai(1),
            ai(1),
            aj(0),
            aj(0)
    }

    function af(e, d) {
        ai(65472),
            ai(17),
            aj(8),
            ai(d),
            ai(e),
            aj(3),
            aj(1),
            aj(17),
            aj(0),
            aj(2),
            aj(17),
            aj(1),
            aj(3),
            aj(17),
            aj(1)
    }

    function ae() {
        var e,
            d;
        for (ai(65499), ai(132), aj(0), e = 0; 64 > e; e++) {
            aj(aU[e])
        }
        for (aj(1), d = 0; 64 > d; d++) {
            aj(aT[d])
        }
    }

    function ad() {
        var j,
            i,
            p,
            o,
            n,
            m,
            l,
            k;
        for (ai(65476), ai(418), aj(0), j = 0; 16 > j; j++) {
            aj(ay[j + 1])
        }
        for (i = 0; 11 >= i; i++) {
            aj(ax[i])
        }
        for (aj(16), p = 0; 16 > p; p++) {
            aj(aw[p + 1])
        }
        for (o = 0; 161 >= o; o++) {
            aj(av[o])
        }
        for (aj(1), n = 0; 16 > n; n++) {
            aj(au[n + 1])
        }
        for (m = 0; 11 >= m; m++) {
            aj(at[m])
        }
        for (aj(17), l = 0; 16 > l; l++) {
            aj(ar[l + 1])
        }
        for (k = 0; 161 >= k; k++) {
            aj(aq[k])
        }
    }

    function ac() {
        ai(65498),
            ai(12),
            aj(3),
            aj(1),
            aj(0),
            aj(2),
            aj(17),
            aj(3),
            aj(17),
            aj(0),
            aj(63),
            aj(0)
    }

    function ab(N, M, L, K, J) {
        var G,
            C,
            B,
            A,
            z,
            y,
            x,
            p,
            n,
            m,
            I = J[0],
            H = J[240];
        var F = 16,
            E = 63,
            D = 64;
        for (C = ah(N, M), B = 0; D > B; ++B) {
            aJ[az[B]] = C[B]
        }
        for (A = aJ[0] - L, L = aJ[0], 0 == A ? ak(K[0]) : (G = 32767 + A, ak(K[aL[G]]), ak(aM[G])), z = 63; z > 0 && 0 == aJ[z]; z--) {
        }
        if (0 == z) {
            return ak(I),
                L
        }
        for (y = 1; z >= y;) {
            for (p = y; 0 == aJ[y] && z >= y; ++y) {
            }
            if (n = y - p, n >= F) {
                for (x = n >> 4, m = 1; x >= m; ++m) {
                    ak(H)
                }
                n = 15 & n
            }
            G = 32767 + aJ[y],
                ak(J[(n << 4) + aL[G]]),
                ak(aM[G]),
                y++
        }
        return z != E && ak(I),
            L
    }

    function aa() {
        var d,
            e = String.fromCharCode;
        for (d = 0; 256 > d; d++) {
            aC[d] = e(d)
        }
    }

    function c(e) {
        if (0 >= e && (e = 1), e > 100 && (e = 100), aA != e) {
            var d = 0;
            d = 50 > e ? Math.floor(5000 / e) : Math.floor(200 - 2 * e),
                ap(d),
                aA = e,
                console.log('Quality set to: ' + e + '%')
        }
    }

    function b() {
        var d,
            a = (new Date).getTime();
        aW || (aW = 50),
            aa(),
            an(),
            am(),
            al(),
            c(aW),
            d = (new Date).getTime() - a,
            console.log('Initialization ' + d + 'ms')
    }

    var aV,
        aU,
        aT,
        aS,
        aR,
        aQ,
        aP,
        aO,
        aN,
        aM,
        aL,
        aK,
        aJ,
        aI,
        aH,
        aG,
        aF,
        aE,
        aD,
        aC,
        aB,
        aA,
        az,
        ay,
        ax,
        aw,
        av,
        au,
        at,
        ar,
        aq;
    Math.round,
        aV = Math.floor,
        aU = new Array(64),
        aT = new Array(64),
        aS = new Array(64),
        aR = new Array(64),
        aM = new Array(65535),
        aL = new Array(65535),
        aK = new Array(64),
        aJ = new Array(64),
        aI = [],
        aH = 0,
        aG = 7,
        aF = new Array(64),
        aE = new Array(64),
        aD = new Array(64),
        aC = new Array(256),
        aB = new Array(2048),
        az = [
            0,
            1,
            5,
            6,
            14,
            15,
            27,
            28,
            2,
            4,
            7,
            13,
            16,
            26,
            29,
            42,
            3,
            8,
            12,
            17,
            25,
            30,
            41,
            43,
            9,
            11,
            18,
            24,
            31,
            40,
            44,
            53,
            10,
            19,
            23,
            32,
            39,
            45,
            52,
            54,
            20,
            22,
            33,
            38,
            46,
            51,
            55,
            60,
            21,
            34,
            37,
            47,
            50,
            56,
            59,
            61,
            35,
            36,
            48,
            49,
            57,
            58,
            62,
            63
        ],
        ay = [
            0,
            0,
            1,
            5,
            1,
            1,
            1,
            1,
            1,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        ax = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
        ],
        aw = [
            0,
            0,
            2,
            1,
            3,
            3,
            2,
            4,
            3,
            5,
            5,
            4,
            4,
            0,
            0,
            1,
            125
        ],
        av = [
            1,
            2,
            3,
            0,
            4,
            17,
            5,
            18,
            33,
            49,
            65,
            6,
            19,
            81,
            97,
            7,
            34,
            113,
            20,
            50,
            129,
            145,
            161,
            8,
            35,
            66,
            177,
            193,
            21,
            82,
            209,
            240,
            36,
            51,
            98,
            114,
            130,
            9,
            10,
            22,
            23,
            24,
            25,
            26,
            37,
            38,
            39,
            40,
            41,
            42,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            146,
            147,
            148,
            149,
            150,
            151,
            152,
            153,
            154,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            178,
            179,
            180,
            181,
            182,
            183,
            184,
            185,
            186,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250
        ],
        au = [
            0,
            0,
            3,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            0,
            0,
            0,
            0,
            0
        ],
        at = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
        ],
        ar = [
            0,
            0,
            2,
            1,
            2,
            4,
            4,
            3,
            4,
            7,
            5,
            4,
            4,
            0,
            1,
            2,
            119
        ],
        aq = [
            0,
            1,
            2,
            3,
            17,
            4,
            5,
            33,
            49,
            6,
            18,
            65,
            81,
            7,
            97,
            113,
            19,
            34,
            50,
            129,
            8,
            20,
            66,
            145,
            161,
            177,
            193,
            9,
            35,
            51,
            82,
            240,
            21,
            98,
            114,
            209,
            10,
            22,
            36,
            52,
            225,
            37,
            241,
            23,
            24,
            25,
            26,
            38,
            39,
            40,
            41,
            42,
            53,
            54,
            55,
            56,
            57,
            58,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            146,
            147,
            148,
            149,
            150,
            151,
            152,
            153,
            154,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            178,
            179,
            180,
            181,
            182,
            183,
            184,
            185,
            186,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250
        ],
        this.encode = function (T, S) {
            var Q,
                P,
                O,
                N,
                M,
                L,
                x,
                j,
                h,
                w,
                v,
                u,
                t,
                s,
                r,
                q,
                l,
                k,
                i,
                g,
                R = (new Date).getTime();
            for (S && c(S), aI = new Array, aH = 0, aG = 7, ai(65496), ag(), ae(), af(T.width, T.height), ad(), ac(), Q = 0, P = 0, O = 0, aH = 0, aG = 7, this.encode.displayName = '_encode_', N = T.data, M = T.width, L = T.height, x = 4 * M, h = 0; L > h;) {
                for (j = 0; x > j;) {
                    for (t = x * h + j, s = t, r = -1, q = 0, l = 0; 64 > l; l++) {
                        q = l >> 3,
                            r = 4 * (7 & l),
                            s = t + q * x + r,
                        h + q >= L && (s -= x * (h + 1 + q - L)),
                        j + r >= x && (s -= j + r - x + 4),
                            w = N[s++],
                            v = N[s++],
                            u = N[s++],
                            aF[l] = (aB[w] + aB[v + 256 >> 0] + aB[u + 512 >> 0] >> 16) - 128,
                            aE[l] = (aB[w + 768 >> 0] + aB[v + 1024 >> 0] + aB[u + 1280 >> 0] >> 16) - 128,
                            aD[l] = (aB[w + 1280 >> 0] + aB[v + 1536 >> 0] + aB[u + 1792 >> 0] >> 16) - 128
                    }
                    Q = ab(aF, aS, Q, aQ, aO),
                        P = ab(aE, aR, P, aP, aN),
                        O = ab(aD, aR, O, aP, aN),
                        j += 32
                }
                h += 8
            }
            return aG >= 0 && (k = [], k[1] = aG + 1, k[0] = (1 << aG + 1) - 1, ak(k)),
                ai(65497),
                i = 'data:image/jpeg;base64,' + btoa(aI.join('')),
                aI = [],
                g = (new Date).getTime() - R,
                console.log('Encoding time: ' + g + 'ms'),
                i
        },
        b()
}

function getImageDataFromImage(f) {
    var g,
        e = 'string' == typeof f ? document.getElementById(f) : f,
        h = document.createElement('canvas');
    return h.width = e.width,
        h.height = e.height,
        g = h.getContext('2d'),
        g.drawImage(e, 0, 0),
        g.getImageData(0, 0, h.width, h.height)
}

!function () {
    function h(m) {
        var o,
            n,
            f = m.naturalWidth,
            p = m.naturalHeight;
        return f * p > 1048576 ? (o = document.createElement('canvas'), o.width = o.height = 1, n = o.getContext('2d'), n.drawImage(m, -f + 1, 0), 0 === n.getImageData(0, 0, 1, 1).data[3]) : !1
    }

    function g(w, v, u) {
        var s,
            r,
            q,
            p,
            o,
            n,
            m,
            t = document.createElement('canvas');
        for (t.width = 1, t.height = u, s = t.getContext('2d'), s.drawImage(w, 0, 0), r = s.getImageData(0, 0, 1, u).data, q = 0, p = u, o = u; o > q;) {
            n = r[4 * (o - 1) + 3],
                0 === n ? p = o : q = o,
                o = p + q >> 1
        }
        return m = o / u,
            0 === m ? 1 : m
    }

    function l(f, d, n) {
        var m = document.createElement('canvas');
        return k(f, m, d, n),
            m.toDataURL('image/jpeg', d.quality || 0.8)
    }

    function k(N, M, L, K) {
        var E,
            D,
            C,
            B,
            A,
            z,
            y,
            x,
            e,
            b,
            a,
            J = N.naturalWidth,
            I = N.naturalHeight,
            H = L.width,
            G = L.height,
            F = M.getContext('2d');
        for (F.save(), j(M, F, H, G, L.orientation), E = h(N), E && (J /= 2, I /= 2), D = 1024, C = document.createElement('canvas'), C.width = C.height = D, B = C.getContext('2d'), A = K ? g(N, J, I) : 1, z = Math.ceil(D * H / J), y = Math.ceil(D * G / I / A), x = 0, e = 0; I > x;) {
            for (b = 0, a = 0; J > b;) {
                B.clearRect(0, 0, D, D),
                    B.drawImage(N, -b, -x),
                    F.drawImage(C, 0, 0, D, D, a, e, z, y),
                    b += D,
                    a += z
            }
            x += D,
                e += y
        }
        F.restore(),
            C = B = null
    }

    function j(m, f, p, o, n) {
        switch (n) {
            case 5:
            case 6:
            case 7:
            case 8:
                m.width = o,
                    m.height = p;
                break;
            default:
                m.width = p,
                    m.height = o
        }
        switch (n) {
            case 2:
                f.translate(p, 0),
                    f.scale(-1, 1);
                break;
            case 3:
                f.translate(p, o),
                    f.rotate(Math.PI);
                break;
            case 4:
                f.translate(0, o),
                    f.scale(1, -1);
                break;
            case 5:
                f.rotate(0.5 * Math.PI),
                    f.scale(1, -1);
                break;
            case 6:
                f.rotate(0.5 * Math.PI),
                    f.translate(0, -o);
                break;
            case 7:
                f.rotate(0.5 * Math.PI),
                    f.translate(p, -o),
                    f.scale(-1, 1);
                break;
            case 8:
                f.rotate(-0.5 * Math.PI),
                    f.translate(-p, 0)
        }
    }

    function i(f) {
        var e,
            n,
            m;
        if (window.Blob && f instanceof Blob) {
            if (e = new Image, n = window.URL && window.URL.createObjectURL ? window.URL : window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL : null, !n) {
                throw Error('No createObjectURL function found to create blob url')
            }
            e.src = n.createObjectURL(f),
                this.blob = f,
                f = e
        }
        f.naturalWidth || f.naturalHeight || (m = this, f.onload = function () {
            var d,
                p,
                o = m.imageLoadListeners;
            if (o) {
                for (m.imageLoadListeners = null, d = 0, p = o.length; p > d; d++) {
                    o[d]()
                }
            }
        }, this.imageLoadListeners = []),
            this.srcImage = f
    }

    i.prototype.render = function (B, A, z) {
        var y,
            x,
            w,
            v,
            u,
            t,
            s,
            r,
            q,
            d,
            c;
        if (this.imageLoadListeners) {
            return y = this,
                this.imageLoadListeners.push(function () {
                    y.render(B, A, z)
                }),
                void 0
        }
        A = A || {},
            x = this.srcImage.naturalWidth,
            w = this.srcImage.naturalHeight,
            v = A.width,
            u = A.height,
            t = A.maxWidth,
            s = A.maxHeight,
            r = !this.blob || 'image/jpeg' === this.blob.type,
            v && !u ? u = w * v / x << 0 : u && !v ? v = x * u / w << 0 : (v = x, u = w),
        t && v > t && (v = t, u = w * v / x << 0),
        s && u > s && (u = s, v = x * u / w << 0),
            q = {
                width: v,
                height: u
            };
        for (d in A) {
            q[d] = A[d]
        }
        c = B.tagName.toLowerCase(),
            'img' === c ? B.src = l(this.srcImage, q, r) : 'canvas' === c && k(this.srcImage, B, q, r),
        'function' == typeof this.onrender && this.onrender(B),
        z && z()
    },
        'function' == typeof define && define.amd ? define([], function () {
            return i
        }) : this.MegaPixImage = i
}();
(function (a) {
    a.fn.localResizeIMG = function (c) {
        a('#' + a(this).attr('id')).live({
            change: function (h) {
                if (this.files) {
                    var g = this.files[0],
                        i = (g.name || '').toLowerCase();
                    if ((a.inArray(g.type, [
                        'image/jpg',
                        'image/jpeg',
                        'image/bmp',
                        'image/png'
                    ]) >= 0 || i.endWith('.jpg') || i.endWith('.jpeg') || i.endWith('.png') || i.endWith('.bmp')) && c.cprs && (window.FileReader && window.File) && (g.size > 300 * 1024 && g.size < 5 * 1024 * 1024)) {
                        var d = d || webkitURL;
                        var f = d.createObjectURL(g);
                        if (a.isFunction(c.before)) {
                            c.before(this, f, g)
                        }
                        b(f, g);
                        this.value = ''
                    } else {
                        if (a.isFunction(c.unsupport)) {
                            c.unsupport()
                        }
                    }
                } else {
                    if (a.isFunction(c.unsupport)) {
                        c.unsupport()
                    }
                }
            }
        });

        function b(e) {
            var d = new Image();
            d.src = e;
            d.onload = function () {
                var j = this;
                var n = j.width,
                    i = j.height,
                    g = n / i;
                n = parseInt(c.cprs) * n / 100;
                i = n / g;
                var f = document.createElement('canvas');
                var o = f.getContext('2d');
                a(f).attr({
                    width: n,
                    height: i
                });
                o.drawImage(j, 0, 0, n, i);
                var k = f.toDataURL('image/jpeg', c.quality || 0.8);
                if (navigator.userAgent.match(/iphone/i)) {
                    var m = new MegaPixImage(d);
                    m.render(f, {
                        maxWidth: n,
                        maxHeight: i,
                        quality: c.quality || 0.8
                    });
                    k = f.toDataURL('image/jpeg', c.quality || 0.8)
                }
                if (navigator.userAgent.match(/Android/i)) {
                    var l = new JPEGEncoder();
                    k = l.encode(o.getImageData(0, 0, n, i), c.quality * 100 || 80)
                }
                var p = {
                    base64: k,
                    clearBase64: k.substr(k.indexOf(',') + 1)
                };
                c.success(p)
            }
        }
    }
})(jQuery);
jQuery.extend({
    handleError: function (b, d, a, c) {
        if (b.error) {
            b.error.call(b.context || b, d, a, c)
        }
        if (b.global) {
            (b.context ? jQuery(b.context) : jQuery.event).trigger('ajaxError', [
                d,
                b,
                c
            ])
        }
    },
    createUploadIframe: function (d, b) {
        var a = 'jUploadFrame' + d;
        var c = '<iframe id="' + a + '" name="' + a + '" style="position:absolute; top:-9999px; left:-9999px"';
        if (window.ActiveXObject) {
            if (typeof b == 'boolean') {
                c += ' src="javascript:false"'
            } else {
                if (typeof b == 'string') {
                    c += ' src="' + b + '"'
                }
            }
        }
        c += ' />';
        jQuery(c).appendTo(document.body);
        return jQuery('#' + a).get(0)
    },
    createUploadForm: function (a, j, d) {
        var h = 'jUploadForm' + a;
        var c = 'jUploadFile' + a;
        var b = jQuery('<form  action="" method="POST" name="' + h + '" id="' + h + '" enctype="multipart/form-data"></form>');
        if (d) {
            for (var e in d) {
                jQuery('<input type="hidden" name="' + e + '" value="' + d[e] + '" />').appendTo(b)
            }
        }
        var f = jQuery('#' + j);
        var g = jQuery(f).clone();
        jQuery(f).attr('id', c);
        jQuery(f).before(g);
        jQuery(f).appendTo(b);
        jQuery(b).css('position', 'absolute');
        jQuery(b).css('top', '-1200px');
        jQuery(b).css('left', '-1200px');
        jQuery(b).appendTo('body');
        return b
    },
    ajaxFileUpload: function (k) {
        k = jQuery.extend({}, jQuery.ajaxSettings, k);
        var a = new Date().getTime();
        var b = jQuery.createUploadForm(a, k.fileElementId, (typeof (k.data) == 'undefined' ? false : k.data));
        var i = jQuery.createUploadIframe(a, k.secureuri);
        var h = 'jUploadFrame' + a;
        var j = 'jUploadForm' + a;
        if (k.global && !jQuery.active++) {
            jQuery.event.trigger('ajaxStart')
        }
        var c = false;
        var f = {};
        if (k.global) {
            jQuery.event.trigger('ajaxSend', [
                f,
                k
            ])
        }
        var d = function (l) {
            var p = document.getElementById(h);
            try {
                if (p.contentWindow) {
                    f.responseText = p.contentWindow.document.body ? p.contentWindow.document.body.innerHTML : null;
                    f.responseXML = p.contentWindow.document.XMLDocument ? p.contentWindow.document.XMLDocument : p.contentWindow.document
                } else {
                    if (p.contentDocument) {
                        f.responseText = p.contentDocument.document.body ? p.contentDocument.document.body.innerHTML : null;
                        f.responseXML = p.contentDocument.document.XMLDocument ? p.contentDocument.document.XMLDocument : p.contentDocument.document
                    }
                }
            } catch (o) {
                jQuery.handleError(k, f, null, o)
            }
            if (f || l == 'timeout') {
                c = true;
                var m;
                try {
                    m = l != 'timeout' ? 'success' : 'error';
                    if (m != 'error') {
                        var n = jQuery.uploadHttpData(f, k.dataType);
                        if (k.success) {
                            k.success(n, m)
                        }
                        if (k.global) {
                            jQuery.event.trigger('ajaxSuccess', [
                                f,
                                k
                            ])
                        }
                    } else {
                        jQuery.handleError(k, f, m)
                    }
                } catch (o) {
                    m = 'error';
                    jQuery.handleError(k, f, m, o)
                }
                if (k.global) {
                    jQuery.event.trigger('ajaxComplete', [
                        f,
                        k
                    ])
                }
                if (k.global && !--jQuery.active) {
                    jQuery.event.trigger('ajaxStop')
                }
                if (k.complete) {
                    k.complete(f, m)
                }
                jQuery(p).unbind();
                setTimeout(function () {
                    try {
                        jQuery(p).remove();
                        jQuery(b).remove()
                    } catch (q) {
                        jQuery.handleError(k, f, null, q)
                    }
                }, 100);
                f = null
            }
        };
        if (k.timeout > 0) {
            setTimeout(function () {
                if (!c) {
                    d('timeout')
                }
            }, k.timeout)
        }
        try {
            var b = jQuery('#' + j);
            jQuery(b).attr('action', k.url);
            jQuery(b).attr('method', 'POST');
            jQuery(b).attr('target', h);
            if (b.encoding) {
                jQuery(b).attr('encoding', 'multipart/form-data')
            } else {
                jQuery(b).attr('enctype', 'multipart/form-data')
            }
            jQuery(b).submit()
        } catch (g) {
            jQuery.handleError(k, f, null, g)
        }
        jQuery('#' + h).load(d);
        return {
            abort: function () {
            }
        }
    },
    uploadHttpData: function (r, type) {
        var data = !type;
        data = type == 'xml' || data ? r.responseXML : r.responseText;
        if (data.indexOf('<script') > 0) {
            data = data.substring(0, data.indexOf('<script'))
        }
        if (type == 'script') {
            jQuery.globalEval(data)
        }
        if (type == 'json') {
            eval('data = ' + data)
        }
        if (type == 'html') {
            jQuery('<div>').html(data).evalScripts()
        }
        return data
    }
});
