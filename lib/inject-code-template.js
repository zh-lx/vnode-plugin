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
window.addEventListener('mouseover', function (e) {
    var nodePath = e.path;
    var targetNode;
    // 寻找第一个由_vc-path属性的元素
    for (var i = 0; i < nodePath.length; i++) {
        var node = nodePath[i];
        if (node.hasAttribute && node.hasAttribute('_vc-path')) {
            targetNode = node;
            break;
        }
    }
    if (targetNode) {
        // 检查子元素是否已插入_vc-cover，防止重复插入
        var children = targetNode.children;
        if (children.length) {
            var lastChild = children[children.length - 1];
            if (lastChild.className === '_vc-cover') {
                return;
            }
        }
        var cover = document.createElement('div');
        cover.setAttribute('class', '_vc-cover');
        targetNode.appendChild(cover);
    }
});
//# sourceMappingURL=inject-code-template.js.map