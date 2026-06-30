"""
搖桿校準 — 顯示 raw ADC 值，幫助找出正確的範圍和中心點
=========================================================
用法：複製到 CIRCUITPY/code.py，開序列終端機 (115200)，按 RESET
      照指示推動搖桿到各極限位置
"""
import time
import board
import analogio

joy_x = analogio.AnalogIn(board.A0)  # GP26
joy_y = analogio.AnalogIn(board.A1)  # GP27

print("\n" + "=" * 50)
print("  搖桿 ADC 校準")
print("=" * 50)

# 自動取樣找中點和範圍
print("\n[自動取樣 3 秒 — 請放開搖桿讓它回中]")
samples_x = []
samples_y = []
for i in range(30):
    samples_x.append(joy_x.value)
    samples_y.append(joy_y.value)
    time.sleep(0.1)

print(f"\n  中點 X: {sum(samples_x)//len(samples_x)}")
print(f"  中點 Y: {sum(samples_y)//len(samples_y)}")
print(f"  X 範圍: {min(samples_x)} ~ {max(samples_x)}")
print(f"  Y 範圍: {min(samples_y)} ~ {max(samples_y)}")

# 手動極限測試
print("\n[手動測試 — 請依指示推動搖桿]\n")

for label, direction in [
    ("搖桿推到 最左      ", "left"),
    ("搖桿推到 最右      ", "right"),
    ("搖桿推到 最上      ", "up"),
    ("搖桿推到 最下      ", "down"),
]:
    input(f"  準備好了嗎？按 Enter 開始讀取 {label}")
    samples_x = []
    samples_y = []
    for _ in range(20):
        samples_x.append(joy_x.value)
        samples_y.append(joy_y.value)
        time.sleep(0.01)
    avg_x = sum(samples_x) // len(samples_x)
    avg_y = sum(samples_y) // len(samples_y)
    print(f"  {label} → X={avg_x:>6}  Y={avg_y:>6}")
    print()

print("=" * 50)
print("把上面這些數值貼給我，我幫你調校準參數")
print("=" * 50)

joy_x.deinit()
joy_y.deinit()
