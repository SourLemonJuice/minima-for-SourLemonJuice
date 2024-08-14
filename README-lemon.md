# README by lemon

## 布局改动

将导航栏和页脚的宽度调大，并与正文宽度变量脱离关系

## 颜色

主要的改动位置是 auto 模式下的深色模式。\
应该会改改主要颜色和代码高亮颜色，浅色模式的主要颜色更改并不在计划中

## 新增变量

### page.has_modified

bool

用于判断是否显示最后修改日期，如果为 true 则使用 [gjtorikian/jekyll-last-modified-at](https://github.com/gjtorikian/jekyll-last-modified-at) 获取时间

### site.minima.date_format_no_hour

Liquid 时间格式

用于显示没有小时信息的时间。\
例如帖子的发布元信息很有可能是没有小时的（就是那个写在文件名里的 2000-01-01-xxx）
