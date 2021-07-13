"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var server_1 = __importDefault(require("./server"));
var get_inject_code_1 = __importDefault(require("./get-inject-code"));
var _options = {};
var TrackCodePlugin = /** @class */ (function () {
    function TrackCodePlugin(options) {
        if (options === void 0) { options = {}; }
        _options = options;
    }
    TrackCodePlugin.prototype.apply = function (complier) {
        complier.plugin('compilation', function (compilation) {
            server_1.default(function (port) {
                var code = get_inject_code_1.default(port, _options);
                compilation.plugin('html-webpack-plugin-after-html-processing', function (data) {
                    // html-webpack-plugin编译后的内容，注入代码
                    data.html = data.html.replace('</body>', code + "\n</body>");
                });
            });
        });
    };
    return TrackCodePlugin;
}());
module.exports = TrackCodePlugin;
//# sourceMappingURL=index.js.map