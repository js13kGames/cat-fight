//import { Wav, CWav, NWav } from 'https://codepen.io/m-nakasato/pen/MWNLqQx.js';
 import { Wav, CWav, NWav } from './apu.js';

/*class Lfsr {
  #reg = 1;
  #tapPos; // 1: long-period, 6: short-period
  constructor(tapPos = 1) {
    this.#tapPos = tapPos;
  }
  #get1Bit = (b, n) => (b & (1 << n)) >> n;
  prn() {
    let prn = this.#get1Bit(this.#reg, 0) ^ this.#get1Bit(this.#reg, this.#tapPos);
    this.#reg >>= 1;
    this.#reg |= (prn << 14);
    return prn;
  }
}*/

/**
 * @param {number} tapPos - 1: long-period (32,767 bit), 6: short-period (93 bit)
 */
function lfsr(tapPos = 1) {
  let reg = 1;
  let get1Bit = (b, n) => (b & (1 << n)) >> n;
  return function() {
    let prn = get1Bit(reg, 0) ^ get1Bit(reg, tapPos);
    reg >>= 1;
    reg |= (prn << 14);
    return prn;
  };
}

class WaveFactory {
  #AC;
  #tone = {
    fcPulse: {
      '1:1': 'F0',
      '1:3': 'F000',
      '1:7': 'F0000000',
    },
    fcTriangle: {
      _: '0123456789ABCDEFFEDCBA9876543210'
    },
    gbWave: {},
    fcNoise: {
      'long': '',
      'short': ''
    }
  };
  constructor(AC) {
    this.#AC = AC;
  }
  getTones(wave) {
    return Object.keys(this.#tone[wave]);
  }
  setGbWave(gbWave) {
    this.#tone.gbWave = gbWave;
  }
  create(wave) {
    let WavClass, prm, notes;
    switch (wave) {
      case 'sine':
      case 'square':
      case 'sawtooth':
      case 'triangle':
        WavClass = Wav;
        prm = wave;
        break;
      case 'fcPulse':
      case 'fcTriangle':
      case 'gbWave':
        WavClass = CWav;
        prm = Object.values(this.#tone[wave]);
        break;
      case 'noise':
        // let f = (t) => ((((t / 2) & 128 & (5e5 / (t & 4095))) % 255) / 127 - 1) * Math.exp(-t / 5e3);
        notes = [...new Set([...Array(15)].flatMap((_, i) => Math.round(this.#AC.sampleRate / 441 / (1.5 ** i))))].filter(Boolean);
        WavClass = NWav;
        prm = {notes};
        // prm = {};
        break;
      case 'fcNoise':
        let functions = [lfsr(), lfsr(6)];
        let FC_NOTES = [4068,2034,1016,762,508,380,254,202,160,128,96,64,32,16,8,4];
        notes = [...new Set(FC_NOTES.map(fcp => Math.round((this.#AC.sampleRate / 1789772.5) * fcp)))].filter(Boolean);
        WavClass = NWav;
        prm = {functions, notes};
        break;
    }
    return new WavClass(this.#AC, prm);
  }
}

function lch(color) {
  let lightness = color[0];
  let hue = parseInt(color[1], 16);
  let h = 0, c = 0, l = 0;
  if (hue == 0) {
    l = lightness * 30 + 40;
  } else if (hue < 13) {
    // h = hue * 30 + 200;
    h = hue * 28 + 225;
    c = 55;
    l = lightness * 25 + 25;
  } else {
    l = (lightness - 2) * 30 + 30;
  }
  return 'lch(' + l + ' ' + c + '% ' + h + ')';
}

function toBase36(tbl) {
  return tbl.map(r => {
    return parseInt(r.map(c => c.toString(2).padStart(2, '0')).join(''), 2).toString(36);
  }).join();
}

function fromBase36(base36) {
  return base36.split(',').map((e, r) => {
    return parseInt(e, 36).toString(2).padStart(16, 0).match(/../g).map(b => parseInt(b, 2));
  });
}

export { lfsr, WaveFactory, lch, toBase36, fromBase36 };