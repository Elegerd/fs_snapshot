const fs = require('fs');
const path = require('path');
const async = require('async');
const hasha = require('hasha');
const xl = require('excel4node');


const saveAnalysis = (paths, firstSnapshot, secondSnapshot) => {
    let wb = new xl.Workbook({
        defaultFont: {
            color: '#000000',
            size: 12,
        }
    });
    let ws = wb.addWorksheet('Analysis');
    ws.cell(1, 1).string('Path')
    ws.cell(1, 2).string('Hash value[1]')
    ws.cell(1, 3).string('Hash value[2]')
    ws.cell(1, 4).string('Result comparison')
    paths.forEach((path, index) => {
        const isEqual = firstSnapshot[path] === secondSnapshot[path];
        ws.cell(index + 2, 1).string(path)
        ws.cell(index + 2, 2).string(firstSnapshot[path])
        ws.cell(index + 2, 3).string(secondSnapshot[path])
        ws.cell(index + 2, 4).bool(isEqual).style({
            font: {
                color: '#ffffff',
            },
            fill: {
                bgColor: isEqual ? '#008000' : '#ff0000'
            }
        })
    });
    //wb.write('Excel.xlsx');
};

const getHashFile = (path, algorithm = 'md5') => {
    return hasha.fromFile(path, {algorithm})
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
    saveAnalysis,
    filter
}
