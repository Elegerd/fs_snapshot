const {app, ipcMain, dialog} = require('electron');
const {getHashFile, getAllFiles, saveAnalysis, filter} = require('./helper.js');
const promiseLimit = require('promise-limit');
const path = require('path');
const fsp = require('fs').promises;
const fs = require('fs');
const {getWindow} = require("./window.js");


const limit = promiseLimit(5);
module.exports = () => {
    ipcMain.handle('APP_SELECT_SNAPSHOTS', (event) => {
        return dialog.showOpenDialogSync(getWindow('main'), {
            properties: ['openFile', 'multiSelections'],
            defaultPath: path.resolve(app.getAppPath(),'analysis'),
            filters: [
                {name: 'JSON', extensions: ['json']},
                {name: 'Все файлы', extensions: ['*']}
            ]
        });
    });

    // ipcMain.on('APP_SETTING', (event, date) => {
    //     const defaultSetting = {
    //         disabledSchedule: true,
    //         hour: 15,
    //         time: 0
    //     };
    //     if (date) {
    //         setting
    //     } else {
    //
    //     }
    //     fs.mkdir(path.resolve('/fs_snapshots/snapshots'), {recursive: true}, (err) => {
    //         if (err) console.log(err)
    //         fs.readFile('/fs_snapshots/setting.json', 'utf8', (err, data) => {
    //             const defaultSetting = {
    //                 disabledSchedule: true,
    //                 hour: 15,
    //                 time: 0
    //             };
    //             let setting = {};
    //             if (err) {
    //                 fs.writeFile(path.resolve(`/fs_snapshots/setting.json`),
    //                     JSON.stringify(defaultSetting, null, 2), 'utf8', (error) => {
    //                         if (error) reply({status: "error"});
    //                         setting = defaultSetting;
    //                     }
    //                 );
    //             } else {
    //                 setting = JSON.parse(data);
    //             }
    //             ipcMain.send('')
    //         });
    //     });
    // })

    ipcMain.on('APP_SNAPSHOTS_ANALYSIS', (event, snapshots_path) => {
        const reply = (message) => event.reply('APP_SNAPSHOTS_ANALYSIS_REPLY', message);
        reply({status: "beginning"});
        const promises = snapshots_path.map(snapshot => {
            return fsp.readFile(snapshot)
                .then(json => {
                    return JSON.parse(json);
                })
                .catch(_ => {
                    return {status: "error"}
                })
        });
        Promise.all(promises)
            .then(snapshots => {
                reply({status: "processing"});
                const firstSnapshots = snapshots[0];
                const secondSnapshots = snapshots[1];
                const allKeys = filter(Object.keys(firstSnapshots).concat(Object.keys(secondSnapshots))).sort();
                fs.mkdir(path.resolve(app.getAppPath(), 'analysis'), {recursive: true}, (err) => {
                    if (err) reply({status: "error"});
                    const timestamp = new Date()
                    const pathToSave = path.resolve(app.getAppPath(), 'analysis', `${+timestamp}.xlsx`)
                    saveAnalysis(allKeys, pathToSave, firstSnapshots, secondSnapshots);
                    reply({status: "done", pathToSave});
                });
            })
            .catch(error => {
                reply(error)
            })
    });

    ipcMain.handle('APP_SELECT_DIRECTORIES', (event) => {
        return dialog.showOpenDialogSync(getWindow('main'), {
            properties: ['openDirectory', 'multiSelections']
        });
    });

    ipcMain.on('APP_GET_HASH_FILES', (event, directories) => {
        const reply = (message) => event.reply('APP_GET_HASH_FILES_REPLY', message);
        getAllFiles(directories, (err, filePaths) => {
            const count = filePaths.length;
            let counter = 0;
            let counterError = 0;
            reply({count, counter, counterError, status: "beginning", currentFile: null});
            const getPromiseHashFile = (filePath) => {
                return getHashFile(filePath)
                    .then(hash => {
                        counter += 1;
                        reply({count, counter, status: "processing", currentFile: filePath});
                        let res = {};
                        res[filePath] = hash;
                        return res;
                    })
                    .catch(_ => {
                        counter += 1;
                        counterError += 1;
                        reply({count, counter, counterError, status: "processing", currentFile: filePath});
                        let res = {};
                        res[filePath] = null;
                        return res;
                    });
            };
            const promises = filePaths.map(file => {
                return limit(() => getPromiseHashFile(file))
            });
            Promise.allSettled(promises)
                .then(res => {
                    let hashs = res.reduce((accum, obj) => {
                        return Object.assign(accum, obj.value);
                    }, {});
                    reply({status: "saving", currentFile: null, hashs});
                    fs.mkdir(path.resolve(app.getAppPath(), 'snapshots'), {recursive: true}, (err) => {
                        if (err) reply({status: "error"});
                        fs.writeFile(path.resolve(app.getAppPath(), `snapshots/${+new Date}.json`),
                            JSON.stringify(hashs, null, 2), 'utf8', (error) => {
                                if (error) reply({status: "error"});
                                reply({status: "done"});
                            }
                        );
                    });
                });
        });
    });
};
