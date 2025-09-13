class Wav {
  // #type; #notes = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(',');
  #type; notes = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(',');
  constructor(AC, type) {
    this._AC = AC;
    this.#type = type;
  }
  freq(spn) {
    let noteName = spn.slice(0, -1), octaveNum = Number(spn.slice(-1));
    let aFreq = 27.5 * (2 ** octaveNum);
    // let pitchClass = this.#notes.indexOf(noteName);
    let pitchClass = this.notes.indexOf(noteName);
    let freqInterval = 2 ** (1 / 12);
    return aFreq * (freqInterval ** (pitchClass - 9));
  }
  getSrc(pitch) {
    return new OscillatorNode(this._AC, {type: this.#type, frequency: this.freq(pitch)});
  }
}

class CWav extends Wav {
  #wf = [];
  constructor(AC, tables = []) {
    super(AC);
    this.#genWav(tables);
  }
  static dft(data, len) {
    let real = new Float32Array(len), imag = new Float32Array(len);
    for (let k = 1; k <= len; k++) {
      for (let n = 0; n < len; n++) {
        let idx = Math.floor(n / len * data.length);
        let th = (2 * Math.PI * k * n) / len;
        real[k] += data[idx] * Math.cos(th);
        imag[k] += data[idx] * Math.sin(th);
      }
    }
    return {real, imag};
  }
  #genWav(tables) {
    tables.forEach((tbl, tblId) => {
      let d = [];
      for (let i = 0; i < tbl.length; i++)
        d[i] = parseInt(tbl.charAt(i), 16);
      this.#wf[tblId] = new PeriodicWave(this._AC, (CWav.dft(d, 512)));
    });
  }
  getSrc(pitch, tone) {
    return new OscillatorNode(this._AC, {periodicWave: this.#wf[tone], frequency: this.freq(pitch)});
  }
}

class NWav {
  #AC; #wf = [];
  constructor(AC, {functions = [Math.random], notes = [1]} = {}) {
    this.#AC = AC;
    this.notes = notes;
    this.#genWav(functions);
  }
  #genWav(functions) {
    let sr = this.#AC.sampleRate;
    functions.forEach((f, fid) => {
      this.#wf[fid] = [];
      this.notes.forEach((pitch, pid) => {
        this.#wf[fid][pid] = this.#AC.createBuffer(1, sr, sr);
        let data = this.#wf[fid][pid].getChannelData(0), amplitude;
        for (let i = 0; i < sr; i++) {
          if (i % pitch == 0) amplitude = f(i) * 2 - 1;
          data[i] = amplitude;
        }
      });
    });
  }
  freq(pitch) {return this.#AC.sampleRate / this.notes[pitch]}
  getSrc(pitch, tone) {
    return new AudioBufferSourceNode(this.#AC, {buffer:this.#wf[tone][pitch], loop:true});
  }
}

class Synth {
  #AC; #wav; #analyserNode; #tasks = {};
  constructor(AC, wav, analyserNode) {
    this.#AC = AC;
    this.#wav = wav;
    this.#analyserNode = analyserNode;
  }
  #lfo(target, prm = []) {
    if (prm[0] == undefined) return;
    let [depth, rate = 5, wave = 'sine'] = prm;
    let lfo = new OscillatorNode(this.#AC, {type: wave, frequency: rate});
    lfo.start();
    let gainNode = new GainNode(this.#AC, {gain: depth});
    lfo.connect(gainNode).connect(target);
  }
  #envelope(gain, sTime, eTime, vol, adsr = []) {
    let [a = .01, d = .01, s = .5, r = .01] = adsr;
    gain.setValueAtTime(0, sTime);
    gain.linearRampToValueAtTime(vol, sTime + a);
    gain.linearRampToValueAtTime(vol * s, sTime + a + d);
    gain.setValueAtTime(vol * s, eTime - r);
    gain.linearRampToValueAtTime(0, eTime);
  }
  play(pitch, {tone = 0, sTime = this.#AC.currentTime, dur = .03, vol = 1, det = 0, swp = 0, env, vib, trem} = {}) {
  // play(pitch, {tone = 0, sTime = this.#AC.currentTime, dur = .03, vol = 1, swp = 0, env, vib, trem} = {}) {
    let eTime = sTime + dur;
    let src = this.#wav.getSrc(pitch, tone);
    src.detune.value = det;
    src.detune.linearRampToValueAtTime(det + swp, eTime);
    // src.detune.linearRampToValueAtTime(swp, eTime);
    if (src.frequency != undefined) this.#lfo(src.frequency, vib);
    if (!(this.#wav instanceof CWav)) vol /= 4;
    let gainNode = new GainNode(this.#AC);
    this.#envelope(gainNode.gain, sTime, eTime, vol, env);
    this.#lfo(gainNode.gain, trem);
    if (this.#analyserNode) gainNode.connect(this.#analyserNode);
    src.connect(gainNode).connect(this.#AC.destination);
    src.start(sTime);
    src.stop(eTime);
    let UUID = crypto.randomUUID();
    this.#tasks[UUID] = src;
    src.onended = () => {
      src.disconnect();
      if (this.#wav instanceof NWav) src.buffer = null;
      delete this.#tasks[UUID];
    };
    // return {eTime, freq: this.#wav.freq(pitch)};
    return {eTime};
  }
  discard() {
    Object.keys(this.#tasks).forEach(key => this.#tasks[key].stop());
  }
}

export { Wav, CWav, NWav, Synth };