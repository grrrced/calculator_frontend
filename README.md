# CalcFlow Calculator Frontend

第一次作业的独立前端仓库。对应[老师发布的作业要求](https://bbs.csdn.net/topics/620530837)。

配套项目：[后端仓库](https://github.com/grrrced/calculator_backend)。

前端使用 HTML、CSS 和原生 JavaScript，负责输入、按钮交互、结果与历史展示。计算通过 HTTP/JSON 请求交给独立后端；前端没有数据库，也不直接连接 SQLite。历史记录由后端写入和查询。

## 本地运行

环境：Python 3.9+、现代浏览器。Python 仅用于提供静态文件服务，不需要安装第三方包。

下载或克隆本仓库后，在**本仓库根目录**（可以看到 `index.html`、`server.py` 的目录）执行：

```bash
python3 server.py
```

打开 <http://127.0.0.1:5500/>。另一个终端应已在独立后端仓库根目录运行 `python3 server.py`，后端默认监听 `http://127.0.0.1:8000`。终端进程需要保持运行，按 `Ctrl+C` 停止。

## 配置后端地址

默认 API 地址是 `http://127.0.0.1:8000/api`，适用于前后端均运行在当前电脑的情况。换用另一台设备、局域网服务器或线上后端时，在 `index.html` 底部、加载 `app.js` 之前加入配置：

```html
<script>
  window.CALCULATOR_API_BASE = 'http://127.0.0.1:8000/api';
</script>
<script src="app.js"></script>
```

把示例中的本机地址替换为**浏览器能够访问的实际后端地址**，保留 `/api`，末尾不加 `/`。上面的 `app.js` 标签应替换原有标签，避免重复加载。

- 局域网访问时，使用后端电脑的局域网 IP 和端口。`127.0.0.1` 始终指向打开浏览器的设备。
- 线上 HTTPS 前端应连接 HTTPS 后端，避免浏览器拦截混合内容请求。
- 当前后端已支持跨来源请求（CORS），前后端可以使用不同主机或端口。
- 静态托管可直接发布 `index.html`、`styles.css` 和 `app.js`；不需要在线运行本仓库的 Python 服务。后端仍需单独部署。

若需让同一局域网的设备打开前端，在 macOS/Linux 运行：

```bash
FRONTEND_HOST=0.0.0.0 FRONTEND_PORT=5500 python3 server.py
```

其他设备通过本机局域网 IP 的 `5500` 端口访问；同时按上文配置后端地址。`0.0.0.0` 是监听配置，不是给浏览器填写的服务器地址。

## 功能与接口

- 输入四则运算、括号、小数及一元正负号，点击 `=` 或按 Enter 提交。
- 显示后端返回的结果、非法表达式和除零错误。
- 通过 `GET /api/history` 读取历史，搜索当前已加载的历史记录。
- 通过 `DELETE /api/history/{id}` 删除一条记录，或 `DELETE /api/history` 清空全部记录。
- 支持深色主题和键盘操作；页面显示后端连接状态。

计算请求示例：`POST /api/calculate`，JSON 请求体为 `{"expression":"(1+2)*3"}`。完整接口说明见独立后端仓库 README。

## 目录

```text
.
├── .gitignore
├── README.md
├── codestyle.md      # 代码规范
├── index.html        # 页面结构
├── styles.css        # 响应式界面样式
├── app.js            # HTTP 请求、交互和视图状态
└── server.py         # 本地静态文件服务器
```

## 联调检查

启动前后端后，页面应显示“后端已连接”。输入 `(1+2)*3` 应显示 `9`，刷新页面后历史记录应仍可读取；输入 `1/0` 应显示错误提示。若提示后端不可用，检查后端是否运行、API 地址是否正确以及浏览器控制台的请求错误。
