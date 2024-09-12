# README by lemon

## 安装

emm 我现在在用 remote-theme 而且估计也不是很想发布 gem 包，先这样用吧。\
我本身也想很频繁的改动小细节的说

## 布局改动

将导航栏和页脚的宽度调大，并与正文宽度变量脱离关系

## 颜色

主要的改动位置是 auto 模式下的深色模式。\
应该会改改主要颜色和代码高亮颜色，浅色模式的主要颜色更改并不在计划中

## 修改时间的显示

该分叉放弃了 `page.mdate` 作为修改时间的显示方式，而是希望使用 `gjtorikian/jekyll-last-modified-at` 作为修改时间的获取方式。\
但由于 liquid 糟糕的语法，这不是自动的，每个被修改的帖子都需要配置 `page.has_modified` 为 `true` 才会在各个地方显示最后修改时间

包括 home 布局中的帖子列表上和 post 布局中的元信息里

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

开启标签展示。\
不是我不想自动一点，但 `{%- if page.tags != '' -%}` 和 `{%- if page.tags-%}` 都用不了啊（烦）
