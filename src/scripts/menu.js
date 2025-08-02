const path = require('path');
const { Menu, nativeImage } = require('electron')

const setMainMenu = (win) => {
    const sunIconPath = path.join(global.appRoot, "public/menu-icons/sun.png")
    const sunIcon = nativeImage.createFromPath(sunIconPath).resize({ width: 16, height: 16 })

    const moonIconPath = path.join(global.appRoot, "public/menu-icons/moon.png")
    const moonIcon = nativeImage.createFromPath(moonIconPath).resize({ width: 16, height: 16 })

    const template = [
        {
            label: "Themes",
            submenu: [
                { 
                    label: "Light",
                    icon: sunIcon,
                    click: () => win.webContents.send("update-theme", "light"),
                },
                {
                    label: "Dark",
                    icon: moonIcon,
                    click: () => win.webContents.send("update-theme", "dark")
                }
            ]
        },

        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

module.exports = {
    setMainMenu
}