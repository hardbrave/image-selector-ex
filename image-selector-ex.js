(function ($) {
    $.fn.extend({
        imageSelectorEx: function(opts) {
            return this.each(function() {
                $(this).data("modal", new SelectorDialogEx(sanitized_options(opts)));
            });
        },
        
        showSelectorDialogEx: function () {
            $(this).data("modal").show();
        }
    });
    
    var sanitized_options = function(opts) {
        var default_options= {
            type: 'image',
            title: '传说中的图片选择器',
            select_tab_title: '选择图片',
            upload_tab_title: '上传新图片',
            select_btn_title: '选择图片',
            upload_btn_title: '上传图片',
            cancel_btn_title: '取消',
            image_per_number: 8,                // 每页加载多少张缩略图(默认为8张)
            image_width: 100,                   // 缩略图图片宽度(默认为100px)
            image_height: 100,                  // 缩略图高度(默认为100px)
            get_image_total_number: void 0,     // 获取缩略图总数量的接口(必填,$.ajax().then(), value: 图片数量)
            get_image_list: void 0,             // 获取缩略图列表的接口(必填,$.ajax().then(), obj: [{imgSrc: '', val: {}, label: ''}])
            upload_image: void 0,               // 上传图片的接口(必填,$.ajax().then())
            selected_callback: void 0,          // 确认选择后的回调函数
            initialized_callback: void 0        // 初始化后的回调函数
        };
        return $.extend({}, default_options, opts == null ? {} : opts);
    };

    var SelectorDialogEx = (function () {
        function SelectorDialogEx(opts) {
            this.opts = opts;
            this.dialog_sel = '#' + opts.type +'_selector_dlg_ex';
            this.upload_tab_sel = this.dialog_sel + '_upload_tab';
            this.select_tab_sel = this.dialog_sel + '_select_tab';
            this.image_picker_sel = this.dialog_sel + '_image_picker';
            this.pagination_sel = this.dialog_sel + '_pagination';
            this.confirm_sel = this.dialog_sel + '_confirm';
            this.param = opts.param;

            this.create_modal();
            this.initialize();
            
            if (this.opts.initialized_callback) {
                this.opts.initialized_callback();
            }

        }

        SelectorDialogEx.prototype.create_modal = function () {
            var self = this;
            $('body').append(
                $("#image-selecor-dialog-ex-template").render(self.opts)
            );
        };

        SelectorDialogEx.prototype.initialize = function () {
            var self = this;

            /* 监听模态框显示事件,在模态框显示的时候初始化分页类,并加载第一页数据 */
            $(self.dialog_sel).on('show.bs.modal', function() {
                self.initPagination(0, self.opts.image_per_number);
                self.loadImageList(0, self.opts.image_per_number);
            });

            /* 图片选择器选中不同的标签页时,改变对应的按钮状态 */
            $(self.upload_tab_sel).click(function (e) {
                $(self.confirm_sel).html(self.opts.upload_btn_title);
            });
            $(self.select_tab_sel).click(function (e) {
                $(self.confirm_sel).html(self.opts.select_btn_title);
            });

            /* 模态框确定按钮绑定事件 */
            $(self.confirm_sel).click(function() {
                if ($(this).html() == self.opts.select_btn_title) {
                    var val = $(self.image_picker_sel).data("picker").selected_values();
                    var obj = JSON.parse(val);
                    $(self.dialog_sel).modal('hide');
                    if (self.opts.selected_callback) {
                        self.opts.selected_callback(obj, self.param);
                    }
                } else {
                    $(this).html('正在上传').attr('disabled', 'disabled');
                    self.opts.upload_image().done(function () {
                        $(self.confirm_sel).html(self.opts.upload_btn_title).removeAttr('disabled');
                        self.initPagination(0, self.opts.image_per_number);
                        self.loadImageList(0, self.opts.image_per_number);
                    });
                }

            });
        };

        SelectorDialogEx.prototype.initPagination = function (pageIndex, pageSize) {
            var self = this;
            self.opts.get_image_total_number().done(function (count) {
                $(self.pagination_sel).pagination(count, {
                    callback: function (index) {
                        self.loadImageList(index * pageSize, pageSize);
                    },
                    prev_text: "« 上一页",
                    next_text: "下一页 »",
                    items_per_page: pageSize,
                    num_edge_entries: 2,       //两侧首尾分页条目数
                    num_display_entries: 6,    //连续分页主体部分分页条目数
                    current_page: pageIndex    //当前页索引
                });
            });
        };

        SelectorDialogEx.prototype.loadImageList = function (offset, limit) {
            var self = this;
            self.opts.get_image_list(offset, limit).done(function (obj) {
                $(self.image_picker_sel).empty();
                $.each(obj, function (idx, item) {
                    var img_option = $("<option>" + "</option>");
                    img_option.attr('data-img-src', item.imgSrc).val(item.val).html(item.label);
                    $(self.image_picker_sel).append(img_option);

                });
                $(self.image_picker_sel).imagepicker({
                    hide_select: true,
                    show_label: true
                });
                $("img.image_picker_image").height(self.opts.image_height + "px").width("100px");
            });
        };

        SelectorDialogEx.prototype.show = function () {
            $(this.dialog_sel).modal('show');
        };

        SelectorDialogEx.prototype.hide = function () {
            $(this.dialog_sel).modal('hide');
        };

        return SelectorDialogEx;
    })();

})(jQuery);