# Greasy Fork Scripts

日常使用的油猴脚本

## Library

- [Quick Menu](./packages/quick-menu/README.md)：快速创建菜单库，支持在 iframe 内创建菜单

## User Script

- [Monkey Debugger](./packages/monkey-debugger/README.md)：使用 Monkey Patch 的便捷调试脚本，具有以下能力：
  - 在 `new Function` 运行前注入自定义代码，默认是 `debugger;`
  - 在 `new Function` 运行前去除 `debugger` 逻辑（反反调试）
  - 在 `eval` 运行前注入自定义代码，默认是 `debugger;`
  - 在 `eval` 运行前去除 `debugger` 逻辑（反反调试）
  - 移除 [console-ban](https://github.com/fz6m/console-ban) 在谷歌高版本浏览器内的限制（反反调试）
