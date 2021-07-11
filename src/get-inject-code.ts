import path from 'path';
import fs from 'fs';
import { InjectPathName, InjectLineName, InjectColumnName } from './constant';
const injectFile = path.resolve(__dirname, './inject-code-template.js'); // 编译后会在lib文件夹中
const DefaultInjectCode = fs.readFileSync(injectFile, 'utf-8');

const injectCode = (port, options) => {
  const clickArr = [];
  const recordArr = [];
  for (let key in options) {
    if (/^[a-z]$/.test(key) && typeof options[key] === 'function') {
      clickArr.push(`${key}: ${options[key].toString()}`);
      recordArr.push(`${key}: false`);
    }
  }
  const code =
    clickArr.length > 0
      ? DefaultInjectCode.replace(
          "'__CODE__CB__'",
          `'__CODE__CB__', ${clickArr.join(',')}`
        ).replace(
          "'__CODE__RECORD__'",
          `'__CODE__RECORD__', ${recordArr.join(',')}`
        )
      : DefaultInjectCode;
  return code
    .replace('__FILE__', InjectPathName)
    .replace('__LINE__', InjectLineName)
    .replace('__COLUMN__', InjectColumnName)
    .replace('__PORT__', port);
};

export = injectCode;
