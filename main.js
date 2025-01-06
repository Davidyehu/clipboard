const { app, BrowserWindow, clipboard, ipcMain, globalShortcut } = require('electron')
let mainWindow
let clipboardHistory = []

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: { nodeIntegration: true }
  })
  mainWindow.loadFile('index.html')
}

function trackClipboard() {
  let lastText = clipboard.readText()
  setInterval(() => {
    const currentText = clipboard.readText()
    if (currentText && currentText !== lastText) {
      clipboardHistory.unshift(currentText)
      if (clipboardHistory.length > 50) clipboardHistory.pop()
      lastText = currentText
      mainWindow.webContents.send('update-clipboard', clipboardHistory)
    }
  }, 1000)
}

app.whenReady().then(() => {
  createMainWindow()
  trackClipboard()
  // Windows key cannot be registered, use Ctrl+Shift+V instead
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

ipcMain.handle('get-clipboard-history', () => clipboardHistory)