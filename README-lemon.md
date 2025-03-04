# README by lemon

## 安装

emm 我现在在用 remote-theme 而且估计也不是很想发布 gem 包，先这样用吧。\
我本身也想很频繁的改动小细节的说

## 布局改动

将导航栏和页脚的宽度调大，并与正文宽度变量脱离关系

## 颜色

主要的改动位置是 auto 模式下的深色模式。\
浅色模式的主要颜色更改并不在计划中

深色模式下的代码高亮参考 VSCode 的现代深色进行了调整，但还是有很多地方不太一样就是了

## 修改时间的显示

该分叉~~放弃了~~ `page.mdate` 作为修改时间的显示方式，而是希望使用 `gjtorikian/jekyll-last-modified-at` 作为修改时间的获取方式。\
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

用于判断是否显示最后修改日期，如果为 true 则使用 [gjtorikian/jekyll-last-modified-at](https://github.com/gjtorikian/jekyll-last-modified-at) 获取时间

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

### page.show_tags

> 已弃用\
> 在合并到 minima v3 的期间内，标签功能已被改进为自动识别的形式\
> 解决方式放到了这里：<https://stackoverflow.com/a/79483199/25416550>

开启标签展示。\
不是我不想自动一点，但 `{%- if page.tags != '' -%}` 和 `{%- if page.tags -%}` 都用不了啊（烦）
