# QuickMenu

油猴菜单库，支持开关菜单，支持状态保持，支持 Iframe

## API 定义

### QuickMenu.add

| Key           | 类型                                         | 必填 | 参数描述                                                                                         |
| ------------- | -------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------ |
| name          | string                                       | 是   | 菜单名称                                                                                         |
| type          | 'button' 或 'toggle'                         | 否   | 菜单类型，`toggle` 会额外展示当前菜单状态                                                        |
| shouldInitRun | boolean 或 () => boolean                     | 否   | 注册菜单后是否要立即执行回调，默认为 `false`                                                     |
| shouldAddMenu | boolean 或 () => boolean                     | 否   | 当前环境是否注册菜单，默认为 `true`                                                              |
| callback      | (value: undefined 或 'on' 或 'off' ) => void | 是   | 初始化执行和点击菜单的回调函数，如果是 `toggle` 类型的话 value 会返回点击后状态（`on` 或 `off`） |

## 使用示例

```js
QuickMenu.add({
  // 菜单名称
  name: '开启 eval 调试',
  // 菜单类型
  type: 'toggle',
  // 开启初始化执行回调，这样宿主和 Iframe 环境会初始化执行
  shouldInitRun: true,
  // 这里只有最顶层宿主才会注册菜单，点击 toggle 之后也会发送消息给其他环境，同步执行回调
  shouldAddMenu: () => {
    return unsafeWindow === unsafeWindow.top;
  },
  // 执行回调逻辑
  callback: (value) => {
    // 保存原始的 eval 函数
    const originalEval = eval.originalEval ? eval.originalEval : eval;
    eval.originalEval = originalEval;
    if (value === 'on') {
      // 定义一个新的 eval 函数
      const patchedEval = function (code) {
        // 在 eval 的代码前插入 debugger 语句
        const codeWithDebugger = `debugger; ${code}`;
        return originalEval(codeWithDebugger);
      };
      patchedEval.prototype = originalEval.prototype;
      // 替换全局的 eval 函数
      unsafeWindow.eval = patchedEval;
    } else if (value === 'off') {
      unsafeWindow.eval = originalEval;
    }
  },
});
```
