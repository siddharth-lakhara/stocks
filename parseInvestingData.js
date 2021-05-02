const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readdirPromise = util.promisify(fs.readdir);

const getParsedValues = (unparsedValues) => {
    const parsedValues = unparsedValues.map((v) => {
        if (isNaN(v)) {
            const localisedString = v.replace(/,/g,'');
            const isLocalisedString = !isNaN(localisedString);
            if (localisedString.length && isLocalisedString) {
                return +localisedString;
            }
            return v;
        }
        return +v;
    });
    return parsedValues;
}

const parseData = async (NSEDataFileName, NSEIndicesFileName) => {
    const excelInterface = new Excel.Workbook();
    // const investingDataCSV = await excelInterface.csv.readFile(investingDataFileName);
    const NSEDataCSV = await excelInterface.csv.readFile(NSEDataFileName);
    const NSEIndicesCSV = await excelInterface.csv.readFile(NSEIndicesFileName);
    const mainExcel = await excelInterface.xlsx.readFile(process.env.mainExcelPath);
    
    // const ws = mainExcel.getWorksheet('Investing Data');
    const nseWs = mainExcel.getWorksheet('NSE Data');
    const nseIndicesWs = mainExcel.getWorksheet('NSE Indices');
    
    // investingDataCSV.columns.map((c, idx) => {
    //     const values = getParsedValues(c.values);
    //     ws.getColumn(idx+1).values = values;
    // });
    
    NSEDataCSV.columns.map((c, idx) => {
        const values = getParsedValues(c.values);
        nseWs.getColumn(idx+1).values = values;
    });

    NSEIndicesCSV.columns.map((c, idx) => {
      const values = getParsedValues(c.values);
      nseIndicesWs.getColumn(idx + 1).values = values;
    });

    await mainExcel.xlsx.writeFile(process.env.mainExcelPath);
}

const filterCSVFiles = (files) => {
    return files.filter(
        (f) => {
            const fileParts = f.split('.');
            const isCSV = fileParts[fileParts.length-1] === 'csv';
            // const isInvestingData = (/^Portfolio_Watchlist.*$/).test(fileParts[0]);
            const isNSEData = (/^MW-SECURITIES-IN-F&O.*$/).test(fileParts[0]);
            const isNSEIndicesData = (/^MW-All-Indices.*$/).test(fileParts[0]);
            const isRequiredFile = isNSEData || isNSEIndicesData;
            return (isCSV && isRequiredFile);
        }
    )
};

const getCreateTime = (files, dirPath) => {
    const fileWithCreateTime = files.map((f) => ({
        name: f,
        createTime: fs.statSync(path.join(dirPath, f)).mtime.getTime()
    }));
    return fileWithCreateTime;
}

const sortOnTime = (files) => {
    return files.sort((a, b) => {
        return b.createTime - a.createTime
    });
};

const filterFileName = (files, pattern) => {
    for (let i=0; i<files.length; i++) {
        if (pattern.test(files[i])) {
            return files[i];
        }
    }
}

const findFiles = async () => {
  const dirPath = process.env.downloadFolderPath;
  const files = await readdirPromise(dirPath)
    .then(filterCSVFiles)
    .then((files) => getCreateTime(files, dirPath))
    .then(sortOnTime)
    .then((files) => files.map((f) => f.name));
  // const investingDataFileName = path.join(dirPath, filterFileName(files, /^Portfolio_Watchlist.*$/)) ;
  const NSEDataFileName = path.join(dirPath, filterFileName(files, /^MW-SECURITIES-IN-F&O.*$/));
  const NSEIndicesFileName = path.join(dirPath, filterFileName(files, /^MW-All-Indices.*$/));
  return [NSEDataFileName, NSEIndicesFileName];
};;

const main = async () => {
    const [NSEDataFileName, NSEIndicesFileName] = await findFiles();
    await parseData(NSEDataFileName, NSEIndicesFileName);    
}

module.exports = main;

if (require.main === module) {
    main();
}

