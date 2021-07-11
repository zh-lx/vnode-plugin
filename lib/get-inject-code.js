"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var constant_1 = require("./constant");
var injectFile = path_1.default.resolve(__dirname, './inject-code-template.js'); // 编译后会在lib文件夹中
var DefaultInjectCode = fs_1.default.readFileSync(injectFile, 'utf-8');
var injectCode = function (port, options) {
    var clickArr = [];
    var recordArr = [];
    for (var key in options) {
        if (/^[a-z]$/.test(key) && typeof options[key] === 'function') {
            clickArr.push(key + ": " + options[key].toString());
            recordArr.push(key + ": false");
        }
    }
    var code = clickArr.length > 0
        ? DefaultInjectCode.replace("'__CODE__CB__'", "'__CODE__CB__', " + clickArr.join(',')).replace("'__CODE__RECORD__'", "'__CODE__RECORD__', " + recordArr.join(','))
        : DefaultInjectCode;
    return code
        .replace('__FILE__', constant_1.InjectPathName)
        .replace('__LINE__', constant_1.InjectLineName)
        .replace('__COLUMN__', constant_1.InjectColumnName)
        .replace('__PORT__', port);
};
module.exports = injectCode;
//# sourceMappingURL=get-inject-code.js.map