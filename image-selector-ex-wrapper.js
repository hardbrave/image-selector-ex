(function ($) {
    var sanitized_options = function(opts) {
        var default_options = {
            selected_callback: void 0
        };
        return $.extend({}, default_options, opts);
    };

    $.fn.extend({
        imageSelectorWrapper: function(opts) {
            if (opts == null) {
                opts = {};
            }
            opts = sanitized_options(opts);

            return this.each(function() {
                var self = this;
                
                var selector_type = 'image_' + $(self).attr('id');
                
                var upload_form_sel = '#' + selector_type + '_upload_form';
                var upload_file_sel = '#' + selector_type + '_upload_file';
                var url_sel = '#' + selector_type + '_url';
                var desc_sel = '#' + selector_type + '_descr';
                
                $(this).imageSelectorEx({
                    type: selector_type,
                    selected_callback: function (value) {
                        opts.selected_callback.call(self, value);
                    },
                    initialized_callback : function () {
                        /* 初始化图片上传控件 */
                        $(upload_file_sel).fileinput({
                            'showUpload': false,
                            'language': 'zh',
                            'allowedFileTypes': ['image'],
                            'allowedFileExtensions': ['jpg', 'png', 'gif']
                        });
                    },
                    upload_image: function () {
                        return (
                            $.ajax({
                                type: 'POST',
                                url: '/api/admin/image/upload_image/article',
                                data: new FormData($(upload_form_sel)[0]),
                                processData: false,  // 告诉jQuery不要去处理发送的数据
                                contentType: false   // 告诉jQuery不要去设置Content-Type请求头
                            }).then(function (data) {
                                $(upload_file_sel).fileinput('reset');
                                $(url_sel).val('');
                                $(desc_sel).val('');
                                return data;
                            }).done(function (data) {
                                var obj = JSON.parse(data);
                                if (obj['error_code'] != 0) {
                                    alert('上传失败');
                                } else {
                                    alert('上传成功');
                                }
                            })
                        );
                        
                    },
                    get_image_total_number: function () {
                        return (
                            $.ajax({
                                type: 'GET',
                                url: '/api/admin/image/get_image_count/article'
                            }).then(function (data) {
                                var obj = JSON.parse(data);
                                return obj.count;
                            })
                        );
                    },
                    get_image_list: function (offset, limit) {
                        return (
                            $.ajax({
                                type: 'POST',
                                url: '/api/admin/image/get_image_list/article',
                                data: {
                                    offset: offset,
                                    limit: limit,
                                    order: ["id DESC"]
                                }
                            }).then(function(data) {
                                var obj = JSON.parse(data);
                                var array = [];
                                $.each(obj.image_list, function (idx, item) {
                                    var small_img_src = '/uploads/images/article' + '/' + item.path + '100px/' + item.file_name;
                                    var big_img_src = '/uploads/images/article' + '/' + item.path + '400px/' + item.file_name;
                                    var value = {id: item.id, url: big_img_src, file_name: item.file_name};
                                    array.push({
                                        imgSrc: small_img_src,
                                        val: JSON.stringify(value),
                                        label: item.id
                                    })

                                });
                                return array;
                            })
                        );
                    }
                });
            });
        },

        showImageSelectorDialog: function () {
            $(this).showSelectorDialogEx();
        }
    });

})(jQuery);