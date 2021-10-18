import { pipeline, Transform } from 'stream';
import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';

const outputPath = './task1_2/output';

if (!fs.existsSync(outputPath)){
  fs.mkdirSync(outputPath);
}

const pathToCsvFile = path.resolve('./task1_2/csv', 'data.csv');
const pathToTxtFile = path.resolve(outputPath, 'data.txt');

const removingAccountStream = new Transform({
  transform(chunk, encoding, callback) {
    try {
      const obj = JSON.parse(chunk.toString());
      delete obj.Amount;
      callback(null, Buffer.from(JSON.stringify(obj) + '\n'));
    } catch (e) {
      callback(e);
    }
  }
});

pipeline(
  fs.createReadStream(pathToCsvFile),
  csv(),
  removingAccountStream,
  fs.createWriteStream(pathToTxtFile),
  (error) => {
    if (error) console.log(error);
  }
);
