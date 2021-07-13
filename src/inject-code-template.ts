const __TRACK__KeyClickCbMap = {
  v: __trackCode,
  __CODE__: '__CODE__CB__', // 占位符，用于替换用户自定义事件
};

const __TRACK__KeyClickRecord = {
  v: false,
  __CODE__: '__CODE__RECORD__', // 占位符
};

let __KEY__DOWN__ = false;

// 设置遮罩层
function __setCover(targetNode) {
  const coverDom = document.querySelector('#__COVER__') as HTMLElement;
  const targetLocation = targetNode.getBoundingClientRect();
  coverDom.style.top = `${targetLocation.top}px`;
  coverDom.style.left = `${targetLocation.left}px`;
  coverDom.style.width = `${targetLocation.width}px`;
  coverDom.style.height = `${targetLocation.height}px`;
  const file = targetNode.getAttribute('__FILE__');
  const line = targetNode.getAttribute('__LINE__');
  const column = targetNode.getAttribute('__COLUMN__');
  const node = targetNode.getAttribute('__NODE__');
  coverDom.onclick = function () {
    __trackCode(file, line, column);
  };
  coverDom.innerText = node + '\n\n' + file;
}

// 清楚遮罩层
function __resetCover() {
  const coverDom = document.querySelector('#__COVER__') as HTMLElement;
  coverDom.onclick = function () {};
  coverDom.style.top = '0';
  coverDom.style.left = '0';
  coverDom.style.width = '0';
  coverDom.style.height = '0';
  coverDom.innerText = '';
}

// 显示遮罩层的定时器
let __coverTimeout = null;

function __trackCode(file, line, column) {
  console.log('track');
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
    // 清除上一个定时器
    __resetCover();
    if (__coverTimeout) {
      clearTimeout(__coverTimeout);
    }
    // 寻找第一个有_vc-path属性的元素
    for (let i = 0; i < nodePath.length; i++) {
      const node = nodePath[i];
      if (node.hasAttribute && node.hasAttribute('__FILE__')) {
        targetNode = node;
        break;
      }
    }
    if (targetNode) {
      // 设置新定时器
      __coverTimeout = setTimeout(function () {
        __setCover(targetNode);
      }, 100);
    }
  }
});
