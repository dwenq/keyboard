/**
 * app.js
 * 主应用：手机号登录、过关制课程导航、记忆复习、练习调度与结果结算。
 *
 * 三层结构：
 *   登录 → 课程工作台（过关 / 复习 / 复盘 三个页签）
 *   → 点选当前课开始练习 → 按准确率判定通过 → 解锁下一课并安排记忆复习 → 结算。
 *
 * 依赖：storage.js（持久化）、course.js（课程模型）、memory.js（记忆曲线）、
 *       三个练习模式（english/pinyin/text）。
 */

const PASS_RATE = 90; // 一课判定「通过」所需的最低准确率（%）

const App = {
  subject: "english",       // 'english' | 'powerup' | 'chinese'
  grade: "一年级",
  zhType: "pinyin",         // 语文课程类型：'pinyin' | 'text'
  dictation: false,         // 英语课程练习类型：false=单词打字，true=听音拼写
  tab: "course",            // 工作台页签：course | review | records
  mode: null,               // 当前练习模式实例
  kb: null,
  ctx: null,                // 本次练习上下文 {kind, subject, grade, type, courseKey, lesson, cards}

  // ---------- 初始化 ----------
  init() {
    this.cacheDom();
    this.kb = new VisualKeyboard(this.dom.keyboard, { mode: "en" });
    this.bindEvents();
    this.refreshGate();
  },

  cacheDom() {
    this.dom = {
      layout: document.getElementById("layoutMain"),
      setupPanel: document.getElementById("setupPanel"),
      practicePanel: document.getElementById("practicePanel"),
      practiceTitle: document.getElementById("practiceTitle"),
      target: document.getElementById("target"),
      backBtn: document.getElementById("backBtn"),
      keyboard: document.getElementById("keyboard"),
      scope: document.getElementById("scope"),
      subjectEn: document.getElementById("subjectEn"),
      subjectZh: document.getElementById("subjectZh"),
      subjectPu: document.getElementById("subjectPu"),
      userChip: document.getElementById("userChip"),
      userPhone: document.getElementById("userPhone"),
      logoutBtn: document.getElementById("logoutBtn"),
      loginOverlay: document.getElementById("loginOverlay"),
      loginPhone: document.getElementById("loginPhone"),
      loginCode: document.getElementById("loginCode"),
      sendCodeBtn: document.getElementById("sendCodeBtn"),
      loginSubmit: document.getElementById("loginSubmit"),
      loginHint: document.getElementById("loginHint")
    };
  },

  bindEvents() {
    // 科目切换
    this.dom.subjectEn.addEventListener("change", () => {
      this.subject = "english";
      this.grade = "一年级";
      this.renderSetup();
    });
    this.dom.subjectZh.addEventListener("change", () => {
      this.subject = "chinese";
      this.grade = "一年级";
      this.renderSetup();
    });
    this.dom.subjectPu.addEventListener("change", () => {
      this.subject = "powerup";
      this.grade = "1";
      this.renderSetup();
    });
    // 返回设置
    this.dom.backBtn.addEventListener("click", () => this.exitPractice());
    // 退出登录
    this.dom.logoutBtn.addEventListener("click", () => {
      UserStore.signOut();
      this.refreshGate();
    });
    // 登录
    this.dom.sendCodeBtn.addEventListener("click", () => this.onSendCode());
    this.dom.loginSubmit.addEventListener("click", () => this.onLogin());
    ["loginPhone", "loginCode"].forEach((id) => {
      this.dom[id].addEventListener("keydown", (e) => { if (e.key === "Enter") this.onLogin(); });
    });
  },

  /** 根据登录态显示登录遮罩或应用主体。 */
  refreshGate() {
    if (UserStore.isLoggedIn()) {
      this.dom.loginOverlay.classList.add("hidden");
      this.dom.layout.classList.remove("hidden");
      this.dom.userChip.classList.remove("hidden");
      this.dom.userPhone.textContent = "用户：" + UserStore.session;
      this.renderSetup();
    } else {
      this.dom.loginOverlay.classList.remove("hidden");
      this.dom.layout.classList.add("hidden");
      this.dom.userChip.classList.add("hidden");
    }
  },

  /** 登录表单：模拟短信验证码（固定 123456）。 */
  onSendCode() {
    const phone = this.dom.loginPhone.value.replace(/\s/g, "");
    const hint = this.dom.loginHint;
    if (!phone) { this._hint("请先输入手机号", true); return; }
    if (!/^1\d{10}$/.test(phone)) { this._hint("手机号格式不正确（应为 1 开头的 11 位）", true); return; }
    // 演示环境：输入框内直接给出示例码。
    this.dom.loginCode.value = "123456";
    this._hint("验证码已下发（演示环境为 123456）", false);
  },

  onLogin() {
    const phone = this.dom.loginPhone.value.replace(/\s/g, "");
    const code = this.dom.loginCode.value.replace(/\s/g, "");
    if (!/^1\d{10}$/.test(phone)) { this._hint("请输入正确的手机号", true); return; }
    if (code !== "123456") { this._hint("验证码错误（演示码为 123456）", true); return; }
    UserStore.signIn(phone);
    this._hint("", false);
    this.dom.loginCode.value = "";
    this.dom.loginPhone.value = "";
    this.refreshGate();
  },

  _hint(msg, isError) {
    const h = this.dom.loginHint;
    h.textContent = msg || "演示环境：验证码固定为 123456";
    if (msg) h.innerHTML = msg;
    h.classList.toggle("is-error", !!isError);
  },

  // ---------- 设置面板渲染（工作台） ----------
  renderSetup() {
    const isEn = this.subject === "english";
    const isPu = this.subject === "powerup";
    const title = isEn ? "英语 · 过关打字" : isPu ? "Power Up · 单词句型过关" : "语文 · 过关打字";
    this.dom.setupPanel.classList.remove("hidden");
    this.dom.practicePanel.classList.add("hidden");
    this.dom.practiceTitle.textContent = title;
    this.buildWorkbench();
    this.kb.setMode(isEn || isPu ? "en" : "pinyin");
  },

  /** 渲染左侧工作台：页签 + 各视图。 */
  buildWorkbench() {
    // 页签
    const tabs = el("div", "app-tabs");
    [["course", "过关"], ["review", "复习"], ["records", "复盘"]].forEach(([key, label]) => {
      const b = el("button", "app-tab" + (this.tab === key ? " on" : ""), label);
      b.addEventListener("click", () => { this.tab = key; this.buildWorkbench(); });
      tabs.appendChild(b);
    });

    const sc = this.dom.scope;
    sc.innerHTML = "";
    sc.appendChild(tabs);
    if (this.tab === "course") this._renderCourse(sc);
    else if (this.tab === "review") this._renderReview(sc);
    else this._renderRecords(sc);
  },

  // ============ 过关课程 ============
  _renderCourse(sc) {
    const isEn = this.subject === "english";
    const isPu = this.subject === "powerup";

    // 年级 / 级别选择
    const gradeWrap = el("div", "ctl-row");
    gradeWrap.appendChild(el("label", "ctl-label", isPu ? "级别" : "年级 / 范围"));
    const gradeSel = el("select", "ctl-select");
    let grades;
    if (isEn) {
      // 沪教版五四制英语：初中六年级起，同时保留原有小学年级可选
      grades = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级上册", "七年级上册", "八年级上册", "九年级上册", "KET"];
    } else if (isPu) {
      grades = ["1", "2", "3"];
    } else {
      grades = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];
    }
    grades.forEach((g) => {
      const opt = el("option", "", isPu ? "Power Up " + g : g);
      opt.value = g;
      if (g === this.grade) opt.selected = true;
      gradeSel.appendChild(opt);
    });
    gradeSel.addEventListener("change", () => { this.grade = gradeSel.value; this._renderCourse(sc); });
    gradeWrap.appendChild(gradeSel);
    sc.appendChild(gradeWrap);

    // 语文：练习类型切换（拼音 / 课文）
    if (!isEn && !isPu) {
      const typeRow = el("div", "ctl-row");
      typeRow.appendChild(el("label", "ctl-label", "课程类型"));
      const seg = el("div", "seg");
      ["pinyin", "text"].forEach((t) => {
        const b = el("button", "seg-btn" + (this.zhType === t ? " on" : ""), t === "pinyin" ? "拼音生字" : "课文古诗");
        b.addEventListener("click", () => { this.zhType = t; this._renderCourse(sc); });
        seg.appendChild(b);
      });
      typeRow.appendChild(seg);
      sc.appendChild(typeRow);
    }

    // 英语 / Power Up：练习类型切换（单词打字 / 听音拼写）
    if (isEn || isPu) {
      const enRow = el("div", "ctl-row");
      enRow.appendChild(el("label", "ctl-label", "练习类型"));
      const seg = el("div", "seg");
      [["typing", "单词跟读", false], ["dictation", "听音拼写", true]].forEach(([key, label, val]) => {
        const b = el("button", "seg-btn" + (this.dictation === val ? " on" : ""), label);
        b.addEventListener("click", () => { this.dictation = val; this._renderCourse(sc); });
        seg.appendChild(b);
      });
      enRow.appendChild(seg);
      sc.appendChild(enRow);
    }

    const courseKey = Course.key(this.subject, this.grade, this.type());
    const lessons = Course.build(this.subject, this.grade, this.type());
    const statusList = Course.statusList(courseKey, lessons);

    // 进度 + 待复习提示
    const meta = el("div", "course-meta");
    const passed = Course.passedCount(courseKey, lessons);
    meta.appendChild(el("span", "progress-pill", `进度 ${passed} / ${lessons.length} 课`));
    const dueN = Memory.dueSummary(UserStore.cards());
    if (dueN) meta.appendChild(el("span", "due-badge", "今日复习 " + dueN + ""));
    sc.appendChild(meta);

    // 课程链
    const listWrap = el("div", "lesson-list");
    if (!statusList.length) {
      listWrap.appendChild(el("div", "empty-tip", "该范围暂无内容"));
    } else {
      statusList.forEach((s) => {
        const row = this._lessonRow(s, courseKey);
        if (row) listWrap.appendChild(row);
      });
    }
    sc.appendChild(listWrap);

    // 下一课预习
    const cur = Course.currentLesson(statusList);
    if (cur && !Course.isComplete(courseKey, lessons)) {
      sc.appendChild(this._previewCard(cur.lesson));
    } else if (Course.isComplete(courseKey, lessons)) {
      const ok = el("div", "course-done");
      ok.innerHTML = "<b>🎉 已结营</b>该课程全部过完，可在「复习」中巩固";
      sc.appendChild(ok);
    }
  },

  /** 本课程的 practice 类型。 */
  type() {
    if (this.subject === "english" || this.subject === "powerup") return "";
    return this.zhType;
  },

  /** 某一课的可点击行。 */
  _lessonRow(s, courseKey) {
    const { lesson, status, index } = s;
    const row = el("div", "lesson-item" + (status === "locked" ? " locked" : ""));
    const icon = { passed: "✅", current: "▶️", locked: "🔒" }[status];
    row.appendChild(el("span", "li-state", icon));
    const body = el("div", "li-body");
    body.appendChild(el("div", "li-title", (index + 1) + ". " + lesson.title));
    body.appendChild(el("div", "li-sub", lesson.subtitle + (status === "current" ? " · 当前课" : "")));
    row.appendChild(body);

    if (status === "current") {
      const badge = el("span", "li-badge current", "待通过");
      row.appendChild(badge);
      const btn = el("button", "btn primary xs", "开始练习");
      btn.addEventListener("click", () => this.startCourseLesson(courseKey, lesson, s));
      const actions = el("div", "li-actions");
      actions.appendChild(btn);
      row.appendChild(actions);
    } else if (status === "passed") {
      const badge = el("span", "li-badge passed", "已通过");
      row.appendChild(badge);
      const btn = el("button", "btn xs secondary", "回练");
      btn.addEventListener("click", () => this.startCourseLesson(courseKey, lesson, s));
      const actions = el("div", "li-actions");
      actions.appendChild(btn);
      row.appendChild(actions);
    }
    return row;
  },

  /** 预习卡片：展示下一课将学的内容。 */
  _previewCard(lesson) {
    const card = el("div", "preview-card");
    card.appendChild(el("div", "pv-title", "📖 下一课预习 · " + lesson.title));
    const list = el("div", "pv-list");
    const items = this._lessonItems(lesson);
    items.slice(0, 12).forEach((it) => {
      list.appendChild(el("span", "pv-chip", this._itemPreviewLabel(lesson.type, it)));
    });
    if (items.length > 12) list.appendChild(el("span", "pv-chip", "+" + (items.length - 12)));
    card.appendChild(list);
    return card;
  },

  /** 从课构造练习所需的条目数组。 */
  _lessonItems(lesson) {
    if (lesson.type === "english") {
      const words = (lesson.payload.words || []).map((w) => ({ en: w.en, cn: w.cn }));
      // Power Up：同一课内单词在前、句型在后，一并练习。
      if (this.subject === "powerup") {
        const sents = (lesson.payload.sentences || []).map((s) => ({ en: s.en, cn: s.cn }));
        return words.concat(sents);
      }
      return words;
    }
    if (lesson.type === "pinyin") {
      return (lesson.payload.words || []).map((w) => ({ char: w.char, pinyin: w.pinyin, meaning: w.meaning }));
    }
    return []; // text 用整篇课文对象
  },

  _itemPreviewLabel(type, it) {
    if (type === "english") return it.en + (it.cn ? " " + it.cn : "");
    if (type === "pinyin") return it.char + (it.pinyin ? " " + it.pinyin : "");
    return "";
  },

  // ============ 记忆复习 ============
  _renderReview(sc) {
    sc.appendChild(el("p", "review-sum",
      "根据记忆曲线，练习过的知识点会按期再次出现，巩固记忆。下方为今日到期待复习的内容。"));

    const cards = UserStore.cards();
    const due = Memory.dueCards(cards);
    if (!due.length) {
      sc.appendChild(el("div", "empty-tip", "🎉 今日暂无到期复习内容，先去过关教材吧。"));
      return;
    }

    // 按类型分组
    const groups = {};
    due.forEach((c) => { (groups[c.type] = groups[c.type] || []).push(c); });
    Object.keys(groups).forEach((type) => {
      const list = groups[type];
      const box = el("div", "lesson-list");
      list.forEach((c) => {
        const item = el("div", "review-item");
        item.appendChild(el("span", "qv", c.question));
        item.appendChild(el("span", "qa", c.answer + (c.grade ? " · " + c.grade : "")));
        item.appendChild(el("span", "qd", this._dueText(c)));
        box.appendChild(item);
      });
      sc.appendChild(box);
      const startBtn = el("button", "btn primary", "开始复习 · " + list.length + " 个");
      startBtn.addEventListener("click", () => this.startReview(type, list));
      sc.appendChild(startBtn);
    });
  },

  _dueText(c) {
    return Memory.isDue(c) ? "待复习" : Memory.dueIn(c);
  },

  // ============ 复盘 ============
  _renderRecords(sc) {
    const recs = UserStore.records();
    const cards = UserStore.cards();
    if (!recs.length) {
      sc.appendChild(el("div", "empty-tip", "还没有练习记录，完成一次练习后会自动记录。"));
      return;
    }
    const total = recs.length;
    const acc = Math.round((recs.reduce((s, r) => s + (r.accuracy || 0), 0) / total) * 10) / 10;
    const passedNow = this._totalPassed();
    const stats = el("div", "rec-stats");
    [["练习次数", total], ["平均准确率", acc + "%"], ["累计过关", passedNow + " 课"]].forEach(([k, v]) => {
      const s = el("div", "rec-stat");
      s.appendChild(el("b", "", v));
      s.appendChild(el("span", "", k));
      stats.appendChild(s);
    });
    sc.appendChild(stats);

    const recList = el("div", "rec-list");
    recs.forEach((r) => {
      const row = el("div", "rec-row");
      const main = el("div", "rr-main", r.title || (r.lesson || "") + (r.type ? " · " + r.type : ""));
      const sub = el("div", "rr-sub",
        new Date(r.ts).toLocaleString("zh-CN") + " · 准确率 " + (r.accuracy || 0) + "% · 用时 " + formatTime(r.time || 0));
      row.appendChild(main);
      row.appendChild(sub);
      const badge = el("span", "rr-badge " + (r.pass ? "pass" : "fail"), r.pass ? "通过" : "未过");
      row.appendChild(badge);
      recList.appendChild(row);
    });
    sc.appendChild(recList);
  },

  _totalPassed() {
    const d = UserStore.data();
    if (!d) return 0;
    let n = 0;
    Object.keys(d.passed || {}).forEach((k) => { n += d.passed[k].length; });
    return n;
  },

  // ============ 启动练习 ============
  startCourseLesson(courseKey, lesson, statusEntry) {
    let items, title, poem = null;
    if (lesson.type === "english") {
      items = shuffle(this._lessonItems(lesson));
    } else if (lesson.type === "pinyin") {
      items = shuffle(this._lessonItems(lesson));
    } else {
      poem = lesson.payload;
      items = [];
    }
    this.ctx = { kind: "course", courseKey, subject: this.subject, grade: this.grade, type: lesson.type, lesson, items, poem };
    const gradeTag = this.subject === "powerup" ? "Power Up " + this.grade : this.grade;
    title = gradeTag + " · " + lesson.title;
    this._enterPractice(title);
    this._startMode(lesson.type, items, poem, title);
  },

  startReview(type, cards) {
    let items = [], poem = null;
    if (type === "english") {
      items = shuffle(cards.map((c) => ({ en: c.answer, cn: c.question })));
    } else if (type === "pinyin") {
      items = shuffle(cards.map((c) => ({ char: c.question, pinyin: c.answer, meaning: "" })));
    } else if (type === "text") {
      const first = cards.find((c) => c.poem);
      poem = first ? first.poem : null;
      items = [];
    }
    this.ctx = { kind: "review", type, subject: this.subject, grade: this.grade, cards, items, poem };
    const title = "记忆复习 · " + (type === "english" ? "单词" : type === "pinyin" ? "生字" : "课文");
    this._enterPractice(title);
    this._startMode(type, items, poem, title);
  },

  /** 实例化对应练习模式。 */
  _startMode(type, items, poem, title) {
    this._stopCurrent();
    const ctx = this.ctx;
    const opts = {
      kb: this.kb,
      container: this.dom.target,
      requireToneGetter: () => this._toneReqChecked(),
      onStats: () => {},
      onComplete: (stats) => this.onPracticeComplete(stats, ctx)
    };
    if (type === "english") {
      // 听音拼写启用时用 dictation 模式，否则用普通单词打字（含音标跟读）。
      this.mode = this.dictation ? new DictationMode(opts) : new EnglishMode(opts);
      this.mode.start(items);
    } else if (type === "pinyin") {
      this.mode = new PinyinMode(opts);
      this.mode.start(items);
    } else if (type === "text") {
      this.mode = new TextMode(opts);
      this.mode.start(poem);
    }
  },

  _toneReqChecked() {
    const el = document.getElementById("toneReq");
    return el ? el.checked : false;
  },

  _enterPractice(subtitle) {
    this.dom.practicePanel.classList.remove("hidden");
    this.dom.setupPanel.classList.add("hidden");
    this.dom.practiceTitle.textContent = subtitle;
    this.dom.target.innerHTML = "";
  },

  _stopCurrent() {
    if (this.mode && typeof this.mode.stop === "function") this.mode.stop();
    this.mode = null;
  },

  exitPractice() {
    this._stopCurrent();
    this.kb.reset();
    this.dom.setupPanel.classList.remove("hidden");
    this.dom.practicePanel.classList.add("hidden");
    this.buildWorkbench();
  },

  // ============ 结算与把关 ============
  onPracticeComplete(stats, ctx) {
    const s = computeStats(stats);
    // 复习与过关共用：准确率达标即「通过」。
    const pass = s.accuracy >= PASS_RATE;

    let banner = { passed: pass, text: "" };
    if (ctx.kind === "course") {
      if (pass) {
        UserStore.markPassed(ctx.courseKey, ctx.lesson.id);
        this._scheduleLessonCards(ctx, this.mode ? this.mode.itemResults : []);
      }
      this._record(ctx, s, pass, ctx.lesson.title);
    } else {
      this._rescheduleReviewCards(ctx);
      this._record(ctx, s, pass, "记忆复习");
    }
    this.showResult(ctx, s, pass, banner);
  },

  /** 记录一条练习记录（复盘）。 */
  _record(ctx, s, pass, title) {
    UserStore.addRecord({
      subject: ctx.subject,
      grade: ctx.grade,
      type: ctx.type || "",
      lesson: title,
      title: title,
      accuracy: s.accuracy,
      time: s.time,
      correct: s.correct,
      wrong: s.wrong,
      pass
    });
  },

  /** 过关后：为这节课的知识点安排记忆复习（生成卡片）。 */
  _scheduleLessonCards(ctx, itemResults) {
    const cards = [];
    const lesson = ctx.lesson;
    if (ctx.type === "english") {
      // Power Up：以实际练习条目（单词在前、句型在后）生成记忆卡片。
      if (this.subject === "powerup") {
        (itemResults || []).forEach((res) => {
          const quality = res.firstTry ? 5 : 2;
          cards.push(Memory.schedule({
            id: "pu|" + res.a,
            subject: "powerup",
            type: "english",
            grade: "Power Up " + ctx.grade,
            lesson: lesson.title,
            question: res.q,
            answer: res.a
          }, quality));
        });
      } else {
        (lesson.payload.words || []).forEach((w) => {
          const en = w.en.toLowerCase();
          const res = itemResults.find((r) => r.a === en);
          const quality = res ? (res.firstTry ? 5 : 2) : 3;
          cards.push(Memory.schedule({
            id: "en|" + en,
            subject: "english",
            type: "english",
            grade: ctx.grade,
            lesson: lesson.title,
            question: w.cn,
            answer: en
          }, quality));
        });
      }
    } else if (ctx.type === "pinyin") {
      (lesson.payload.words || []).forEach((w) => {
        const res = itemResults.find((r) => r.q === w.char);
        const quality = res ? (res.firstTry ? 5 : 2) : 3;
        cards.push(Memory.schedule({
          id: "ch|" + w.char,
          subject: "chinese",
          type: "pinyin",
          grade: ctx.grade,
          lesson: lesson.title,
          question: w.char,
          answer: w.pinyin
        }, quality));
      });
    } else if (ctx.type === "text") {
      const res = itemResults[0];
      const quality = res ? (res.firstTry ? 5 : 2) : 3;
      cards.push(Memory.schedule({
        id: "txt|" + lesson.title,
        subject: "chinese",
        type: "text",
        grade: ctx.grade,
        lesson: lesson.title,
        question: lesson.title,
        answer: (lesson.payload.author || "") + "《" + lesson.title + "》",
        poem: lesson.payload
      }, quality));
    }
    UserStore.saveCards(cards);
  },

  /** 复习完成：按本次结果更新每张卡片的记忆状态。 */
  _rescheduleReviewCards(ctx) {
    const itemResults = this.mode ? this.mode.itemResults : [];
    const updated = (ctx.cards || []).map((card) => {
      let quality = 3;
      if (card.type === "text") {
        const res = itemResults[0];
        quality = res ? (res.firstTry ? 5 : 2) : 3;
      } else if (card.type === "english") {
        const res = itemResults.find((r) => r.a === card.answer);
        quality = res ? (res.firstTry ? 5 : 2) : 2;
      } else if (card.type === "pinyin") {
        const res = itemResults.find((r) => r.q === card.question);
        quality = res ? (res.firstTry ? 5 : 2) : 2;
      }
      return Memory.schedule(Object.assign({}, card), quality);
    });
    UserStore.saveCards(updated);
  },

  // ============ 结算界面 ============
  showResult(ctx, s, pass, banner) {
    this.kb.reset();
    const box = el("div", "result");
    const title = this.ctx && this.ctx.kind === "review" ? "复习完成 🎉" : (pass ? "过关成功 🎉" : "再接再厉 💪");
    let html = `
      <div class="r-title">${title}</div>
      <div class="r-sub">${ctx.lesson ? ctx.lesson.title : "记忆复习"}</div>`;
    if (banner && banner.passed) {
      html += `<div class="r-pass-banner passed">✔ 准确率 ${s.accuracy}% ≥ ${PASS_RATE}%，已通过本课，下一课已解锁</div>`;
    } else if (banner) {
      html += `<div class="r-pass-banner failed">✘ 准确率 ${s.accuracy}% 未达 ${PASS_RATE}%，请再次练习本课</div>`;
    }
    html += `
      <div class="r-grid">
        <div class="r-item"><b>${formatTime(s.time)}</b><span>用时</span></div>
        <div class="r-item"><b>${s.accuracy}%</b><span>准确率</span></div>
        <div class="r-item"><b>${Math.round((s.correct / 5) / (s.time / 60))}</b><span>字/分</span></div>
        <div class="r-item"><b>${s.correct}</b><span>正确键</span></div>
        <div class="r-item"><b>${s.wrong}</b><span>错误键</span></div>
        <div class="r-item"><b>${s.keyStrokes}</b><span>总击键</span></div>
      </div>
      <div class="r-actions">
        <button class="btn secondary" id="rAgain">再来一组</button>
        <button class="btn" id="rBack">返回工作台</button>
      </div>
    `;
    box.innerHTML = html;
    this.dom.target.innerHTML = "";
    this.dom.target.appendChild(box);
    box.querySelector("#rAgain").addEventListener("click", () => {
      // 重跑本轮（同一节课或同一批复习）。
      if (this.ctx && this.ctx.kind === "course") {
        this.startCourseLesson(this.ctx.courseKey, this.ctx.lesson, null);
      } else if (this.ctx && this.ctx.kind === "review") {
        this.startReview(this.ctx.type, this.ctx.cards);
      }
    });
    box.querySelector("#rBack").addEventListener("click", () => this.exitPractice());
  }
};

/** 工具：便捷创建元素。 */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

document.addEventListener("DOMContentLoaded", () => App.init());
window.App = App; // 暴露给控制台调试与自动化测试使用