/**
 * course.js
 * 课程模型：把各学科内容按「顺序课程」切分，并提供过关解锁与下一课预览。
 *
 * 每个学科对应一条「课程链」（courseKey），由若干节课（lesson）按顺序组成，
 * 只有通过前一级才能解锁后一级：
 *   - 英语：每个话题 = 一节课（如「家庭成员 Family」）。
 *   - Power Up：每个 Unit = 一节课，含单词与句型。
 *   - 语文·拼音：生字按每组 8 个字自动切成一节。
 *   - 语文·课文：每首古诗/课文 = 一节课。
 *
 * 课程状态：passed（已通过）/ current（当前可练，尚未通过）/ locked（被锁住）。
 */

window.Course = {
  /** 拼音课每节包含的生字数。 */
  PINYIN_PER_LESSON: 8,

  /** 拼接课程键。
   *  @returns {string} 如 "en:一年级"、"pu:1"、"zh:一年级:pinyin"。 */
  key(subject, grade, type) {
    if (subject === "english") return "en:" + grade;
    if (subject === "powerup") return "pu:" + grade;
    return "zh:" + grade + ":" + (type || "pinyin");
  },

  /**
   * 构建某门课程的所有课。
   * @param {string} subject 'english'|'powerup'|'chinese'
   * @param {string} grade  年级名 / Power Up 级别 / 年级名
   * @param {string} type   'pinyin'|'text'（仅语文使用）
   * @returns {Array<object>} 每节含 { id, title, subtitle, type, payload }。
   */
  build(subject, grade, type) {
    const lessons = [];
    if (subject === "english") {
      const gradeGroup = (window.ENGLISH_WORDS || []).find((x) => x.grade === grade);
      const topics = grade === "KET"
        ? (window.KET_WORDS || []).map((t) => ({ topic: t.topic, words: t.words }))
        : (gradeGroup ? gradeGroup.topics : []);
      topics.forEach((tp) => {
        lessons.push({
          id: tp.topic,
          title: tp.topic,
          subtitle: tp.words.length + " 个单词",
          type: "english",
          payload: { words: tp.words, sentences: tp.sentences || [] }
        });
      });
    } else if (subject === "powerup") {
      const group = (window.POWERUP_WORDS || []).find((x) => String(x.level) === String(grade));
      (group ? group.topics : []).forEach((tp) => {
        lessons.push({
          id: tp.topic,
          title: tp.topic,
          subtitle: (tp.words ? tp.words.length : 0) + " 单词 · " + (tp.sentences ? tp.sentences.length : 0) + " 句型",
          type: "english",
          payload: { words: tp.words || [], sentences: tp.sentences || [] }
        });
      });
    } else if (type === "text") {
      (window.CHINESE_TEXTS || [])
        .filter((p) => p.grade === grade)
        .forEach((poem) => {
          lessons.push({
            id: poem.title,
            title: "《" + poem.title + "》",
            subtitle: (poem.author || "") + " · " + poem.poem.length + " 行",
            type: "text",
            payload: poem
          });
        });
    } else {
      // 语文·拼音：把生字按固定数量切成多节。
      const g = (window.CHINESE_CHARS || []).find((x) => x.grade === grade);
      if (!g) return lessons;
      const n = this.PINYIN_PER_LESSON;
      for (let i = 0; i < g.words.length; i += n) {
        const chunk = g.words.slice(i, i + n);
        lessons.push({
          id: "c" + i,
          title: "第 " + (lessons.length + 1) + " 课",
          subtitle: "生字 " + chunk.length + " 个",
          type: "pinyin",
          payload: { words: chunk }
        });
      }
    }
    return lessons;
  },

  /**
   * 依据已通过的课程 id 集合，为每节课标注状态。
   * @param {string} courseKey 课程键
   * @param {Array} lessons    课程内的所有课
   * @returns {Array<{lesson, status:'passed'|'current'|'locked', index}>}
   */
  statusList(courseKey, lessons) {
    const passed = window.UserStore.passedLessons(courseKey);
    const known = new Set(passed);
    let firstUnpassed = lessons.findIndex((l) => !known.has(l.id));
    if (firstUnpassed === -1) firstUnpassed = lessons.length;
    return lessons.map((lesson, index) => {
      let status;
      if (index < firstUnpassed) status = "passed";
      else if (index === firstUnpassed) status = "current";
      else status = "locked";
      return { lesson, status, index };
    });
  },

  /** 已通过课程数。 */
  passedCount(courseKey, lessons) {
    const known = new Set(window.UserStore.passedLessons(courseKey));
    return lessons.filter((l) => known.has(l.id)).length;
  },

  /** 课程是否全部通过（毕业）。 */
  isComplete(course, lessons) {
    return lessons.length > 0 && this.passedCount(course, lessons) === lessons.length;
  },

  /** 某节课是否可练（当前课或已通过课可回练）。 */
  canPlay(status) {
    return status === "current" || status === "passed";
  },

  /** 当前待学习（下一节要过关）的课。 */
  currentLesson(statusList) {
    return statusList.find((s) => s.status === "current");
  }
};