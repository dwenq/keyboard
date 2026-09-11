/**
 * dictationMode.js
 * 英语「听音拼写」练习模式。
 *
 * 交互：
 *   - 自动朗读当前单词（🔊 按钮可重听），屏幕给出中文释义 + 国际音标作为提示，
 *     但不显示单词拼写，学生根据听到的发音在键盘上输入英文单词。
 *   - 逐字母判定：正确绿色、错误红色并等待正确键；空格用空格键。
 *   - 通过「音标→听音→拼写」打通发音与拼写（语音意识/phonics）训练。
 *   - 统计结构与英文模式一致（correct/wrong/wordCount/time/accuracy），
 *     可直接复用 App 的过关判定、记忆曲线与复盘记录逻辑。
 *
 * 供 App 调用：handleKeydown 返回 true 表示已处理。
 */

class DictationMode {
  /**
   * 构造听音拼写模式。
   * @param {Object} opts { kb, container, onStats, onComplete }
   */
  constructor(opts) {
    this.opts = opts;
    this.kb = opts.kb;
    this.container = opts.container;
    this.items = [];      // 待练习词语 [{en, cn}]
    this.index = 0;       // 当前词下标
    this.typed = [];      // 当前词已键入字符
    this.startTime = 0;
    this.running = false;
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0, time: 0, wordCount: 0 };
    this.target = "";     // 当前目标拼写
    this.itemResults = []; // 每个单词的完成结果 {q,a,firstTry}
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
      <div class="prompt-card dictation-card">
        <div class="dictation-tip">🔊 听发音，用音标作提示，打出这个单词</div>
        <button type="button" class="btn big-sound-btn" title="再听一遍">🔊 再听一遍</button>
        <div class="prompt-word dictation-word"></div>
        <div class="dictation-cn"></div>
        <div class="prompt-ipa"></div>
      </div>
    `;
    this.el = {
      word: this.container.querySelector(".prompt-word"),
      cn: this.container.querySelector(".dictation-cn"),
      ipa: this.container.querySelector(".prompt-ipa"),
      soundBtn: this.container.querySelector(".big-sound-btn"),
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

  /** 显示指定下标的词并自动朗读。 */
  _showItem(i) {
    this.index = i;
    this.typed = [];
    const item = this.items[i];
    this.target = (item.en || "").toLowerCase();
    this._renderPrompt();
    this._updateProgress();
    // 进入新词后自动朗读，便于听音拼写。
    this.el.soundBtn.onclick = (e) => { e.stopPropagation(); this._speak(); };
    this._speak();
  }

  /** 朗读当前目标单词。 */
  _speak() {
    if (window.Speech) window.Speech.speak(this.target);
  }

  /** 渲染当前词（只显示占位框，不显示拼写）。 */
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
        s.textContent = "·"; // 听写时不透露字母，用占位圆点
      }
      s.dataset.idx = idx;
      this.el.word.appendChild(s);
    });
    this.el.cn.textContent = item.cn || "";
    this.el.ipa.textContent = window.ipaOf ? window.ipaOf(item.en || "") : "";
    this._applyTypedState();
  }

  /** 根据已输入状态刷新字母盒子与目标键样式。 */
  _applyTypedState() {
    const boxes = this.el.word.querySelectorAll(".letter");
    boxes.forEach((s) => { s.classList.remove("ok", "bad", "here"); });
    this.typed.forEach((t, idx) => {
      const s = boxes[idx];
      if (!s) return;
      const ch = this.target.charAt(idx);
      s.classList.add(t === true ? "ok" : "bad");
      if (t === true) s.textContent = ch === " " ? "␣" : ch; // 正确后揭示字母
    });
    const pos = this.typed.length;
    if (pos < boxes.length) {
      boxes[pos].classList.add("here");
      const need = this.target.charAt(pos);
      if (this.kb) this.kb.setTarget(/[a-z ]/.test(need) ? need : "space");
    } else {
      if (this.kb) this.kb.reset();
    }
  }

  /** 处理按键。 */
  _handleKey(e) {
    if (!this.running) return;
    const k = e.key;
    if (k.length === 1 && /[a-zA-Z ]/.test(k)) {
      e.preventDefault();
      this._type(String(k).toLowerCase());
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
    if (ok && this.typed.filter(Boolean).length === this.target.length) {
      this.stats.wordCount++;
      this._afterWord();
    }
    this._updateStats();
  }

  /** 退格：撤销上一个字符的判断。 */
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
    if (window.Speech) window.Speech.stop();
    window.removeEventListener("keydown", this._handleKey, true);
    if (this.opts.onComplete) this.opts.onComplete(this.stats);
  }

  /** 停止并清理（切换科目/返回时调用）。 */
  stop() {
    this.running = false;
    clearInterval(this._timer);
    if (window.Speech) window.Speech.stop();
    window.removeEventListener("keydown", this._handleKey, true);
  }
}