//import { lch, toBase36, fromBase36 } from 'https://codepen.io/m-nakasato/pen/yyBOvYx.js'
 import { lch, toBase36, fromBase36 } from './util.js'

//import { Bg, Sprite, Character, Scr } from 'https://codepen.io/m-nakasato/pen/MYaQgZy.js'
 import { Bg, Sprite, Character, Scr } from './ppu.js'

let bgPlts = (
    '0d1707' + //roof
    // '203222' + //sea sky
    '20112c' + //sea sky
    '360a1a' + //sand
    // '0d1808' + //stage
    // '0d1303' + //stage
    // '0d1c0c' + //stage
    // '0d1202' + //stage
    // '0d1101' + //stage
    // '0d1000' + //stage
    '36170d' 
).match(/.{6}/g);
let bgPtns = [
  '0',
  '1,1,1,6,6,6,q,q',                        //1: roof l 1
  'q,2y,2y,2y,bu,bu,bu,1be',                //2: roof l 2
  '1be,1be,59m,59m,59m,l2i,l2i,l2i',        //3: roof l 3
  '1be,1be,59m,59m,59m,l2i,l2i,gut',        //4: roof l 3b
  'cn4,cn4,cn4,sg0,sg0,sg0,we8,we8',        //5: roof r 1
  'we8,xds,xds,xds,xmo,xmo,xmo,xow',        //6: roof r 2
  'xow,xow,xpg,xpg,xpg,xpl,xpl,xpl',        //7: roof r 3
  'xow,xow,xpg,xpg,xpg,xpl,xpl,gut',        //8: roof r 3b
  'gut,xpm,xpm,xpm,xpm,xpm,xpm,xpm',        //9: roof t
  'xpm,xpm,xpm,xpm,xpm,xpm,xpm,gut',        //10: roof b
  'xpm,xpm,xpm,xpm,xpm,xpm,xpm,xpm',        //11: roof m / sky (all 2)
  'pa7,pa7,pa7,pa7,pa7,pa7,pa7,gut',        //12: roof edge l
  '1ekf,1ekf,1ekf,1ekf,1ekf,1ekf,1ekf,gut', //13: roof edge m
  '1ekd,1ekd,1ekd,1ekd,1ekd,1ekd,1ekd,gut', //14: roof edge r
  'gut,gut,gut,pa7,pa7,pa7,pa7,pa7',        //15: shadow l
  'gut,gut,gut,1ekf,1ekf,1ekf,1ekf,1ekf',   //16: shadow m
  'gut,gut,gut,1ekd,1ekd,1ekd,1ekd,1ekd',   //17: shadow r
  'pa7,pa7,pa7,pa7,pa7,pa7,pa7,pa7',        //18: wall l
  '1ekf,1ekf,1ekf,1ekf,1ekf,1ekf,1ekf,1ekf',//19: wall m / sea (all 3)
  '1ekd,1ekd,1ekd,1ekd,1ekd,1ekd,1ekd,1ekd',//20: wall r
  'xgq,wnu,ti2,thy,thy,gut,gut,gut',        //21: cloud t
  'xnp,xg5,xg5,wnp,wnp,wnp,thx,thx',        //22: cloud l
  'l2i,hwq,hpm,gx6,gx6,gve,guy,guu',        //23: cloud r
  'gut,hud,k2d,gut,gut,gut,gut,gut',        //24: cloud m 1
  'h45,hnd,k0m,thx,thx,gx1,gux,gut',        //25: cloud m 2
  'gut,gut,gut,gut,gut,gut,gut,gut',        //26: cloud m 3 (all 1)
  'gut,gut,gut,gut,xpm,qyw,6qq,qyw',        //27: sand
  '6cg,ea,6cg,ea,0,6cg,0,ea',               //28: sand
  'xpm,xpm,xpm,xpm,1ekf,1ekf,1ekf,1ekf',    //29: sky sea
];
let bg = new Bg(bgPlts, bgPtns);
//0: pltId, 1: ptnIdLT, 2: ptnIdRT, 3: ptnIdLB, 4: ptnIdRB, 5: c, 6: r
let bgData = [
  //roof left
  [0, 0, 1, 0, 2, 1, 6],
  [0, 0, 3, 1, 11, 1, 7],
  [0, 2, 11, 3, 11, 1, 8],
  [0, 0, 1, 0, 2, 0, 9],
  [0, 0, 3, 1, 11, 0, 10],
  [0, 2, 11, 4, 10, 0, 11],
  [0, 12, 13, 0, 15, 0, 12],
  [0, 0, 18, 0, 18, 0, 13],
  [0, 0, 18, 0, 18, 0, 14],
  //roof right
  [0, 5, 0, 6, 0, 14, 6],
  [0, 7, 0, 11, 5, 14, 7],
  [0, 11, 6, 11, 7, 14, 8],
  [0, 5, 0, 6, 0, 15, 9],
  [0, 7, 0, 11, 5, 15, 10],
  [0, 11, 6, 10, 8, 15, 11],
  [0, 13, 14, 17, 0, 15, 12],
  [0, 20, 0, 20, 0, 15, 13],
  [0, 20, 0, 20, 0, 15, 14],
  //cloud
  [1, 11, 11, 11, 11, 0, 0],
  [1, 11, 21, 22, 24, 1, 0],
  [1, 21, 11, 25, 23, 2, 0],
  [1, 11, 22, 22, 24, 0, 1],
  [1, 25, 26, 24, 25, 1, 1],
  [1, 24, 24, 26, 24, 2, 1],
  [1, 23, 11, 25, 24, 3, 1],
  [1, 22, 23, 25, 24, 4, 1],
  [1, 11, 11, 23, 11, 5, 1],
];
for (let r = 0; r < 15; r++) {
  for (let c = 0; c < 16; c++) {
    //sky
    // if (r == 0) bgData.push([1, 11, 11, 11, 11, c, r]);
    if (r == 0 && c > 2) bgData.push([1, 11, 11, 11, 11, c, r]);
    if (r == 1 && c > 5) bgData.push([1, 11, 11, 11, 11, c, r]);
    //sea
    if (r == 2) bgData.push([1, 29, 29, 19, 19, c, r]);
    if (r == 3) bgData.push([1, 19, 19, 19, 19, c, r]);
    //sand
    if (r == 4) bgData.push([2, 27, 27, 28, 28, c, r]);
    //roof
    if (r == 6 && c > 1 && c < 14) bgData.push([0, 9, 9, 11, 11, c, r]);
    if (r > 6 && r < 9 && c > 1 && c < 14) bgData.push([0, 11, 11, 11, 11, c, r]);
    if (r > 8 && r < 11 && c > 0 && c < 15) bgData.push([0, 11, 11, 11, 11, c, r]);
    if (r == 11 && c > 0 && c < 15) bgData.push([0, 11, 11, 10, 10, c, r]);
    if (r == 12 && c > 0 && c < 15) bgData.push([0, 13, 13, 16, 16, c, r]);
    if (r > 12 && c > 0 && c < 15) bgData.push([0, 19, 19, 19, 19, c, r]);
  }
}
bg.set(bgData);

let sprPlts = (
    '0d2d36' + //0: black cat
    '0d2036' + //1: white cat
    '163a15'   //2: impact energy
).match(/.{6}/g);
let sprPtns = [
  '0',
  '3y8,4zk,61h,696,696,622,59m,59m',   //1: headL 1
  'k,9w,h4k,xpw,xpw,xpg,xpg,xpg',      //2: headR 1
  '59p,1bh,1be,9m,1ba,59l,l2h,kva',    //3: faceL 1
  'xus,xus,10uo,1b28,xds,h1c,xow,xpg', //4: faceR 1
  'l0a,l2i,59m,1be,1be,1be,1be,1be',   //5: bodyL 1
  'xpg,xnt,xih,wx5,wx5,xic,xn4,xmo',   //6: bodyR 1
  '59m,59m,596,59h,l1s,l1x,l1x,47p',   //7: legL 1
  'xmo,xow,uj4,l2c,59g,h49,h49,gus',   //8: legR 1
  '0,3y8,4zk,61h,696,696,622,59m',     //9: headL 2
  '0,k,9w,h4k,xpw,xpw,xpg,xpg',        //10: headR 2
  '59m,59p,1bh,1be,bu,9m,1b9,59l',     //11: faceL 2
  'xpg,xus,xus,10uo,1b28,xfk,h3k,xpg', //12: faceR 2
  'l2h,kva,l0a,59m,1be,1be,1be,1be',   //13: bodyL 2
  'xpg,xpg,xnt,xih,wx5,wx5,xic,xn4',   //14: bodyR 2
  '1be,1be,1ba,1b9,59g,59h,hwl,47p',   //15: legL 2
  'xmo,xmo,kzk,kzk,kzk,l1s,l1w,guo',   //16: legR 2
  'xus,xus,10uo,1b28,xds,h1x,xpm,xpm', //17: faceR p1
  'xpm,xn9,xmo,xmo,xmo,xmo,xmo,xmo',   //18: bodyR p1
  '0,0,0,0,0,gus,xpl,xih',             //19: punchT 1
  'gx5,2c,0,0,0,0,0,0',                //20: punchB 1
  '0,0,cu8,45c,8w,9g,28,1s',           //21: impact
  '6az,5wr,6az,1at,b9,9m,1b9,59l',     //22: damage1 faceL
  '1dic,o10,1cpc,uj4,ugw,wn4,hw0,xpg', //23: damage1 faceR
  '0,0,0,xpm,xpm,0,0,0',               //24: energy 8:0
  '0,0,0,xpn,xpn,0,0,0',               //25: energy 7:1
  '0,0,0,xpr,xpr,0,0,0',               //26: energy 6:2
  '0,0,0,xq7,xq7,0,0,0',               //27: energy 5:3
  '0,0,0,xrz,xrz,0,0,0',               //28: energy 4:4
  '0,0,0,xz3,xz3,0,0,0',               //29: energy 3:5
  '0,0,0,yrj,yrj,0,0,0',               //30: energy 2:6
  '0,0,0,11xb,11xb,0,0,0',             //31: energy 1:7
  '0,0,0,1ekf,1ekf,0,0,0',             //32: energy 0:8
  '0,8w,b8,dl,e2,e2,dm,bu',            //33: headL p2
  '0,5,p,gvd,xpl,xpl,xpl,xpl',         //34: headR p2
  'bu,bu,2y,2y,q,2d,2y,bu',            //35: faceL p2
  'xpl,1779,1779,xwp,yjo,gut,xpm,xpm', //36: faceR p2
  'bu,bu,bu,1be,1be,1be,1be,1be',      //37: bodyL p2
  'xpm,xg5,wvd,xnt,xn8,xmo,xmo,xmo',   //38: bodyR p2
  'xow,xpg,ujt,h49,59g,hwk,h45,gus',   //39: legR p2
  '59p,1bh,1be,bu,2d,2y,bu,bu',        //40: faceL k1
  'xus,xus,10uo,1b28,kqo,tfk,xg0,wx0', //41: faceR k1
  'be,be,bq,bq,bt,bu,2y,47u',          //42: bodyL k1
  'ujo,xpg,xow,xg4,h44,xpg,uj4,ujo',   //43: bodyR k1
  'l2d,47k,0,0,0,2d,47p,1',            //44: legL k1
  'hwk,hwk,k0g,kzk,kzk,l1s,l1w,guo',   //45: legR k1
  '59m,59p,1bh,192,bt,bu,1be,1bd',     //46: faceL k2
  'xpg,xus,xus,10uo,gu8,xn9,xnu,xp6',  //47: faceR k2
  '59i,59i,l22,l22,l0a,45i,p,489',     //48: bodyL k2
  'xp1,xne,wq2,xpm,xpm,xpl,xp0,ksw',   //49: bodyR k2
  'l1s,l1s,l1s,l1s,hu8,l1s,m1g,guo',   //50: legR k2
  '0,0,0,0,0,9g,h4p,l4d',              //51: kickT
  'xrt,xn8,wlc,sg0,cn4,0,0,0',         //52: kickB
  '1,1,1,1,6,q,2y,gx6',                //53: damage2 headM
  'fsw,zk0,11c1,ym9,xox,xph,xph,xih',  //54: damage2 faceR
  '0,glc,1atc,10jk,xds,xds,xds,xds',   //55: damage2 armR
  'l2i,p0q,696,1ih,bu,2y,m,11x',       //56: damage2 faceL
  'wo9,xih,luh,huu,kva,wwq,xgq,h4a',   //57: damage2 faceM
  'xds,xds,xds,xds,xds,xmo,xow,xpg',   //58: damage2 bodyR
  '622,5gq,622,11x,0,0,0,0',           //59: damage2 armL
  'xpm,xpm,xpm,gve,q,6,1,0',           //60: damage2 bodyL
  'xpl,xpm,xpm,xpm,xpm,xpm,xpm,l2h',   //61: damage2 bodyM
  '2c,gz1,xpl,xq5,xq5,wno,fsw,cn4',    //62: damage2 legR
  '59i,59h,58w,58w,o7k,lao,ogg,474',   //63: damage2 legL
  'sg0,we8,kr8,57t,1bd,9g,0,0',        //64: damage2 tailM
  '45c,kzk,l1x,l22,huy,k2y,kve,l0q',        //65: win headL
  'l0p,l0m,l0q,57e,592,59h,59m,59m',        //66: win faceL
  'xic,k84,10uo,1b28,xds,h1c,xow,xpg',        //67: win faceR
  '59m,59m,59m,1be,1be,1be,1be,1be',        //68: win bodyL
];

//key, pltId, ptnId, c, r, h = 0, v = 0
let pcBodySprMap = [
  //0: stand1
  [
    ['hL', 0, 1, 0, 0],
    ['hR', 0, 2, 1, 0],
    ['fL', 0, 3, 0, 1],
    ['fR', 0, 4, 1, 1],
    ['bL', 0, 5, 0, 2],
    ['bR', 0, 6, 1, 2],
    ['lL', 0, 7, 0, 3],
    ['lR', 0, 8, 1, 3]
    // ['lR', 7, 1, 3, 1]
  ],
  //1: stand2
  [
    ['hL', 0, 9, 0, 0],
    ['hR', 0, 10, 1, 0],
    ['fL', 0, 11, 0, 1],
    ['fR', 0, 12, 1, 1],
    ['bL', 0, 13, 0, 2],
    ['bR', 0, 14, 1, 2],
    ['lL', 0, 7, 0, 3],
    ['lR', 0, 8, 1, 3]
  ],
  //2: move
  [
    ['hL', 0, 9, 0, 0],
    ['hR', 0, 10, 1, 0],
    ['fL', 0, 11, 0, 1],
    ['fR', 0, 12, 1, 1],
    ['bL', 0, 13, 0, 2],
    ['bR', 0, 14, 1, 2],
    ['lL', 0, 15, 0, 3],
    ['lR', 0, 16, 1, 3]
  ],
  //3: punch1
  [
    ['hL', 0, 1, 0, 0],
    ['hR', 0, 2, 1, 0],
    ['fL', 0, 3, 0, 1],
    ['fR', 0, 17, 1, 1],
    ['bL', 0, 5, 0, 2],
    ['bR', 0, 18, 1, 2],
    ['lL', 0, 7, 0, 3],
    ['lR', 0, 8, 1, 3]
  ],
  //4: damage1
  [
    ['hL', 0, 10, 0, 0, 1],
    ['hR', 0, 9, 1, 0, 1],
    ['fL', 0, 22, 0, 1],
    ['fR', 0, 23, 1, 1],
    ['bL', 0, 13, 0, 2],
    ['bR', 0, 14, 1, 2],
    ['lL', 0, 7, 0, 3],
    ['lR', 0, 8, 1, 3]
  ],
  //5: punch2
  [
    ['hL', 0, 33, 0, 0],
    ['hR', 0, 34, 1, 0],
    ['fL', 0, 35, 0, 1],
    ['fR', 0, 36, 1, 1],
    ['bL', 0, 37, 0, 2],
    ['bR', 0, 38, 1, 2],
    ['lL', 0, 7, 0, 3],
    ['lR', 0, 39, 1, 3]
  ],
  //6: kick1
  [
    ['hL', 0, 1, 0, 0],
    ['hR', 0, 2, 1, 0],
    ['fL', 0, 40, 0, 1],
    ['fR', 0, 41, 1, 1],
    ['bL', 0, 42, 0, 2],
    ['bR', 0, 43, 1, 2],
    ['lL', 0, 44, 0, 3],
    ['lR', 0, 45, 1, 3]
  ],
  //7: kick2
  [
    ['hL', 0, 9, 0, 0],
    ['hR', 0, 10, 1, 0],
    ['fL', 0, 46, 0, 1],
    ['fR', 0, 47, 1, 1],
    ['bL', 0, 48, 0, 2],
    ['bR', 0, 49, 1, 2],
    ['lL', 0, 44, 0, 3],
    ['lR', 0, 50, 1, 3]
  ],
//key, pltId, ptnId, c, r, h = 0, v = 0
  //8: damage2
  [
    ['hL', 0, 0, 0, 0],
    ['hR', 0, 0, 0, 0],
    ['fL', 0, 56, -1, 1],
    ['fR', 0, 54, 0, 0],
    ['bL', 0, 60, 0, 2],
    ['bR', 0, 58, 1, 1],
    ['lL', 0, 63, 1, 3],
    ['lR', 0, 62, 2, 2],
    ['hM', 0, 53, -1, 0],
    ['aL', 0, 59, -1, 2],
    ['aR', 0, 55, 1, 0],
    ['fM', 0, 57, 0, 1],
    ['bM', 0, 61, 1, 2],
    ['tM', 0, 64, 2, 3],
  ],
  //9: damage2-none
  [
    ['hL', 0, 0, 0, 0],
    ['hR', 0, 0, 0, 0],
    ['fL', 0, 0, -1, 1],
    ['fR', 0, 0, 0, 0],
    ['bL', 0, 0, 0, 2],
    ['bR', 0, 0, 1, 1],
    ['lL', 0, 0, 1, 3],
    ['lR', 0, 0, 2, 2],
    ['hM', 0, 0, -1, 0],
    ['aL', 0, 0, -1, 2],
    ['aR', 0, 0, 1, 0],
    ['fM', 0, 0, 0, 1],
    ['bM', 0, 0, 1, 2],
    ['tM', 0, 0, 2, 3],
  ],
  //10: win
  [
    ['hL', 0, 65, 0, 0],
    ['hR', 0, 2, 1, 0],
    ['fL', 0, 66, 0, 1],
    ['fR', 0, 67, 1, 1],
    ['bL', 0, 68, 0, 2],
    ['bR', 0, 6, 1, 2],
    ['lL', 0, 7, 0, 3],
    ['lR', 0, 8, 1, 3]
  ],
];
/*
  '45c,kzk,l1x,l22,huy,k2y,kve,l0q',        //65: win headL
  'l0p,l0m,l0q,57e,592,59h,59m,59m',        //66: win faceL
  'xic,k84,10uo,1b28,xds,h1c,xow,xpg',        //67: win faceR
  '59m,59m,59m,1be,1be,1be,1be,1be',        //68: win bodyL
*/
//key, pltId, ptnId, c, r, h = 0, v = 0
let pcAttackSprMap = [
  //0: none
  [
    ['p1TL', 0, 0, 0, 0],
    ['p1TR', 0, 0, 1, 0],
    ['p1BL', 0, 0, 0, 1],
    ['p1BR', 0, 0, 1, 1]
  ],
  //1: punch1
  [
    ['p1TL', 0, 19, 0, 0],
    ['p1TR', 0, 0, 1, 0],
    ['p1BL', 0, 20, 0, 1],
    ['p1BR', 0, 0, 1, 1]
  ],
  //2: punch1 with impact
  [
    ['p1TL', 0, 19, 0, 0],
    ['p1TR', 2, 21, 1, 0],
    ['p1BL', 0, 20, 0, 1],
    ['p1BR', 2, 21, 1, 1, 0, 1]
  ],
  //3: kick with impact
  [
    ['p1TL', 0, 51, 0, 0],
    ['p1TR', 2, 21, 1, 0],
    ['p1BL', 0, 52, 0, 1],
    ['p1BR', 2, 21, 1, 1, 0, 1]
  ],
];
//key, pltId, ptnId, c, r, h = 0, v = 0
let pcEnergySprMap = [
  //0: 0/16
  [
    ['l', 2, 32, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //1: 1/16
  [
    ['l', 2, 31, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //2: 2/16
  [
    ['l', 2, 30, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //3: 3/16
  [
    ['l', 2, 29, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //4: 4/16
  [
    ['l', 2, 28, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //5: 5/16
  [
    ['l', 2, 27, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //6: 6/16
  [
    ['l', 2, 26, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //7: 7/16
  [
    ['l', 2, 25, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //8: 8/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 32, 1, 0]
  ],
  //9: 9/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 31, 1, 0]
  ],
  //10: 10/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 30, 1, 0]
  ],
  //11: 11/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 29, 1, 0]
  ],
  //12: 12/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 28, 1, 0]
  ],
  //13: 13/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 27, 1, 0]
  ],
  //14: 14/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 26, 1, 0]
  ],
  //15: 15/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 25, 1, 0]
  ],
  //16: 16/16
  [
    ['l', 2, 24, 0, 0],
    ['r', 2, 24, 1, 0]
  ],
];

let enemyBodySprMap = pcBodySprMap.map(ptn => ptn.map(spr => [spr[0], 1, spr[2], spr[3], spr[4], spr[5], spr[6]]));
let enemyAttackSprMap = pcAttackSprMap.map(ptn => ptn.map(spr => [spr[0], spr[1] / 2 + 1, spr[2], spr[3], spr[4], spr[5], spr[6]]));

let ally1 = new Character('ally1', sprPlts, sprPtns, 16 * 2.5, 16 * 5);
ally1.setBody(pcBodySprMap, 0, 0, 2, 4);
ally1.setAttack(pcAttackSprMap, 16, 8, 2, 2);
ally1.setEnergy(pcEnergySprMap, 0, -8, 2, 1);

//  constructor(plts, ptns, x, y, z = 0, way = 0) {
let pc = new Character('pc', sprPlts, sprPtns, 16 * 1.75, 16 * 7.25);
//sprMap, xos, yos, c, r, h, v
pc.setBody(pcBodySprMap, 0, 0, 2, 4);
pc.setAttack(pcAttackSprMap, 16, 8, 2, 2);
pc.setEnergy(pcEnergySprMap, 0, -8, 2, 1);

let ally2 = new Character('ally2', sprPlts, sprPtns, 16 * 1, 16 * 9.5);
ally2.setBody(pcBodySprMap, 0, 0, 2, 4);
ally2.setAttack(pcAttackSprMap, 16, 8, 2, 2);
ally2.setEnergy(pcEnergySprMap, 0, -8, 2, 1);

let enemy1 = new Character('enemy1', sprPlts, sprPtns, 16 * 12.5, 16 * 5);
enemy1.setBody(enemyBodySprMap, 0, 0, 2, 4);
enemy1.setAttack(enemyAttackSprMap, 16, 8, 2, 2);
enemy1.setEnergy(pcEnergySprMap, 0, -8, 2, 1);
enemy1.turn();

let enemy2 = new Character('enemy2', sprPlts, sprPtns, 16 * 13.25, 16 * 7.25);
enemy2.setBody(enemyBodySprMap, 0, 0, 2, 4);
enemy2.setAttack(enemyAttackSprMap, 16, 8, 2, 2);
enemy2.setEnergy(pcEnergySprMap, 0, -8, 2, 1);
enemy2.turn();

let enemy3 = new Character('enemy3', sprPlts, sprPtns, 16 * 14, 16 * 9.5);
enemy3.setBody(enemyBodySprMap, 0, 0, 2, 4);
enemy3.setAttack(enemyAttackSprMap, 16, 8, 2, 2);
enemy3.setEnergy(pcEnergySprMap, 0, -8, 2, 1);
enemy3.turn();

let chrs = new Map();
chrs.set('enemy3', enemy3);
chrs.set('enemy2', enemy2);
chrs.set('enemy1', enemy1);
chrs.set('ally2', ally2);
chrs.set('pc', pc);
chrs.set('ally1', ally1);
enemy3.setChrs(chrs);
enemy2.setChrs(chrs);
enemy1.setChrs(chrs);
ally2.setChrs(chrs);
pc.setChrs(chrs);
ally1.setChrs(chrs);

let scr = new Scr(document.querySelector('#scr'), '1a', 3);
scr.setBg(bg);
chrs.forEach(chr => {
  scr.setChr(chr);
  chr.animate([0, 1], 250);
});

let mv = {x: 0, y: 0};
let mvId = setInterval(() => {
  if (mv.x == 0 && mv.y == 0) return;
  if (pc.way == 0 && mv.x < 0 || pc.way == 1 && mv.x > 0) pc.turn();
  if (!pc.collision(mv.x, mv.y) &&  pc.energyVal > 0) {
    pc.move(mv.x, mv.y, pc.z);
    if (pc.drop()) {
      clearInterval(mvId);
      pc.animate([8], 250);
    }
  }
}, 25);

function walk(axis, val) {
  if (pc.z || pc.energyVal < 1) {
    mv = {x: 0, y: 0};
    return;
  }
  mv[axis] = val;
  // console.log(pc.energyVal);
  pc.animate([2, 0], 250);
}

function stop(axis) {
  mv[axis] = 0;
  if (mv.x == 0 && mv.y == 0) pc.animate([0, 1], 250);
}

let bodySprIds = [[3], [5], [6, 7]], attackSprIds = [[2, 2], [2, 2], [0, 3]], wait = false;
function pcAttack() {
  //waitはプレイヤー用
  if (wait) return;
  wait = true;
  setTimeout(() => wait = false, 250);
  attack(pc);
}

document.querySelector('#l').onpointerdown = () => walk('x', -1);
document.querySelector('#r').onpointerdown = () => walk('x', 1);
document.querySelector('#u').onpointerdown = () => walk('y', -1);
document.querySelector('#d').onpointerdown = () => walk('y', 1);
document.querySelector('#l').onpointerup = () => stop('x');
document.querySelector('#r').onpointerup = () => stop('x');
document.querySelector('#u').onpointerup = () => stop('y');
document.querySelector('#d').onpointerup = () => stop('y');

document.querySelector('#lu').onpointerdown = () => {walk('x', -1);walk('y', -1)};
document.querySelector('#ru').onpointerdown = () => {walk('x', 1);walk('y', -1)};
document.querySelector('#ld').onpointerdown = () => {walk('x', -1);walk('y', 1)};
document.querySelector('#rd').onpointerdown = () => {walk('x', 1);walk('y', 1)};
document.querySelector('#lu').onpointerup = () => {stop('x');stop('y')};
document.querySelector('#ru').onpointerup = () => {stop('x');stop('y')};
document.querySelector('#ld').onpointerup = () => {stop('x');stop('y')};
document.querySelector('#rd').onpointerup = () => {stop('x');stop('y')};

document.onkeydown = e => {
  if (e.repeat || pc.energyVal < 1) return;
  // console.log(e.key)
  let k = e.key;
  if (k == ' ') {
    let target = pcAttack();
    if (target) 
      console.log(target);
  } //攻撃中は移動したくない
  if (k == 'ArrowLeft' || k == 'a') walk('x', -1);
  if (k == 'ArrowRight' || k == 'd') walk('x', 1);
  if (k == 'ArrowDown' || k == 's') walk('y', 1);
  if (k == 'ArrowUp' || k == 'w') walk('y', -1);
};
document.onkeyup = e => {
  if (pc.energyVal < 1) return;
  let k = e.key;
  if (k == 'ArrowLeft' || k == 'a') stop('x');
  if (k == 'ArrowRight' || k == 'd') stop('x');
  if (k == 'ArrowDown' || k == 's') stop('y');
  if (k == 'ArrowUp' || k == 'w') stop('y');
};

document.querySelector('#attack').onclick = () => pcAttack();

// document.querySelector('#enemy2').onclick = () => auto(enemy2);

function auto(chr, enemies) {
  let directions = ['n', 'e', 's', 'w'];
  enemies.forEach(enemy => {
    if (enemy.y < chr.y - 16) directions.push('n','n','n','n','n','n','n','n','n');
    if (enemy.x > chr.x + 16) directions.push('e','e','e','e','e','e','e','e','e');
    if (enemy.y > chr.y + 16) directions.push('s','s','s','s','s','s','s','s','s');
    if (enemy.x < chr.x - 16) directions.push('w','w','w','w','w','w','w','w','w');
  });
  let direction = directions[Math.floor(Math.random() * directions.length)];
  let distance = 8 * Math.ceil(Math.random() * 3);
  chr.walk(direction, distance, mode => {
    if (mode == 'drop') {
      chr.animate([8], 250);
    } else if(mode == 'stop') {
      // attack(chr);
      if (chr.energyVal > 0) attack(chr);
    }
  });
  if (chr.energyVal > 0) chr.animate([2, 0], 250);
}

function attack(self) {
  let target = self.collision(0, 0, 1);
  if (target) {
    if (self.way == target.way) target.turn();
    let attackSprId = self.attackCnt % attackSprIds.length;
    if (self.energyVal > 0) self.animate(bodySprIds[attackSprId], 125);
    self.attack(attackSprIds[attackSprId], 125);
    let damegeVal = attackSprId == attackSprIds.length - 1 ? 2 : 1;
    // target.damage(1, [4], mode => {
    target.damage(damegeVal, [4], mode => {
      if (mode == 'drop') {
        target.animate([8], 250);
      } else if (mode == 'lose') {
        target.animate([8, 9], 250)
        setTimeout(() => {
          target.animate([9], 250);
          chrs.delete(target.name);
        }, 1500);
      }
    });
  } else {
    //空振り
    self.animate([3], 125);
    self.attack([1, 1], 125);
  }
  setTimeout(() => {
    self.animate([0, 1], 250);
  }, 250);
}

let autoId = setInterval(() => {
  chrs.forEach(chr => {
    let enemies;
    if (chr.name == 'pc') {
      return;
    } else if (chr.name == 'ally1' || chr.name == 'ally2') {
      enemies = [enemy1, enemy2, enemy3];
    } else {
      enemies = [ally1, pc, ally2];
    }
    // if (Math.random() > 0.8) auto(chrs.get(chr.name), enemies.filter(e => chrs.has(e.name)));
    if (Math.random() > 0.5) auto(chrs.get(chr.name), enemies.filter(e => chrs.has(e.name)));
  });
  // console.log(chrs.keys());
}, 500);

document.addEventListener('touchmove', e => {
  document.querySelector('#debug').innerText = e.scale;
  if (e.scale !== 1) e.preventDefault();
}, {passive: false});

function judge() {
  let black = 0, white = 0;
  if (chrs.has('pc')) black++;
  if (chrs.has('ally1')) black++;
  if (chrs.has('ally2')) black++;
  if (chrs.has('enemy1')) white++;
  if (chrs.has('enemy2')) white++;
  if (chrs.has('enemy3')) white++;
  if (black == 0) {
    if (chrs.has('enemy1')) enemy1.animate([10], 250);
    if (chrs.has('enemy2')) enemy2.animate([10], 250);
    if (chrs.has('enemy3')) enemy3.animate([10], 250);
    return 'white';
  } else if (white == 0) {
    if (chrs.has('pc')) pc.animate([10], 250);
    if (chrs.has('ally1')) ally1.animate([10], 250);
    if (chrs.has('ally2')) ally2.animate([10], 250);
    return 'black';
  }
}

function draw() {
  scr.draw();
  let result = judge();
  if (result) {
    // alert(result + ' wins!');
    // return;
    clearInterval(mvId);
    clearInterval(autoId);
  }
  requestAnimationFrame(draw);
}

draw();

function adjustContainer() {
  let scale;
  if (window.innerWidth < window.innerHeight) {
    scale = window.innerWidth / document.querySelector('#scr').width;
  } else {
    scale = window.innerHeight / document.querySelector('#scr').height;
    document.querySelector('#ctrl').style.display = 'none';
  }
  // document.querySelector('#scr').style.transform = 'scale(' + scale + ')';
  // document.querySelector('#scrDiv').style.width = document.querySelector('#scr').width * scale + 'px'
  document.querySelector('#scrDiv').style.width = document.querySelector('#scr').width + 'px'
  // alert(document.querySelector('#scrDiv').style.width);
}

window.onload = function() {
  adjustContainer();
}