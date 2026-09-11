/**
 * powerupWords.js
 * 剑桥《Power Up》学生用书 1-3 级别核心词库与句型库。
 *
 * 语料来源：Power Up 1 / 2 / 3 Pupil's Book 单元内容（级别 1、2 取自教材 OCR 提取，
 *           级别 3 依据教材单元话题与语法焦点整理）。
 *
 * 数据结构说明：
 *   每个级别为一个对象，包含 level（级别，'1'|'2'|'3'）、desc（一句话说明）、
 *   topics（单元数组）。每个单元 topic 含 topic（单元课题）、words（单词+中文释义）、
 *   sentences（本单元核心句型，含中文翻译）。
 *
 * 适用场景：Power Up 作为独立科目，按级别与单元设置关卡，供孩子预习、巩固、复习
 *           （单词与句型一起练习，配合记忆曲线安排复习）。
 */

window.POWERUP_WORDS = [
  // ==================== Level 1 ====================
  {
    level: "1",
    desc: "剑桥 Power Up 一级：问候、数字颜色、校园、家庭与身体、农场动物、食物、玩具、出行",
    topics: [
      {
        topic: "Hello 你好",
        words: [
          { en: "hello", cn: "你好" },
          { en: "hi", cn: "嗨；你好" },
          { en: "name", cn: "名字" },
          { en: "old", cn: "年岁的" },
          { en: "class", cn: "班级；课" },
          { en: "friend", cn: "朋友" },
          { en: "please", cn: "请" },
          { en: "thank you", cn: "谢谢你" },
          { en: "red", cn: "红色的" },
          { en: "yellow", cn: "黄色的" },
          { en: "blue", cn: "蓝色的" },
          { en: "green", cn: "绿色的" },
          { en: "black", cn: "黑色的" },
          { en: "white", cn: "白色的" },
          { en: "orange", cn: "橘色的" },
          { en: "pink", cn: "粉色的" },
          { en: "purple", cn: "紫色的" },
          { en: "brown", cn: "棕色的" },
          { en: "grey", cn: "灰色的" },
          { en: "one", cn: "一" },
          { en: "two", cn: "二" },
          { en: "three", cn: "三" },
          { en: "four", cn: "四" },
          { en: "five", cn: "五" },
          { en: "six", cn: "六" },
          { en: "seven", cn: "七" },
          { en: "eight", cn: "八" },
          { en: "nine", cn: "九" },
          { en: "ten", cn: "十" }
        ],
        sentences: [
          { en: "Hello, I'm Henrietta.", cn: "你好，我是亨丽埃塔。" },
          { en: "What's your name?", cn: "你叫什么名字？" },
          { en: "How old are you?", cn: "你几岁了？" },
          { en: "I'm eight.", cn: "我八岁了。" }
        ]
      },
      {
        topic: "Our new school 我们的新学校",
        words: [
          { en: "classroom", cn: "教室" },
          { en: "rubber", cn: "橡皮" },
          { en: "pencil", cn: "铅笔" },
          { en: "teacher", cn: "老师" },
          { en: "crayon", cn: "蜡笔" },
          { en: "bag", cn: "书包；袋子" },
          { en: "desk", cn: "课桌" },
          { en: "chair", cn: "椅子" },
          { en: "book", cn: "书" },
          { en: "pen", cn: "钢笔" },
          { en: "pencil case", cn: "铅笔盒" },
          { en: "door", cn: "门" },
          { en: "wall", cn: "墙" },
          { en: "board", cn: "黑板" },
          { en: "window", cn: "窗户" },
          { en: "where", cn: "哪里" }
        ],
        sentences: [
          { en: "Where's the crayon?", cn: "蜡笔在哪里？" },
          { en: "It's on the desk.", cn: "它在课桌上。" },
          { en: "It's under the book.", cn: "它在书下面。" },
          { en: "It's in the pencil case.", cn: "它在铅笔盒里。" },
          { en: "It's next to the desk.", cn: "它在课桌旁边。" }
        ]
      },
      {
        topic: "All about us 关于我们",
        words: [
          { en: "family", cn: "家庭" },
          { en: "father", cn: "父亲" },
          { en: "dad", cn: "爸爸" },
          { en: "mother", cn: "母亲" },
          { en: "mum", cn: "妈妈" },
          { en: "grandfather", cn: "祖父；外祖父" },
          { en: "grandpa", cn: "爷爷；外公" },
          { en: "grandmother", cn: "祖母；外祖母" },
          { en: "grandma", cn: "奶奶；外婆" },
          { en: "brother", cn: "哥哥；弟弟" },
          { en: "sister", cn: "姐姐；妹妹" },
          { en: "head", cn: "头" },
          { en: "face", cn: "脸" },
          { en: "nose", cn: "鼻子" },
          { en: "mouth", cn: "嘴" },
          { en: "eye", cn: "眼睛" },
          { en: "ear", cn: "耳朵" },
          { en: "hair", cn: "头发" },
          { en: "arm", cn: "手臂" },
          { en: "hand", cn: "手" },
          { en: "body", cn: "身体" },
          { en: "leg", cn: "腿" },
          { en: "foot", cn: "脚" },
          { en: "feet", cn: "脚（复数）" },
          { en: "tail", cn: "尾巴" }
        ],
        sentences: [
          { en: "Who is she?", cn: "她是谁？" },
          { en: "She's Jenny. She's a girl.", cn: "她是珍妮。她是个女孩。" },
          { en: "He's Jim. He's a boy.", cn: "他是吉姆。他是个男孩。" },
          { en: "I've got brown hair.", cn: "我有棕色的头发。" },
          { en: "They've got blue eyes.", cn: "他们有蓝色的眼睛。" }
        ]
      },
      {
        topic: "Fun on the farm 农场真有趣",
        words: [
          { en: "farm", cn: "农场" },
          { en: "cow", cn: "奶牛" },
          { en: "donkey", cn: "驴" },
          { en: "horse", cn: "马" },
          { en: "sheep", cn: "绵羊" },
          { en: "goat", cn: "山羊" },
          { en: "chicken", cn: "鸡" },
          { en: "duck", cn: "鸭子" },
          { en: "cat", cn: "猫" },
          { en: "dog", cn: "狗" },
          { en: "spider", cn: "蜘蛛" },
          { en: "long", cn: "长的" },
          { en: "big", cn: "大的" },
          { en: "small", cn: "小的" },
          { en: "old", cn: "老的；旧的" }
        ],
        sentences: [
          { en: "Has it got a long tail?", cn: "它有长尾巴吗？" },
          { en: "Yes, it has. / No, it hasn't.", cn: "是的，它有。/ 不，它没有。" },
          { en: "It's got small feet.", cn: "它有小脚。" },
          { en: "It hasn't got small feet.", cn: "它没有小脚。" },
          { en: "They aren't old chickens.", cn: "它们不是老母鸡。" }
        ]
      },
      {
        topic: "Food with friends 和朋友一起美食",
        words: [
          { en: "food", cn: "食物" },
          { en: "drink", cn: "饮料" },
          { en: "cake", cn: "蛋糕" },
          { en: "chocolate", cn: "巧克力" },
          { en: "chicken", cn: "鸡肉" },
          { en: "burger", cn: "汉堡" },
          { en: "bread", cn: "面包" },
          { en: "lemonade", cn: "柠檬水" },
          { en: "water", cn: "水" },
          { en: "banana", cn: "香蕉" },
          { en: "mango", cn: "芒果" },
          { en: "salad", cn: "沙拉" },
          { en: "fruit", cn: "水果" },
          { en: "apple", cn: "苹果" },
          { en: "orange", cn: "橙子" },
          { en: "grapes", cn: "葡萄" },
          { en: "juice", cn: "果汁" },
          { en: "meat", cn: "肉" },
          { en: "meatballs", cn: "肉丸" },
          { en: "beans", cn: "豆子" },
          { en: "sausage", cn: "香肠" },
          { en: "ice cream", cn: "冰淇淋" }
        ],
        sentences: [
          { en: "Do you like chocolate?", cn: "你喜欢巧克力吗？" },
          { en: "Yes, I do. / No, I don't.", cn: "是的，我喜欢。/ 不，我不喜欢。" },
          { en: "I like salad.", cn: "我喜欢沙拉。" },
          { en: "I don't like burgers.", cn: "我不喜欢汉堡。" },
          { en: "Would you like some ice cream?", cn: "你想来点冰淇淋吗？" },
          { en: "Can I have some chocolate, please?", cn: "我可以吃一些巧克力吗？" }
        ]
      },
      {
        topic: "Happy birthday! 生日快乐！",
        words: [
          { en: "birthday", cn: "生日" },
          { en: "toys", cn: "玩具" },
          { en: "plane", cn: "飞机" },
          { en: "kite", cn: "风筝" },
          { en: "doll", cn: "洋娃娃" },
          { en: "robot", cn: "机器人" },
          { en: "ball", cn: "球" },
          { en: "house", cn: "房子；玩具屋" },
          { en: "car", cn: "小汽车" },
          { en: "bike", cn: "自行车" },
          { en: "ship", cn: "船" },
          { en: "balloon", cn: "气球" },
          { en: "computer", cn: "电脑" },
          { en: "mouse", cn: "鼠标；老鼠" },
          { en: "keyboard", cn: "键盘" },
          { en: "board game", cn: "棋盘游戏" },
          { en: "helicopter", cn: "直升机" },
          { en: "teddy", cn: "泰迪熊" },
          { en: "radio", cn: "收音机" },
          { en: "box", cn: "盒子" }
        ],
        sentences: [
          { en: "Whose car is that?", cn: "那是谁的汽车？" },
          { en: "What does he want?", cn: "他想要什么？" },
          { en: "He wants a helicopter.", cn: "他想要一架直升机。" },
          { en: "Does he want a teddy?", cn: "他想要泰迪熊吗？" },
          { en: "Yes, he does. / No, he doesn't.", cn: "是的，他想要。/ 不，他不想。" }
        ]
      },
      {
        topic: "A day out 出门的一天",
        words: [
          { en: "park", cn: "公园" },
          { en: "garden", cn: "花园" },
          { en: "tree", cn: "树" },
          { en: "flower", cn: "花" },
          { en: "train", cn: "火车" },
          { en: "bus", cn: "公共汽车" },
          { en: "bus stop", cn: "公交车站" },
          { en: "car", cn: "小汽车" },
          { en: "motorbike", cn: "摩托车" },
          { en: "lorry", cn: "卡车" },
          { en: "shop", cn: "商店" },
          { en: "there", cn: "那里" }
        ],
        sentences: [
          { en: "There's a big lorry.", cn: "有一辆大卡车。" },
          { en: "There are old cars.", cn: "有一些旧汽车。" },
          { en: "There aren't any shops.", cn: "没有任何商店。" },
          { en: "Is there a park?", cn: "有一个公园吗？" },
          { en: "Are there any animals?", cn: "有什么动物吗？" }
        ]
      }
    ]
  },

  // ==================== Level 2 ====================
  {
    level: "2",
    desc: "剑桥 Power Up 二级：乡村与日常、天气与一周、工作派对、家庭居家、动物世界、城市出行、大改变",
    topics: [
      {
        topic: "A day on the farm 农场的一天",
        words: [
          { en: "countryside", cn: "乡村" },
          { en: "mountain", cn: "山" },
          { en: "lake", cn: "湖" },
          { en: "forest", cn: "森林" },
          { en: "river", cn: "河" },
          { en: "ground", cn: "地面" },
          { en: "grass", cn: "草" },
          { en: "leaf", cn: "叶子" },
          { en: "leaves", cn: "叶子（复数）" },
          { en: "field", cn: "田地" },
          { en: "rock", cn: "岩石" },
          { en: "tractor", cn: "拖拉机" }
        ],
        sentences: [
          { en: "There's a tree in the field.", cn: "田地里有一棵树。" },
          { en: "There are lots of rocks.", cn: "有很多岩石。" },
          { en: "Is there a lake?", cn: "有一个湖吗？" },
          { en: "Yes, there is. / No, there isn't.", cn: "是的，有。/ 不，没有。" }
        ]
      },
      {
        topic: "Daily routines 日常作息",
        words: [
          { en: "wake up", cn: "醒来" },
          { en: "get up", cn: "起床" },
          { en: "shower", cn: "淋浴" },
          { en: "get dressed", cn: "穿好衣服" },
          { en: "breakfast", cn: "早餐" },
          { en: "lunch", cn: "午餐" },
          { en: "dinner", cn: "晚餐" },
          { en: "milk", cn: "牛奶" },
          { en: "toothbrush", cn: "牙刷" },
          { en: "toothpaste", cn: "牙膏" },
          { en: "clean", cn: "清洁" },
          { en: "teeth", cn: "牙齿" }
        ],
        sentences: [
          { en: "What time do you get up?", cn: "你几点起床？" },
          { en: "I get up at seven.", cn: "我七点起床。" },
          { en: "What time does school start?", cn: "学校几点开始上课？" },
          { en: "I clean my teeth in the morning.", cn: "我早上刷牙。" }
        ]
      },
      {
        topic: "My week 我的一周",
        words: [
          { en: "Monday", cn: "星期一" },
          { en: "Tuesday", cn: "星期二" },
          { en: "Wednesday", cn: "星期三" },
          { en: "Thursday", cn: "星期四" },
          { en: "Friday", cn: "星期五" },
          { en: "Saturday", cn: "星期六" },
          { en: "Sunday", cn: "星期天" },
          { en: "week", cn: "星期；一周" },
          { en: "activities", cn: "活动" },
          { en: "skating", cn: "滑冰" },
          { en: "shopping", cn: "购物" },
          { en: "comics", cn: "漫画" }
        ],
        sentences: [
          { en: "How often do you go skating?", cn: "你多久去滑一次冰？" },
          { en: "I sometimes go shopping.", cn: "我有时去购物。" },
          { en: "Do you ever read comics?", cn: "你读过漫画吗？" },
          { en: "How often do you listen to music?", cn: "你多久听一次音乐？" }
        ]
      },
      {
        topic: "Party time! 派对时间！",
        words: [
          { en: "party", cn: "派对" },
          { en: "costume", cn: "服装" },
          { en: "present", cn: "礼物" },
          { en: "treasure", cn: "宝藏" },
          { en: "clown", cn: "小丑" },
          { en: "pirate", cn: "海盗" },
          { en: "cook", cn: "厨师" },
          { en: "nurse", cn: "护士" },
          { en: "dentist", cn: "牙医" },
          { en: "doctor", cn: "医生" },
          { en: "farmer", cn: "农民" },
          { en: "film star", cn: "影星" },
          { en: "pop star", cn: "流行明星" }
        ],
        sentences: [
          { en: "What are you wearing?", cn: "你穿着什么？" },
          { en: "I'm wearing a clown's costume.", cn: "我穿着小丑的服装。" },
          { en: "What do you want to be?", cn: "你想成为什么？" },
          { en: "I want to be a doctor.", cn: "我想成为一名医生。" }
        ]
      },
      {
        topic: "The family at home 在家的一家人",
        words: [
          { en: "home", cn: "家" },
          { en: "parents", cn: "父母" },
          { en: "son", cn: "儿子" },
          { en: "daughter", cn: "女儿" },
          { en: "grandparents", cn: "祖父母" },
          { en: "aunt", cn: "阿姨；姑妈；姨妈" },
          { en: "uncle", cn: "叔叔；舅舅" },
          { en: "cousin", cn: "堂（表）兄弟姐妹" },
          { en: "granddaughter", cn: "孙女；外孙女" },
          { en: "grandson", cn: "孙子；外孙" },
          { en: "baby", cn: "婴儿" },
          { en: "together", cn: "一起" }
        ],
        sentences: [
          { en: "This is my uncle.", cn: "这是我的叔叔。" },
          { en: "I've got a baby cousin.", cn: "我有一个小表弟。" },
          { en: "We live together in our home.", cn: "我们一起住在家里。" },
          { en: "My grandparents live near us.", cn: "我的祖父母住在我们附近。" }
        ]
      },
      {
        topic: "Animal world 动物世界",
        words: [
          { en: "animal", cn: "动物" },
          { en: "wild", cn: "野生的" },
          { en: "domestic", cn: "家养的" },
          { en: "bear", cn: "熊" },
          { en: "bat", cn: "蝙蝠" },
          { en: "parrot", cn: "鹦鹉" },
          { en: "kangaroo", cn: "袋鼠" },
          { en: "rabbit", cn: "兔子" },
          { en: "panda", cn: "熊猫" },
          { en: "lion", cn: "狮子" },
          { en: "whale", cn: "鲸" },
          { en: "penguin", cn: "企鹅" },
          { en: "dolphin", cn: "海豚" },
          { en: "cage", cn: "笼子" }
        ],
        sentences: [
          { en: "It's climbing like a bear.", cn: "它像熊一样攀爬。" },
          { en: "It's running like a lion.", cn: "它像狮子一样奔跑。" },
          { en: "It's jumping like a kangaroo.", cn: "它像袋鼠一样跳跃。" },
          { en: "Can you move like an animal?", cn: "你能像动物一样活动吗？" }
        ]
      },
      {
        topic: "Our weather 我们的天气",
        words: [
          { en: "weather", cn: "天气" },
          { en: "cloud", cn: "云" },
          { en: "clouds", cn: "云（复数）" },
          { en: "wind", cn: "风" },
          { en: "windy", cn: "有风的" },
          { en: "rain", cn: "雨" },
          { en: "rainy", cn: "下雨的" },
          { en: "rainbow", cn: "彩虹" },
          { en: "snow", cn: "雪" },
          { en: "sunny", cn: "晴朗的" },
          { en: "hot", cn: "热的" },
          { en: "cold", cn: "寒冷的" }
        ],
        sentences: [
          { en: "What's the weather like?", cn: "天气怎么样？" },
          { en: "It's sunny today.", cn: "今天天气晴朗。" },
          { en: "It's raining and windy.", cn: "正在下雨而且刮风。" },
          { en: "Look at the rainbow!", cn: "看那彩虹！" }
        ]
      },
      {
        topic: "A cooking class 烹饪课",
        words: [
          { en: "cooking", cn: "烹饪" },
          { en: "cup", cn: "杯子" },
          { en: "plate", cn: "盘子" },
          { en: "bowl", cn: "碗" },
          { en: "glass", cn: "玻璃杯" },
          { en: "bottle", cn: "瓶子" },
          { en: "soup", cn: "汤" },
          { en: "pasta", cn: "意大利面" },
          { en: "salad", cn: "沙拉" },
          { en: "sandwich", cn: "三明治" },
          { en: "cheese", cn: "奶酪" },
          { en: "vegetables", cn: "蔬菜" }
        ],
        sentences: [
          { en: "Can I have some soup, please?", cn: "我能喝一些汤吗？" },
          { en: "Here you are.", cn: "给你。" },
          { en: "Would you like some pasta?", cn: "你想来点意大利面吗？" },
          { en: "Yes, please. / No, thank you.", cn: "好的，请。/ 不了，谢谢。" }
        ]
      },
      {
        topic: "Around town 小镇周边",
        words: [
          { en: "town", cn: "城镇" },
          { en: "city centre", cn: "市中心" },
          { en: "village", cn: "村庄" },
          { en: "map", cn: "地图" },
          { en: "road", cn: "路" },
          { en: "station", cn: "车站" },
          { en: "car park", cn: "停车场" },
          { en: "ticket", cn: "票" },
          { en: "funfair", cn: "游乐场" },
          { en: "ride", cn: "游玩项目；乘坐" },
          { en: "shopping centre", cn: "购物中心" },
          { en: "safe", cn: "安全的" }
        ],
        sentences: [
          { en: "How do I get to the station?", cn: "我怎么去车站？" },
          { en: "Where's the shopping centre?", cn: "购物中心在哪里？" },
          { en: "It's near the car park.", cn: "它在停车场附近。" },
          { en: "Turn left at the shop.", cn: "在商店处向左转。" }
        ]
      },
      {
        topic: "A big change 大改变",
        words: [
          { en: "change", cn: "改变" },
          { en: "holiday", cn: "假期" },
          { en: "trip", cn: "旅行" },
          { en: "beach", cn: "海滩" },
          { en: "sea", cn: "大海" },
          { en: "circus", cn: "马戏团" },
          { en: "surprised", cn: "惊讶的" },
          { en: "excited", cn: "兴奋的" },
          { en: "frightened", cn: "害怕的" },
          { en: "hungry", cn: "饿的" },
          { en: "thirsty", cn: "渴的" },
          { en: "tired", cn: "累的" },
          { en: "dangerous", cn: "危险的" },
          { en: "difficult", cn: "困难的" },
          { en: "easy", cn: "容易的" },
          { en: "boring", cn: "无聊的" }
        ],
        sentences: [
          { en: "How do you feel?", cn: "你感觉怎么样？" },
          { en: "I'm happy.", cn: "我很快乐。" },
          { en: "I'm hot. / I'm cold.", cn: "我很热。/ 我很冷。" },
          { en: "The circus is exciting!", cn: "马戏团真令人兴奋！" }
        ]
      }
    ]
  },
  // ==================== Level 3 ====================
  {
    level: "3",
    desc: "剑桥 Power Up 三级：时间计划、食物、身体与比较、手工、服装材料、学校科目、职业、方位、超级英雄、假期",
    topics: [
      {
        topic: "Practice time 练习时间",
        words: [
          { en: "half past", cn: "…点半" },
          { en: "o'clock", cn: "…点钟" },
          { en: "breakfast", cn: "早餐" },
          { en: "snack", cn: "点心；小吃" },
          { en: "lunch", cn: "午餐" },
          { en: "dinner", cn: "晚餐" },
          { en: "wake up", cn: "醒来" },
          { en: "go to bed", cn: "上床睡觉" },
          { en: "schedule", cn: "时间表" },
          { en: "practice", cn: "练习" },
          { en: "ballet", cn: "芭蕾舞" },
          { en: "violin", cn: "小提琴" }
        ],
        sentences: [
          { en: "What time is it?", cn: "现在几点了？" },
          { en: "It's half past nine.", cn: "现在是九点半。" },
          { en: "What time do you have breakfast?", cn: "你几点吃早餐？" },
          { en: "I have breakfast at half past seven.", cn: "我七点半吃早餐。" },
          { en: "I practise my hobby every day.", cn: "我每天练习我的爱好。" }
        ]
      },
      {
        topic: "Food for the tour 巡演食物",
        words: [
          { en: "supermarket", cn: "超市" },
          { en: "shop", cn: "商店" },
          { en: "noodles", cn: "面条" },
          { en: "rice", cn: "米饭" },
          { en: "coffee", cn: "咖啡" },
          { en: "milk", cn: "牛奶" },
          { en: "fruit", cn: "水果" },
          { en: "vegetables", cn: "蔬菜" },
          { en: "bread", cn: "面包" },
          { en: "tea", cn: "茶" },
          { en: "soup", cn: "汤" },
          { en: "drink", cn: "饮料" }
        ],
        sentences: [
          { en: "What do you like for breakfast?", cn: "你早餐喜欢吃什么？" },
          { en: "I like noodles and tea.", cn: "我喜欢面条和茶。" },
          { en: "Can I have some milk, please?", cn: "我能喝些牛奶吗？" },
          { en: "How much are the apples?", cn: "这些苹果多少钱？" }
        ]
      },
      {
        topic: "On the beach 在海滩",
        words: [
          { en: "beach", cn: "海滩" },
          { en: "exercise", cn: "锻炼" },
          { en: "shoulder", cn: "肩膀" },
          { en: "neck", cn: "脖子" },
          { en: "finger", cn: "手指" },
          { en: "stomach", cn: "腹部；胃" },
          { en: "knee", cn: "膝盖" },
          { en: "elbow", cn: "肘部" },
          { en: "toe", cn: "脚趾" },
          { en: "wrist", cn: "手腕" },
          { en: "ankle", cn: "脚踝" },
          { en: "strong", cn: "强壮的" }
        ],
        sentences: [
          { en: "He cut his finger.", cn: "他划伤了手指。" },
          { en: "Ivan is the strongest man.", cn: "伊凡是世界上最壮的人。" },
          { en: "He's stronger than the acrobats.", cn: "他比杂技演员更强壮。" },
          { en: "Which part of the body is it?", cn: "它是身体的哪个部位？" }
        ]
      },
      {
        topic: "Making things 制作东西",
        words: [
          { en: "make", cn: "制作" },
          { en: "plant", cn: "植物" },
          { en: "flower", cn: "花" },
          { en: "paper", cn: "纸" },
          { en: "wood", cn: "木头" },
          { en: "metal", cn: "金属" },
          { en: "glass", cn: "玻璃" },
          { en: "plastic", cn: "塑料" },
          { en: "scissors", cn: "剪刀" },
          { en: "glue", cn: "胶水" },
          { en: "string", cn: "绳子" },
          { en: "box", cn: "盒子" }
        ],
        sentences: [
          { en: "It is made of paper.", cn: "它是由纸做的。" },
          { en: "What did you make last week?", cn: "你上周做了什么？" },
          { en: "We made a poster.", cn: "我们做了一张海报。" },
          { en: "Be careful! They aren't strong.", cn: "小心！它们不结实。" }
        ]
      },
      {
        topic: "Describing clothes 描述服装",
        words: [
          { en: "clothes", cn: "衣服" },
          { en: "gold", cn: "金色的" },
          { en: "silver", cn: "银色的" },
          { en: "bright", cn: "明亮的" },
          { en: "dark", cn: "深色的；暗的" },
          { en: "light", cn: "浅色的" },
          { en: "striped", cn: "条纹的" },
          { en: "spotted", cn: "带斑点的" },
          { en: "checked", cn: "格纹的" },
          { en: "plain", cn: "素色的" },
          { en: "helmet", cn: "头盔" },
          { en: "rubber", cn: "橡胶" }
        ],
        sentences: [
          { en: "He's wearing orange trousers.", cn: "他穿着橙色的裤子。" },
          { en: "The helmet is made of gold.", cn: "这顶头盔是金子做的。" },
          { en: "Are these the wings for the show?", cn: "这些是演出用的翅膀吗？" },
          { en: "They aren't very strong.", cn: "它们不太结实。" }
        ]
      },
      {
        topic: "School subjects 学校科目",
        words: [
          { en: "school", cn: "学校" },
          { en: "subject", cn: "科目" },
          { en: "geography", cn: "地理" },
          { en: "history", cn: "历史" },
          { en: "science", cn: "科学" },
          { en: "music", cn: "音乐" },
          { en: "language", cn: "语言" },
          { en: "art", cn: "美术" },
          { en: "maths", cn: "数学" },
          { en: "homework", cn: "作业" },
          { en: "lesson", cn: "课" },
          { en: "classroom", cn: "教室" }
        ],
        sentences: [
          { en: "What's your favourite subject?", cn: "你最喜欢的科目是什么？" },
          { en: "My favourite subject is science.", cn: "我最喜欢的科目是科学。" },
          { en: "We have music on Fridays.", cn: "我们星期五有音乐课。" },
          { en: "When do lessons start?", cn: "什么时候开始上课？" }
        ]
      },
      {
        topic: "Jobs 职业",
        words: [
          { en: "job", cn: "工作；职业" },
          { en: "doctor", cn: "医生" },
          { en: "nurse", cn: "护士" },
          { en: "teacher", cn: "老师" },
          { en: "cook", cn: "厨师" },
          { en: "actor", cn: "演员" },
          { en: "photographer", cn: "摄影师" },
          { en: "journalist", cn: "记者" },
          { en: "singer", cn: "歌手" },
          { en: "pilot", cn: "飞行员" },
          { en: "volunteer", cn: "志愿者" },
          { en: "police officer", cn: "警察" }
        ],
        sentences: [
          { en: "What do you want to be?", cn: "你想成为什么？" },
          { en: "I want to be a journalist.", cn: "我想当一名记者。" },
          { en: "She's a nurse. She helps people.", cn: "她是护士，帮助人们。" },
          { en: "What does he do?", cn: "他是做什么的？" }
        ]
      },
      {
        topic: "Directions 认方向",
        words: [
          { en: "north", cn: "北方" },
          { en: "south", cn: "南方" },
          { en: "east", cn: "东方" },
          { en: "west", cn: "西方" },
          { en: "left", cn: "左边" },
          { en: "right", cn: "右边" },
          { en: "map", cn: "地图" },
          { en: "road", cn: "公路；路" },
          { en: "route", cn: "路线" },
          { en: "park", cn: "公园；停车场" },
          { en: "directions", cn: "方位；方向" },
          { en: "lost", cn: "迷路的" }
        ],
        sentences: [
          { en: "Turn left at the road.", cn: "在路口向左转。" },
          { en: "Turn right at the park.", cn: "在公园处向右转。" },
          { en: "They are in the north.", cn: "他们在北方。" },
          { en: "The lorry park is next to the road.", cn: "停车场紧挨着公路。" }
        ]
      },
      {
        topic: "Our superhero 我们的超级英雄",
        words: [
          { en: "superhero", cn: "超级英雄" },
          { en: "comic", cn: "漫画" },
          { en: "hero", cn: "英雄" },
          { en: "strong", cn: "强壮的" },
          { en: "fast", cn: "快的" },
          { en: "clever", cn: "聪明的" },
          { en: "brave", cn: "勇敢的" },
          { en: "lucky", cn: "幸运的" },
          { en: "horrible", cn: "可怕的" },
          { en: "huge", cn: "巨大的" },
          { en: "excellent", cn: "极好的" },
          { en: "alone", cn: "独自的" }
        ],
        sentences: [
          { en: "He's got a huge mouth.", cn: "他有一张大嘴巴。" },
          { en: "He is strong and clever.", cn: "他又强壮又聪明。" },
          { en: "He's got special shoes.", cn: "他有一双特别的鞋。" },
          { en: "It's got a horrible little dog.", cn: "它有一只可怕的小狗。" }
        ]
      },
      {
        topic: "A big holiday 一个大假期",
        words: [
          { en: "holiday", cn: "假期" },
          { en: "suitcase", cn: "手提箱" },
          { en: "rucksack", cn: "背包" },
          { en: "tent", cn: "帐篷" },
          { en: "beach", cn: "海滩" },
          { en: "sea", cn: "大海" },
          { en: "sandcastle", cn: "沙堡" },
          { en: "postcard", cn: "明信片" },
          { en: "stamp", cn: "邮票" },
          { en: "trainers", cn: "运动鞋" },
          { en: "pyjamas", cn: "睡衣" },
          { en: "umbrella", cn: "雨伞" }
        ],
        sentences: [
          { en: "We're going to go on holiday.", cn: "我们要去度假。" },
          { en: "We're going to go to the beach.", cn: "我们要去海滩。" },
          { en: "I need to pack my suitcase.", cn: "我需要收拾我的手提箱。" },
          { en: "What are you going to take?", cn: "你打算带什么？" }
        ]
      }
    ]
  }
];