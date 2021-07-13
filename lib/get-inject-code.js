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
    var _code = code
        .replace(/__FILE__/g, constant_1.InjectPathName)
        .replace(/__LINE__/g, constant_1.InjectLineName)
        .replace(/__COLUMN__/g, constant_1.InjectColumnName)
        .replace(/__NODE__/g, constant_1.InjectNodeName)
        .replace(/__COVER__/g, constant_1.InjectCoverName)
        .replace(/__PORT__/g, port);
    return "<div class=\"_vc-cover\" id=\"_vc-cover\"></div>\n<style>._vc-cover {position: fixed; z-index: 999999; background: rgba(0, 0, 255, 0.1); overflow: hidden; white-space: normal; word-break: break-all; text-overflow: ellipsis; font-size: 12px; color: orange;}</style>\n<script>\n" + _code + "\n</script>";
};
module.exports = injectCode;
//# sourceMappingURL=get-inject-code.js.map