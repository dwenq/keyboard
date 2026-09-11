/**
 * chineseTexts.js
 * 沪教版《语文》相关的公版古诗/名句课文库，用于「课文打字」练习。
 *
 * 版权说明：仅收录进入公有领域的古典诗文（古诗、传统名篇），供学习打字使用。
 * 每条数据包含：
 *   grade  年级
 *   title  篇名
 *   author 作者
 *   poem   正文行数组；每行 { zh: 汉字行, py: 对应拼音（空格分隔） }
 *
 * 说明：标点符号（，。？：）在 py 中对应原文符号本身；多音字按常见读音标注。
 */

window.CHINESE_TEXTS = [
  {
    grade: "一年级",
    title: "咏鹅",
    author: "骆宾王",
    poem: [
      { zh: "鹅，鹅，鹅，", py: "é, é, é," },
      { zh: "曲项向天歌。", py: "qū xiàng xiàng tiān gē." },
      { zh: "白毛浮绿水，", py: "bái máo fú lǜ shuǐ," },
      { zh: "红掌拨清波。", py: "hóng zhǎng bō qīng bō." }
    ]
  },
  {
    grade: "一年级",
    title: "静夜思",
    author: "李白",
    poem: [
      { zh: "床前明月光，", py: "chuáng qián míng yuè guāng," },
      { zh: "疑是地上霜。", py: "yí shì dì shàng shuāng." },
      { zh: "举头望明月，", py: "jǔ tóu wàng míng yuè," },
      { zh: "低头思故乡。", py: "dī tóu sī gù xiāng." }
    ]
  },
  {
    grade: "一年级",
    title: "春晓",
    author: "孟浩然",
    poem: [
      { zh: "春眠不觉晓，", py: "chūn mián bù jué xiǎo," },
      { zh: "处处闻啼鸟。", py: "chù chù wén tí niǎo." },
      { zh: "夜来风雨声，", py: "yè lái fēng yǔ shēng," },
      { zh: "花落知多少。", py: "huā luò zhī duō shǎo." }
    ]
  },
  {
    grade: "一年级",
    title: "登鹳雀楼",
    author: "王之涣",
    poem: [
      { zh: "白日依山尽，", py: "bái rì yī shān jìn," },
      { zh: "黄河入海流。", py: "huáng hé rù hǎi liú." },
      { zh: "欲穷千里目，", py: "yù qióng qiān lǐ mù," },
      { zh: "更上一层楼。", py: "gèng shàng yī céng lóu." }
    ]
  },
  {
    grade: "一年级",
    title: "悯农（其二）",
    author: "李绅",
    poem: [
      { zh: "锄禾日当午，", py: "chú hé rì dāng wǔ," },
      { zh: "汗滴禾下土。", py: "hàn dī hé xià tǔ." },
      { zh: "谁知盘中餐，", py: "shuí zhī pán zhōng cān," },
      { zh: "粒粒皆辛苦。", py: "lì lì jiē xīn kǔ." }
    ]
  },

  {
    grade: "二年级",
    title: "咏柳",
    author: "贺知章",
    poem: [
      { zh: "碧玉妆成一树高，", py: "bì yù zhuāng chéng yī shù gāo," },
      { zh: "万条垂下绿丝绦。", py: "wàn tiáo chuí xià lǜ sī tāo." },
      { zh: "不知细叶谁裁出，", py: "bù zhī xì yè shuí cái chū," },
      { zh: "二月春风似剪刀。", py: "èr yuè chūn fēng sì jiǎn dāo." }
    ]
  },
  {
    grade: "二年级",
    title: "回乡偶书",
    author: "贺知章",
    poem: [
      { zh: "少小离家老大回，", py: "shào xiǎo lí jiā lǎo dà huí," },
      { zh: "乡音无改鬓毛衰。", py: "xiāng yīn wú gǎi bìn máo cuī." },
      { zh: "儿童相见不相识，", py: "ér tóng xiāng jiàn bù xiāng shí," },
      { zh: "笑问客从何处来。", py: "xiào wèn kè cóng hé chù lái." }
    ]
  },
  {
    grade: "二年级",
    title: "望庐山瀑布",
    author: "李白",
    poem: [
      { zh: "日照香炉生紫烟，", py: "rì zhào xiāng lú shēng zǐ yān," },
      { zh: "遥看瀑布挂前川。", py: "yáo kàn pù bù guà qián chuān." },
      { zh: "飞流直下三千尺，", py: "fēi liú zhí xià sān qiān chǐ," },
      { zh: "疑是银河落九天。", py: "yí shì yín hé luò jiǔ tiān." }
    ]
  },
  {
    grade: "二年级",
    title: "赠汪伦",
    author: "李白",
    poem: [
      { zh: "李白乘舟将欲行，", py: "lǐ bái chéng zhōu jiāng yù xíng," },
      { zh: "忽闻岸上踏歌声。", py: "hū wén àn shàng tà gē shēng." },
      { zh: "桃花潭水深千尺，", py: "táo huā tán shuǐ shēn qiān chǐ," },
      { zh: "不及汪伦送我情。", py: "bù jí wāng lún sòng wǒ qíng." }
    ]
  },
  {
    grade: "二年级",
    title: "山行",
    author: "杜牧",
    poem: [
      { zh: "远上寒山石径斜，", py: "yuǎn shàng hán shān shí jìng xié," },
      { zh: "白云生处有人家。", py: "bái yún shēng chù yǒu rén jiā." },
      { zh: "停车坐爱枫林晚，", py: "tíng chē zuò ài fēng lín wǎn," },
      { zh: "霜叶红于二月花。", py: "shuāng yè hóng yú èr yuè huā." }
    ]
  },
  {
    grade: "二年级",
    title: "小池",
    author: "杨万里",
    poem: [
      { zh: "泉眼无声惜细流，", py: "quán yǎn wú shēng xī xì liú," },
      { zh: "树阴照水爱晴柔。", py: "shù yīn zhào shuǐ ài qíng róu." },
      { zh: "小荷才露尖尖角，", py: "xiǎo hé cái lù jiān jiān jiǎo," },
      { zh: "早有蜻蜓立上头。", py: "zǎo yǒu qīng tíng lì shàng tóu." }
    ]
  },
  {
    grade: "二年级",
    title: "红豆",
    author: "王维",
    poem: [
      { zh: "红豆生南国，", py: "hóng dòu shēng nán guó," },
      { zh: "春来发几枝。", py: "chūn lái fā jǐ zhī." },
      { zh: "愿君多采撷，", py: "yuàn jūn duō cǎi xié," },
      { zh: "此物最相思。", py: "cǐ wù zuì xiāng sī." }
    ]
  },

  {
    grade: "三年级",
    title: "绝句",
    author: "杜甫",
    poem: [
      { zh: "两个黄鹂鸣翠柳，", py: "liǎng gè huáng lí míng cuì liǔ," },
      { zh: "一行白鹭上青天。", py: "yī háng bái lù shàng qīng tiān." },
      { zh: "窗含西岭千秋雪，", py: "chuāng hán xī lǐng qiān qiū xuě," },
      { zh: "门泊东吴万里船。", py: "mén bó dōng wú wàn lǐ chuán." }
    ]
  },
  {
    grade: "三年级",
    title: "春夜喜雨",
    author: "杜甫",
    poem: [
      { zh: "好雨知时节，", py: "hǎo yǔ zhī shí jié," },
      { zh: "当春乃发生。", py: "dāng chūn nǎi fā shēng." },
      { zh: "随风潜入夜，", py: "suí fēng qián rù yè," },
      { zh: "润物细无声。", py: "rùn wù xì wú shēng." }
    ]
  },
  {
    grade: "三年级",
    title: "游子吟",
    author: "孟郊",
    poem: [
      { zh: "慈母手中线，", py: "cí mǔ shǒu zhōng xiàn," },
      { zh: "游子身上衣。", py: "yóu zǐ shēn shàng yī." },
      { zh: "临行密密缝，", py: "lín xíng mì mì féng," },
      { zh: "意恐迟迟归。", py: "yì kǒng chí chí guī." },
      { zh: "谁言寸草心，", py: "shuí yán cùn cǎo xīn," },
      { zh: "报得三春晖。", py: "bào dé sān chūn huī." }
    ]
  },
  {
    grade: "三年级",
    title: "望天门山",
    author: "李白",
    poem: [
      { zh: "天门中断楚江开，", py: "tiān mén zhōng duàn chǔ jiāng kāi," },
      { zh: "碧水东流至此回。", py: "bì shuǐ dōng liú zhì cǐ huí." },
      { zh: "两岸青山相对出，", py: "liǎng àn qīng shān xiāng duì chū," },
      { zh: "孤帆一片日边来。", py: "gū fān yī piàn rì biān lái." }
    ]
  },
  {
    grade: "三年级",
    title: "鹿柴",
    author: "王维",
    poem: [
      { zh: "空山不见人，", py: "kōng shān bù jiàn rén," },
      { zh: "但闻人语响。", py: "dàn wén rén yǔ xiǎng." },
      { zh: "返景入深林，", py: "fǎn jǐng rù shēn lín," },
      { zh: "复照青苔上。", py: "fù zhào qīng tái shàng." }
    ]
  },
  {
    grade: "三年级",
    title: "黄鹤楼送孟浩然之广陵",
    author: "李白",
    poem: [
      { zh: "故人西辞黄鹤楼，", py: "gù rén xī cí huáng hè lóu," },
      { zh: "烟花三月下扬州。", py: "yān huā sān yuè xià yáng zhōu." },
      { zh: "孤帆远影碧空尽，", py: "gū fān yuǎn yǐng bì kōng jìn," },
      { zh: "唯见长江天际流。", py: "wéi jiàn cháng jiāng tiān jì liú." }
    ]
  },

  {
    grade: "四年级",
    title: "题西林壁",
    author: "苏轼",
    poem: [
      { zh: "横看成岭侧成峰，", py: "héng kàn chéng lǐng cè chéng fēng," },
      { zh: "远近高低各不同。", py: "yuǎn jìn gāo dī gè bù tóng." },
      { zh: "不识庐山真面目，", py: "bù shí lú shān zhēn miàn mù," },
      { zh: "只缘身在此山中。", py: "zhǐ yuán shēn zài cǐ shān zhōng." }
    ]
  },
  {
    grade: "四年级",
    title: "暮江吟",
    author: "白居易",
    poem: [
      { zh: "一道残阳铺水中，", py: "yī dào cán yáng pū shuǐ zhōng," },
      { zh: "半江瑟瑟半江红。", py: "bàn jiāng sè sè bàn jiāng hóng." },
      { zh: "可怜九月初三夜，", py: "kě lián jiǔ yuè chū sān yè," },
      { zh: "露似真珠月似弓。", py: "lù sì zhēn zhū yuè sì gōng." }
    ]
  },
  {
    grade: "四年级",
    title: "出塞",
    author: "王昌龄",
    poem: [
      { zh: "秦时明月汉时关，", py: "qín shí míng yuè hàn shí guān," },
      { zh: "万里长征人未还。", py: "wàn lǐ cháng zhēng rén wèi huán." },
      { zh: "但使龙城飞将在，", py: "dàn shǐ lóng chéng fēi jiàng zài," },
      { zh: "不教胡马度阴山。", py: "bù jiào hú mǎ dù yīn shān." }
    ]
  },
  {
    grade: "四年级",
    title: "相思",
    author: "王维",
    poem: [
      { zh: "红豆生南国，", py: "hóng dòu shēng nán guó," },
      { zh: "春来发几枝。", py: "chūn lái fā jǐ zhī." },
      { zh: "劝君多采撷，", py: "quàn jūn duō cǎi xié," },
      { zh: "此物最相思。", py: "cǐ wù zuì xiāng sī." }
    ]
  },
  {
    grade: "四年级",
    title: "池上",
    author: "白居易",
    poem: [
      { zh: "小娃撑小艇，", py: "xiǎo wá chēng xiǎo tǐng," },
      { zh: "偷采白莲回。", py: "tōu cǎi bái lián huí." },
      { zh: "不解藏踪迹，", py: "bù jiě cáng zōng jì," },
      { zh: "浮萍一道开。", py: "fú píng yī dào kāi." }
    ]
  },

  {
    grade: "五年级",
    title: "九月九日忆山东兄弟",
    author: "王维",
    poem: [
      { zh: "独在异乡为异客，", py: "dú zài yì xiāng wéi yì kè," },
      { zh: "每逢佳节倍思亲。", py: "měi féng jiā jié bèi sī qīn." },
      { zh: "遥知兄弟登高处，", py: "yáo zhī xiōng dì dēng gāo chù," },
      { zh: "遍插茱萸少一人。", py: "biàn chā zhū yú shǎo yī rén." }
    ]
  },
  {
    grade: "五年级",
    title: "夏日绝句",
    author: "李清照",
    poem: [
      { zh: "生当作人杰，", py: "shēng dāng zuò rén jié," },
      { zh: "死亦为鬼雄。", py: "sǐ yì wéi guǐ xióng." },
      { zh: "至今思项羽，", py: "zhì jīn sī xiàng yǔ," },
      { zh: "不肯过江东。", py: "bù kěn guò jiāng dōng." }
    ]
  },
  {
    grade: "五年级",
    title: "七律·长征",
    author: "毛泽东",
    poem: [
      { zh: "红军不怕远征难，", py: "hóng jūn bù pà yuǎn zhēng nán," },
      { zh: "万水千山只等闲。", py: "wàn shuǐ qiān shān zhǐ děng xián." },
      { zh: "五岭逶迤腾细浪，", py: "wǔ lǐng wēi yí téng xì làng," },
      { zh: "乌蒙磅礴走泥丸。", py: "wū méng páng bó zǒu ní wán." }
    ]
  },
  {
    grade: "五年级",
    title: "江南春",
    author: "杜牧",
    poem: [
      { zh: "千里莺啼绿映红，", py: "qiān lǐ yīng tí lǜ yìng hóng," },
      { zh: "水村山郭酒旗风。", py: "shuǐ cūn shān guō jiǔ qí fēng." },
      { zh: "南朝四百八十寺，", py: "nán cháo sì bǎi bā shí sì," },
      { zh: "多少楼台烟雨中。", py: "duō shǎo lóu tái yān yǔ zhōng." }
    ]
  },
  {
    grade: "五年级",
    title: "游园不值",
    author: "叶绍翁",
    poem: [
      { zh: "应怜屐齿印苍苔，", py: "yīng lián jī chǐ yìn cāng tái," },
      { zh: "小扣柴扉久不开。", py: "xiǎo kòu chái fēi jiǔ bù kāi." },
      { zh: "春色满园关不住，", py: "chūn sè mǎn yuán guān bù zhù," },
      { zh: "一枝红杏出墙来。", py: "yī zhī hóng xìng chū qiáng lái." }
    ]
  },

  {
    grade: "六年级",
    title: "宿建德江",
    author: "孟浩然",
    poem: [
      { zh: "移舟泊烟渚，", py: "yí zhōu bó yān zhǔ," },
      { zh: "日暮客愁新。", py: "rì mù kè chóu xīn." },
      { zh: "野旷天低树，", py: "yě kuàng tiān dī shù," },
      { zh: "江清月近人。", py: "jiāng qīng yuè jìn rén." }
    ]
  },
  {
    grade: "六年级",
    title: "六月二十七日望湖楼醉书",
    author: "苏轼",
    poem: [
      { zh: "黑云翻墨未遮山，", py: "hēi yún fān mò wèi zhē shān," },
      { zh: "白雨跳珠乱入船。", py: "bái yǔ tiào zhū luàn rù chuán." },
      { zh: "卷地风来忽吹散，", py: "juǎn dì fēng lái hū chuī sàn," },
      { zh: "望湖楼下水如天。", py: "wàng hú lóu xià shuǐ rú tiān." }
    ]
  },
  {
    grade: "六年级",
    title: "西江月·夜行黄沙道中",
    author: "辛弃疾",
    poem: [
      { zh: "明月别枝惊鹊，", py: "míng yuè bié zhī jīng què," },
      { zh: "清风半夜鸣蝉。", py: "qīng fēng bàn yè míng chán." },
      { zh: "稻花香里说丰年，", py: "dào huā xiāng lǐ shuō fēng nián," },
      { zh: "听取蛙声一片。", py: "tīng qǔ wā shēng yī piàn." }
    ]
  },
  {
    grade: "六年级",
    title: "浪淘沙（其一）",
    author: "刘禹锡",
    poem: [
      { zh: "九曲黄河万里沙，", py: "jiǔ qū huáng hé wàn lǐ shā," },
      { zh: "浪淘风簸自天涯。", py: "làng táo fēng bǒ zì tiān yá." },
      { zh: "如今直上银河去，", py: "rú jīn zhí shàng yín hé qù," },
      { zh: "同到牵牛织女家。", py: "tóng dào qiān niú zhī nǚ jiā." }
    ]
  }
];