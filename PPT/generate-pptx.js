const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = '摩托车刹车手把互动装置';
pres.author = 'RCB Project';

// 配色方案：深蓝科技风
const C = {
  navy:   "1A2744",   // 深蓝底
  blue:   "2B5FE3",   // 主蓝色
  blue2:  "4E7CF5",   // 亮蓝
  white:  "FFFFFF",
  offwhite:"F0F4FF",
  grey:   "8B9DC3",
  grey2:  "C5D0E8",
  accent: "FFD700",   // 金黄点缀
  red:    "FF4757",   // 警示红
  green:  "2ED573",   // 绿灯
};

// ===== 第1页 封面 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: C.navy };

  // 顶部装饰线
  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });

  // 左上角标记
  sl.addText("BRAKE HANDLE INTERACTIVE SYSTEM", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("01 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  // 主标题
  sl.addText("摩托车刹车手把", { x:0.6, y:1.6, w:8.8, h:1.2, fontSize:52, color:C.white, fontFace:"Arial", bold:true, charSpacing:-1 });
  sl.addText("互动装置", { x:0.6, y:2.65, w:8.8, h:1.0, fontSize:52, color:C.blue, fontFace:"Arial", bold:true, charSpacing:-1 });

  // 副标题装饰线
  sl.addShape(pres.shapes.RECTANGLE, { x:0.6, y:3.72, w:1.8, h:0.05, fill:{color:C.accent} });
  sl.addText("刹车测试挑战", { x:0.6, y:3.9, w:6, h:0.5, fontSize:22, color:C.grey2, fontFace:"Arial" });

  // 底部说明
  sl.addText("让客户亲手感受你的产品", { x:0.6, y:4.7, w:6, h:0.4, fontSize:14, color:C.grey, fontFace:"Arial" });

  // 右侧装饰方块
  sl.addShape(pres.shapes.RECTANGLE, { x:8.5, y:1.5, w:1.2, h:1.2, fill:{color:C.blue, transparency:20} });
  sl.addShape(pres.shapes.RECTANGLE, { x:8.8, y:1.8, w:0.8, h:0.8, fill:{color:C.blue} });

  // 底部信息栏
  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"141E3A"} });
  sl.addText("2026 · 展览方案", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:C.grey, fontFace:"Arial" });
  sl.addText("→  键盘方向键翻页 · B 键静态模式 · ESC 索引", { x:5, y:5.22, w:4.5, h:0.38, fontSize:10, color:C.grey, fontFace:"Arial", align:"right" });
})();

// ===== 第2页 背景与痛点 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: C.navy };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("BACKGROUND & PAIN POINTS", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("02 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  // 大字标题
  sl.addText("展会同质化", { x:0.5, y:1.1, w:9, h:0.9, fontSize:60, color:C.white, fontFace:"Arial", bold:true, charSpacing:-2 });
  sl.addText("严重", { x:0.5, y:1.9, w:9, h:0.8, fontSize:60, color:C.blue, fontFace:"Arial", bold:true, charSpacing:-2 });

  // 三栏痛点
  const painY = 3.0;
  const cards = [
    { num:"01", title:"走马观花", desc:"客户走一圈\n什么都不记得" },
    { num:"02", title:"静态展示", desc:"产品无法产生\n记忆点" },
    { num:"03", title:"缺乏互动", desc:"没有让客户\n亲身参与的体验" },
  ];
  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.1;
    sl.addShape(pres.shapes.RECTANGLE, { x, y:painY, w:2.8, h:1.9, fill:{color:"1F2D52"}, line:{color:"2B5FE3", width:1} });
    sl.addText(c.num, { x:x+0.2, y:painY+0.2, w:0.6, h:0.4, fontSize:18, color:C.blue, fontFace:"Arial", bold:true });
    sl.addText(c.title, { x:x+0.2, y:painY+0.65, w:2.4, h:0.4, fontSize:16, color:C.white, fontFace:"Arial", bold:true });
    sl.addText(c.desc, { x:x+0.2, y:painY+1.1, w:2.4, h:0.7, fontSize:12, color:C.grey2, fontFace:"Arial" });
  });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"141E3A"} });
  sl.addText("背景与痛点", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:C.grey, fontFace:"Arial" });
})();

// ===== 第3页 解决方案 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: "F0F4FF" };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("SOLUTION", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("03 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("解决方案", { x:0.5, y:0.9, w:6, h:0.8, fontSize:44, color:C.navy, fontFace:"Arial", bold:true });

  // 三个要点
  const points = [
    { icon:"01", title:"产品即控制器", desc:"用客户的刹车手把产品作为游戏控制器" },
    { icon:"02", title:"霍尔线性检测", desc:"两个手把，线性霍尔传感器检测拉力" },
    { icon:"03", title:"真实手感体验", desc:"握住真实手把参与刹车测试游戏" },
  ];
  points.forEach((p, i) => {
    const y = 1.85 + i * 1.0;
    sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.06, h:0.75, fill:{color:C.blue} });
    sl.addShape(pres.shapes.RECTANGLE, { x:0.7, y, w:5.8, h:0.75, fill:{color:"E8EEFA"} });
    sl.addText(p.icon, { x:0.85, y:y+0.08, w:0.5, h:0.35, fontSize:14, color:C.blue, fontFace:"Arial", bold:true });
    sl.addText(p.title, { x:1.4, y:y+0.05, w:2, h:0.35, fontSize:15, color:C.navy, fontFace:"Arial", bold:true });
    sl.addText(p.desc, { x:1.4, y:y+0.38, w:4.8, h:0.35, fontSize:12, color:C.grey, fontFace:"Arial" });
  });

  // 右侧示意图
  sl.addShape(pres.shapes.RECTANGLE, { x:6.8, y:1.7, w:2.9, h:3.5, fill:{color:C.navy} });
  sl.addText("系统连接示意", { x:6.95, y:1.85, w:2.6, h:0.35, fontSize:10, color:C.blue, fontFace:"Arial", bold:true });
  sl.addShape(pres.shapes.RECTANGLE, { x:7.0, y:2.3, w:2.5, h:0.35, fill:{color:"2B5FE3"} });
  sl.addText("刹车手把", { x:7.0, y:2.3, w:2.5, h:0.35, fontSize:11, color:C.white, fontFace:"Arial", align:"center", valign:"middle" });
  sl.addShape(pres.shapes.RECTANGLE, { x:7.3, y:2.75, w:1.9, h:0.3, fill:{color:"1A2744"} });
  sl.addText("霍尔传感器", { x:7.3, y:2.75, w:1.9, h:0.3, fontSize:10, color:C.blue, fontFace:"Arial", align:"center", valign:"middle" });
  sl.addShape(pres.shapes.RECTANGLE, { x:7.6, y:3.15, w:1.3, h:0.3, fill:{color:"0F1A35"} });
  sl.addText("Arduino", { x:7.6, y:3.15, w:1.3, h:0.3, fontSize:10, color:"5B8DEF", fontFace:"Arial", align:"center", valign:"middle" });
  sl.addShape(pres.shapes.RECTANGLE, { x:8.0, y:3.55, w:0.5, h:0.3, fill:{color:"0F1A35"} });
  sl.addText("→", { x:8.0, y:3.55, w:0.5, h:0.3, fontSize:12, color:"5B8DEF", fontFace:"Arial", align:"center", valign:"middle" });
  sl.addShape(pres.shapes.RECTANGLE, { x:7.6, y:3.95, w:1.3, h:0.3, fill:{color:"0F1A35"} });
  sl.addText("大屏幕", { x:7.6, y:3.95, w:1.3, h:0.3, fontSize:10, color:"5B8DEF", fontFace:"Arial", align:"center", valign:"middle" });
  sl.addText("USB HID 模拟游戏手柄", { x:6.95, y:4.4, w:2.6, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial" });
  sl.addText("线性映射 · 即插即用", { x:6.95, y:4.65, w:2.6, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial" });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"DDE5F5"} });
  sl.addText("解决方案", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:"6B7FA8", fontFace:"Arial" });
})();

// ===== 第4页 硬件方案 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: C.navy };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("HARDWARE SOLUTION", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("04 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("硬件方案", { x:0.5, y:0.85, w:4, h:0.7, fontSize:40, color:C.white, fontFace:"Arial", bold:true });
  sl.addShape(pres.shapes.RECTANGLE, { x:3.9, y:0.95, w:0.05, h:0.5, fill:{color:C.blue} });
  sl.addText("霍尔传感器", { x:4.1, y:0.92, w:4, h:0.6, fontSize:32, color:C.blue, fontFace:"Arial", bold:true });

  // 四组件卡片
  const hw = [
    { num:"01", name:"线性霍尔传感器", tags:"无磨损 · 精度高 · 寿命长", desc:"AH3505 / A1302\n非接触式检测\n磁场强度变化" },
    { num:"02", name:"钕磁铁", tags:"隐藏安装 · 无需改造手把", desc:"贴附于手把背面\n跟随把手旋转\n薄片型安装" },
    { num:"03", name:"Arduino Pro Micro", tags:"即插即用 · 无需驱动", desc:"USB HID 模拟游戏手柄\nADC 读取模拟电压\n线性映射到游戏输入" },
    { num:"04", name:"3D打印支架", tags:"支持品牌定制外壳", desc:"固定传感器位置\n精确安装角度\n可定制外壳" },
  ];
  hw.forEach((h, i) => {
    const x = 0.5 + i * 2.35;
    const isLast = i === 3;
    sl.addShape(pres.shapes.RECTANGLE, { x, y:1.7, w:2.2, h:2.4, fill:{color: isLast ? "1A3A8F" : "1F2D52"}, line: isLast ? {color:C.blue, width:2} : {color:"2B3A6A", width:1} });
    sl.addText(h.num, { x:x+0.15, y:1.82, w:0.5, h:0.4, fontSize:20, color: isLast ? C.accent : C.blue, fontFace:"Arial", bold:true });
    sl.addText(h.name, { x:x+0.15, y:2.2, w:1.9, h:0.5, fontSize:12, color:C.white, fontFace:"Arial", bold:true });
    sl.addText(h.tags, { x:x+0.15, y:2.68, w:1.9, h:0.3, fontSize:9, color: isLast ? C.accent : C.grey, fontFace:"Arial" });
    sl.addShape(pres.shapes.LINE, { x:x+0.15, y:3.02, w:1.9, h:0, line:{color:"2B3A6A", width:1} });
    sl.addText(h.desc, { x:x+0.15, y:3.1, w:1.9, h:0.9, fontSize:10, color:C.grey2, fontFace:"Arial" });
  });

  // 工作原理
  sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.25, w:9, h:0.06, fill:{color:"2B3A6A"} });
  sl.addText("工作原理", { x:0.5, y:4.4, w:1.5, h:0.35, fontSize:12, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("手把旋转 → 磁铁靠近/远离霍尔传感器 → 磁场强度变化 → 输出电压变化 → ADC 读取 → 映射为游戏输入值", { x:2.1, y:4.4, w:7.3, h:0.35, fontSize:11, color:C.grey2, fontFace:"Arial" });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"141E3A"} });
  sl.addText("硬件方案 — 霍尔传感器", { x:0.5, y:5.22, w:5, h:0.38, fontSize:10, color:C.grey, fontFace:"Arial" });
})();

// ===== 第5页 游戏玩法 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: "F0F4FF" };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("GAMEPLAY", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("05 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("刹车测试挑战", { x:0.5, y:0.9, w:6, h:0.7, fontSize:40, color:C.navy, fontFace:"Arial", bold:true });

  // 模式一
  sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.75, w:4.3, h:2.55, fill:{color:"E8EEFA"} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.75, w:4.3, h:0.55, fill:{color:C.blue} });
  sl.addText("模式 01   反应刹车", { x:0.65, y:1.8, w:4, h:0.45, fontSize:14, color:C.white, fontFace:"Arial", bold:true, valign:"middle" });
  sl.addText("红灯亮起 → 绿灯亮 → 拉手把刹车 → 测反应时间", { x:0.65, y:2.4, w:4, h:0.4, fontSize:11, color:C.navy, fontFace:"Arial" });
  sl.addText("测试指标", { x:0.65, y:2.85, w:1.2, h:0.3, fontSize:10, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("从绿灯亮起到手把开始拉动的时间", { x:0.65, y:3.1, w:4, h:0.35, fontSize:11, color:"5A6E9A", fontFace:"Arial" });
  sl.addText("适合场景", { x:0.65, y:3.5, w:1.2, h:0.3, fontSize:10, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("反应速度测试 / 新手体验", { x:0.65, y:3.75, w:4, h:0.35, fontSize:11, color:"5A6E9A", fontFace:"Arial" });

  // 模式二
  sl.addShape(pres.shapes.RECTANGLE, { x:5.0, y:1.75, w:4.5, h:2.55, fill:{color:"E8EEFA"} });
  sl.addShape(pres.shapes.RECTANGLE, { x:5.0, y:1.75, w:4.5, h:0.55, fill:{color:C.navy} });
  sl.addText("模式 02   刹车距离挑战", { x:5.15, y:1.8, w:4.2, h:0.45, fontSize:14, color:C.white, fontFace:"Arial", bold:true, valign:"middle" });
  sl.addText("摩托车动画冲刺 → 看到障碍 → 拉手把刹车 → 最短距离获胜", { x:5.15, y:2.4, w:4.2, h:0.4, fontSize:11, color:C.navy, fontFace:"Arial" });
  sl.addText("测试指标", { x:5.15, y:2.85, w:1.2, h:0.3, fontSize:10, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("从刹车到完全停下的距离（拉力越深刹车越急）", { x:5.15, y:3.1, w:4.2, h:0.35, fontSize:11, color:"5A6E9A", fontFace:"Arial" });
  sl.addText("适合场景", { x:5.15, y:3.5, w:1.2, h:0.3, fontSize:10, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("性能展示 / 拉力手感体验", { x:5.15, y:3.75, w:4.2, h:0.35, fontSize:11, color:"5A6E9A", fontFace:"Arial" });

  // 底部说明
  sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.45, w:9, h:0.65, fill:{color:C.navy} });
  sl.addText("线性控制优势", { x:0.7, y:4.52, w:1.8, h:0.25, fontSize:10, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("手把拉力深浅实时映射为刹车力度，拉得越深刹车越急，真正感受产品性能", { x:0.7, y:4.76, w:5.5, h:0.28, fontSize:11, color:C.grey2, fontFace:"Arial" });
  sl.addText("支持双人对战", { x:6.5, y:4.52, w:2.8, h:0.5, fontSize:20, color:C.accent, fontFace:"Arial", bold:true, align:"right" });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"DDE5F5"} });
  sl.addText("游戏玩法", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:"6B7FA8", fontFace:"Arial" });
})();

// ===== 第6页 游戏流程 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: C.navy };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("GAME FLOW", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("06 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("游戏流程", { x:0.5, y:0.85, w:5, h:0.7, fontSize:40, color:C.white, fontFace:"Arial", bold:true });

  // 六步横向流程
  const steps = [
    { num:"01", label:"选手入场", sub:"握住手把，调整姿势" },
    { num:"02", label:"屏幕准备", sub:"显示规则说明" },
    { num:"03", label:"随机倒计时", sub:"防抢跑，等待出发" },
    { num:"04", label:"绿灯亮起", sub:"障碍出现，出发指令", isKey:true },
    { num:"05", label:"拉手把刹车", sub:"线性控制，感受真实手感" },
    { num:"06", label:"成绩出炉", sub:"排行榜实时更新" },
  ];
  steps.forEach((s, i) => {
    const x = 0.4 + i * 1.58;
    const isKey = s.isKey;
    // 编号圆
    sl.addShape(pres.shapes.OVAL, { x:x+0.38, y:1.7, w:0.5, h:0.5, fill:{color: isKey ? C.green : C.blue} });
    sl.addText(s.num, { x:x+0.38, y:1.7, w:0.5, h:0.5, fontSize:10, color:C.white, fontFace:"Arial", bold:true, align:"center", valign:"middle" });
    // 连接线
    if(i < 5) sl.addShape(pres.shapes.LINE, { x:x+0.9, y:1.95, w:1.06, h:0, line:{color:"2B5FE3", width:1.5, dashType:"dash"}});
    // 步骤名称
    sl.addText(s.label, { x:x, y:2.3, w:1.28, h:0.45, fontSize:12, color: isKey ? C.green : C.white, fontFace:"Arial", bold:true, align:"center" });
    sl.addText(s.sub, { x:x, y:2.72, w:1.28, h:0.5, fontSize:9, color:C.grey, fontFace:"Arial", align:"center" });
  });

  // 底部KPI
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:3.45, w:9.2, h:0.05, fill:{color:"2B3A6A"} });
  const kpis = [
    { num:"2", unit:"个手把", sub:"线性拉力输入" },
    { num:"实时", unit:"计时排行", sub:"毫秒级精度" },
    { num:"线性", unit:"拉力控制", sub:"深度=力度" },
    { num:"QR", unit:"成绩分享", sub:"扫码传播" },
  ];
  kpis.forEach((k, i) => {
    const x = 0.4 + i * 2.3;
    sl.addText(k.num, { x, y:3.65, w:1.8, h:0.7, fontSize:36, color: i===1 ? C.blue : C.white, fontFace:"Arial", bold:true });
    sl.addText(k.unit, { x, y:4.3, w:1.8, h:0.3, fontSize:12, color:C.grey2, fontFace:"Arial", bold:true });
    sl.addText(k.sub, { x, y:4.58, w:1.8, h:0.25, fontSize:9, color:C.grey, fontFace:"Arial" });
  });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"141E3A"} });
  sl.addText("游戏流程", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:C.grey, fontFace:"Arial" });
})();

// ===== 第7页 应用场景 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: "F0F4FF" };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("APPLICATIONS", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("07 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("应用场景", { x:0.5, y:0.9, w:5, h:0.7, fontSize:40, color:C.navy, fontFace:"Arial", bold:true });

  const scenes = [
    { num:"01", name:"展会引流", desc:"入口处设置互动装置，吸引排队体验，制造话题和传播" },
    { num:"02", name:"新品发布", desc:"作为产品演示环节，让客户亲手体验新品刹车手把的手感" },
    { num:"03", name:"门店互动", desc:"线下门店放置品牌互动装置，强化品牌记忆和客户粘性" },
    { num:"04", name:"客户活动", desc:"经销商大会、年会等活动的互动体验环节，留下深刻印象" },
  ];
  scenes.forEach((s, i) => {
    const x = 0.5 + (i % 2) * 4.65;
    const y = 1.75 + Math.floor(i / 2) * 1.55;
    sl.addShape(pres.shapes.RECTANGLE, { x, y, w:4.4, h:1.35, fill:{color:"E8EEFA"} });
    sl.addShape(pres.shapes.RECTANGLE, { x, y, w:0.06, h:1.35, fill:{color: i===0 ? C.blue : C.navy} });
    sl.addText(s.num, { x:x+0.2, y:y+0.15, w:0.5, h:0.4, fontSize:20, color: i===0 ? C.blue : C.navy, fontFace:"Arial", bold:true });
    sl.addText(s.name, { x:x+0.75, y:y+0.18, w:3.3, h:0.38, fontSize:16, color:C.navy, fontFace:"Arial", bold:true });
    sl.addText(s.desc, { x:x+0.2, y:y+0.62, w:4.0, h:0.6, fontSize:11, color:"5A6E9A", fontFace:"Arial" });
  });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"DDE5F5"} });
  sl.addText("应用场景", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:"6B7FA8", fontFace:"Arial" });
})();

// ===== 第8页 可选配置 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: C.navy };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("OPTIONS", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("08 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("可选配置", { x:0.5, y:0.85, w:5, h:0.7, fontSize:40, color:C.white, fontFace:"Arial", bold:true });

  const opts = [
    { name:"手把数量", val:"2 个手把", sub:"可扩展至 4 个手把\n支持更多玩家同时对战", note:"标准: 2P / 扩展: 4P+" },
    { name:"控制盒外观", val:"标准黑色外壳", sub:"支持品牌定制配色\n丝印品牌 logo\n定制外壳材质", note:"标准黑 / 品牌定制" },
    { name:"游戏模式", val:"反应刹车 / 刹车距离 / 双模式", sub:"可定制专属游戏主题\n配合品牌色定制皮肤\n游戏内容灵活扩展", note:"3 种模式 / 可定制" },
  ];
  opts.forEach((o, i) => {
    const x = 0.5 + i * 3.1;
    sl.addShape(pres.shapes.RECTANGLE, { x, y:1.7, w:2.9, h:2.2, fill:{color:"1F2D52"} });
    sl.addText(o.name, { x:x+0.2, y:1.82, w:2.5, h:0.35, fontSize:12, color:C.blue, fontFace:"Arial", bold:true });
    sl.addText(o.val, { x:x+0.2, y:2.15, w:2.5, h:0.5, fontSize:11, color:C.white, fontFace:"Arial", bold:true });
    sl.addText(o.sub, { x:x+0.2, y:2.65, w:2.5, h:0.9, fontSize:10, color:C.grey2, fontFace:"Arial" });
    sl.addShape(pres.shapes.LINE, { x:x+0.2, y:3.58, w:2.5, h:0, line:{color:"2B3A6A", width:1} });
    sl.addText(o.note, { x:x+0.2, y:3.65, w:2.5, h:0.25, fontSize:9, color:C.grey, fontFace:"Arial" });
  });

  // 下方两项
  sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.1, w:4.3, h:1.0, fill:{color:"1F2D52"} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.1, w:0.06, h:1.0, fill:{color:C.blue} });
  sl.addText("大屏适配", { x:0.7, y:4.18, w:2, h:0.3, fontSize:12, color:C.blue, fontFace:"Arial", bold:true });
  sl.addText("支持 1080P / 4K 大屏适配\n展会大电视直接投影", { x:0.7, y:4.46, w:3.9, h:0.55, fontSize:10, color:C.grey2, fontFace:"Arial" });

  sl.addShape(pres.shapes.RECTANGLE, { x:5.2, y:4.1, w:4.3, h:1.0, fill:{color:"1F2D52"} });
  sl.addShape(pres.shapes.RECTANGLE, { x:5.2, y:4.1, w:0.06, h:1.0, fill:{color:C.accent} });
  sl.addText("排行榜系统", { x:5.4, y:4.18, w:2, h:0.3, fontSize:12, color:C.accent, fontFace:"Arial", bold:true });
  sl.addText("本地排行榜 / 联网云排行\n成绩二维码扫码分享", { x:5.4, y:4.46, w:3.9, h:0.55, fontSize:10, color:C.grey2, fontFace:"Arial" });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"141E3A"} });
  sl.addText("可选配置", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:C.grey, fontFace:"Arial" });
})();

// ===== 第9页 交付内容 =====
(function(){
  let sl = pres.addSlide();
  sl.background = { color: "F0F4FF" };

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:C.blue} });
  sl.addText("DELIVERABLES", { x:0.5, y:0.4, w:5, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", charSpacing:2 });
  sl.addText("09 / 09", { x:8.5, y:0.4, w:1, h:0.3, fontSize:9, color:C.grey, fontFace:"Arial", align:"right" });

  sl.addText("交付内容", { x:0.5, y:0.9, w:5, h:0.7, fontSize:40, color:C.navy, fontFace:"Arial", bold:true });

  const delivers = [
    { num:"01", name:"硬件清单", items:"霍尔传感器 × 2\nArduino Pro Micro × 1\n3D 打印支架\n控制盒外壳\n连接线材", accent:false },
    { num:"02", name:"软件系统", items:"游戏程序 × 1\n排行榜系统\nArduino 固件\n安装说明文档", accent:false },
    { num:"03", name:"安装调试", items:"传感器安装指导\nArduino 编程烧录\n游戏调试参数设置\n现场测试支持", accent:false },
    { num:"04", name:"技术支持", items:"远程技术支持\n现场技术人员（可选）\n游戏模式定制开发", accent:false },
    { num:"05", name:"交付周期", items:"4–6 周\n从确认方案到现场交付\n包含定制化开发时间", accent:true },
  ];
  delivers.forEach((d, i) => {
    const x = 0.4 + i * 1.9;
    const ac = d.accent;
    sl.addShape(pres.shapes.RECTANGLE, { x, y:1.75, w:1.72, h:3.2, fill:{color: ac ? "1A3A8F" : "E8EEFA"}, line: ac ? {color:C.blue, width:2} : null });
    sl.addText(d.num, { x:x+0.12, y:1.9, w:1.4, h:0.55, fontSize:28, color: ac ? C.accent : C.blue, fontFace:"Arial", bold:true });
    sl.addText(d.name, { x:x+0.12, y:2.48, w:1.4, h:0.35, fontSize:13, color: ac ? C.white : C.navy, fontFace:"Arial", bold:true });
    sl.addShape(pres.shapes.LINE, { x:x+0.12, y:2.88, w:1.4, h:0, line:{color: ac ? "3B6EE8" : "B8CEEE", width:1}});
    sl.addText(d.items, { x:x+0.12, y:2.98, w:1.48, h:1.85, fontSize:10, color: ac ? C.grey2 : "5A6E9A", fontFace:"Arial", lineSpacingMultiple:1.3 });
  });

  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:"DDE5F5"} });
  sl.addText("交付内容", { x:0.5, y:5.22, w:4, h:0.38, fontSize:10, color:"6B7FA8", fontFace:"Arial" });
})();

pres.writeFile({ fileName: "E:\\RCB_Project_Files\\PPT\\刹车手把互动装置.pptx" })
  .then(() => console.log("Done: 刹车手把互动装置.pptx"))
  .catch(e => { console.error(e); process.exit(1); });