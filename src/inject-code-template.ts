// 按键+点击时触发的功能映射表
const __TRACK__KeyClickCbMap = {
  track: __trackCode,
  __CODE__: '__CODE__CB__', // 占位识别符，用于替换用户自定义事件
};

// 记录当前是否有按键触发
const __TRACK__KeyClickRecord = {
  track: false,
  __CODE__: '__CODE__RECORD__', // 占位识别符，用于替换用户自定义事件
};

// 当前是否有功能开启
let __FN_ACTIVE__ = false;
// 当前控制器是否在拖拽
let __is__drag = false;
// 当前控制器位置
let __last_control_X = 0;
let __last_control_Y = 0;
let __last_pointer_X = 0;
let __last_pointer_Y = 0;
// 控制器是否被移动了
let __has_control_be_moved = false;

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

// 请求本地服务端，打开vscode
function __trackCode(targetNode) {
  const file = targetNode.getAttribute('__FILE__');
  const line = targetNode.getAttribute('__LINE__');
  const column = targetNode.getAttribute('__COLUMN__');
  const url = `http://localhost:__PORT__/?file=${file}&line=${line}&column=${column}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
}

// 功能开关
function __clickControl(e) {
  let dom = e.target as HTMLElement;
  if (dom.id === '_vc-control-suspension') {
    if (__TRACK__KeyClickRecord['track']) {
      __TRACK__KeyClickRecord['track'] = false;
      __FN_ACTIVE__ = false;
      dom.style.backgroundColor = 'gray';
    } else {
      __TRACK__KeyClickRecord['track'] = true;
      __FN_ACTIVE__ = true;
      dom.style.backgroundColor = 'lightgreen';
    }
    return false;
  }
  return true;
}

// 鼠标移动时
window.addEventListener('mousemove', function (e) {
  if (__FN_ACTIVE__) {
    const nodePath = (e as any).path;
    let targetNode;
    if (nodePath[0].id === '_vc-control-suspension') {
      __resetCover();
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
      __setCover(targetNode);
    }
  }
});

// 按下对应功能键点击页面时，在捕获阶段
window.addEventListener(
  'click',
  function (e) {
    if (__FN_ACTIVE__) {
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

// 监听是否发生拖拽事件
window.addEventListener('mousedown', function (e) {
  e.preventDefault();
  let dom = e.target as HTMLElement;
  if (dom.id === '_vc-control-suspension') {
    __is__drag = true;
    __last_control_X = dom.offsetLeft;
    __last_control_Y = dom.offsetTop;
    __last_pointer_X = e.clientX;
    __last_pointer_Y = e.clientY;
  }
});

// 控制器拖拽过程
window.addEventListener('mousemove', function (e) {
  const control = document.getElementById('_vc-control-suspension');
  if (__is__drag) {
    __has_control_be_moved = true;
    control.style.left =
      __last_control_X + (e.clientX - __last_pointer_X) + 'px';
    control.style.top =
      __last_control_Y + (e.clientY - __last_pointer_Y) + 'px';
  }
});

// 控制器拖拽结束
window.addEventListener('mouseup', function (e) {
  __is__drag = false;
  __last_control_X = 0;
  __last_control_Y = 0;
  __last_pointer_X = 0;
  __last_pointer_Y = 0;
});

const __suspension_control = document.getElementById('_vc-control-suspension');
__suspension_control.addEventListener('click', function (e) {
  if (!__has_control_be_moved) {
    __clickControl(e);
  } else {
    __has_control_be_moved = false;
  }
});
