const fs = require('fs');
const path = require('path');
const async = require('async');
const hasha = require('hasha');


const getHashFile = (path, algorithm = 'md5') => {
  return hasha.fromFile(path, { algorithm })
};

const filter = (array) => {
  let temp = {};
  return array.filter(a => {
    return a in temp ? 0 : temp[a] = 1;
  })
}

const getFiles = (dirPath, callback) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) return callback(err);
    let filePaths = [];
    async.eachSeries(files, (fileName, eachCallback) => {
      let filePath = path.join(dirPath, fileName);

      fs.stat(filePath, (err, stat) => {
        if (err) return eachCallback(err);

        if (stat.isDirectory()) {
          getFiles(filePath, (err, subDirFiles) => {
            if (err) return eachCallback(err);
            filePaths = filePaths.concat(subDirFiles);
            eachCallback(null);
          });

        } else {
          if (stat.isFile())
              filePaths.push(filePath);
            eachCallback(null);
          }
      });
    }, (err) => {
      callback(err, filePaths);
    });
  });
};

const getAllFiles = (directories, callback) => {
  let filePaths = [];
  async.eachSeries(directories, (directory, eachCallback) => {
    getFiles(directory, (err, files) => {
      if (err) return eachCallback(err);
      filePaths = filePaths.concat(files);
      eachCallback(null);
    });
  }, (err) => {
    callback(err, filePaths);
  });
};


module.exports = {
   getHashFile,
   getAllFiles,
   getFiles,
   filter
}
