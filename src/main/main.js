const {app, BrowserWindow, Tray, Menu} = require('electron');
const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');
const path = require('path');
const Store = require('electron-store');
const {createNewWindow} = require('./window.js');
const {createNewJobs} = require('./job.js');
const {defaultSettings} = require('./defaultSettings.js')
require('./ipcMain.js')();


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-line global-require
if (require('electron-squirrel-startup')) {
    app.quit();
}

app.allowRendererProcessReuse = true;

let mainWindow;
let tray;
const store = new Store();

const init = () => {
    const settings = store.get('settings')
    const time = settings.schedule.split(':');
    const systemAnalysisJob = createNewJobs(
        'systemAnalysis',
        `00 ${time[1]} ${time[0]} * * *`,
        () => { console.log("HI") },
        'Asia/Omsk'
    )
    systemAnalysisJob.start()
    if (!settings) store.set('settings', defaultSettings)
}
init()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const createWindow = () => {
    let iconPath = path.resolve(__dirname, 'fs.png')
    mainWindow = createNewWindow('main', {
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js') // use a preload script
        },
        icon: iconPath
    });
    tray = new Tray(iconPath)
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: function () {
                mainWindow.show()
            }
        },
        {
            label: 'Quit',
            click: function () {
                mainWindow.destroy();
                app.quit();
            }
        }
    ])

    tray.setContextMenu(contextMenu)

    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.setMenuBarVisibility(false);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady()
    .then(() => {
        installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
            .then((name) => console.log(`Added Extension: ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
