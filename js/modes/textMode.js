/**
 * textMode.js
 * 语文「课文打字」练习模式。
 *
 * 屏幕显示古诗全文（汉字）与当前行拼音，学生按汉字顺序逐字输入拼音（可选声调）。
 * 中文标点按原文标点直接键入；退格回退上一字符。
 *
 * 供 App 调用：handleKeydown 返回 true 表示已处理。
 */

class TextMode {
  /**
   * @param {Object} opts {
   *   kb, container, requireToneGetter, onStats, onComplete, onStart
   * }
   */
  constructor(opts) {
    this.opts = opts;
    this.kb = opts.kb;
    this.container = opts.container;
    this.poem = null;           // 当前诗文
    this.lines = [];            // 诗文行
    this.tokens = [];
    this.lineEnds = [];
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, time: 0 };
    this.itemResults = []; // 整篇课文作为一个结果
    this.startTime = 0;
    this.running = false;
    this.engine = new PinyinEngine({
      requireTone: false,
      onStats: (es) => this._accStats(es)
    });
    this.engine.onDone = () => this._finish();
    this._lastES = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0 };
    this._handleKey = this._handleKey.bind(this);
  }

  _renderShell() {
    this.container.innerHTML = `
      <div class="practice-head">
        <div class="progress">
          <span class="p-label">进度</span>
          <div class="p-bar"><div class="p-fill"></div></div>
          <span class="p-count"></span>
        </div>
        <div class="tone-toggle">
          <label class="switch"><input type="checkbox" id="toneReq"><span>需输入声调</span></label>
        </div>
        <div class="stats">
          <div class="stat"><span class="s-val" data-s="time">00:00</span><span class="s-nm">用时</span></div>
          <div class="stat"><span class="s-val" data-s="spd">0</span><span class="s-nm">字/分</span></div>
          <div class="stat"><span class="s-val" data-s="acc">100%</span><span class="s-nm">准确率</span></div>
        </div>
      </div>
      <div class="poem-card">
        <div class="poem-title"></div>
        <div class="poem-text"></div>
        <div class="poem-input"></div>
      </div>
    `;
    this.el = {
      title: this.container.querySelector(".poem-title"),
      text: this.container.querySelector(".poem-text"),
      input: this.container.querySelector(".poem-input"),
      bar: this.container.querySelector(".p-fill"),
      count: this.container.querySelector(".p-count"),
      toneReq: this.container.querySelector("#toneReq"),
      stats: {
        time: this.container.querySelector('[data-s="time"]'),
        spd: this.container.querySelector('[data-s="spd"]'),
        acc: this.container.querySelector('[data-s="acc"]')
      }
    };
    this.el.toneReq.addEventListener("change", () => {
      this.engine.requireTone = this.opts.requireToneGetter();
    });
    // 单击正文也可聚焦到输入（对移动端友好）。
    this.container.addEventListener("click", this._handleKey === null ? null : undefined);
  }

  /** 开始练习某篇诗文。 */
  start(poem) {
    this.poem = poem;
    this.lines = poem.poem;
    this.tokens = tokensFromPoemLines(this.lines);
    this.lineEnds = lineEndsFromPoemLines(this.lines);
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, time: 0 };
    this._renderShell();
    this.el.title.textContent = `《${poem.title}》 · ${poem.author} · 沪教版《语文》${poem.grade}`;
    this.engine.requireTone = this.opts.requireToneGetter();
    this.engine.load(this.tokens);
    this._renderPoem();
    this.startTime = Date.now();
    this.running = true;
    this._timer = setInterval(() => this._tick(), 1000);
    window.addEventListener("keydown", this._handleKey, true);
    if (this.opts.onStart) this.opts.onStart();
  }

  /** 渲染诗文汉字 + 当前行拼音。 */
  _renderPoem() {
    // 汉字区：每行一个 <p>，当前字符高亮。
    this.el.text.innerHTML = "";
    let tokIndex = 0;
    this.lines.forEach((line, li) => {
      const p = document.createElement("p");
      const zhChars = Array.from(line.zh);
      zhChars.forEach((ch) => {
        const s = document.createElement("span");
        s.className = "poem-char";
        s.textContent = ch;
        s.dataset.tok = tokIndex;
        if (tokIndex === this.engine.ptr) s.classList.add("poem-here");
        if (tokIndex < this.engine.ptr) s.classList.add("poem-done");
        p.appendChild(s);
        tokIndex++;
      });
      this.el.text.appendChild(p);
    });

    // 拼音区：按行渲染音节胶囊。
    this.el.input.innerHTML = "";
    let base = 0;
    this.lines.forEach((line, li) => {
      const row = document.createElement("div");
      row.className = "py-row";
      const zhChars = Array.from(line.zh);
      zhChars.forEach((ch, ci) => {
        const t = this.tokens[base + ci];
        if (!t) return;
        const span = document.createElement("span");
        span.className = "syll";
        const global = base + ci;
        if (global < this.engine.ptr) {
          span.classList.add("syll-ok");
          span.textContent = t.type === "punct" ? t.char : t.display;
        } else if (global === this.engine.ptr) {
          span.classList.add("syll-here");
          if (t.type === "punct") span.textContent = t.char;
          else span.textContent = this.engine.buf + t.display.slice(this.engine.buf.length);
        } else {
          span.textContent = t.type === "punct" ? t.char : t.display;
        }
        row.appendChild(span);
      });
      this.el.input.appendChild(row);
      base += zhChars.length;
    });

    // 目标键。
    const tk = this.engine.targetKey;
    if (this.kb) this.kb.setTarget(tk && tk.length === 1 && tk !== " " ? tk : "");
  }

  _accStats(es) {
    const d = {
      correct: es.correct - this._lastES.correct,
      wrong: es.wrong - this._lastES.wrong,
      keyStrokes: es.keyStrokes - this._lastES.keyStrokes,
      charsTyped: es.charsTyped - this._lastES.charsTyped
    };
    this._lastES = { correct: es.correct, wrong: es.wrong, keyStrokes: es.keyStrokes, charsTyped: es.charsTyped };
    this.stats.correct += Math.max(0, d.correct);
    this.stats.wrong += Math.max(0, d.wrong);
    this.stats.keyStrokes += Math.max(0, d.keyStrokes);
    this._updateStats();
  }

  _handleKey(e) {
    if (!this.running) return false;
    const k = e.key;
    const punctMatch = /^[，。？！、；：——…「」『』“”‘’]$/.test(k);
    if (/^[a-z]$/i.test(k) || /^[0-9]$/.test(k) || k === " " || (k.length === 1 && punctMatch)) {
      e.preventDefault();
      this.engine.handleKey(k.toLowerCase());
      this._renderPoem();
      this._updateProgress();
      return true;
    }
    if (k === "Backspace") {
      e.preventDefault();
      this.engine.backspace();
      this._renderPoem();
      return true;
    }
    return false;
  }

  _tick() {
    if (!this.running) return;
    this.stats.time = (Date.now() - this.startTime) / 1000;
    this._updateStats();
  }

  _updateStats() {
    if (!this.el) return;
    const s = computeStats(this.stats);
    this.el.stats.time.textContent = formatTime(s.time);
    this.el.stats.spd.textContent = Math.round((s.correct / 5) / (s.time / 60));
    this.el.stats.acc.textContent = s.accuracy + "%";
    if (this.opts.onStats) this.opts.onStats(s);
  }

  _updateProgress() {
    const p = this.tokens.length ? Math.round((Math.min(this.engine.ptr, this.tokens.length) / this.tokens.length) * 100) : 0;
    this.el.bar.style.width = p + "%";
    const curLine = this._currentLine();
    this.el.count.textContent = curLine + " / " + this.lines.length + " 行";
  }

  _currentLine() {
    for (let i = 0; i < this.lineEnds.length; i++) {
      if (this.engine.ptr < this.lineEnds[i]) return i + 1;
    }
    return this.lines.length;
  }

  _finish() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this._timer);
    this.stats.time = (Date.now() - this.startTime) / 1000;
    // 整篇课文结算为单条结果（课文整体记忆）。
    this.itemResults.push({
      q: this.poem ? this.poem.title : "",
      a: this.poem ? (this.poem.title + " " + (this.poem.author || "")) : "",
      firstTry: this.stats.wrong === 0,
      poem: this.poem
    });
    window.removeEventListener("keydown", this._handleKey, true);
    if (this.opts.onComplete) this.opts.onComplete(this.stats);
  }

  stop() {
    this.running = false;
    clearInterval(this._timer);
    window.removeEventListener("keydown", this._handleKey, true);
  }
}