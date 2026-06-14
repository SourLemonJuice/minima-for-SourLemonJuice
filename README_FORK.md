# README of this fork

## 安装

emm 我现在在用 remote-theme 而且估计也不是很想发布 gem 包，先这样用吧。\
我本身也想很频繁的改动小细节的说

## 布局改动

将导航栏和页脚的宽度调大，并与正文宽度变量脱离关系

### 固定头部（fixed header）

`.site-header` 与其上方的装饰条 `.header-bar` 现在使用 `position: fixed`，固定吸附在视口顶部，正文在其下方滚动。\
因为头部已脱离滚动流，它不会再受到滚动到边缘时的橡皮筋回弹（rubber-band overscroll）效果，而文档本身仍保留这个回弹。

布局上的几个约定：

- `.header-bar` 固定在 `top: 0`（高 4px），`.site-header` 固定在其下方的 `top: 4px`。
- `.site-header` 的高度被固定为 `56px`。
- `.page-content` 增加了与头部高度耦合的顶部内边距：`4px`（装饰条）+ `56px`（头部）+ `1px`（头部下边框）= `61px`，再加上原有的 `$spacing-unit`，以避免首屏内容被固定头部遮挡。

注意：`.site-header` 的高度和 `.page-content` 的顶部内边距是手动耦合的（硬编码的 `61px`）。如果调整头部高度，这两处需要同步修改，相关位置都写了注释提示。

> Collaborate with Claude Code

### 侧边目录（sticky table of contents）

`post` 布局现在会在正文左侧的空白处显示一个吸附（`position: sticky`）的目录，随页面滚动停留在视口内，并在文章末尾随文章一起停下（不会盖住页脚）。

实现要点：

- 目录由 `_includes/post-toc.html` 提供：一段标记加一段内联脚本。脚本在页面加载后扫描 `.post-content` 内的 `h2`、`h3`、`h4` 标题，按文档顺序生成链接列表。
- 标题的锚点 id 依赖 kramdown 默认的 `auto_ids`；脚本对极少数没有 id 的标题做了 slug 兜底（兼容中文）。
- **少于 2 个标题时不显示目录**（短文不值得目录）。标记默认带 `hidden`，由脚本在确认有足够标题后才显示。
- 滚动高亮（scroll-spy）：用 `IntersectionObserver` 给当前阅读到的标题对应的链接加上 `.is-active`。
- 锚点跳转通过 CSS `scroll-behavior: smooth` 平滑滚动，并给正文标题加了 `scroll-margin-top` 以避开固定头部（同样耦合那个 `61px`）。

布局上的约定（见 `_sass/minima/_layout.scss` 中 “Sticky table of contents” 一节）：

- 宽屏下，`post` 的 `.wrapper` 变为对称的三列网格（`1fr | $content-width | 1fr`）：正文留在居中的中间列，目录作为真正在文档流中的网格项放进左列——这正是 `position: sticky` 能生效的前提（吸附范围被正文高度限制，所以不会盖住页脚）。
- 目录宽 `$toc-width`（250px），与正文之间留 `$toc-gap`（24px）。
- 网格由 `.wrapper:has(> .post-toc:not([hidden]))` 限定，因此非帖子页面、以及脚本尚未构建好的目录都不受影响。
- 断点 `$toc-breakpoint` 由 `$content-width` 推导而来：只有当两侧留白足够容纳目录时才启用网格，否则关闭网格、正文恢复居中全宽。因此窄屏（包括移动端）不会显示目录。
- 目录的 `top` 同样耦合固定头部的 `61px`。

样式（参考 Figma 草图重构）：

- 顶部有 “In this page” 标题（衬线字体、20px、上下 18px 外边距、正文色 `$text-color`）；其下列标题项，条目用衬线字体 `$serif-font-family`（Roboto Slab）、`$small-font-size`（14px）。
- 所有条目用链接色 `$link-base-color`；条目文字左对齐、可换行（不再单行截断省略）。
- 每条 `padding: 8px 0 8px 16px`；`h3`/`h4` 子标题在此基础上再加左缩进（30px / 44px）保留层级。
- 每条都有 2px 左边框：未激活项为灰色 `$border-color-03`，当前阅读项（`.is-active`）换成链接色并加粗。

每篇帖子可在 front matter 中用 `toc: false` 关闭目录（默认开启）。

> Collaborate with Claude Code

## 颜色

主要的改动位置是 auto 模式下的深色模式。\
浅色模式的主要颜色更改并不在计划中

深色模式下的代码高亮参考 VSCode 的现代深色进行了调整，但还是有很多地方不太一样就是了

## 修改时间的显示

该分叉~~放弃了~~ `page.mdate` 作为修改时间的显示方式，而是希望使用 [gjtorikian/jekyll-last-modified-at](https://github.com/gjtorikian/jekyll-last-modified-at) 作为修改时间的获取方式。\
但由于 liquid 糟糕的语法，这不是自动的，每个被修改的帖子都需要配置 `page.has_modified` 为 `true` 才会在各个地方显示最后修改时间

> 更新：\
> 新的配置格式将尊重 `page.mdade` 的意愿以获取时间，但 `page.has_modify` 的优先级仍然更高。\
> 如果配置了 `mdate: file` 则行为与 `page.has_modify: true` 一致

包括 home 布局中的帖子列表上和 post 布局中的元信息里

## 页面 meta 标签设定

在以前的版本中，noindex 标签的设定是通过名为 `noindex: true` 的变量配置的。\
这将在页面的 head 中添加这样的内容，并且在 `post` 布局的元信息部分添加一行 `Note: robot blocking tags enabled` 的提示：

```html
<meta name="robots" content="noindex">
```

但这不可扩展，不能设为 `none` 也不能设为 `noindex, nofollow`。\
现在，在保留原有变量的兼容性的情况下，新的 `meta_tags` 变量将允许配置任意 meta 标签为任意内容，比如：

```yaml
meta_tags:
  - name: "robots"
    content: "noindex, nofollow"
  - name: "just-test"
    content: "foo"
```

这将生成：

```html
<meta name="robots" content="noindex, nofollow">
<meta name="just-test" content="foo">
```

不过这种写法不会触发 `post` 布局中特殊的提示标语

`robots: <content>` 配置将触发提示标语，并且可以固定的将 robots 标签写入自定义的 content。比如：

```yaml
robots: none
```

## 新增变量

### page.has_modified

bool

见上文 [#修改时间的显示](#修改时间的显示)

### page.toc

bool

默认开启。在 `post` 布局中将其设为 `false` 可关闭该帖子左侧的侧边目录。\
见上文 [#侧边目录（sticky table of contents）](#侧边目录sticky-table-of-contents)

### site.minima.date_format_no_hour

Liquid 时间格式

用于显示没有小时信息的时间。\
例如帖子的发布元信息很有可能是没有小时的（就是那个写在文件名里的 2000-01-01-xxx）

### site.minima.contacts

这是一个列表，与 `social_links` 类似，但用于扩充用户联系信息下的链接（与邮箱的位置同级）。\
每个键值的 `.url` 表明了要跳转到的目标，而 `.text` 则为超链接的显示文本。例如：

```yml
minima:
  contacts:
   -
    url: "https://example.com/"
    text: "example.com"
```

我有在想要不要加个配置在超链接前显示些文本，但还是算了吧，对于这种情况还是有点复杂了

### site.minima.rainbow_header

bool

头部装饰条现在是一个独立的 `.header-bar` 元素，渲染在 `.site-header` 之上（`.site-header` 自身已不再有 `border-top`）。\
`.header-bar` 默认显示一条灰色的条带。当 `site.minima.rainbow_header` 设为 `true` 时，会给该元素附加 `rainbow` 类（即 `.header-bar.rainbow`），将灰色条带替换为彩虹旗（🏳️‍🌈）渐变：

```yml
minima:
  rainbow_header: true
```

> Collaborate with Claude Code

### page.show_tags

> 已弃用\
> 在合并到 minima v3 的期间内，标签功能已被改进为自动识别的形式\
> 解决方式放到了这里：<https://stackoverflow.com/a/79483199/25416550>

开启标签展示。\
不是我不想自动一点，但 `{%- if page.tags != '' -%}` 和 `{%- if page.tags -%}` 都用不了啊（烦）

## 自定义覆盖文件

### custom-head.html

用于在 `<head>` 标签中添加更多自定义信息，比如 analytics 脚本或者特定的 metadata

### custom-footer.html

在 social_link 之上，个人介绍之下显示一些信息。我会用来写一些 "powered by" 和版权信息
