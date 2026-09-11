/**
 * speech.js
 * 发音助手：基于浏览器 Web Speech API（speechSynthesis）朗读英文单词/句子。
 *
 * 能力：
 *   - effective(history)  兼容性检测
 *   - speak(text, opts)   朗读文本（自动选英文音色、放慢语速适合儿童跟读）
 *   - pickVoice()         选择 en-US / en-GB 音色
 *
 * 说明：语音在线或离线取决于操作系统提供的 TTS 音色；无法朗读时静默降级，不抛错。
 */

window.Speech = (function () {
  /** 是否支持语音合成。 */
  function supported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  var cachedVoice = null;

  /** 挑选合适的英文音色（优先 en-GB，其次 en-US，任意带 en 前缀的兜底）。 */
  function pickVoice() {
    if (!supported()) return null;
    var voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;
    var gb = voices.find(function (v) { return /^en[-_]GB/i.test(v.lang || ""); });
    var us = voices.find(function (v) { return /^en[-_]US/i.test(v.lang || ""); });
    var enAny = voices.find(function (v) { return /^en/i.test(v.lang || ""); });
    return gb || us || enAny || null;
  }

  // 部分浏览器 getVoices() 初次为空，监听 voiceschanged 预热缓存。
  if (supported()) {
    window.speechSynthesis.onvoiceschanged = function () { cachedVoice = pickVoice(); };
    cachedVoice = pickVoice();
  }

  /**
   * 朗读一段文本。
   * @param {string} text 要朗读的文本
   * @param {Object} opts { rate 语速(默认 0.8)，voice 可指定音色 }
   */
  function speak(text, opts) {
    var o = opts || {};
    if (!supported() || !text) return false;
    // 取消之前的朗读，避免叠加。
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = o.rate || 0.8;
    u.pitch = o.pitch || 1;
    var v = o.voice || pickVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
    return true;
  }

  /** 暂停当前朗读。 */
  function stop() {
    if (supported()) window.speechSynthesis.cancel();
  }

  return { supported: supported, speak: speak, stop: stop, pickVoice: pickVoice };
})();