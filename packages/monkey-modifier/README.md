# Monkey Modifier

有时会需要临时更改网页的展示内容，所以本脚本提供了以下示例：

- `document` 开始渲染时直接注入 `style` 样式
- `document DOMContentLoaded` 渲染后操作 `dom`
- 针对异步渲染的代码，使用 `MutationObserver` 进行监听并修改
