const __TRACK__KeyClickCbMap = {
  v: trackCode,
  __CODE__: '__CODE__CB__', // 占位符，用于替换用户自定义事件
};

const __TRACK__KeyClickRecord = {
  v: false,
  __CODE__: '__CODE__RECORD__', // 占位符
};

function trackCode(e) {
  const file = e.target.getAttribute('__FILE__');
  const line = e.target.getAttribute('__LINE__');
  const column = e.target.getAttribute('__COLUMN__');
  const url = `http://localhost:__PORT__/?file=${file}&line=${line}&column=${column}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
}

// 记录键盘下压
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (__TRACK__KeyClickRecord[key] !== undefined) {
    __TRACK__KeyClickRecord[key] = true;
  }
});

// 记录键盘抬起
window.addEventListener('keyup', (e) => {
  const key = e.key;
  if (__TRACK__KeyClickRecord[key] !== undefined) {
    __TRACK__KeyClickRecord[key] = false;
  }
});

window.addEventListener('click', (e) => {
  for (let key in __TRACK__KeyClickCbMap) {
    if (__TRACK__KeyClickRecord[key] && key !== '__CODE__') {
      __TRACK__KeyClickCbMap[key](e);
    }
  }
});

window.addEventListener('mouseover', (e) => {
  const nodePath = (e as any).path;
  let targetNode;
  // 寻找第一个由_vc-path属性的元素
  for (let i = 0; i < nodePath.length; i++) {
    const node = nodePath[i];
    if (node.hasAttribute && node.hasAttribute('_vc-path')) {
      targetNode = node;
      break;
    }
  }
  if (targetNode) {
    // 检查子元素是否已插入_vc-cover，防止重复插入
    const children = targetNode.children;
    if (children.length) {
      const lastChild = children[children.length - 1];
      if (lastChild.className === '_vc-cover') {
        return;
      }
    }
    const cover = document.createElement('div');
    cover.setAttribute('class', '_vc-cover');
    targetNode.appendChild(cover);
  }
});
