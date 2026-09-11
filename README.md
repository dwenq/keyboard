# Keyboard 儿童英语/语文打字练习

一个用于儿童英语、拼音、语文打字练习的 Web 应用。含登录、过关制课程、记忆复习、练习与结果结算等功能。

- Git 仓库：https://github.com/dwenq/keyboard
- SSH：`git@github.com:dwenq/keyboard.git`

## 本地运行

本仓库是纯前端静态代码，启动一个本地静态服务器即可（如启用根目录的 `server.js`）：

```bash
node server.js
# 然后浏览器打开 http://localhost:3000
```

## 在新电脑上使用（含 git 操作）

### 方式一：SSH（推荐）

GitHub 会按“已注册的 SSH 公钥”来识别身份。只要把现有私钥拷贝到新电脑，就能直接克隆和推拉，无需重新配置。

1. 拷贝当前电脑的私钥到新电脑：
   ```bash
   scp ~/.ssh/id_ed25519 用户名@新电脑IP:~/.ssh/id_ed25519
   ```
2. 在新电脑上设好权限并克隆：
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   git clone git@github.com:dwenq/keyboard.git
   ```

### 方式二：HTTPS + Token

```bash
git clone https://github.com/dwenq/keyboard.git
cd keyboard
git remote set-url origin https://github.com/dwenq/keyboard.git
# 首次推拉时按提示输入用户名和 Personal Access Token（需有 repo / Contents 写权限）
```

### 日常 git 流程

```bash
git pull                          # 拉取最新代码
git add .
git commit -m "你的提交说明"
git push                          # 推送
```

## 目录结构

- `index.html` – 应用入口页
- `css/` – 样式
- `js/app.js` – 主应用逻辑（登录、课程导航、练习调度）
- `js/course.js` – 课程构建
- `js/modes/` – 英语 / 拼音 / 文本三种练习模式
- `js/visualKeyboard.js` – 视觉键盘组件
- `js/data/englishWords.js` – 英语词汇库（沪教版·五四制 2026）
- `js/data/ipa.js` – 单词国际音标对照
- `server.js` – 本地静态服务器