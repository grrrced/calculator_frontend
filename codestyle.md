# 前端代码规范

本规范参考 [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) 和 [MDN Web Docs JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)。

- 使用 2 个空格缩进，字符串统一使用单引号。
- 使用 `const`/`let`，禁止 `var`；变量和函数使用 `camelCase`。
- DOM 查询集中在文件顶部，异步网络请求使用 `async`/`await`。
- API 错误必须向用户显示可理解的信息；不要吞掉错误。
- 用户可见文本使用语义 HTML 和 ARIA 属性，按钮必须有明确用途。
- 不在前端实现最终计算结果；计算必须来自后端 API。
- 插值到 HTML 前对历史表达式做转义，避免 XSS。
