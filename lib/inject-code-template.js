var __TRACK__KeyClickCbMap = {
    v: __trackCode,
    __CODE__: '__CODE__CB__',
};
var __TRACK__KeyClickRecord = {
    v: false,
    __CODE__: '__CODE__RECORD__',
};
var __KEY__DOWN__ = false;
// 设置遮罩层
function __setCover(targetNode) {
    var coverDom = document.querySelector('#__COVER__');
    var targetLocation = targetNode.getBoundingClientRect();
    var browserHeight = document.documentElement.clientHeight; // 浏览器高度
    var browserWidth = document.documentElement.clientWidth; // 浏览器宽度
    coverDom.style.top = targetLocation.top + "px";
    coverDom.style.left = targetLocation.left + "px";
    coverDom.style.width = targetLocation.width + "px";
    coverDom.style.height = targetLocation.height + "px";
    var bottom = browserHeight - targetLocation.top - targetLocation.height; // 距浏览器视口底部距离
    var right = browserWidth - targetLocation.left - targetLocation.width; // 距浏览器右边距离
    var file = targetNode.getAttribute('__FILE__');
    var node = targetNode.getAttribute('__NODE__');
    coverDom.onclick = function () {
        for (var key in __TRACK__KeyClickCbMap) {
            if (__TRACK__KeyClickRecord[key] && key !== '__CODE__') {
                __TRACK__KeyClickCbMap[key](targetNode);
            }
        }
    };
    var coverInfoDom = document.querySelector('#__COVERINFO__');
    var classInfoVertical = targetLocation.top > bottom
        ? targetLocation.top < 100
            ? '_vc-top-inner-info'
            : '_vc-top-info'
        : bottom < 100
            ? '_vc-bottom-inner-info'
            : '_vc-bottom-info';
    var classInfoHorizon = targetLocation.left >= right ? '_vc-left-info' : '_vc-right-info';
    var classList = targetNode.classList;
    var classListSpans = '';
    classList.forEach(function (item) {
        classListSpans += "<span class=\"_vc-node-class-name\">." + item + "</span>";
    });
    coverInfoDom.className = "_vc-cover-info " + classInfoHorizon + " " + classInfoVertical;
    coverInfoDom.innerHTML = "<div><span class=\"_vc-node-name\">" + node + "</span>" + classListSpans + "<div/><div>" + file + "</div>";
}
// 清楚遮罩层
function __resetCover() {
    var coverDom = document.querySelector('#__COVER__');
    coverDom.onclick = function () { };
    coverDom.style.top = '0';
    coverDom.style.left = '0';
    coverDom.style.width = '0';
    coverDom.style.height = '0';
    var coverInfoDom = document.querySelector('#__COVERINFO__');
    coverInfoDom.innerHTML = '';
    coverInfoDom.className = '';
}
// 显示遮罩层的定时器
var __coverTimeout = null;
function __trackCode(targetNode) {
    var file = targetNode.getAttribute('__FILE__');
    var line = targetNode.getAttribute('__LINE__');
    var column = targetNode.getAttribute('__COLUMN__');
    var url = "http://localhost:__PORT__/?file=" + file + "&line=" + line + "&column=" + column;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
}
// 记录键盘下压
window.addEventListener('keydown', function (e) {
    var key = e.key;
    if (__TRACK__KeyClickRecord[key] === false) {
        __TRACK__KeyClickRecord[key] = true;
        __KEY__DOWN__ = true;
    }
});
// 记录键盘抬起
window.addEventListener('keyup', function (e) {
    var key = e.key;
    if (__TRACK__KeyClickRecord[key] !== undefined) {
        __TRACK__KeyClickRecord[key] = false;
        __KEY__DOWN__ = false;
        __resetCover();
    }
});
window.addEventListener('mousemove', function (e) {
    if (__KEY__DOWN__) {
        var nodePath = e.path;
        var targetNode_1;
        // 清除上一个定时器
        __resetCover();
        if (__coverTimeout) {
            clearTimeout(__coverTimeout);
        }
        // 寻找第一个有_vc-path属性的元素
        for (var i = 0; i < nodePath.length; i++) {
            var node = nodePath[i];
            if (node.hasAttribute && node.hasAttribute('__FILE__')) {
                targetNode_1 = node;
                break;
            }
        }
        if (targetNode_1) {
            // 设置新定时器
            __coverTimeout = setTimeout(function () {
                __setCover(targetNode_1);
            }, 100);
        }
    }
});
//# sourceMappingURL=inject-code-template.js.map