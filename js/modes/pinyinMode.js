/**
 * pinyinMode.js
 * 语文「拼音输入」打字练习模式。
 *
 * 屏幕显示汉字与释义，学生键入对应拼音（可选声调）。
 * 多音节词语（如“社区 shè qū”）按音节逐个输入；支持退格与声调数字输入。
 *
 * 供 App 调用：handleKeydown 返回 true 表示已处理。
 */

class PinyinMode {
  /**
   * @param {Object} opts {
   *   kb: VisualKeyboard,
   *   container: HTMLElement,
   *   requireToneGetter: () => boolean,   // 是否要求声调（可动态读取）
   *   onStats: fn,
   *   onComplete: fn
   * }
   */
  constructor(opts) {
    this.opts = opts;
    this.kb = opts.kb;
    this.container = opts.container;
    this.items = [];
    this.index = 0;
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, wordCount: 0, time: 0 };
    this.startTime = 0;
    this.running = false;
    this.engine = new PinyinEngine({
      requireTone: false,
      onStats: (es) => this._accStats(es)
    });
    this.engine.onDone = () => this._onItemDone();
    this._lastES = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0 };
    this.itemResults = []; // 每个生字的完成结果 {q,a,firstTry}
    this._handleKey = this._handleKey.bind(this);
  }

  /** 渲染静态骨架。 */
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
      <div class="prompt-card chinese">
        <div class="big-char"></div>
        <div class="pinyin-line"></div>
        <div class="prompt-cn"></div>
        <div class="tone-buttons">
          <button class="tone-btn" data-t="1">ˉ</button>
          <button class="tone-btn" data-t="2">ˊ</button>
          <button class="tone-btn" data-t="3">ˇ</button>
          <button class="tone-btn" data-t="4">ˋ</button>
          <button class="tone-btn" data-t="0">轻声</button>
        </div>
      </div>
    `;
    this.el = {
      char: this.container.querySelector(".big-char"),
      line: this.container.querySelector(".pinyin-line"),
      cn: this.container.querySelector(".prompt-cn"),
      bar: this.container.querySelector(".p-fill"),
      count: this.container.querySelector(".p-count"),
      toneReq: this.container.querySelector("#toneReq"),
      toneBtns: this.container.querySelectorAll(".tone-btn"),
      stats: {
        time: this.container.querySelector('[data-s="time"]'),
        spd: this.container.querySelector('[data-s="spd"]'),
        acc: this.container.querySelector('[data-s="acc"]')
      }
    };
    const bindTone = () => {
      this.engine.requireTone = this.opts.requireToneGetter();
      this.engine.load(syllablesFromPinyin(this._pinyin()));
      this._renderCurrent();
    };
    this.el.toneReq.addEventListener("change", bindTone);
    this.el.toneBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.engine.handleKey(btn.dataset.t));
    });
  }

  /** 当前项的拼音串。 */
  _pinyin() {
    const it = this.items[this.index];
    return it ? it.pinyin : "";
  }

  /** 当前项汉字。 */
  _char() {
    const it = this.items[this.index];
    return it ? it.char : "";
  }

  /** 开始练习。 */
  start(items) {
    this.items = items;
    this.index = 0;
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, wordCount: 0, time: 0 };
    this.itemResults = [];
    this._renderShell();
    this._loadCurrent();
    this.startTime = Date.now();
    this.running = true;
    this._timer = setInterval(() => this._tick(), 1000);
    window.addEventListener("keydown", this._handleKey, true);
  }

  /** 载入当前项到引擎。 */
  _loadCurrent() {
    this._lastES = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0 };
    this._itemStartWrong = this.stats.wrong;
    this.engine.requireTone = this.opts.requireToneGetter();
    this.engine.load(syllablesFromPinyin(this._pinyin()));
    this._renderCurrent();
    this._updateProgress();
  }

  /** 渲染当前字的展示（大字 + 拼音进度 + 释义）。 */
  _renderCurrent() {
    this.el.char.textContent = this._char();
    const it = this.items[this.index];
    this.el.cn.textContent = it ? it.meaning : "";

    // 按引擎状态渲染音节胶囊。
    const pills = this.engine.tokens.map((t, i) => {
      const p = document.createElement("span");
      p.className = "syll";
      if (i < this.engine.ptr) {
        p.classList.add("syll-ok");
        p.textContent = t.display;
      } else if (i === this.engine.ptr) {
        p.classList.add("syll-here");
        const shown = this.engine.buf + t.display.slice(this.engine.buf.length);
        p.textContent = shown;
      } else {
        p.textContent = t.display;
      }
      return p;
    });
    this.el.line.innerHTML = "";
    pills.forEach((p) => this.el.line.appendChild(p));

    // 更新指法/键盘目标。
    const tk = this.engine.targetKey;
    if (this.kb) this.kb.setTarget(tk && tk.length === 1 && tk !== " " ? tk : "");
    // 需输入声调时给出数字键提示（键盘无数字行）。
    if (/^[0-9]$/.test(tk)) {
      const hint = document.getElementById("finger-hint");
      if (hint) hint.textContent = tk === "0" ? "请按数字键 0/5 输入轻声" : "请输入声调数字 " + tk + "（1-4）";
    }
  }

  /** 累计引擎统计到模式总统计。 */
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
    this.stats.charScore = this.stats.correct;
    this._updateStats();
  }

  /** 单个字完成。 */
  _onItemDone() {
    const it = this.items[this.index];
    this.itemResults.push({
      q: it.char || "",
      a: it.pinyin || "",
      firstTry: this.stats.wrong === this._itemStartWrong
    });
    this.stats.wordCount++;
    // 完成当前超长显示后再进入下一个。
    if (this.index + 1 < this.items.length) {
      setTimeout(() => {
        this.index++;
        this._loadCurrent();
      }, 180);
    } else {
      this._finish();
    }
  }

  /** 处理按键。 */
  _handleKey(e) {
    if (!this.running) return false;
    const k = e.key;
    if (/^[a-z]$/i.test(k) || /^[0-9]$/.test(k) || k === " " || /^[，。？！、；：]$/.test(k)) {
      e.preventDefault();
      this.engine.handleKey(k.toLowerCase());
      this._renderCurrent();
      return true;
    }
    if (k === "Backspace") {
      e.preventDefault();
      this.engine.backspace();
      this._renderCurrent();
      return true;
    }
    return false;
  }

  /** 每秒刷新用时。 */
  _tick() {
    if (!this.running) return;
    this.stats.time = (Date.now() - this.startTime) / 1000;
    this._updateStats();
  }

  /** 更新统计显示。 */
  _updateStats() {
    if (!this.el) return;
    const s = computeStats(this.stats);
    this.el.stats.time.textContent = formatTime(s.time);
    this.el.stats.spd.textContent = Math.round((s.correct / 5) / (s.time / 60));
    this.el.stats.acc.textContent = s.accuracy + "%";
    if (this.opts.onStats) this.opts.onStats(s);
  }

  /** 更新进度条。 */
  _updateProgress() {
    const p = this.items.length ? Math.round(((this.index + 1) / this.items.length) * 100) : 0;
    this.el.bar.style.width = p + "%";
    this.el.count.textContent = (this.index + 1) + " / " + this.items.length;
  }

  /** 结束。 */
  _finish() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this._timer);
    this.stats.time = (Date.now() - this.startTime) / 1000;
    window.removeEventListener("keydown", this._handleKey, true);
    if (this.opts.onComplete) this.opts.onComplete(this.stats);
  }

  /** 停止清理。 */
  stop() {
    this.running = false;
    clearInterval(this._timer);
    window.removeEventListener("keydown", this._handleKey, true);
  }
}