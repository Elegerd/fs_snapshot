const {app, ipcMain, dialog} = require('electron');
const {getJob} = require('./job.js')
const {getHashFile, getAllFiles, saveAnalysis, filter} = require('./helper.js');
const promiseLimit = require('promise-limit');
const path = require('path');
const fsp = require('fs').promises;
const fs = require('fs');
const {CronTime} = require('cron');
const {getWindow} = require("./window.js");
const Store = require('electron-store');


const limit = promiseLimit(5);
const store = new Store();
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

    ipcMain.on('APP_SETTING', (event, date) => {
        if (date) {
            store.set('settings', date);
            const time = date.schedule.split(':');
            const systemAnalysisJob = getJob('systemAnalysis');
            const cronTime = new CronTime(`00 ${time[1]} ${time[0]} * * *`)
            systemAnalysisJob.setTime(cronTime)
            systemAnalysisJob.start()
        }
        event.reply('APP_SETTING_REPLY', store.get('settings'))
    });

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
                    if (err)
                        reply({status: "error"});
                    else {
                        const timestamp = new Date()
                        const pathToSave = path.resolve(app.getAppPath(), 'analysis', `${+timestamp}.xlsx`)
                        saveAnalysis(allKeys, pathToSave, firstSnapshots, secondSnapshots);
                        reply({status: "done", pathToSave});
                    }
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
            reply({count, counter, counterError, status: "beginning",
                currentFile: null, message: "Process start..."});
            const getPromiseHashFile = (filePath) => {
                return getHashFile(filePath)
                    .then(hash => {
                        counter += 1;
                        reply({count, counter, status: "processing", currentFile: filePath,
                            message: filePath});
                        let res = {};
                        res[filePath] = hash;
                        return res;
                    })
                    .catch(_ => {
                        counter += 1;
                        counterError += 1;
                        reply({count, counter, counterError, status: "processing", currentFile: filePath,
                            message: filePath});
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
                    reply({status: "saving", currentFile: null, hashs,
                        message: "Saving is in progress..."});
                    fs.mkdir(path.resolve(app.getAppPath(), 'snapshots'), {recursive: true}, (err) => {
                        if (err)
                            reply({status: "error", message: "Something went wrong..."});
                        else {
                            fs.writeFile(path.resolve(app.getAppPath(), `snapshots/${+new Date}.json`),
                                JSON.stringify(hashs, null, 2), 'utf8', (error) => {
                                    if (error) reply({status: "error", message: "Something went wrong..."});
                                    else reply({status: "done", message: "Done!"});
                                }
                            );
                        }
                    });
                });
        });
    });
};
