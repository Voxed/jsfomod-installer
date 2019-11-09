const { Parser, Installer } = require('jsfomod')
const pug = require('pug')
const PARSER = new Parser()
const { app, BrowserWindow, ipcMain } = require('electron')

function openInstaller(path) {
    return new Promise(function (resolve, reject) {
        if(!app.isReady())
            reject(new Error('Electron has not initialized yet.'))

        const installer = new Installer(PARSER.parse(path), path)
        const locals = { base: `file://app/${__dirname}/`, installer: installer }
        
        let win = new BrowserWindow({
            width: 800,
            height: 600,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false
            }
        })
    
        win.on('closed', () => {
            win = null
        })
    
        win.webContents.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(
            pug.renderFile(`${__dirname}/app/installer.pug`, locals)
        ))

        ipcMain.on('next', (event, arg) => {
            if (event.sender !== win.webContents)
                return
            const selected = arg.map(o => locals.page.groups[o[0]].options[o[1]])
            locals.page = installer.next(selected)
            if (locals.page !== undefined)
                win.webContents.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(
                    pug.renderFile(`${__dirname}/app/page.pug`, locals)
                ))
            else {
                win.close()
                resolve(installer.files())
            }
        })

        ipcMain.on('previous', (event, arg) => {
            if (event.sender !== win.webContents)
                return
            locals.page = installer.previous()
            win.webContents.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(
                pug.renderFile(`${__dirname}/app/page.pug`, locals)
            ))
        })

        win.on('close', () => {
            if(locals.page !== undefined || installer.hasNext())
                reject(new Error('Interrupted by user.'))
        })
    })
}

module.exports = openInstaller