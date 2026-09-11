/**
 * storage.js
 * 本地持久化层：手机号登录会话、练习记录、过关进度、记忆卡片的读写。
 *
 * 数据全部保存在浏览器 localStorage 中（纯前端、无需后端），并为不同手机号隔离数据：
 *   - kb_session         当前登录手机号
 *   - kb_users           已知/注册过的手机号集合
 *   - kb_u_<phone>       某手机号的全部数据（记录 + 过关进度 + 记忆卡片）
 *
 * 每个练习模式产生的「单词/生字/课文」结果以记忆卡片（card）形式与练习记录（record）分开存储，
 * 卡片用于记忆曲线调度，记录用于复盘统计。
 */

window.UserStore = {
  PREFIX: "kb_",

  /** 存储键：当前会话手机号。 */
  get sessionKey() { return this.PREFIX + "session"; },
  /** 存储键：已知手机号集合。 */
  get usersKey() { return this.PREFIX + "users"; },
  /** 依据手机号合成某用户的数据键。 */
  userKey(phone) { return this.PREFIX + "u_" + phone; },

  /** 当前登录手机号（未登录则 null）。 */
  get session() {
    const v = localStorage.getItem(this.sessionKey);
    return v && v.replace(/\s/g, "") ? v : null;
  },

  /** 是否已登录。 */
  isLoggedIn() { return !!this.session; },

  /** 手机号是否已被记住（注册过/登录过）。 */
  isKnown(phone) {
    const u = JSON.parse(localStorage.getItem(this.usersKey) || "{}");
    return !!u[phone];
  },

  /** 记住一个手机号（视为已注册用户）。 */
  remember(phone) {
    const u = JSON.parse(localStorage.getItem(this.usersKey) || "{}");
    u[phone] = true;
    localStorage.setItem(this.usersKey, JSON.stringify(u));
  },

  /** 登录：写入会话，并初始化该用户数据容器。 */
  signIn(phone) {
    const p = String(phone || "").replace(/\s/g, "");
    if (!p) return;
    this.remember(p);
    localStorage.setItem(this.sessionKey, p);
    if (!localStorage.getItem(this.userKey(p))) {
      this._initUserData(p);
    }
  },

  /** 退出登录：仅清除会话，保留数据以便重新登录复盘。 */
  signOut() {
    localStorage.removeItem(this.sessionKey);
  },

  /** 初始化某个手机号的数据容器。 */
  _initUserData(phone) {
    localStorage.setItem(this.userKey(phone), JSON.stringify({
      created: new Date().toISOString(),
      records: [],           // 练习记录（复盘）
      passed: {},            // 过关进度：courseKey → [lessonId,...]
      cards: []              // 记忆卡片
    }));
  },

  /** 读取某手机号数据；缺省时用当前会话，不存在则新建。 */
  data(phone) {
    const p = phone || this.session;
    if (!p) return null;
    if (!localStorage.getItem(this.userKey(p))) this._initUserData(p);
    return JSON.parse(localStorage.getItem(this.userKey(p)));
  },

  /** 当前用户数据（未登录返回 null）。 */
  get current() { return this.data(); },

  /** 保存当前用户数据。 */
  _save(data) {
    if (!this.session) return;
    localStorage.setItem(this.userKey(this.session), JSON.stringify(data));
  },

  /** 返回当前用户数据对象（供直接修改）。 */
  getCurrentForWrite() {
    const d = this.data();
    if (!d) throw new Error("未登录");
    d.__persist = () => this._save(d);
    return d;
  },

  // ---------- 练习记录（复盘） ----------

  /** 追加一条练习记录。 */
  addRecord(rec) {
    const d = this.data();
    if (!d) return;
    d.records.push(Object.assign({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: new Date().toISOString()
    }, rec));
    this._save(d);
  },

  /** 当前用户的练习记录（按时间倒序）。 */
  records() {
    const d = this.data();
    if (!d) return [];
    return d.records.slice().sort((a, b) => (a.ts < b.ts ? 1 : -1));
  },

  // ---------- 过关进度 ----------

  /** 某课程已通过的课程 id 列表。 */
  passedLessons(courseKey) {
    const d = this.data();
    if (!d) return [];
    return (d.passed[courseKey] || []).slice();
  },

  /** 某课程某节课是否已通过。 */
  hasPassed(courseKey, lessonId) {
    return this.passedLessons(courseKey).includes(lessonId);
  },

  /** 标记某课程的一课为「已通过」。 */
  markPassed(courseKey, lessonId) {
    const d = this.current;
    if (!d) return;
    if (!d.passed[courseKey]) d.passed[courseKey] = [];
    if (!d.passed[courseKey].includes(lessonId)) d.passed[courseKey].push(lessonId);
    this._save(d);
  },

  // ---------- 记忆卡片 ----------

  /** 所有记忆卡片。 */
  cards() {
    const d = this.data();
    return d ? d.cards : [];
  },

  /** 依据卡片 id 取卡片。 */
  getCard(id) {
    return this.cards().find((c) => c.id === id) || null;
  },

  /** 新增或更新一张记忆卡片。 */
  saveCard(card) {
    const d = this.data();
    if (!d) return;
    const i = d.cards.findIndex((c) => c.id === card.id);
    if (i >= 0) d.cards[i] = card;
    else d.cards.push(card);
    this._save(d);
  },

  /** 批量写入多张卡片（存在则更新，不存在则新增）。 */
  saveCards(cards) {
    const d = this.data();
    if (!d || !cards.length) return;
    cards.forEach((card) => {
      const i = d.cards.findIndex((c) => c.id === card.id);
      if (i >= 0) d.cards[i] = card;
      else d.cards.push(card);
    });
    this._save(d);
  },

  /** 删除一张卡片。 */
  removeCard(id) {
    const d = this.data();
    if (!d) return;
    d.cards = d.cards.filter((c) => c.id !== id);
    this._save(d);
  }
};