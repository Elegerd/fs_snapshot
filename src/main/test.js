const { ipcMain, dialog } = require('electron');
const { getHashFile, getAllFiles} = require('./helper.js');
const promiseLimit = require('promise-limit');
const limit = promiseLimit(2);

module.exports = (browserWindow) => {

  ipcMain.handle('APP_SELECT_DIRECTORIES', (event) => {
      const directories = dialog.showOpenDialogSync(browserWindow, {
        properties: ['openDirectory', 'multiSelections']
      });
      return directories;
  });

  ipcMain.on('APP_GET_HASH_FILES', (event, directories) => {
    let promises = [];
    getAllFiles(directories, (err, filePaths) => {
      const count = filePaths.length;
      let counter = 0;
      let counterError = 0;
      event.reply('APP_GET_HASH_FILES_REPLY', {
        count,
        counter,
        currentFile: null,
        status: null
      });
      filePaths.forEach((filePath) => {
        const promise = getHashFile(filePath)
          .then(res => {
            counter += 1;
            event.reply('APP_GET_HASH_FILES_REPLY', {
              currentFile: filePath,
              count,
              counter,
              counterError
            });
            return {
              path: filePath,
              hash: res
            };
          })
          .catch(err => {
            counter += 1;
            counterError += 1;
            event.reply('APP_GET_HASH_FILES_REPLY', {
              currentFile: filePath,
              count,
              counter,
              counterError
            });
            return {
              path: filePath,
              hash: null
            };
          });
        promises.push(promise);
      });
      Promise.allSettled(promises)
        .then(res => {
          event.reply('APP_GET_HASH_FILES_REPLY', {
            status: true,
            currentFile: null,
            res
          });
        });
    });
  });
};
