var __TRACK__KeyClickCbMap = {
    v: trackCode,
    __CODE__: '__CODE__CB__',
};
var __TRACK__KeyClickRecord = {
    v: false,
    __CODE__: '__CODE__RECORD__',
};
function trackCode(e) {
    var file = e.target.getAttribute('__FILE__');
    var line = e.target.getAttribute('__LINE__');
    var column = e.target.getAttribute('__COLUMN__');
    var url = "http://localhost:__PORT__/?file=" + file + "&line=" + line + "&column=" + column;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
}
// 记录键盘下压
window.addEventListener('keydown', function (e) {
    var key = e.key;
    if (__TRACK__KeyClickRecord[key] !== undefined) {
        __TRACK__KeyClickRecord[key] = true;
    }
});
// 记录键盘抬起
window.addEventListener('keyup', function (e) {
    var key = e.key;
    if (__TRACK__KeyClickRecord[key] !== undefined) {
        __TRACK__KeyClickRecord[key] = false;
    }
});
window.addEventListener('click', function (e) {
    for (var key in __TRACK__KeyClickCbMap) {
        if (__TRACK__KeyClickRecord[key] && key !== '__CODE__') {
            __TRACK__KeyClickCbMap[key](e);
        }
    }
});
//# sourceMappingURL=inject-code-template.js.map