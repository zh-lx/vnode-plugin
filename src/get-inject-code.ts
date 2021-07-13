import path from 'path';
import fs from 'fs';
import {
  InjectPathName,
  InjectLineName,
  InjectColumnName,
  InjectCoverName,
  InjectNodeName,
} from './constant';
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
  const _code = code
    .replace(/__FILE__/g, InjectPathName)
    .replace(/__LINE__/g, InjectLineName)
    .replace(/__COLUMN__/g, InjectColumnName)
    .replace(/__NODE__/g, InjectNodeName)
    .replace(/__COVER__/g, InjectCoverName)
    .replace(/__PORT__/g, port);
  return `<div class="_vc-cover" id="_vc-cover"></div>\n<style>\._vc-cover {position: fixed; z-index: 999999; background: rgba(0, 0, 255, 0.1); overflow: hidden; white-space: normal; word-break: break-all; text-overflow: ellipsis; font-size: 12px; color: orange;}</style>\n<script>\n${_code}\n</script>`;
};

export = injectCode;
