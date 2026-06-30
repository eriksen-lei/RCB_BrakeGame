"""
RP2040-Zero USB Gamepad — 搖桿版（非對稱校準 + 簡易監控）
===========================================================
開機自動取中點，非對稱範圍映射，每秒印一次狀態
"""
import time
import struct
import board
import digitalio
import analogio
import usb_hid

# ── 找到 Gamepad ──
gamepad = None
for device in usb_hid.devices:
    if device.usage_page == 0x01 and device.usage == 0x05:
        gamepad = device
        break
if gamepad is None:
    raise RuntimeError("找不到 Gamepad HID 裝置！")

# ── 設定 ──
POLL_INTERVAL = 0.01
DEAD_ZONE = 8

# ── 硬體 ──
stick_btn = digitalio.DigitalInOut(board.GP6)
stick_btn.direction = digitalio.Direction.INPUT
stick_btn.pull = digitalio.Pull.UP

joy_x = analogio.AnalogIn(board.A0)
joy_y = analogio.AnalogIn(board.A1)

# ── 自動校準中心點 ──
print("校準中... 放開搖桿")
time.sleep(0.5)
CX = sum(joy_x.value for _ in range(50)) // 50
CY = sum(joy_y.value for _ in range(50)) // 50
print(f"中心: X={CX}  Y={CY}")

# 非對稱範圍（實測值）
X_LO, X_HI = 200, 65535
Y_LO, Y_HI = 280, 65535


def map_asymmetric(raw: int, center: int, lo: int, hi: int) -> int:
    """非對稱映射：以 center 為原點，上下範圍不同"""
    if raw > center:
        val = int((raw - center) / (hi - center) * 127)
    elif raw < center:
        val = int((raw - center) / (center - lo) * 127)
    else:
        val = 0
    if abs(val) < DEAD_ZONE:
        return 0
    return max(-127, min(127, val))


# === 主迴圈 ===
print("=" * 45)
print("  Gamepad Running  |  X=%s  Y=%s  SW=%s" % ("●", "●", "○"))
print("=" * 45)

tick = time.monotonic()
while True:
    try:
        raw_x = joy_x.value
        raw_y = joy_y.value
        x = map_asymmetric(raw_x, CX, X_LO, X_HI)
        y = map_asymmetric(raw_y, CY, Y_LO, Y_HI)
        stick = not stick_btn.value
        button_state = (1 << 6) if stick else 0

        report = struct.pack("<Hbbbb", button_state, x, y, 0, 0)
        gamepad.send_report(report)

        # 每秒印一次狀態（不影響 HID）
        now = time.monotonic()
        if now - tick >= 1.0:
            tick = now
            sw = "●" if stick else "○"
            print(f"X={x:>4}(raw={raw_x:<5})  Y={y:>4}(raw={raw_y:<5})  SW={sw}")

    except Exception as e:
        print(f"ERR: {e}")
        time.sleep(0.1)

    time.sleep(POLL_INTERVAL)
