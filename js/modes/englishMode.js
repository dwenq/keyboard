/**
 * englishMode.js
 * 英语「单词/字母输入」打字练习模式。
 *
 * 交互：
 *   - 屏幕显示当前单词与中文释义，逐字母高亮待输入字符。
 *   - 键入字母：正确绿色、错误红色并等待正确键。
 *   - 复合短语中的空格用空格键输入；完成一个词后自动进入下一个。
 *   - 实时统计：正确/错误/进度/用时/速度。
 *
 * 供 App 调用：handleKeydown 返回 true 表示已处理。
 */

class EnglishMode {
  /**
   * 构造英语模式。
   * @param {Object} opts { kb: VisualKeyboard, onStats: fn, onComplete: fn }
   */
  constructor(opts) {
    this.opts = opts;
    this.kb = opts.kb;
    this.container = opts.container;
    this.items = [];      // 待练习词语
    this.index = 0;       // 当前词下标
    this.typed = [];      // 当前词已键入字符
    this.startTime = 0;
    this.running = false;
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, time: 0, wordCount: 0 };
    this.target = "";     // 当前目标字符串
    this.itemResults = []; // 每个单词的完成结果 {q,a,firstTry}，供记忆曲线使用
    this._handleKey = this._handleKey.bind(this);
  }

  /** 渲染静态 UI 骨架。 */
  _renderShell() {
    this.container.innerHTML = `
      <div class="practice-head">
        <div class="progress">
          <span class="p-label">进度</span>
          <div class="p-bar"><div class="p-fill"></div></div>
          <span class="p-count"></span>
        </div>
        <div class="stats">
          <div class="stat"><span class="s-val" data-s="time">00:00</span><span class="s-nm">用时</span></div>
          <div class="stat"><span class="s-val" data-s="speed">0</span><span class="s-nm">字/分</span></div>
          <div class="stat"><span class="s-val" data-s="acc">100%</span><span class="s-nm">准确率</span></div>
        </div>
      </div>
      <div class="prompt-card">
        <div class="prompt-word"></div>
        <div class="prompt-meta">
          <div class="prompt-cn"></div>
          <button type="button" class="btn sound-btn" title="听发音">🔊 跟读</button>
        </div>
        <div class="prompt-ipa"></div>
      </div>
    `;
    this.el = {
      word: this.container.querySelector(".prompt-word"),
      cn: this.container.querySelector(".prompt-cn"),
      ipa: this.container.querySelector(".prompt-ipa"),
      soundBtn: this.container.querySelector(".sound-btn"),
      bar: this.container.querySelector(".p-fill"),
      count: this.container.querySelector(".p-count"),
      stats: {
        time: this.container.querySelector('[data-s="time"]'),
        speed: this.container.querySelector('[data-s="speed"]'),
        acc: this.container.querySelector('[data-s="acc"]')
      }
    };
  }

  /**
   * 开始练习。
   * @param {Array} items [{en, cn}] 打乱后的词语列表
   */
  start(items) {
    this.items = items;
    this.index = 0;
    this.typed = [];
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, time: 0, wordCount: 0 };
    this.itemResults = [];
    this._renderShell();
    this._showItem(0);
    this.startTime = Date.now();
    this.running = true;
    this._timer = setInterval(() => this._tick(), 1000);
    window.addEventListener("keydown", this._handleKey, true);
    if (this.opts.onStart) this.opts.onStart(this.target);
  }

  /** 显示指定下标的词，并初始化目标。 */
  _showItem(i) {
    const item = this.items[i];
    this.index = i;
    this.typed = [];
    // 保留词条原始大小写：该大写的大写（Monday、I、句首字母），无需小写归一。
    this.target = item.en || "";
    this._renderPrompt();
    this._updateProgress();
    const firstKey = this.target.charAt(0);
    if (this.kb) this.kb.setTarget(/^[a-zA-Z]$/.test(firstKey) ? firstKey : "space");
  }

  /** 渲染当前词的字母盒子。 */
  _renderPrompt() {
    const item = this.items[this.index];
    this.el.word.innerHTML = "";
    const letters = this.target.split("");
    letters.forEach((ch, idx) => {
      const s = document.createElement("span");
      s.className = "letter";
      if (ch === " ") {
        s.classList.add("letter-space");
        s.textContent = "␣";
        s.dataset.real = " ";
      } else {
        s.textContent = ch;
      }
      s.dataset.idx = idx;
      this.el.word.appendChild(s);
    });
    this.el.cn.textContent = item.cn || "";
    this.el.ipa.textContent = window.ipaOf ? window.ipaOf(item.en || "") : "";
    // 句型类条目（长度较大）视为整句输入，隐藏单词级音标/跟读按钮。
    const isSentence = (this.target.split(" ").length > 1);
    this.el.ipa.style.display = isSentence ? "none" : "";
    const snd = this.el.soundBtn;
    if (snd) snd.style.display = isSentence ? "none" : "";
    this._bindSound();
    this._applyTypedState();
  }

  /** 绑定「跟读发音」按钮：朗读当前单词。 */
  _bindSound() {
    const btn = this.el.soundBtn;
    if (!btn) return;
    // 防止重复绑定：用属性记录当前绑定的单词。
    const current = (this.items[this.index] && this.items[this.index].en) || "";
    if (btn.dataset.word === current) return;
    btn.dataset.word = current;
    btn.onclick = (e) => {
      e.stopPropagation();
      if (window.Speech) window.Speech.speak(current);
    };
  }

  /** 根据已输入状态刷新字母盒子与目标键样式。 */
  _applyTypedState() {
    const boxes = this.el.word.querySelectorAll(".letter");
    boxes.forEach((s) => {
      s.classList.remove("ok", "bad", "here");
    });
    this.typed.forEach((t, idx) => {
      const s = boxes[idx];
      if (!s) return;
      s.classList.add(t === true ? "ok" : "bad");
    });
    const pos = this.typed.length;
    if (pos < boxes.length) {
      boxes[pos].classList.add("here");
      const need = this.target.charAt(pos);
      // 键盘提示与校验：保留真实大小写；空格/标点按原字符处理。
      if (this.kb) this.kb.setTarget(/^[a-zA-Z]$/.test(need) ? need : (need === " " ? "space" : need));
    } else {
      if (this.kb) this.kb.reset();
    }
  }

  /** 处理按键。 */
  _handleKey(e) {
    if (!this.running) return;
    const k = e.key;
    // 英文模式：字母、空格、常见标点（句型输入用）与退格；其余键透传。
    if (k.length === 1 && /[a-zA-Z .,?!'"()\-:;/]/.test(k)) {
      e.preventDefault();
      this._type(String(k));
      return true;
    } else if (k === "Backspace") {
      e.preventDefault();
      this._backspace();
      return true;
    }
    return false;
  }

  /** 输入一个字符。 */
  _type(ch) {
    this.stats.keyStrokes++;
    const pos = this.typed.length;
    const need = this.target.charAt(pos);
    let ok = false;
    if (ch === need) {
      ok = true;
      this.stats.correct++;
      this.stats.charsTyped++;
    } else {
      this.stats.wrong++;
    }
    if (this.kb) this.kb.flash(ch, ok);
    this.typed.push(ok);
    this._applyTypedState();
    // 达成完整词：正确则进入下一个词。
    if (ok && this.typed.filter(Boolean).length === this.target.length) {
      this.stats.wordCount++;
      this._afterWord();
    }
    this._updateStats();
  }

  /** 退格：撤销上一个字符的错误判断（若上一字符错误则先撤销一次）。 */
  _backspace() {
    if (this.typed.length > 0) {
      this.typed.pop();
      this._applyTypedState();
    }
  }

  /** 完成一个词后的处理。 */
  _afterWord() {
    const item = this.items[this.index];
    this.itemResults.push({
      q: item.cn || "",
      a: (item.en || "").toLowerCase(),
      firstTry: this.typed.every(Boolean)
    });
    if (this.kb) this.kb.reset();
    const next = this.index + 1;
    if (next < this.items.length) {
      setTimeout(() => this._showItem(next), 160);
    } else {
      this._finish();
    }
  }

  /** 键盘每分钟刷新用时。 */
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
    // 速度用“正确字符/5=词”的标准估算每分钟字数。
    this.el.stats.speed.textContent = Math.round((s.correct / 5) / (s.time / 60));
    this.el.stats.acc.textContent = s.accuracy + "%";
    if (this.opts.onStats) this.opts.onStats(s);
  }

  /** 更新进度条。 */
  _updateProgress() {
    const p = this.items.length ? Math.round(((this.index + 1) / this.items.length) * 100) : 0;
    this.el.bar.style.width = p + "%";
    this.el.count.textContent = (this.index + 1) + " / " + this.items.length;
  }

  /** 结束练习。 */
  _finish() {
    this.running = false;
    clearInterval(this._timer);
    this.stats.time = (Date.now() - this.startTime) / 1000;
    window.removeEventListener("keydown", this._handleKey, true);
    if (this.opts.onComplete) this.opts.onComplete(this.stats);
  }

  /** 停止并清理（切换科目/返回时调用）。 */
  stop() {
    this.running = false;
    clearInterval(this._timer);
    window.removeEventListener("keydown", this._handleKey, true);
  }
}