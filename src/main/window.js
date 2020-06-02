const {BrowserWindow} = require('electron');


const currentWindows = new Map()

const createNewWindow = (windowId, options) => {
    if (currentWindows.has(windowId))
        return null
    const newWindow = new BrowserWindow(options)
    newWindow.on('closed', () => {
        currentWindows.delete(windowId)
    })
    currentWindows.set(windowId, newWindow)
    return newWindow
}

const getWindow = (windowId) => {
    if (!currentWindows.has(windowId)) { return null }
    else { return currentWindows.get(windowId) }
}

module.exports = {
    createNewWindow,
    getWindow
}