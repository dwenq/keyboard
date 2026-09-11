/**
 * visualKeyboard.js
 * 可视化 QWERTY 键盘组件。
 *
 * 能力：
 *   - 按标准指法为按键分区着色（左/右手 各手指）。
 *   - 高亮“下一个待按”的目标键。
 *   - 敲击反馈：正确绿色/错误红色短闪。
 *   - 根据当前输入法（英文/拼音）决定要渲染的键位。
 *
 * 用法：
 *   const kb = new VisualKeyboard(containerEl, {mode: 'en' | 'pinyin'});
 *   kb.setTarget('a');      // 高亮目标键
 *   kb.flash('b', true);    // 敲击反馈
 *   kb.reset();
 */

class VisualKeyboard {
  /**
   * 构造键盘。
   * @param {HTMLElement} container 挂载容器
   * @param {Object} opts { mode: 'en'|'pinyin' }
   */
  constructor(container, opts = {}) {
    this.container = container;
    this.mode = opts.mode || "en";
    this.keyEls = {};
    this._build();
  }

  /** 键盘行定义：每行一个数组，元素为 {key, label?, type?} 或字符串。 */
  get _rows() {
    const letterRow = (chars) => chars.split("").map((ch) => ({ key: ch }));
    return [
      letterRow("qwertyuiop"),
      [{ key: "tab", label: "Tab" }, ...letterRow("asdfghjkl"), { key: "enter", label: "Enter" }],
      [{ key: "shift", label: "Shift" }, ...letterRow("zxcvbnm"), { key: "backspace", label: "退格" }],
      [{ key: "space", label: "空格" }]
    ];
  }

  /** 按键对应的显示文字。 */
  _label(key) {
    if (key === "space") return "空格";
    if (key === "backspace") return "退格";
    return key.toUpperCase();
  }

  /** 构建键盘 DOM。 */
  _build() {
    this.container.innerHTML = "";
    this.container.classList.add("vk");
    this._rows.forEach((row, ri) => {
      const rowEl = document.createElement("div");
      rowEl.className = "vk-row";
      row.forEach((item, ci) => {
        const key = typeof item === "string" ? item : item.key;
        const el = document.createElement("div");
        el.className = "vk-key";
        el.dataset.key = key;
        if (key === "space" || key === "tab" || key === "enter" || key === "shift" || key === "backspace") {
          el.classList.add("vk-special");
        }
        el.textContent = this._label(key);
        // 按指法分区着色（仅字母键）。
        if (FINGER_MAP[key]) {
          el.classList.add("fk-" + FINGER_MAP[key]);
        }
        this.keyEls[key] = el;
        rowEl.appendChild(el);
      });
      this.container.appendChild(rowEl);
    });
  }

  /** 高亮指定目标键（带当前指法提示）。 */
  setTarget(key) {
    this._clearTarget();
    if (!key || key.length === 0) return;
    const k = key.toLowerCase();
    const el = this.keyEls[k];
    if (!el) return;
    el.classList.add("vk-target");
    const finger = FINGER_MAP[k];
    if (finger && FINGER_NAMES[finger]) {
      const hint = this.container.parentElement.querySelector("[data-finger-hint]");
      if (hint) hint.textContent = FINGER_NAMES[finger];
    }
  }

  /** 清除目标高亮。 */
  _clearTarget() {
    this.container.querySelectorAll(".vk-key.vk-target").forEach((el) => el.classList.remove("vk-target"));
    const hint = this.container.parentElement.querySelector("[data-finger-hint]");
    if (hint) hint.textContent = "";
  }

  /** 敲击反馈：ok=true 绿色，否则红色，短暂动画后还原。 */
  flash(key, ok) {
    const k = String(key || "").toLowerCase();
    const el = this.keyEls[k] || this.keyEls.space;
    if (!el) return;
    el.classList.remove("vk-hit-ok", "vk-hit-wrong");
    // 强制重排以便重放动画。
    void el.offsetWidth;
    el.classList.add(ok ? "vk-hit-ok" : "vk-hit-wrong");
    setTimeout(() => el.classList.remove("vk-hit-ok", "vk-hit-wrong"), 220);
  }

  /** 切换输入法模式（用于切换要渲染的键位）。 */
  setMode(mode) {
    this.mode = mode;
  }

  /** 完全重置：清除所有高亮。 */
  reset() {
    this._clearTarget();
    this.container.querySelectorAll(".vk-hit-ok, .vk-hit-wrong").forEach((el) => {
      el.classList.remove("vk-hit-ok", "vk-hit-wrong");
    });
  }
}