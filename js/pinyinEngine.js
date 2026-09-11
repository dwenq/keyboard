/**
 * pinyinEngine.js
 * 拼音输入引擎：把一段拼音（词语/整行诗文）拆成分词 token，逐 token 处理输入。
 *
 * 每个 token 有两种类型：
 *   - syllable（音节）：{ type, letters, tone, display }  letters 为去声调、ü→u 的规范化字母，tone 为 0-4。
 *   - punct（标点）：{ type:'punct', char }，直接按原文标点输入。
 *
 * 输入规则：
 *   - 字母键逐字符输入；每输入一位即与目标该位字母比较计对错。
 *   - 当音节字母数输满且匹配：
 *       requireTone=false → 自动进入下一个 token；
 *       requireTone=true  → 等待用户输入声调数字（1-4 / 0 或 5 表示轻声）。
 *   - 数字键仅在“待定声调”时生效。
 *   - 退格回退；空格在音节已输满时可用于提交前进。
 */

class PinyinEngine {
  /**
   * @param {Object} opts {
   *   requireTone: boolean,   // 是否要求输入声调
   *   onStats: fn,            // 每次统计变化回调 {correct, wrong, keyStrokes, charsTyped}
   * }
   */
  constructor(opts = {}) {
    this.opts = opts;
    this.requireTone = !!opts.requireTone;
    this.tokens = [];
    this.ptr = 0;
    this.buf = "";
    this.awaitTone = false;
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0 };
    this.onDone = null;
    this.done = false;
  }

  /** 设置新的目标 token 序列，重置状态。 */
  load(tokens) {
    this.tokens = tokens;
    this.ptr = 0;
    this.buf = "";
    this.awaitTone = false;
    this.done = false;
    this._countDone = 0;
    this.stats = { correct: 0, wrong: 0, keyStrokes: 0, charsTyped: 0 };
  }

  /** 当前 token。 */
  get current() {
    return this.tokens[this.ptr];
  }

  /** 是否全部完成。 */
  get finished() {
    return this.ptr >= this.tokens.length;
  }

  /** 当前应被高亮的目标键提示：返回 'a-z' 字母、数字 '1'-'4'、或 'space' 等。 */
  get targetKey() {
    if (this.finished) return "";
    const t = this.current;
    if (t.type === "punct") return t.char;
    if (this.awaitTone) return String(Math.max(t.tone, 1));
    const len = this.buf.length;
    if (len < t.letters.length) return t.letters.charAt(len);
    // 已输满但音未匹配到自动前进（理论上不会到这），回退显示空格。
    return "";
  }

  /** 输入按键，返回是否被命中处理。 */
  handleKey(key) {
    if (this.finished) return true;
    const t = this.current;
    if (t.type === "punct") {
      if (key === t.char) {
        this._ok();
        this._advance();
      } else if (typeof key === "string" && key.length === 1 && !key.match(/[a-z0-9 ]/i)) {
        this._wrong();
      }
      return true;
    }
    // syllable
    if (/^[a-z]$/.test(key)) {
      // 正在等待声调时按字母 → 记错并忽略（要求退格或正确声调）。
      if (this.awaitTone) {
        this._wrong();
        return true;
      }
      const expect = t.letters.charAt(this.buf.length);
      if (key === expect) {
        this._ok();
        this.buf += key;
      } else {
        this._wrong();
        this._flashWrong(key);
      }
      // 输满且匹配 → 决定是否等待声调。
      if (this.buf.length === t.letters.length && this.buf === t.letters) {
        if (this.requireTone && t.tone > 0) {
          this.awaitTone = true;
        } else {
          this._advance();
        }
      }
      this._emitStats();
      return true;
    }
    if (/^[0-9]$/.test(key)) {
      // 仅当音节已输满且匹配且等待声调时处理。
      if (this.awaitTone) {
        const d = parseInt(key, 10);
        const validNeutral = d === 0 || d === 5;
        const ok = t.tone === 0 ? validNeutral : d === t.tone;
        if (ok) this._ok(); else this._wrong();
        this.awaitTone = false;
        this._advance();
        this._emitStats();
      }
      return true;
    }
    if (key === " " && !this.awaitTone) {
      // 空格提交当前已输满的音节（若未输满则忽略）。
      if (this.buf.length === t.letters.length && this.buf === t.letters) {
        this._advance();
        this._emitStats();
      }
      return true;
    }
    return false;
  }

  /** 退格处理（可由外部调用）。
   *  支持跨 token 回退：先撤销当前音节已输入的字母；若已输满或当前是标点，
   *  则回退到上一个 token 并清空其输入，以便重新输入。
   */
  backspace() {
    // 从“整段结束”状态回退到最后一个 token。
    if (this.finished) {
      this.ptr = this.tokens.length - 1;
      this.awaitTone = false;
      if (this.current && this.current.type === "syllable") this.buf = "";
    } else {
      const t = this.current;
      if (t.type === "syllable" && this.buf.length > 0) {
        this.buf = this.buf.slice(0, -1);
        this.awaitTone = false;
      } else {
        // 当前为空音节或为标点 → 回退上一个 token。
        if (this.ptr > 0) {
          this.ptr--;
          this.awaitTone = false;
          const prev = this.current;
          if (prev && prev.type === "syllable") this.buf = "";
        }
      }
    }
    this._emitStats();
  }

  /** 进入下一个 token。 */
  _advance() {
    this.ptr++;
    this.buf = "";
    this.awaitTone = false;
    if (this.finished && this.onDone) this.onDone();
  }

  _ok() {
    this.stats.correct++;
    this.stats.keyStrokes++;
    if (this.current && this.current.type === "syllable") this.stats.charsTyped++;
  }

  _wrong() {
    this.stats.wrong++;
    this.stats.keyStrokes++;
  }

  _flashWrong(key) { /* 供键盘闪烁，由上层调用 kb.flash */ }

  _emitStats() {
    if (this.opts.onStats) this.opts.onStats(this.stats);
  }
}

/** 工具：把一段空格分隔的拼音串解析为 token 数组。 */
function syllablesFromPinyin(py) {
  return String(py || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((syl) => ({
      type: "syllable",
      letters: PinyinUtil.stripTones(syl).toLowerCase().replace(/[üv]/g, "u"),
      tone: PinyinUtil.getTone(syl),
      display: syl
    }));
}

/** 判断是否为中文标点。 */
const CN_PUNCT_RE = /^[，。？！、；：——…「」『』“”‘’]$/;

/** 工具：把「课文正文行」（{zh, py} 数组）解析为 token 数组。
 *  中文汉字对应下一段拼音音节；中文标点作为 punct 独立 token，按原文标点输入。
 */
function tokensFromPoemLines(lines, opts = {}) {
  const tokens = [];
  lines.forEach((line, li) => {
    const zhChars = Array.from(line.zh);
    // 拼音音节约（去首尾英文标点），用于与汉字一一对应。
    const syllQueue = line.py
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((s) => s.replace(/^[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+/i, "").replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/i, ""));
    let q = 0;
    for (const ch of zhChars) {
      if (CN_PUNCT_RE.test(ch)) {
        tokens.push({ type: "punct", char: ch });
      } else if (q < syllQueue.length) {
        const syl = syllQueue[q];
        tokens.push({
          type: "syllable",
          letters: PinyinUtil.stripTones(syl).toLowerCase().replace(/[üv]/g, "u"),
          tone: PinyinUtil.getTone(syl),
          display: syl
        });
        q++;
      }
    }
  });
  return tokens;
}

/** 计算每行结束处的 token 下标（用于分批渲染）。 */
function lineEndsFromPoemLines(lines) {
  const ends = [];
  let idx = 0;
  lines.forEach((line) => {
    const zhChars = Array.from(line.zh);
    idx += zhChars.length;
    ends.push(idx);
  });
  return ends;
}