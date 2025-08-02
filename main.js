const { app, BrowserWindow } = require('electron/main')
const path = require("node:path")
global.appRoot = __dirname

// Establece el ID de la aplicación para Windows
if (process.platform === 'win32') {
    app.setAppUserModelId("com.flashcards.app")
}

console.log("global", global.appRoot)
const { setMainMenu } = require("./src/scripts/menu")

const createWindow = () => {
    const win = new BrowserWindow({
        icon: path.join(__dirname, "public", "icons", "favicon.ico"),
        width: 1500,
        height: 1500,
        webPreferences: {
            preload: path.join(__dirname, "/src/scripts/preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        }
    })

    win.loadFile('index.html')
    setMainMenu(win)
}


app.whenReady().then(() => {
    createWindow()
})