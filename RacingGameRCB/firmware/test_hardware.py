"""
硬體診斷腳本 — 逐腳測試所有按鈕和搖桿
=========================================
用法：
  1. 把這個檔案內容複製到 CIRCUITPY/code.py（先備份原 code.py）
  2. 打開序列終端機（Putty / Tera Term / Arduino Serial Monitor）
     連接 RP2040 的 COM Port，鮑率 115200
  3. 按 RESET，看輸出
  4. 照提示逐個測試每個輸入
"""
import time
import board
import digitalio
import analogio

print("\n" + "=" * 50)
print("  RP2040-Zero 硬體診斷")
print("=" * 50)

# ── 測試數位腳位（按鈕） ──
print("\n[數位腳位測試]")
print("逐個按按鈕，觀察數值變化（未按下 -> 按下）\n")

# GP0~GP5: pull-down，按鈕接 3.3V
print("--- GP0~GP5 (pull-down, 按鈕接 3.3V) ---")
for gp in [board.GP0, board.GP1, board.GP2, board.GP3, board.GP4, board.GP5]:
    pin = digitalio.DigitalInOut(gp)
    pin.direction = digitalio.Direction.INPUT
    pin.pull = digitalio.Pull.DOWN
    pin_name = str(gp).split('.')[-1]

    # 讀 10 次，顯示變化
    last = pin.value
    print(f"  {pin_name}: 初始={last}", end="")
    for _ in range(10):
        v = pin.value
        if v != last:
            print(f" -> {v}", end="")
            last = v
        time.sleep(0.1)
    print(f"  最終={last}")
    pin.deinit()

# GP6: pull-up，搖桿 SW 接 GND
print("\n--- GP6 (pull-up, 搖桿 SW 接 GND) ---")
pin = digitalio.DigitalInOut(board.GP6)
pin.direction = digitalio.Direction.INPUT
pin.pull = digitalio.Pull.UP
print(f"  GP6: 初始={pin.value} (放開應為 True, 按下為 False)", end="")
last = pin.value
for _ in range(10):
    v = pin.value
    if v != last:
        print(f" -> {v}", end="")
        last = v
    time.sleep(0.1)
print(f"  最終={last}")
pin.deinit()

# ── 測試類比腳位（搖桿） ──
print("\n[類比腳位測試]")
print("推動搖桿，觀察 ADC 數值變化\n")

print("--- A0/GP26 (搖桿 X 軸) ---")
joy_x = analogio.AnalogIn(board.A0)
last = joy_x.value
print(f"  A0: 初始={last}", end="")
for _ in range(20):
    v = joy_x.value
    if abs(v - last) > 500:
        print(f" -> {v}", end="")
        last = v
    time.sleep(0.1)
print(f"  最終={last}")
joy_x.deinit()

print("\n--- A1/GP27 (搖桿 Y 軸) ---")
joy_y = analogio.AnalogIn(board.A1)
last = joy_y.value
print(f"  A1: 初始={last}", end="")
for _ in range(20):
    v = joy_y.value
    if abs(v - last) > 500:
        print(f" -> {v}", end="")
        last = v
    time.sleep(0.1)
print(f"  最終={last}")
joy_y.deinit()

# ── 診斷總結 ──
print("\n" + "=" * 50)
print("  診斷完成！")
print("=" * 50)
print("""
解讀方式：
  GP0~GP5:  未按=False, 按下=True  → 正常
            永遠 False           → 按鈕沒接到 3.3V，或 pin 腳不對
            永遠 True            → 按鈕短路，或 pull-down 沒生效

  GP6:      放開=True, 按下=False → 正常（pull-up 接地觸發）

  A0/A1:    中間 ~32000            → 正常
            不會變                → 搖桿沒供電 / 接錯腳
            極端值 0 或 65535     → 短路或斷路

如果你看到數值完全沒變化，請確認：
  1. 搖桿模組的 VCC 和 GND 有接到板子的 3V3 和 GND
  2. 所有共地是否正確（按鈕 → 3.3V, 搖桿 SW → GND）
""")
