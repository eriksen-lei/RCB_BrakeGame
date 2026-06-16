# RCB Brake Racing 架构设计

## 产品目标

这是一款电脑桌面级 2D 俯视摩托赛车训练游戏，核心不是竞速排名，而是测量玩家在刹车信号出现后的反应时间、刹车力度稳定性、停车距离控制能力。第一阶段先完成软件闭环，硬件接入通过 Electron 主进程预留。

## 技术分层

- Electron：桌面窗口、系统权限、未来硬件接入、IPC 安全隔离。
- React：主游戏 UI、Canvas 渲染、训练流程、分数面板。
- Vue：设备控制台、调试面板、后续硬件校准工具。
- TypeScript：游戏状态、评分模型、硬件数据结构类型约束。
- Vite：本地开发与前端构建。

## 当前玩法闭环

1. 玩家点击开始测试。
2. 车辆自动巡航，等待随机刹车信号。
3. 信号出现后，玩家按空格刹车并控制刹车力度。
4. 车辆停下后，根据反应时间、平均刹车力度、停车位置计算成绩。

## 硬件接入预留

现在的 `electron/hardware/hardwareHub.cjs` 是硬件中心。后续硬件明确后，只需要新增适配器并保持输出结构一致：

```ts
type HardwareInputPayload = {
  source: string;
  brakePressure: number;
  throttle: number;
  steering: number;
  connected: boolean;
  timestamp: number;
};
```

推荐的后续适配顺序：

1. 串口设备：使用 `serialport`，适合 Arduino、STM32、ESP32 串口输出。
2. HID 设备：使用 `node-hid`，适合自定义 USB 手柄或刹车把。
3. 蓝牙设备：优先确认 Windows 蓝牙协议和稳定性，再决定 Web Bluetooth 或原生桥接。

## 目录说明

- `electron/main.cjs`：Electron 主进程。
- `electron/preload.cjs`：安全暴露给渲染层的 API。
- `electron/hardware/`：硬件输入中心和未来适配器。
- `src/game/`：游戏状态、模拟、评分。
- `src/ui/`：React 主界面和 Canvas 游戏画面。
- `src/vue/`：Vue 设备控制台。
- `docs/`：架构、需求、硬件协议等文档。

## GitHub 管理建议

当前项目已经位于 Git 仓库 `E:\RCB_Project_Files` 下。后续要上传或关联新 GitHub 仓库时，需要确认：

- GitHub 用户名或组织名。
- 仓库名。
- 使用 SSH 还是 HTTPS。
- 是否覆盖当前 `origin` 远程。
