/**
 * core.js
 * 核心工具库：拼音处理、随机打乱、统计计算等公共函数。
 */

/** 拼音工具：负责声调符号与字母串的转换、比较。 */
const PinyinUtil = {
  /** 声调数字到符号的映射（按 a e i o u ü 顺序）。 */
  toneMap: {
    a: ["a", "ā", "á", "ǎ", "à"],
    e: ["e", "ē", "é", "ě", "è"],
    i: ["i", "ī", "í", "ǐ", "ì"],
    o: ["o", "ō", "ó", "ǒ", "ò"],
    u: ["u", "ū", "ú", "ǔ", "ù"],
    ü: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
    v: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"]
  },

  /** 去掉拼音串中所有声调符号，返回纯字母（ü 归一化为 ü）。 */
  stripTones(str) {
    return String(str || "").replace(/[āáǎà]/g, "a")
      .replace(/[ēéěè]/g, "e")
      .replace(/[īíǐì]/g, "i")
      .replace(/[ōóǒò]/g, "o")
      .replace(/[ūúǔù]/g, "u")
      .replace(/[ǖǘǚǜ]/g, "ü");
  },

  /** 判断字符串是否带有任意声调符号。 */
  hasToneMark(str) {
    return /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(str);
  },

  /**
   * 提取字符串中的声调数字（如果有），返回 1-4；无则返回 0。
   * 规则：ā=1、á=2、ǎ=3、à=4，其余元音同理。
   */
  getTone(str) {
    const marks = {
      ā: 1, á: 2, ǎ: 3, à: 4,
      ē: 1, é: 2, ě: 3, è: 4,
      ī: 1, í: 2, ǐ: 3, ì: 4,
      ō: 1, ó: 2, ǒ: 3, ò: 4,
      ū: 1, ú: 2, ǔ: 3, ù: 4,
      ǖ: 1, ǘ: 2, ǚ: 3, ǜ: 4
    };
    for (const ch of String(str || "")) {
      if (marks[ch] !== undefined) return marks[ch];
    }
    return 0;
  },

  /** 根据声调数字，在音节正确元音上添加声调符号。音节需为纯字母（如 "ma"），tone∈[1,5]，5/0 表示轻声不加符号。 */
  addTone(syllable, tone) {
    if (!tone || tone > 4) return syllable;
    // 寻找该放声调的元音位置：a > e > o > iu > ü（标准规则）。
    const lower = String(syllable).toLowerCase();
    let index = -1;
    if (lower.includes("a")) index = lower.indexOf("a");
    else if (lower.includes("e")) index = lower.indexOf("e");
    else if (lower.includes("o")) index = lower.indexOf("o");
    else if (lower.includes("iu")) index = lower.indexOf("u");
    else if (lower.includes("ui")) index = lower.indexOf("i");
    else {
      index = lower.search(/[iüuv]/);
    }
    if (index < 0) return syllable;
    const ch = lower[index];
    const list = this.toneMap[ch] || this.toneMap.v;
    const mark = list[tone] || this.toneMap.a[tone];
    return lower.slice(0, index) + mark + lower.slice(index + 1);
  },

  /** 归一化用户输入，便于与目标比较。返回 {letters, tone}，tone 为0/非0。 */
  normalizeInput(typed) {
    let s = String(typed || "").trim().toLowerCase();
    let tone = this.hasToneMark(s) ? this.getTone(s) : 0;
    let letters = this.stripTones(s).replace(/v/g, "ü");
    // 允许把目标 ü 的字母按 u 输入（宽松匹配，比较时统一按 ü）。
    letters = letters.replace(/u/g, (m, i, full) => (full[i - 1] === "ü" ? "u" : m));
    return { letters, tone };
  }
};

/** Fisher-Yates 洗牌：返回打乱后的新数组，不影响原数组。 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 数字补零：3 -> "03"。 */
function pad2(n) {
  return String(n).padStart(2, "0");
}

/** 将秒格式化为 mm:ss。 */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return pad2(m) + ":" + pad2(s);
}

/** 计算打字统计：返回 {wpm, accuracy, chars, correct, wrong, time}。 */
function computeStats(stats) {
  const timeSec = Math.max(1, stats.time);
  const total = stats.correct + stats.wrong;
  const wpm = stats.wordCount ? Math.round((stats.wordCount / (timeSec / 60)) * 10) / 10 : 0;
  const accuracy = total ? Math.round((stats.correct / total) * 1000) / 10 : 100;
  return {
    wpm,
    accuracy,
    chars: total,
    correct: stats.correct,
    wrong: stats.wrong,
    time: timeSec,
    keyStrokes: stats.keyStrokes
  };
}

/** 按手指分组为键盘上色用的标准 QWERTY 指法表。 */
const FINGER_MAP = {
  q: "lp", w: "lr", e: "lm", r: "li", t: "li",
  y: "ri", u: "ri", i: "rm", o: "rr", p: "rp",
  a: "lp", s: "lr", d: "lm", f: "li", g: "li",
  h: "ri", j: "ri", k: "rm", l: "rr",
  z: "lp", x: "lr", c: "lm", v: "li", b: "li",
  n: "ri", m: "ri"
};

/** 每个手指对应的显示名称（用于指法提示）。 */
const FINGER_NAMES = {
  lp: "左小指", lr: "左无名指", lm: "左中指", li: "左食指",
  ri: "右食指", rm: "右中指", rr: "右无名指", rp: "右小指"
};