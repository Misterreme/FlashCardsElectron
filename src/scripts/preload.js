const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld("API", {
    onChangeTheme: (callback) => ipcRenderer.on("update-theme", callback),
})