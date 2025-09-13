//import { lch, toBase36, fromBase36 } from 'https://codepen.io/m-nakasato/pen/yyBOvYx.js'
 import { lch, toBase36, fromBase36 } from './util.js'

class Bg {
  #plts;
  #ptns;
  #blk = [...Array(16)].map(() => Array(15));
  #chrs = [];
  constructor(plts, ptns) {
    this.#plts = plts;
    this.#ptns = ptns;
  }
  //0: pltId, 1: ptnIdLT, 2: ptnIdRT, 3: ptnIdLB, 4: ptnIdRB, 5: c, 6: r
  set(bgData) {
    bgData.forEach(b => {
      this.#blk[b[6]][b[5]] = {pltId: b[0], ptnId: [b[1], b[2], b[3], b[4]]};
    });
    this.#chrs = this.#makeChrs();
  }
  #makeChrs() {
    let chrs = [];
    this.#blk.forEach((r, _r) => {
      r.forEach((c, _c) => {
        if (!c) return;
        c.ptnId.forEach((ptnId, i) => {
          chrs.push({
            plt: this.#plts[c.pltId].match(/.{2}/g),
            ptn: fromBase36(this.#ptns[ptnId]),
            x: _c * 16 + (i % 2) * 8,
            y: _r * 16 + Math.floor(i / 2) * 8
          });
        });
      });
    });
    return chrs;
  }
  get() {
    return this.#chrs;
  }
}

class Sprite {
  #sprites = {};
  #plts; #ptns; #x; #y; #c; #r; #h; #v;
  constructor(plts, ptns, x, y, c, r, h = 0, v = 0) {
    this.#plts = plts;
    this.#ptns = ptns;
    this.#x = x;
    this.#y = y;
    this.#c = c;
    this.#r = r;
    this.#h = h;
    this.#v = v;
  }
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  get c() {
    return this.#c;
  }
  get r() {
    return this.#r;
  }
  set x(x) {
    this.#x = x;
  }
  set y(y) {
    this.#y = y;
  }
  set h(h) {
    this.#h = h;
    Object.values(this.#sprites).forEach(s => {
      s.ptn.map(row => row.reverse());
      s.c = this.#c - 1 - s.c;
    });
  }
  set v(v) {
    this.#v = v;
    Object.values(this.#sprites).forEach(s => {
      s.ptn.reverse();
      s.r = this.#r - 1 - s.r;
    });
  }
  set(key, pltId, ptnId, c, r, h = 0, v = 0) {
    let plt = this.#plts[pltId].match(/.{2}/g);
    let ptn = fromBase36(this.#ptns[ptnId]);
    if (this.#h ^ h) ptn.map(row => row.reverse());
    if (this.#v ^ v) ptn.reverse();
    if (this.#h) c = this.#c - 1 - c;
    if (this.#v) r = this.#r - 1 - r;
    this.#sprites[key] = {plt, ptn, c, r};
  }
  batchSet(sprMap) {
    try {
      sprMap.forEach(spr => this.set(spr[0], spr[1], spr[2], spr[3], spr[4], spr[5], spr[6]));
    } catch (err) {
      console.log(err);
    }
  }
  dlt(key) {
    if (key) {
      delete this.#sprites[key];
    } else {
      this.#sprites = {};
    }
  }
  get() {
    let chrs = [];
    Object.values(this.#sprites).forEach(s => {
      chrs.push({plt: s.plt, ptn: s.ptn, x: this.#x + s.c * 8, y: this.#y + s.r * 8});
    });
    return chrs;
  }
}

class Character {
  #name; #chrs;
  #plts; #ptns;
  #body; #attack; #energy; #guard;
  #bodySprMap; #attackSprMap; #energySprMap;
  #x; #y; #w; #h;
  #way; //0: right, 1: left
  // #state = 0; //0: normal, 1: attack, 2: guard, 3: move
  #animateId; #attackId;
  #attackCnt = 0;
  #energyVal = 16;
  constructor(name, plts, ptns, x, y, z = 0, way = 0) {
    this.#name = name;
    this.#plts = plts;
    this.#ptns = ptns;
    this.#x = x;
    this.#y = y;
    this.z = z;
    this.#way = way;
    // this.#guard = guard;
  }
  get name() {return this.#name}
  get x() {return this.#x}
  get y() {return this.#y}
  get w() {return this.#w}
  get h() {return this.#h}
  get ax() {return this.#attack.x}
  get aw() {return this.#attack.c * 8 - 7}
  get way() {return this.#way}
  get attackCnt() {return this.#attackCnt++}
  get energyVal() {return this.#energyVal}
  setChrs(chrs) {
    this.#chrs = chrs;
  }
  setBody(sprMap, xos, yos, c, r, h, v) {
    this.#bodySprMap = sprMap;
    this.#body = new Sprite(this.#plts, this.#ptns, this.#x + xos, this.#y + yos, c, r, h, v);
    this.#w = c * 8;
    this.#h = r * 8;
  }
  setAttack(sprMap, xos, yos, c, r, h, v) {
    this.#attackSprMap = sprMap;
    this.#attack = new Sprite(this.#plts, this.#ptns, this.#x + xos, this.#y + yos, c, r, h, v);
  }
  setEnergy(sprMap, xos, yos, c, r, h, v) {
    this.#energySprMap = sprMap;
    this.#energy = new Sprite(this.#plts, this.#ptns, this.#x + xos, this.#y + yos, c, r, h, v);
    this.#energy.batchSet(this.#energySprMap[this.#energyVal]);
  }
  damage(val, ptnIds, callback) {
    if (this.#energyVal <= 0) {
      this.#energyVal = 0;
      return true;
    }
    // this.#energyVal -= val;
    this.#energyVal = this.#energyVal - val < 0 ? 0 : this.#energyVal - val;
    this.#energy.batchSet(this.#energySprMap[this.#energyVal]);
    if (this.#energyVal == 0) {
      callback('lose');
      console.log('lose', this.#name, this.#energyVal);
      // this.#chrs.delete(this.name);
      setTimeout(() => this.#energy.dlt(), 1500);
      return;
    }
    let cnt = 0;
    this.animate(ptnIds, 250);
    let id = setInterval(() => {
      let x = this.way * 2 - 1 + 0;
      if (!this.collision(x, 0)) {
        this.move(x, 0, this.z);
      }
      if (this.drop()) {
        clearInterval(id);
        callback('drop');
      }
      cnt++;
      if (cnt > val * 4) clearInterval(id);
    }, 10);
  }
  animate(ptnIds, delay) {
    clearInterval(this.#animateId);
    let ptnId = 0;
    this.#body.batchSet(this.#bodySprMap[ptnIds[0]]);
    this.#animateId = setInterval(() => {
      ptnId = ptnIds.length - 1 > ptnId ? ptnId + 1 : 0;
      this.#body.batchSet(this.#bodySprMap[ptnIds[ptnId]]);
    }, delay);
  }
  // attack(ptnIds, delay, callback) {
  attack(ptnIds, delay) {
    let ptnId = 0;
    this.#attack.batchSet(this.#attackSprMap[ptnIds[0]]);
    this.#attackId = setInterval(() => {
      if (ptnId < ptnIds.length - 1) {
        ptnId++;
        this.#attack.batchSet(this.#attackSprMap[ptnIds[ptnId]]);
      } else {
        clearInterval(this.#attackId);
        this.#attack.dlt();
      }
    }, delay);
  }
  // guard() {}
  turn() {
    this.#way ^= 1;
    this.#body.h = this.#way;
    this.#attack.h = this.#way;
    this.#attack.x = this.#way ? this.#x - this.#w : this.#x + this.#w;
  }
  collision(osX, osY, attack = 0) {
    let rtn;
    let [x, y, w, h] = attack ? [this.ax + osX, this.y + osY, this.aw, this.h] : [this.x + osX, this.y + osY, this.w, this.h];
    this.#chrs.forEach(chr => {
      if (this.name == chr.name || this.z || chr.z) return;
      if (x + w > chr.x && x < chr.x + chr.w &&
          y + h > chr.y + chr.h - 4 && y + h < chr.y + chr.h + 4) rtn = chr;
      // if (attack && chr.name == 'enemy1') console.log(x, w, x+w, chr.x, chr.w, chr.x+chr.w);
    });
    return rtn;
  }
  walk(direction, distance, callback, delay = 25) {
    let x = 0, y = 0, cnt = 0;
    if (direction == 'n') y = -1;
    if (direction == 'e') x = 1;
    if (direction == 's') y = 1;
    if (direction == 'w') x = -1;
    let mvId = setInterval(() => {
      if (this.#way == 0 && direction == 'w' || this.#way == 1 && direction == 'e') this.turn();
      if (!this.collision(x, y)) {
        this.move(x, y, this.z);
        if (this.drop()) {
          clearInterval(mvId);
          callback('drop');
        }
      }
      cnt++;
      if (distance <= cnt) {
        clearInterval(mvId);
        callback('stop');
      }
    }, delay);
  }
  move(x, y, z = 0) {
    this.#x += x;
    this.#y += y;
    this.z = z;
    this.#body.x += x;
    this.#body.y += y;
    if (this.#attack !== undefined) {
      this.#attack.x += x;
      this.#attack.y += y;
    }
    this.#energy.x += x;
    this.#energy.y += y;
  }
  drop() {
    let offset = Math.floor((this.#y - 64) / 3);
    let z = this.#x < 24 - offset || this.#x > 216 + offset || this.#y < 65 ? 1 : 0;
    let fDrop = this.#y > 160 ? 1 : 0;
    if (z || fDrop) {
      // this.move(0, 0, z);
      this.z = z;
      let id = setInterval(() => {
        this.move(0, 1, z);
        if (this.#y > 256) {
          clearInterval(id);
          this.#chrs.delete(this.name);
        }
        // console.log([this.#x, this.#y, this.z]);
      }, 5);
      // this.#chrs.delete(this.name);
      return true;
    }
  }
  get() {
    let body = this.#body.get();
    let energy = this.#energy ? this.#energy.get() : [];
    let attack = this.#attack ? this.#attack.get() : [];
    return body.concat(energy, attack);
  }
}

class Scr {
  #ctx;
  #oc; #ctxOc;
  #scrElm;
  #bgColor;
  #chrs = [];
  constructor(scrElm, bgColor, scale = 2) {
    this.#scrElm = scrElm;
    this.#bgColor = bgColor;
    this.#scrElm.width = 256 * scale;
    this.#scrElm.height = 240 * scale;
    this.#ctx = this.#scrElm.getContext('2d');
    this.#ctx.imageSmoothingEnabled = false;
    this.#ctx.scale(scale, scale);
  }
  setBg(bg) {
    this.#oc = new OffscreenCanvas(this.#scrElm.width, this.#scrElm.height);
    this.#ctxOc = this.#oc.getContext('2d');
    bg.get().forEach(chr => this.#drawChr(this.#ctxOc, chr));
  }
  setBgColor(bgColor) {
    this.#bgColor = bgColor;
  }
  setChr(character) {
    this.#chrs.push(character);
  }
  #drawChr(ctx, chr) {
    chr.ptn.forEach((r, y) => {
      r.forEach((c, x) => {
        if (!c) return;
        ctx.fillStyle = lch(chr.plt[c - 1]);
        ctx.fillRect(chr.x + x, chr.y + y, 1, 1);
      });
    });
  }
  draw() {
    this.#ctx.fillStyle = lch(this.#bgColor);
    this.#ctx.fillRect(0, 0, this.#scrElm.width, this.#scrElm.height);
    
    this.#chrs.sort((a, b) => a.y - b.y);
    
    this.#chrs.forEach(character => {
      if (!character.z) return;
      character.get().forEach(chr => this.#drawChr(this.#ctx, chr));
    });
    
    this.#ctx.drawImage(this.#oc, 0, 0);
    
    this.#chrs.forEach(character => {
      if (character.z) return;
      character.get().forEach(chr => this.#drawChr(this.#ctx, chr));
    });
  }
}

export { Bg, Sprite, Character, Scr };