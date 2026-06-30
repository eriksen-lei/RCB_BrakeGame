"""
boot.py — 在 USB 初始化前註冊純 Gamepad HID 裝置
====================================================
只啟用 Gamepad，不啟用鍵盤/滑鼠，避免 Windows 誤判為鍵盤。
REPL (CDC) 和 CIRCUITPY 磁碟 (MSC) 不受影響。

Windows 裝置管理員將顯示為 "RCBGAME CONTROLLER"。
"""

import supervisor
import usb_hid

# ═══════════════════════════════════════════════════════
#  設定 USB 裝置名稱（Windows 顯示的名稱）
# ═══════════════════════════════════════════════════════

supervisor.set_usb_identification(
    manufacturer="RCB",
    product="RCBGAME CONTROLLER",
)

# ═══════════════════════════════════════════════════════
#  Gamepad HID Report Descriptor
#  16 按鈕 (2 bytes) + 4 軸 (X/Y/Z/Rz 各 1 byte signed)
#  報告總長: 6 bytes
# ═══════════════════════════════════════════════════════

GAMEPAD_REPORT_DESCRIPTOR = bytes((
    0x05, 0x01,        # Usage Page (Generic Desktop)
    0x09, 0x05,        # Usage (Game Pad)
    0xA1, 0x01,        # Collection (Application)
    0x05, 0x09,        #   Usage Page (Button)
    0x19, 0x01,        #   Usage Minimum (Button 1)
    0x29, 0x10,        #   Usage Maximum (Button 16)
    0x15, 0x00,        #   Logical Minimum (0)
    0x25, 0x01,        #   Logical Maximum (1)
    0x75, 0x01,        #   Report Size (1)
    0x95, 0x10,        #   Report Count (16)
    0x81, 0x02,        #   Input (Data,Var,Abs)
    0x05, 0x01,        #   Usage Page (Generic Desktop)
    0x09, 0x30,        #   Usage (X)
    0x09, 0x31,        #   Usage (Y)
    0x09, 0x32,        #   Usage (Z)
    0x09, 0x35,        #   Usage (Rz)
    0x15, 0x81,        #   Logical Minimum (-127)
    0x25, 0x7F,        #   Logical Maximum (127)
    0x75, 0x08,        #   Report Size (8)
    0x95, 0x04,        #   Report Count (4)
    0x81, 0x02,        #   Input (Data,Var,Abs)
    0xC0               # End Collection
))

# ═══════════════════════════════════════════════════════
#  建立 Gamepad 裝置
# ═══════════════════════════════════════════════════════

gamepad_device = usb_hid.Device(
    report_descriptor=GAMEPAD_REPORT_DESCRIPTOR,
    usage_page=0x01,      # Generic Desktop
    usage=0x05,           # Game Pad
    report_ids=(0,),      # 不使用 report ID
    in_report_lengths=(6,),
    out_report_lengths=(0,),
)

# ═══════════════════════════════════════════════════════
#  只啟用 Gamepad（不啟用鍵盤滑鼠）
# ═══════════════════════════════════════════════════════

usb_hid.enable((gamepad_device,))

print("boot.py: Gamepad-only HID enabled")
