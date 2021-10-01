import { pipeline } from 'stream';
import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';

const outputPath = './task1_2/output';

if (!fs.existsSync(outputPath)){
  fs.mkdirSync(outputPath);
}

const pathToCsvFile = path.resolve('./task1_2/csv', 'data.csv');
const pathToTxtFile = path.resolve(outputPath, 'data.txt');

pipeline(
  fs.createReadStream(pathToCsvFile),
  csv(),
  fs.createWriteStream(pathToTxtFile),
  (error) => {
    if (error) console.log(error);
  }
);
