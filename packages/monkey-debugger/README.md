# Monkey Debugger

由于在工作中会有很多调试 JS 沙箱的场景，写了这个脚本专门用于方便调试 `new Function ` 和 `eval` 里面的代码，有如下能力：

- 在 `new Function` 运行前注入自定义代码，默认是 `debugger;`
- 在 `new Function` 运行前去除 `debugger` 逻辑（反反调试）
- 在 `eval` 运行前注入自定义代码，默认是 `debugger;`
- 在 `eval` 运行前去除 `debugger` 逻辑（反反调试）
- 移除 [console-ban](https://github.com/fz6m/console-ban) 在谷歌高版本浏览器内的限制（反反调试）
