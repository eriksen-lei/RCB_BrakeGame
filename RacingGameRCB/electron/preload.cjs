const { contextBridge } = require("electron");

const hardwareStatus = Object.freeze({
  connected: false,
  deviceName: null,
  type: null,
});

contextBridge.exposeInMainWorld("rcbHardware", {
  async getStatus() {
    return hardwareStatus;
  },

  async requestConnection() {
    return {
      ...hardwareStatus,
      message: "Hardware integration is not implemented in this prototype.",
    };
  },

  onBrakeInput() {
    return () => {};
  },
});

