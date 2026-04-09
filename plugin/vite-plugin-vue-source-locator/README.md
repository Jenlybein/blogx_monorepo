# `@blogx/vite-plugin-vue-source-locator`

一个专门面向 `Vite + Vue` 开发环境的源码定位插件。

它的目标很简单：

- 在页面里直接点元素
- 快速知道它来自哪个 `.vue`
- 复制源码路径
- 打开编辑器跳到对应位置

这个插件特别适合：

- 原型项目
- 运营后台
- 内容站点
- 使用了较多 UI 组件库、需要快速反查页面结构来源的项目

## 功能概览

当前已经支持：

- 开发环境下为 `.vue` 模板节点注入源码位置信息
- `Alt + Click` 复制 `文件路径:行:列`
- 点击后自动调用本地编辑器打开源码位置
- 鼠标位置弹出渐隐提示
- 按住触发键时高亮当前可定位元素范围
- `Alt + 滚轮`
- `Alt + 方向键`

以上两种方式都可以在最近几层可定位祖先之间切换。

这对下面这种场景很好用：

- 你点到了 `NCard` 内部 DOM
- 但真正想打开的是外层业务容器
- 可以先切到外层再点

## 适用范围

这个插件目前是：

- `Vite` 插件
- `Vue SFC` 专用
- 仅开发环境生效

支持：

- `Vue 3 + Vite`

不支持或未专门适配：

- React
- Svelte
- Solid
- Vue `pug` 模板

## 工作原理

插件主要做了两件事：

1. 在 `vite serve` 时处理 `.vue` 文件  
给模板里的原生节点注入：

- `data-vsl-file`
- `data-vsl-line`
- `data-vsl-column`

2. 在浏览器端监听快捷操作  
当你按住触发键点击页面时：

- 找到最近的可定位节点
- 复制路径到剪贴板
- 请求本地 dev server
- 由 dev server 调用编辑器打开源码

## 安装

### 在当前 monorepo 中使用

```bash
pnpm add -D @blogx/vite-plugin-vue-source-locator --filter <你的项目名>
```

### 在普通项目中使用

如果之后你把它发布到私有 npm 仓库：

```bash
pnpm add -D @blogx/vite-plugin-vue-source-locator
```

## 基础接入

在 `vite.config.ts` 中：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueSourceLocator from "@blogx/vite-plugin-vue-source-locator";

export default defineConfig({
  plugins: [
    vueSourceLocator({
      triggerKey: "alt",
      launchEditor: "code",
    }),
    vue(),
  ],
});
```

## 推荐接入示例

更贴近真实项目的配置通常会是这样：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueSourceLocator from "@blogx/vite-plugin-vue-source-locator";

export default defineConfig({
  plugins: [
    vueSourceLocator({
      triggerKey: "alt",
      launchEditor: "code",
      overlay: false,
      pathMode: "relative",
    }),
    vue(),
  ],
});
```

## 怎么使用

### 1. 启动开发环境

```bash
pnpm dev
```

### 2. 打开页面

### 3. 按住触发键

默认是：

- `Alt`

此时会高亮当前鼠标下最近的可定位元素。

### 4. 点击元素

点击后会发生三件事：

- 复制源码路径到剪贴板
- 在鼠标位置弹出“已复制元素路径”
- 打开编辑器跳到对应文件行列

### 5. 如果点到了第三方组件内部 DOM

可以先切层级：

- `Alt + 滚轮`
- `Alt + 方向键`

这样能在最近几层可定位祖先之间来回切换。

## 复制结果示例

### `pathMode: "absolute"`

```text
E:/project/blogx_monorepo/prototype/web/src/views/public/HomeView.vue:86:13
```

### `pathMode: "relative"`

```text
src/views/public/HomeView.vue:86:13
```

## 配置项

### `triggerKey`

触发键，支持：

- `"alt"`
- `"shift"`
- `"meta"`
- `"ctrl"`

示例：

```ts
vueSourceLocator({
  triggerKey: "shift",
});
```

### `launchEditor`

要调用的编辑器命令，默认是 `code`。

常见例子：

```ts
vueSourceLocator({
  launchEditor: "code",
});

vueSourceLocator({
  launchEditor: "cursor",
});
```

当前内置适配较好的命令有：

- `code`
- `code-insiders`
- `cursor`
- `codium`
- `windsurf`
- `webstorm`
- `idea`

### `overlay`

是否显示右下角提示条，默认 `true`。

如果你不想在页面右下角看到“源码定位已启用”：

```ts
vueSourceLocator({
  overlay: false,
});
```

### `pathMode`

控制注入到 `data-vsl-file` 中的路径格式。

支持：

- `"absolute"`：默认
- `"relative"`：相对于当前 Vite 项目根目录

示例：

```ts
vueSourceLocator({
  pathMode: "relative",
});
```

开启后：

- DOM 中的路径更短
- 复制到剪贴板的内容也更短
- 服务端仍会按项目根目录还原成绝对路径再打开文件

### `allowRoots`

默认只能打开当前 Vite 项目根目录下的文件。

如果你是 monorepo，组件可能来自项目外层目录，比如 `packages/ui`，可以手动加白名单：

```ts
import path from "node:path";

vueSourceLocator({
  allowRoots: [
    path.resolve(__dirname, "../../packages"),
  ],
});
```

### `attributePrefix`

控制注入属性前缀，默认是 `data-vsl`。

默认注入结果：

- `data-vsl-file`
- `data-vsl-line`
- `data-vsl-column`

如果你想换前缀：

```ts
vueSourceLocator({
  attributePrefix: "data-source-locator",
});
```

### `endpoint`

控制浏览器向 dev server 请求的接口路径。

默认：

```text
/__vue-source-locator__/open-in-editor
```

通常不需要改，除非你和其他开发工具的中间件冲突。

## 常见问题

### 1. 为什么有时候只能定位到外层组件，不能精确到我点的那个节点？

这是正常现象。

因为你点到的可能是第三方组件库内部渲染出来的 DOM，比如：

- `NCard`
- `NButton`
- `NInput`

这些内部节点不是你模板里直接写的原生标签，所以插件只能回退到最近的可定位祖先。

这时建议：

- 使用 `Alt + 滚轮`
- 或 `Alt + 方向键`

先切到你真正想要的那一层再点击。

### 2. 为什么 Vue DevTools 能看到组件路径，而这里还要注入 `data-*`？

因为两者目标不一样。

Vue DevTools 主要拿的是组件级信息，比如 `Component.__file`。  
这个插件要做的是“尽量定位到模板里的具体节点行列”，所以需要额外注入模板坐标。

### 3. 为什么生产环境里看不到这些属性？

因为插件只在开发环境生效。

源码里用了：

- `apply: "serve"`

所以它不会参与生产构建。

### 4. 为什么点击后没有打开编辑器？

优先检查：

1. 你的编辑器命令是否能在终端直接执行
2. `launchEditor` 是否配置正确
3. 文件路径是否在允许的根目录里

比如先在终端手动试：

```bash
code -r -g src/App.vue:1:1
```

如果你用的是 Cursor：

```ts
vueSourceLocator({
  launchEditor: "cursor",
});
```

## 当前项目中的集成示例

这个仓库里已经集成到了：

- [prototype/web/vite.config.ts](/E:/project/blogx_monorepo/prototype/web/vite.config.ts)
- [prototype/admin/vite.config.ts](/E:/project/blogx_monorepo/prototype/admin/vite.config.ts)

你可以直接参考这两个例子。

## 本仓库内构建

```bash
pnpm --filter @blogx/vite-plugin-vue-source-locator build
```

## 开发建议

如果你后面还想继续增强，比较值得做的方向有：

- 高亮框角上显示当前层级 `2/4`
- 高亮时显示当前命中文件名
- 支持更多编辑器命令
- 拆成核心层 + Vue 适配层，方便以后扩展到 React JSX 注入方案
