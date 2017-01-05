## Introduction
图片选择器是我们后台管理页面经常会用到的组件，为了便于使用，我将此功能封装成了一个jQuery插件，用法简单，支持模板定制，同时还支持图片上传

## Implementation
此项目其实包含了两个jQuery插件

- imageSelectorEx：定义在image-selector-ex.js文件中，这个是最底层的插件，支持最大程度的可定制化，不要轻易修改
	- type：类型，一个选择框对应一个类型，不同的选择框应使用不同的类型
	- title：选择框标题（默认为‘传说中的图片选择器’）
	- select_tab_title：选择图片标签栏标题（默认为‘选择图片’）
	- upload_tab_title：上传图片标签栏标题（默认为‘上传新图片’）
	- select_btn_title：选择按钮标题（默认为‘选择图片’）
	- upload_btn_title：上传按钮标题（默认为‘上传图片’）
	- cancel_btn_title：取消按钮标题（默认为‘取消’）
	- image_per_number：每页加载多少张缩略图(默认为8张)
	- image_width：缩略图宽度(默认为100px)
	- image_height：缩略图高度(默认为100px)
	- selected_callback：确认选择后的回调函数
	- get_image_total_number：获取缩略图总数量的接口
	- get_image_list：获取缩略图列表的接口
	- upload_image：上传图片的接口
	- selected_callback：确认选择后的回调函数
	- initialized_callback：初始化后的回调函数
- imageSelectorWrapper：定义在image-selector-ex-wrapper.js文件中，这个是对imageSelector插件的上层封装，向外暴露更少的接口以便于使用，用户可随意修改
	- selected_callback：确认选择后的回调函数

在项目中通常使用imageSelectorWrapper插件，而不是用更底层的imageSelectorEx，用户在使用过程中可以参考此插件的实现，并可根据自己项目的实际需求来进行修改。项目中还存在一个模板文件template.html，这是一个jsRender模板文件，用户可以根据需要制作自己的图片选择器模板

在同一个页面中，图片选择框可以有多个，但触发这些图片选择器的控件必须具有唯一的id（每个图片选择器通过触发控件的id与之绑定）

该插件的实现引入了jsRender模板技术，通过jsRender模板技术实现了图片选择对话框的高度可定制化，关于jsRender详细信息可参见[jsRender官方文档](http://www.jsviews.com/)

## Features
- 用法简单，几行代码就能调用
- 支持高度可定制，用户可以通过修改模板文件来自定义自己的图片选择器

## Requirements
- Bootstrap 3.3及以上版本
- jQuery 2.0及以上版本
- [jsRender](http://www.jsviews.com/#home)
- [fileinput](http://github.com/kartik-v/bootstrap-fileinput)
- [pagination](https://github.com/gbirke/jquery_pagination)
- [imagepicker](https://github.com/rvera/image-picker)

## Getting started
HTML代码

```
// 激活图片选择器的控件
<button type="button" class="btn btn-primary" id="choose_title_img">选择图片</button>
...
// 将template.html放到适合的目录，可改成自己喜欢的名字（如image_picker_tpl.html），然后将其引入进来
{?include file='admin/common/image_picker_tpl.html'?}
```
JS调用

```
// 将图片选择器与激活它的控件绑定
$("#choose_title_img").imageSelectorWrapper({
	selected_callback: function (obj) {
		// Your code
   }
});
$("#choose_title_img").click(function() {
      $(this).showImageSelectorDialog();
});
```

## Todo
- 重度依赖第三方插件：除了bootstrap、jQuery以及jsRender外，该插件还依赖第三方插件fileinput、imagepicker以及pagination来实现诸如图片选择以及分页等功能，后续考虑摆脱对这些插件的依赖
- 模板文件和插件存在依赖：修改了模板文件之后，需要同时修改插件代码，后续考虑插件代码与模板文件的解耦


## Demo
#### 选择图片
![image](https://github.com/hardbrave/image-selector-ex/raw/master/snapshot/image-picker-ex-1.png)

#### 上传图片
![image](https://github.com/hardbrave/image-selector-ex/raw/master/snapshot/image-picker-ex-2.png)