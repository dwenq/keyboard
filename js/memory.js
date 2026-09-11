/**
 * memory.js
 * 记忆曲线（间隔重复）调度器，基于简化 SM-2 算法。
 *
 * 每个要记忆的「知识点」（英文单词 / 汉字 / 整篇课文）对应一张记忆卡片（card）：
 *   {
 *     id, subject, type, grade, lesson,
 *     question,    // 提示（如中文释义 / 汉字 / 诗词标题）
 *     answer,      // 目标（如英文单词 / 拼音 / 课文信息）
 *     rep,         // 已复习次数
 *     interval,    // 当前间隔（天）
 *     ease,        // 难度系数 1.3~2.5
 *     due,         // 到期时间戳（毫秒）
 *     failure      // 连续记错次数
 *   }
 *
 * 复习间隔策略：首次通过后 1 天 → 3 天 → 之后按 ease 递增（约 7/14/30…天）。
 */

window.Memory = {
  DAY: 86400000,

  /** 依据练习结果得到的「记忆质量」生成或更新一张卡片并返回新卡片。
   *  返回的卡片已排好下一次复习时间。 */
  schedule(card, quality) {
    const c = Object.assign({ rep: 0, interval: 0, ease: 2.5, due: 0, failure: 0 }, card);
    if (quality < 3) {
      // 记不清：重置为待学习，很快再次出现。
      c.failure = (c.failure || 0) + 1;
      c.rep = 0;
      c.interval = 0;
      c.due = Date.now() + this.DAY;
      c.ease = Math.max(1.3, c.ease - 0.2);
      return c;
    }
    // 记得：按 SM-2 更新间隔与难度。
    c.failure = 0;
    c.rep = (c.rep || 0) + 1;
    if (c.rep === 1) c.interval = 1;
    else if (c.rep === 2) c.interval = 3;
    else c.interval = Math.round(((c.interval || 3) * (c.ease || 2.5)));
    c.ease = c.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    c.ease = Math.max(1.3, Math.min(2.5, c.ease));
    c.due = Date.now() + c.interval * this.DAY;
    return c;
  },

  /** 是否已到复习时间（到期）。 */
  isDue(card, now) {
    return card.due <= (now || Date.now());
  },

  /** 从卡片列表中筛出到期的（记忆复习队列）。 */
  dueCards(cards, now) {
    const t = now || Date.now();
    return (cards || []).filter((c) => c.due <= t);
  },

  /** 尚未安排复习（首次等待 schedule）的卡片。 */
  unscheduled(cards) {
    return (cards || []).filter((c) => !c.due);
  },

  /** 汇总今日到期复习数量提示文本。 */
  dueSummary(cards) {
    return this.dueCards(cards).length;
  },

  /** 距下一次到期还需要多久（人类可读）。 */
  dueIn(card) {
    const d = card.due - Date.now();
    if (d <= 0) return "已到期";
    if (d < this.DAY) return "今天";
    if (d < 2 * this.DAY) return "明天";
    return Math.round(d / this.DAY) + " 天后";
  }
};