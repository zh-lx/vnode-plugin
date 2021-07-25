// 按键+点击时触发的功能映射表
const __TRACK__KeyClickCbMap = {
  v: __trackCode,
  __CODE__: '__CODE__CB__', // 占位识别符，用于替换用户自定义事件
};

// 记录当前是否有按键触发
const __TRACK__KeyClickRecord = {
  v: false,
  __CODE__: '__CODE__RECORD__', // 占位识别符
};

// 当前是否有按键按下
let __KEY__DOWN__ = false;

// 鼠标移到有对应信息组件时，显示遮罩层
function __setCover(targetNode) {
  const coverDom = document.querySelector('#__COVER__') as HTMLElement;
  const targetLocation = targetNode.getBoundingClientRect();
  const browserHeight = document.documentElement.clientHeight; // 浏览器高度
  const browserWidth = document.documentElement.clientWidth; // 浏览器宽度
  coverDom.style.top = `${targetLocation.top}px`;
  coverDom.style.left = `${targetLocation.left}px`;
  coverDom.style.width = `${targetLocation.width}px`;
  coverDom.style.height = `${targetLocation.height}px`;
  const bottom = browserHeight - targetLocation.top - targetLocation.height; // 距浏览器视口底部距离
  const right = browserWidth - targetLocation.left - targetLocation.width; // 距浏览器右边距离
  const file = targetNode.getAttribute('__FILE__');
  const node = targetNode.getAttribute('__NODE__');
  const coverInfoDom = document.querySelector('#__COVERINFO__') as HTMLElement;
  const classInfoVertical =
    targetLocation.top > bottom
      ? targetLocation.top < 100
        ? '_vc-top-inner-info'
        : '_vc-top-info'
      : bottom < 100
      ? '_vc-bottom-inner-info'
      : '_vc-bottom-info';
  const classInfoHorizon =
    targetLocation.left >= right ? '_vc-left-info' : '_vc-right-info';
  const classList = targetNode.classList;
  let classListSpans = '';
  classList.forEach((item) => {
    classListSpans += ` <span class="_vc-node-class-name">\.${item}</span>`;
  });
  coverInfoDom.className = `_vc-cover-info ${classInfoHorizon} ${classInfoVertical}`;
  coverInfoDom.innerHTML = `<div><span class="_vc-node-name">${node}</span>${classListSpans}<div/><div>${file}</div>`;
}

// 键盘抬起时清除遮罩层
function __resetCover() {
  const coverDom = document.querySelector('#__COVER__') as HTMLElement;
  coverDom.style.top = '0';
  coverDom.style.left = '0';
  coverDom.style.width = '0';
  coverDom.style.height = '0';
  const coverInfoDom = document.querySelector('#__COVERINFO__') as HTMLElement;
  coverInfoDom.innerHTML = '';
  coverInfoDom.className = '';
}

function __trackCode(targetNode) {
  const file = targetNode.getAttribute('__FILE__');
  const line = targetNode.getAttribute('__LINE__');
  const column = targetNode.getAttribute('__COLUMN__');
  const url = `http://localhost:__PORT__/?file=${file}&line=${line}&column=${column}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
}

// 记录键盘下压
window.addEventListener('keydown', function (e) {
  const key = e.key;
  if (__TRACK__KeyClickRecord[key] === false) {
    __TRACK__KeyClickRecord[key] = true;
    __KEY__DOWN__ = true;
  }
});

// 记录键盘抬起
window.addEventListener('keyup', function (e) {
  const key = e.key;
  if (__TRACK__KeyClickRecord[key] !== undefined) {
    __TRACK__KeyClickRecord[key] = false;
    __KEY__DOWN__ = false;
    __resetCover();
  }
});

window.addEventListener('mousemove', function (e) {
  if (__KEY__DOWN__) {
    const nodePath = (e as any).path;
    let targetNode;
    // 寻找第一个有_vc-path属性的元素
    for (let i = 0; i < nodePath.length; i++) {
      const node = nodePath[i];
      if (node.hasAttribute && node.hasAttribute('__FILE__')) {
        targetNode = node;
        break;
      }
    }
    if (targetNode) {
      __setCover(targetNode);
    }
  }
});

// 按下对应功能键点击页面时，在捕获阶段
window.addEventListener(
  'click',
  function (e) {
    if (__KEY__DOWN__) {
      const nodePath = (e as any).path;
      let targetNode;
      // 寻找第一个有_vc-path属性的元素
      for (let i = 0; i < nodePath.length; i++) {
        const node = nodePath[i];
        if (node.hasAttribute && node.hasAttribute('__FILE__')) {
          targetNode = node;
          break;
        }
      }
      if (targetNode) {
        e.stopPropagation();
        for (let key in __TRACK__KeyClickCbMap) {
          if (__TRACK__KeyClickRecord[key] && key !== '__CODE__') {
            __TRACK__KeyClickCbMap[key](targetNode);
          }
        }
      }
    }
  },
  true
);
