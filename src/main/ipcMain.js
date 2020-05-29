const { ipcMain, dialog } = require('electron');
const { getHashFile, getAllFiles, filter } = require('./helper.js');
const promiseLimit = require('promise-limit');
const path = require('path');
const fsp = require('fs').promises;
const fs = require('fs');

const limit = promiseLimit(5);

module.exports = (browserWindow) => {

  ipcMain.handle('APP_SELECT_SNAPSHOTS', (event) => {
    const snapshots = dialog.showOpenDialogSync(browserWindow, {
      properties: ['openFile', 'multiSelections'],
      defaultPath: path.join(__dirname, '/snapshots'),
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Все файлы', extensions: ['*'] }
      ]
    });
    return snapshots;
  });

  ipcMain.on('APP_SNAPSHOTS_ANALYSIS', (event, snapshots_path) => {
    const reply = (message) => event.reply('APP_SNAPSHOTS_ANALYSIS_REPLY', message);
    const promises = snapshots_path.map(snapshot => {
      return fsp.readFile(snapshot)
        .then(res => {
          return JSON.parse(res);
        })
        .catch(error => {
          return { status: "error" }
        })
    })
    Promise.all(promises)
      .then(snapshots => {
        const firstSnapshots = snapshots[0];
        const secondSnapshots = snapshots[1];
        const allKeys = filter(Object.keys(firstSnapshots).concat(Object.keys(secondSnapshots))).sort();
        const result = allKeys.map(key => {
          return {
            file: key,
            comparison: firstSnapshots[key] === secondSnapshots[key]
          }
        });
        reply({ status: "done", result });
      })
      .catch(error => {
        reply(error)
      })
  });

  ipcMain.handle('APP_SELECT_DIRECTORIES', (event) => {
    const directories = dialog.showOpenDialogSync(browserWindow, {
      properties: ['openDirectory', 'multiSelections']
    });
    return directories;
  });

  ipcMain.on('APP_GET_HASH_FILES', (event, directories) => {
    const reply = (message) => event.reply('APP_GET_HASH_FILES_REPLY', message);
    getAllFiles(directories, (err, filePaths) => {
      const count = filePaths.length;
      let counter = 0;
      let counterError = 0;
      reply({ count, counter, counterError, status: "beginning", currentFile: null });
      const getPromiseHashFile = (filePath) => {
        return getHashFile(filePath)
          .then(hash => {
            counter += 1;
            reply({ count, counter, status: "processing", currentFile: filePath });
            let res = {};
            res[filePath] = hash;
            return res;
          })
          .catch(err => {
            counter += 1;
            counterError += 1;
            reply({ count, counter, counterError, status: "processing", currentFile: filePath });
            let res = {};
            res[filePath] = hash;
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
          reply({ status: "saving", currentFile: null, hashs });
          fs.mkdir(path.join(__dirname, '/snapshots'), { recursive: true }, (err) => {
            if (err) reply({ status: "error" });
            fs.writeFile(path.join(__dirname, `/snapshots/${+new Date}.json`),
              JSON.stringify(hashs, null, 2), 'utf8', (error) => {
                if (error) reply({ status: "error" });
                reply({ status: "done" });
              }
            );
          });
        });
    });
  });
};
