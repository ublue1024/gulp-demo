function flightDynamicClass() {
    // 文本省略
    function textEllipsisFn(text) {
        if(text.length > 10) {
            var startText = text.substr(0, 4);
            var endText = text.substr(-4, 4);
            var ellipsisText = startText+'……'+endText;
            return ellipsisText;
        }
        else
        {
            return text;
        }
    }

    /*
        日期选择
    */
    function dateSelectFn() {
        var oDate = new Date();
        var year = oDate.getFullYear();
        var month = oDate.getMonth() + 1;
        var date = oDate.getDate();
        var hour = oDate.getHours();
        month = month < 10 ? '0'+month : month;
        date = date < 10 ? '0'+date : date;
        hour = hour < 10 ? '0'+hour : hour;

        // 点击选择
        $('#startTime, #endTime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-CN',
            weekStart: 1,
            autoclose: true,
            todayHighlight: 1,
            startView: 2,
            minView: 1
        });
    }
     Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
    }
    /*
        弹出层
    */
    function layoutFn() {
        // 指令列表
        var instructListHtml = '<table class="zh-table zh-instruct-table"><tr><td width="100"><span class="zh-field-name">查询类型</span></td><td>查询指令</td><td width="150">查询指令</td></tr><tr><td><span class="zh-field-name">激活指令查询框</span></td><td>Enter(回车键) / 点击指令输入框</td><td>--</td></tr><tr><td><span class="zh-field-name">退出指令查询框</span></td><td>ESC键 / 点击非指令输入框区域</td><td>--</td></tr><tr><td><span class="zh-field-name">重置航班列表</span></td><td>Delete(删除键) / 点击重置按钮</td><td>--</td></tr><tr><td><span class="zh-field-name">查询航班</span></td><td>直接输入完整航班号,多个航班请用空格间隔</td><td>MU1234 CA2235 KY774</td></tr><tr><td><span class="zh-field-name">查询状态</span></td><td>输入状态缩写ZT QF(起飞) DD(到达) JH(计划) BJ(备降) FH(返航) QX(取消) HH(滑回) YW(全部延误)YW+30M(延误30分钟以上) YW+1H(延误1小时以上) YW+2H(延误2小时以上) YW+4H(延误4小时以上)</td><td>ZT QX YW+4H</td></tr><tr><td><span class="zh-field-name">查询航司</span></td><td>输入航司缩写HS 多个航司用空格间隔</td><td>HS CA HU DR</td></tr><tr><td><span class="zh-field-name">查询机场</span></td><td>输入机场缩写JC 多个机场用空格间隔</td><td>JC PEK SHA HKG</td></tr><tr><td><span class="zh-field-name">查询航班类型</span></td><td>输入属性缩写LX 多种类型用空格间隔,GJ(国际) GN(国内) DQ(地区)</td><td>LX GJ DQ</td></tr><tr><td><span class="zh-field-name">查询要客航班</span></td><td>输入指令:VIP</td><td>VIP</td></tr><tr><td><span class="zh-field-name">查询机位航班</span></td><td>输入指令:JW,多个机位用空格间隔</td><td>JW 101 102 523R</td></tr><tr><td><span class="zh-field-name">查询区域航班</span></td><td>输入指令:QY,多区域用空格间隔,LQW(廊桥位) JJW(近机位) JHJP(9号机坪) XJP(新机坪) LSJW(临时机位)</td><td>QY LQW JJW</td></tr><tr><td><span class="zh-field-name">查询登机口对应航班</span></td><td>输入指令:DJK,多个登机口编号用空格间隔</td><td>DJK 05 06 08</td></tr><tr><td><span class="zh-field-name">查询行李转盘对应航班</span></td><td>输入指令:XL,多个行李转盘编号用空格间隔</td><td>XL 01 02</td></tr></table>';
        $('#zhInstructList').click(function() {
            layer.open({
                type : 1,
                title : '<strong>指令列表</strong>',
                area : ['900px','500px'],
                content : instructListHtml
            });
        });
        //天气航线信息
        $('body').on('click','.zh-airline',function(){
            var fid = $(this).parent().parent().parent().children('td').eq(0).find('label').children("input").val();
            if(fid.indexOf('_') !== -1){
                fid = $(this).data('fid');
            }
            var msg_layer = layer.msg('正在加载数据中,请稍候...',{time:0});
            $.ajax({
                type:"GET",
                url:GET_WEATHER_URL+'?fid='+fid,
                //async:false,
                success: function(html){
                    layer.close(msg_layer);
                     var flag = 0;
                    try{
                        var data = $.parseJSON(html);
                        flag = 1;
                        show_no_permission();
                    }catch(err){
                        //todo
                        flag = 0;
                    }

                    if(flag === 1)
                    {
                        return false;
                    }
                     layer.open({
                        type : 1,
                        title : '<strong>航线信息</strong>',
                        area : ['900px','482px'],
                        content : html
                    });

                }
            });



        });


        // 接收部门
        function contentOpenableFn() {
            // 默认显示2行
            var lineHgt = parseInt($('.zh-content-openable').css('line-height'));
            var contentHgt = $('.zh-content-openable').height();
            if(contentHgt > lineHgt*2) {
                $('.zh-content-openable').height(lineHgt*2);
                $('.zh-content-openable').after('<div class="zh-more">更多<span class="zh-icon-arrow"></span></div>');
            }
            // 点击更多
            $('body').off('click', '.zh-content-openable+.zh-more');
            $('body').on('click', '.zh-content-openable+.zh-more', function() {
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(this).contents().filter(function() {
                        if(this.nodeType == 3) {
                            this.nodeValue = '更多';
                        }
                    });
                    $(this).prev().height(lineHgt*2);
                } else {
                    $(this).addClass('active');
                    $(this).contents().filter(function() {
                        if(this.nodeType == 3) {
                            this.nodeValue = '收起';
                        }
                    });
                    $(this).prev().height(contentHgt);
                }
            });
        }
        // 消息详情
        $('body').on('click', '.zh-fd-transaction .zh-fd-table tr', function() {

            var info_id = $(this).attr('data');
            var from_department = msg_object[info_id].from.department;
            var truename = msg_object[info_id].from.truename;
            var newDate = new Date();
            newDate.setTime(msg_object[info_id].from.send_time * 1000);
            var send_time = newDate.Format("hhmm");
            var content = msg_object[info_id].content;
            var need_confirm = msg_object[info_id].need_confirm;
            //接收部门
            var to_department_html = '';

            $.each(msg_object[info_id]['to'],function(k,v){
                var to_department_cn = v.to_department_cn;
                if(need_confirm == 1){
                    if(v.confirmed_time > 0){
                        var newDate = new Date();
                        newDate.setTime(v.confirmed_time * 1000);
                        var time_format = newDate.Format("yyyy-MM-dd hh:mm:ss");
                        to_department_html += to_department_cn +'(<small>'+ time_format +'</small>)';
                    }else{
                        to_department_html += to_department_cn + '(<span class="zh-text-red">待确认</span>)';
                    }
                }else{
                    to_department_html += to_department_cn + '<span></span>';
                }

            });
            var newsDetailHtml = '<dl class="zh-news-panel">';
                newsDetailHtml +=  '<dt>消息详情</dt>';
                newsDetailHtml+=  '<dd>';
                newsDetailHtml += '<ul class="zh-list clearfix">';
                newsDetailHtml +=  '<li><span class="zh-field-name">发送部门</span>'+ from_department +'</li>';
                newsDetailHtml +=   '<li><span class="zh-field-name">消息类型</span>事务催办</li>';
                newsDetailHtml +=   '<li><span class="zh-field-name">发送时间</span>'+ send_time +'</li>';
                newsDetailHtml +=    '<li><span class="zh-field-name">发送ID</span>'+ truename +'</li></ul></dd></dl>';
                newsDetailHtml +='  <dl class="zh-news-panel"><dt>消息内容</dt><dd>'+ content +'</dd></dl><dl class="zh-news-panel"><dt>接收部门</dt><dd><div class="zh-content-openable">'+to_department_html;
                newsDetailHtml +='</div></dd></dl>';
            layer.open({
                type : 1,
                title : '<strong>消息详情</strong>',
                area : ['600px','430px'],
                content : newsDetailHtml
            });

            contentOpenableFn();
        });


    //执飞信息
    $('body').on('click','.zh-fd-list .zh-table .zh-plane-number',function(){
         var msg_layer = layer.msg('正在加载数据中,请稍候...',{time: 0});
         var aircraft_num = $.trim($(this).html());
         var aircraft_type=$(this).data('aircraft-type');
         var fly_html = '';
        var f_date = $(this).parents('tr').data('flight-date');
        if(f_date == undefined){
            f_date = $(this).data('flight-date');
        }
            $.ajax({
                type:"GET",
                url:GET_FLY_INFO_URL+'?aircraft_num='+aircraft_num+'&f_date='+f_date,
                //async:false,
                success: function(html){
                    layer.close(msg_layer);
                     var flag = 0;
                    try{
                        var data = $.parseJSON(html);
                        flag = 1;
                        show_no_permission();
                    }catch(err){
                        //todo
                        flag = 0;
                    }

                    if(flag === 1)
                    {
                        return false;
                    }
                     layer.open({
                        type : 1,
                        title : '<strong>执飞信息('+ aircraft_num +' - '+ aircraft_type +')</strong>',
                        area : ['1000px','300px'],
                        shade: [0.8, '#393D49'],
                        shadeClose: true,
                        content : html
                    });
                }
            });


    });


        //恢复默认字段选项
        $('body').on('click','#zh-field-config .zh-optbody dl dt .zh-recover',function() {
            var idData = $(this).parent().data('default').split(',');
            $(this).parent().siblings('dd').find('.zh-fd-checkbox').removeClass('active');
            $(this).parent().siblings('dd').find('.zh-fd-checkbox').each(function() {
                var id = ''+$(this).data('id');
                if($.inArray(id, idData) !== -1) {
                    $(this).addClass('active');
                }
            });
        });

        // 日期，在原有日期基础上，增加days天数，默认增加1天
        function addDate(date, days) {
            if (days == undefined || days == '') {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }

        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        function getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return '';
            }

            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }

            return re;
        }

        //列表配置
        $('#zhListConfig').click(function() {

            var tip_layer = layer.msg('正在加载配置中,请稍候...',{time: 2000});
            $.get(CONFIG_LIST_URL,function(html){
                layer.close(tip_layer);
                  var flag = 0;
                  try{
                        var data = $.parseJSON(html);
                        flag = 1;
                        show_no_permission();
                    }catch(err){
                        //todo
                        flag = 0;
                    }
                    if(flag === 1)
                    {
                        return false;
                    }
                //关闭之前的弹出层
                layer.open({
                type : 1,
                title : '<strong>列表配置</strong>',
                area : ['900px','520px'],
                btn: ['提交', '取消'],
                yes: function(index,layer0) {
                    //时间范围
                    var time_range = $("input[name='time_range']:checked").val();
                    if(time_range == 2)
                    {
                        //自定义配置
                        var self_time_range_start = $.trim($("input[name='self_time_range_start']").val());
                        var self_time_range_end = $.trim($("input[name='self_time_range_end']").val());
                        if(self_time_range_start == '' || self_time_range_end == ''){
                            layer.msg("请输入自定义时间范围时间",{time: 1000});
                            return false;
                        }
                        if(self_time_range_start !== '' && self_time_range_end == ''){
                            layer.msg("请输入自定义时间范围结束时间",{time: 1000});
                            return false;
                        }else if(self_time_range_end !== '' && self_time_range_start == ''){
                            layer.msg("请输入自定义时间范围开始时间",{time: 1000});
                            return false;
                        }
                        //验证输入是否合法
                        if(self_time_range_start !== '' && self_time_range_end !== ''){
                            var reg = /^\d{4}$/;
                            if(!reg.test(self_time_range_start) || !reg.test(self_time_range_end)){
                                layer.msg("请输入正确的时间格式",{time: 1000});
                                return false;
                            }
                            var self_time_range_start_0 = self_time_range_start.substr(0,2);
                            var self_time_range_start_1 = self_time_range_start.substr(2,2);
                            if(parseInt(self_time_range_start_0) >23 || parseInt(self_time_range_start_1) > 59)
                            {
                                layer.msg("请输入正确的时间格式",{time: 1000});
                                return false;
                            }
                            var self_time_range_end_0 = self_time_range_end.substr(0,2);
                            var self_time_range_end_1 = self_time_range_end.substr(2,2);
                            if(parseInt(self_time_range_end_0) >23 || parseInt(self_time_range_end_1) > 59)
                            {
                                layer.msg("请输入正确的时间格式",{time: 1000});
                                return false;
                            }
                            if(self_time_range_start == self_time_range_end)
                            {
                                layer.msg("请输入一个有效的时间范围",{time: 1000});
                                return false;
                            }
                            if(parseInt(self_time_range_end) < parseInt(self_time_range_start))
                            {
                                layer.msg("开始时间不能大于结束时间",{time: 1000});
                                return false;
                            }

                        }
                    }

                    //执行分类
                    var implent_class = $("input[name='implent_class']:checked").val();
                    //列表分类
                    var list_type = [];
                    $("input[name='list_type[]']").each(function(){
                            if($(this).parent().hasClass('active')){
                                list_type.push($(this).val());
                            }
                    });
                    //属性
                    var f_cla_obj = $("input[name='f_cla[]']");
                    var f_cla = [];
                    $.each(f_cla_obj,function(){
                        if($(this).parent().hasClass('active'))
                        {
                            f_cla.push($(this).val());
                        }
                    });
                    //航空公司包括|不包括
                    var airlines_type = $("input[name='airlines_type']:checked").val();
                    //关联机场包括|不包括
                    var airports_type = $("input[name='airports_type']:checked").val();
                    //航空公司
                    var airlines = $("input[name='airlines']").val();
                    //关联机场
                    var airports = $("input[name='airports']").val();
                    //机位
                    var parking = $("input[name='parking']").val();
                    //登机口
                    var gate = $("input[name='gate']").val();
                    //行李转盘
                    var baggage_turntable = $("input[name='baggage_turntable']").val();

                    //字段配置 start
                    //是否合并进出港
                    var in_out_all = $(".zh-in-out-all>label.active>input").val();
                    //进港
                    var in_field = [];
                    var in_field_sort = [];
                    $(".zh-in-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            in_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        in_field_sort.push($(this).data('id'));
                    });
                    //出港
                    var out_field = [];
                    var out_field_sort = [];
                    $(".zh-out-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            out_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        out_field_sort.push($(this).data('id'));
                    });
                    //不正常航班
                    var abnormal_field = [];
                    var abnormal_field_sort = [];
                    $(".zh-abnormal-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            abnormal_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        abnormal_field_sort.push($(this).data('id'));
                    });
                    //关注航班
                    var attention_field = [];
                    var attention_field_sort = [];
                    $(".zh-attention-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            attention_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        attention_field_sort.push($(this).data('id'));
                    });
                    //航食航班
                    var food_field = [];
                    var food_field_sort = [];
                    $(".zh-food-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            food_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        food_field_sort.push($(this).data('id'));
                    });
                    //会议航班
                    var meeting_field = [];
                    var meeting_field_sort = [];
                    $(".zh-meeting-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            meeting_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        meeting_field_sort.push($(this).data('id'));
                    });
                    //字段配置 end
                    //状态排序
                    var flight_status_sort = [];
                    $(".zh-flight-status-sort tbody tr").each(function (k) {
                          flight_status_sort.push($(this).attr('data-flight-status'));
                    });
                    //合并字段start
                    var all_field_sort = [];
                    var all_field = [];
                    $(".zh-in-all-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            all_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        all_field_sort.push($(this).data('id'));
                    });
                    $(".zh-out-all-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            all_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        all_field_sort.push($(this).data('id'));
                    });
                    //合并字段end
                    //始发字段
                    var depart_field = [];
                    var depart_field_sort = [];
                    $(".zh-out-depart-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            depart_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        depart_field_sort.push($(this).data('id'));
                    });
                    //预计停场字段
                    var stop_field = [];
                    var stop_field_sort = [];
                    $(".zh-out-stop-field-config").find('label').each(function (k) {
                        if($(this).hasClass('active')){
                            if($(this).text() == '全选') return true;
                            stop_field.push($(this).data('id'));
                        }
                        if($(this).text() == '全选') return true;
                        stop_field_sort.push($(this).data('id'));
                    });

                    var requestParamObj_config = {
                        time_range:time_range,
                        self_time_range_start:self_time_range_start,
                        self_time_range_end:self_time_range_end,
                        implent_class:implent_class,
                        list_type:list_type,
                        f_cla:f_cla,
                        airlines_type:airlines_type,
                        airlines:airlines,
                        airports_type:airports_type,
                        airports:airports,
                        parking:parking,
                        gate:gate,
                        baggage_turntable:baggage_turntable,
                        in_out_all:in_out_all,
                        in_field:in_field,
                        in_field_sort:in_field_sort,
                        out_field:out_field,
                        out_field_sort:out_field_sort,
                        abnormal_field:abnormal_field,
                        abnormal_field_sort:abnormal_field_sort,
                        attention_field:attention_field,
                        attention_field_sort:attention_field_sort,
                        food_field:food_field,
                        food_field_sort:food_field_sort,
                        meeting_field:meeting_field,
                        meeting_field_sort:meeting_field_sort,
                        all_field:all_field,
                        all_field_sort:all_field_sort,
                        depart_field:depart_field,
                        depart_field_sort:depart_field_sort,
                        stop_field:stop_field,
                        stop_field_sort:stop_field_sort,
                        flight_status_sort:flight_status_sort
                    };
                    //停止自动刷新

                    if(ajax_timer != null){
                        clearTimeout(ajax_timer);
                    }
                    if(ajax_request != null){
                        ajax_request.abort();
                    }

                    var tip_index = layer.msg('提交中,请稍候...');

                    $.ajax({
                        type:'POST',
                        dataType:'JSON',
                        data:requestParamObj_config,
                        url:USER_FLIGHT_LIST_CONFIG_URL,
                        cache: false,
                        timeout: 60000,
                        beforeSend: function() {

                        },
                        success:function(data){
                            layer.close(tip_index);
                            if(data.code === 1)
                            {
                                layer.close(index);
                                layer.msg('设置成功，正在刷新列表数据...');
                                $(".zh-opt-count li").each(function(){
                                    if($(this).hasClass("active")){
                                        cur_active = $(this).children('a').attr('type');
                                    }
                                });
                                var transaction_msg_obj = $(".zh-fd-transaction");
                                var am_flight_obj = $(".am-flight-wrap");
                                if(in_out_all == 1){
                                    in_out_all_flag = 1;
                                    //取消事务消息请求start
                                    if(msg_request !== null){
                                        msg_request.abort();
                                    }
                                    if(msg_timer !== null){
                                        clearInterval(msg_timer);
                                    }
                                    //隐藏事务消息
                                    transaction_msg_obj.addClass('not-visible');
                                    //显示航班信息
                                    am_flight_obj.removeClass('not-visible');
                                    var mainHgt = $(window).height() - $('.zh-navbar').outerHeight() - $('.zh-fd-header').height() - 10 - 20 - $('.zh-fd-footer').height();
                                    var listTableHgt = mainHgt - $('.am-fd-bottom').height();
                                    $('.zh-fd-list').height(listTableHgt);
                                    // 正在玩命加载中……
                                    $('.zh-loading-box').css({
                                        'height': $('.zh-thead-fix').height()
                                    });
                                    //取消事务消息请求end
                                    //合并进出港
                                    var tab_type = $(".zh-opt-count li").eq(0).find('a').attr('type');
                                    var tab_is_active = '';
                                    if(cur_active == undefined){
                                        cur_active = 'all_0';
                                        tab_is_active = 'active';
                                    }else if(cur_active.indexOf('in') !== -1){
                                        cur_active = 'all_0';
                                        tab_is_active = 'active';
                                    }else if(cur_active.indexOf('out') !== -1){
                                        cur_active = 'all_0';
                                        tab_is_active = 'active';
                                    }else if(cur_active.indexOf('all') !== -1){
                                        tab_is_active = 'active';
                                    }
                                    if(tab_type.indexOf('all') == -1){
                                        $(".zh-opt-count li").filter(':lt(2)').remove();
                                        var _li_html = '<li class="zh-xl '+tab_is_active+'">' +
                                            '<a type="all_0" href="###">进出港：<span class=""></span></a> ' +
                                            '<div class="zh-arrow"></div><div class="zh-dropdown"> ' +
                                            '<div type="all_0" class="zh-item">全部</div> ' +
                                            '<div type="all_1" class="zh-item">前站计划</div> ' +
                                            '<div type="all_2" class="zh-item">前站起飞</div> ' +
                                            '<div type="all_3" class="zh-item">到达本场</div> ' +
                                            '<div type="all_4" class="zh-item">出港计划</div> ' +
                                            '<div type="all_5" class="zh-item">出港已飞</div> ' +
                                            '</div></li>';
                                        $(".zh-opt-count").prepend(_li_html);
                                    }
                                }else{
                                    in_out_all_flag = 0;
                                    //隐藏事务消息
                                    transaction_msg_obj.removeClass('not-visible');
                                    //显示航班信息
                                    am_flight_obj.addClass('not-visible');
                                    var mainHgt = $(window).height() - $('.zh-navbar').outerHeight() - $('.zh-fd-header').height() - 10 - 20 - $('.zh-fd-footer').height();
                                    var listTableHgt = mainHgt - $('.am-fd-bottom').height();
                                    $('.zh-fd-list').height(listTableHgt);
                                    // 正在玩命加载中……
                                    $('.zh-loading-box').css({
                                        'height': $('.zh-thead-fix').height()
                                    });
                                    //取消始发请求
                                    if(flight_data_request !== null){
                                        flight_data_request.abort();
                                    }
                                    if(flight_data_timer !== null){
                                        clearTimeout(flight_data_timer);
                                    }
                                    if(cur_active.indexOf('all') !== -1){
                                        cur_active = 'in_0';
                                    }
                                    var tab_type = $(".zh-opt-count li").eq(0).find('a').attr('type');
                                    var tab_is_active = '';
                                    if(cur_active == undefined){
                                        cur_active = 'all_0';
                                        tab_is_active = 'active';
                                    }else if(cur_active.indexOf('in') !== -1){
                                        tab_is_active = 'active';
                                    }
                                    if(tab_type.indexOf('in') == -1){
                                        $(".zh-opt-count li").eq(0).remove();
                                        var _li_html = '<li class="zh-xl '+tab_is_active+'">' +
                                            '<a type="in_0" href="###">进港：<span class=""></span></a>' +
                                            '<div class="zh-arrow"></div>' +
                                            '<div class="zh-dropdown">' +
                                            '<div type="in_0" class="zh-item">全部进港</div>' +
                                            '<div type="in_1" class="zh-item">前站计划</div>' +
                                            '<div type="in_2" class="zh-item">前站起飞</div>' +
                                            '<div type="in_3" class="zh-item">到达本场</div> ' +
                                            '<div type="in_4" class="zh-item">预计停场</div> ' +
                                            '</div> ' +
                                            '</li>' +
                                            '<li class="zh-xl">' +
                                            '<a type="out_0" href="###">出港：<span class=""></span></a>' +
                                            '<div class="zh-arrow"></div>' +
                                            '<div class="zh-dropdown">' +
                                            '<div type="out_0" class="zh-item">全部出港</div>' +
                                            '<div type="out_1" class="zh-item">出港计划</div>' +
                                            '<div type="out_2" class="zh-item">出港已飞</div>' +
                                            '<div type="out_3" class="zh-item">始发航班</div>' +
                                            '</div></li>';
                                        $(".zh-opt-count").prepend(_li_html);
                                    }
                                }

                                var start_time_obj = $("#startTime");
                                var date_arr = start_time_obj.val().split(' ');
                                var end_time_obj = $("#endTime");
                                if(time_range == 0){
                                    var mh_str_1 = '06:00';
                                    var mh_str_2 = '05:59';
                                    var start_time = date_arr[0]+' '+mh_str_1;
                                    var end_time = addDate(date_arr[0],1)+' '+mh_str_2;
                                    start_time_obj.val(start_time);
                                    end_time_obj.val(end_time);
                                }else if(time_range == 1){
                                    var mh_str_1 = '00:00';
                                    var mh_str_2 = '23:59';
                                    var start_time = date_arr[0]+' '+mh_str_1;
                                    var end_time = date_arr[0]+' '+mh_str_2;
                                    start_time_obj.val(start_time);
                                    end_time_obj.val(end_time);
                                }
                                if(time_range ==2 && self_time_range_start !== '' && self_time_range_end !== ''){
                                    var self_time_range_start_0 = self_time_range_start.substr(0,2);
                                    var self_time_range_start_1 = self_time_range_start.substr(2,2);
                                    var self_time_range_end_0 = self_time_range_end.substr(0,2);
                                    var self_time_range_end_1 = self_time_range_end.substr(2,2);
                                    var mh_str_1 = self_time_range_start_0+':'+self_time_range_start_1;
                                    var mh_str_2 = self_time_range_end_0+':'+self_time_range_end_1;
                                    var start_time = date_arr[0]+' '+mh_str_1;
                                    var end_time = date_arr[0]+' '+mh_str_2;
                                    start_time_obj.val(start_time);
                                    end_time_obj.val(end_time);
                                }

                                var requestParamObj = {
                                    init:1,
                                    pid:new Date().getTime(),
                                    start_time:start_time,
                                    end_time:end_time,
                                    f_status:cur_active,
                                    list_type:requestParamObj_config.list_type
                                };
                                requestList(requestParamObj);

                                if(in_out_all == 1){
                                    //执行始发请求
                                    flight_param = {
                                        'init':1,
                                        'page_hash':PAGE_HASH,
                                        'type':'depart'
                                    };
                                    request_flight_data();
                                }else{
                                    //执行事务消息请求
                                    requestMsgInit();
                                }

                            }
                        },
                        error:function(){
                            //todo
                        }
                    });

                    // return false;
                    // alert('提交');
                },
                btn2: function() {
                    // alert('取消');
                },
                content: html,
                success: function() {
                    // 拖动排序
                    $('.zh-draggable-list ul').each(function() {
                        var _this = $(this);
                        _this.dragsort({
                            dragSelector: '.draggable',
                            placeHolderTemplate: '<li class="zh-dashed-box"></li>',
                            scrollWrap: '.layui-layer-content', // 滚动容器
                            offsetPrevIndex: 0, // 偏移索引前不加虚框
                            dragStart: function() {
                                setTimeout(function() {
                                    $(this).children('.zh-fd-checkbox').addClass('active');
                                    // 判断全选
                                    var totalNum = $(this).parent().find('.zh-fd-checkbox:not(.zh-checkbox-all)').size(),
                                        activeNum = $(this).parent().find('.zh-fd-checkbox.active:not(.zh-checkbox-all)').size();
                                    if(activeNum == totalNum) {
                                        $(this).parent().find('.zh-checkbox-all').addClass('active').children('input').attr('checked', 'checked');
                                    }
                                }.bind(this), 110);
                            },
                            dragEnd: function() {
                                _this.children('li:not(:first)').each(function(i) {
                                    $(this).children('.zh-num').text(++i);
                                });
                            }
                        });
                    });
                }
                });
                // 初始全选
                $('.zh-news-panel dd').each(function() {
                    if($(this).hasClass('zh-draggable-list')){
                        if($(this).find('.zh-checkbox-all').size() > 0) {
                            var labelNum = $(this).find('.zh-fd-checkbox').size(),
                                labelActiveNum = $(this).find('.zh-fd-checkbox.active').size();
                            if(labelNum-labelActiveNum == 1) {
                                $(this).find('.zh-fd-checkbox:first').addClass('active');
                            }
                        }
                    }else{
                        if($(this).children('.zh-checkbox-all').size() > 0) {
                            var labelNum = $(this).children('.zh-fd-checkbox').size(),
                                labelActiveNum = $(this).children('.zh-fd-checkbox.active').size();
                            if(labelNum-labelActiveNum == 1) {
                                $(this).children('.zh-fd-checkbox:first-child').addClass('active');
                            }
                        }
                    }

                });
            });

        });

        // 清除文本框内容
        $('body').on('click', '.zh-input-close .zh-close', function() {
            $(this).siblings('input').val('');
        });

        //新增航班信息
        var addFlightInfoHtml = '<div class="zh-edit-flight">\
									<div class="zh-optbody" style="display: block;">\
										<dl class="zh-news-panel">\
											<dt>航班信息</dt>\
											<dd>\
												<ul class="zh-form-list2 clearfix">\
													<li>\
														<span class="zh-field-name">航班号</span>\
														<input name="fnum" class="zh-input zh-input-md zh-width-80" type="text" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">城市</span>\
														<input name="city" class="zh-input zh-input-md zh-width-260" placeholder="请填写机场三字码" type="text" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">进/出港</span>\
														<div class="zh-fd-select" id="am_inOutSelect">\
															<input class="zh-input zh-input-md zh-width-80" readonly="readonly" type="text" value="进港">\
															<input name="in_or_out" type="hidden" value="0">\
															<ul>\
																<li data-sort="0" class="active">进港</li>\
																<li data-sort="1">出港</li>\
															</ul>\
														</div>\
													</li>\
													<li>\
														<span class="zh-field-name">注册号</span>\
														<input name="aircraft_num" class="zh-input zh-input-md zh-width-80" type="text" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">机位</span>\
														<input name="parking" class="zh-input zh-input-md zh-width-80" type="text" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">机型</span>\
														<div class="zh-fd-select">\
															<input class="zh-input zh-input-md zh-width-80" readonly="readonly" type="text" value="C类">\
															<input name="parking_type" type="hidden" value="C">\
															<ul>\
															    <li data-sort="B" class="active">B类</li>\
																<li data-sort="C" class="active">C类</li>\
                                                                <li data-sort="D">D类</li>\
                                                                <li data-sort="E">E类</li>\
                                                                <li data-sort="F">F类</li>\
															</ul>\
														</div>\
													</li>\
													<li>\
														<span class="zh-field-name">航班属性</span>\
														<div class="zh-fd-select">\
															<input class="zh-input zh-input-md zh-width-80" readonly="readonly" type="text" value="全部属性">\
															<input name="Cla" type="hidden">\
															<ul>\
																<li data-sort="">全部属性</li>\
                                                                <li data-sort="H/Y">货运加班</li>\
                                                                <li data-sort="L/W">客班包机</li>\
                                                                <li data-sort="V/U">人工降雨</li>\
                                                                <li data-sort="T/W">地方航线</li>\
                                                                <li data-sort="Q/C">农林化</li>\
                                                                <li data-sort="P/F">放单不载客</li>\
                                                                <li data-sort="A/V">熟练</li>\
                                                                <li data-sort="R/W">日航</li>\
                                                                <li data-sort="Y/H">夜航</li>\
                                                                <li data-sort="D/Y">带飞</li>\
                                                                <li data-sort="M/X">鱼苗</li>\
                                                                <li data-sort="G/X">磁测</li>\
                                                                <li data-sort="B/F">播种</li>\
                                                                <li data-sort="X/D">护林</li>\
                                                                <li data-sort="Q/B">物理采矿</li>\
                                                                <li data-sort="X/L">训练</li>\
                                                                <li data-sort="X/F">校飞</li>\
                                                                <li data-sort="H/F">航摄</li>\
                                                                <li data-sort="X/P">森林巡逻</li>\
                                                                <li data-sort="S/E">施肥</li>\
                                                                <li data-sort="Q/T">其他运输飞机</li>\
                                                                <li data-sort="P/A">林业化学灭火</li>\
                                                                <li data-sort="N/B">农业播种</li>\
                                                                <li data-sort="D/C">航空调查</li>\
                                                                <li data-sort="F/J">校验飞行</li>\
                                                                <li data-sort="K/Y">空中游览</li>\
                                                                <li data-sort="L/B">林业播种</li>\
                                                                <li data-sort="O/F">救灾急救</li>\
                                                                <li data-sort="U/H">公务</li>\
                                                                <li data-sort="S/Q">视察飞行</li>\
                                                                <li data-sort="H/J">海岸检测</li>\
                                                                <li data-sort="H/Z">货运正班</li>\
                                                                <li data-sort="H/G">货运包机</li>\
                                                                <li data-sort="Z/P">客班补班</li>\
                                                                <li data-sort="Z/X">要客加班</li>\
                                                                <li data-sort="A/N">备降</li>\
                                                                <li class="active" data-sort="W/Z">客班正班</li>\
                                                                <li data-sort="C/B">普客加班</li>\
                                                                <li data-sort="K/L">本场训练</li>\
                                                                <li data-sort="N/M">调机</li>\
                                                                <li data-sort="B/W">专机</li>\
                                                                <li data-sort="W/A">转场</li>\
                                                                <li data-sort="R/Z">试航</li>\
                                                                <li data-sort="S/F">试飞</li>\
                                                                <li data-sort="O/M">军事运输</li>\
                                                                <li data-sort="Y/A">养调</li>\
                                                                <li data-sort="Q/U">换发飞行</li>\
                                                                <li data-sort="X/X">其它</li>\
															</ul>\
														</div>\
													</li>\
													<li id="am_inSelect">\
														<span class="zh-field-name">行李转盘</span>\
														<input name="baggage_turntable" class="zh-input zh-input-md zh-width-80" type="text" value="">\
													</li>\
													<li id="am_outSelect" style="display:none;">\
														<span class="zh-field-name">登机口</span>\
														<input name="gate" class="zh-input zh-input-md zh-width-80" type="text" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">航班状态</span>\
														<div class="zh-fd-select">\
															<input class="zh-input zh-input-md zh-width-80" readonly="readonly" type="text" value="计划">\
															<input name="flight_status_code" type="hidden" value="0">\
															<ul>\
																<li data-sort="0" class="active">计划</li>\
                                                                <li data-sort="1" >起飞</li>\
                                                                <li data-sort="2" >到达</li>\
                                                                <li data-sort="3" >取消</li>\
                                                                <li data-sort="4" >延误</li>\
                                                                <li data-sort="5" >备降</li>\
                                                                <li data-sort="11" >返航</li>\
                                                                <li data-sort="98" >非营运</li>\
                                                                <li data-sort="97" >返回停机位</li>\
                                                                <li data-sort="15" >可能备降</li>\
                                                                <li data-sort="32" >备降到达</li>\
															</ul>\
														</div>\
													</li>\
													<li>\
														<span class="zh-field-name">VIP</span>\
														<div class="zh-fd-select">\
															<input class="zh-input zh-input-md zh-width-80" readonly="readonly" type="text" value="否">\
															<input name="is_vip" type="hidden" value="0">\
															<ul>\
																<li data-sort="1">是</li>\
																<li data-sort="0" class="active">否</li>\
															</ul>\
														</div>\
													</li>\
												</ul>\
											</dd>\
										</dl>\
										<dl class="zh-news-panel">\
											<dt>航班时刻</dt>\
											<dd>\
												<ul class="zh-form-list2 clearfix">\
													<li>\
														<span class="zh-field-name">计划起飞</span>\
														<input name="scheduled_deptime_h" class="zh-input zh-input-md zh-width-40" type="text" value="">\
														<input name="scheduled_deptime_y" class="zh-input zh-input-md zh-input-date zh-width-80" type="text" readonly="readonly" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">计划到达</span>\
														<input name="scheduled_arrtime_h" class="zh-input zh-input-md zh-width-40" type="text" value="">\
														<input name="scheduled_arrtime_y" class="zh-input zh-input-md zh-input-date zh-width-80" type="text" readonly="readonly" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">预计起飞</span>\
														<input name="estimated_deptime_h" class="zh-input zh-input-md zh-width-40" type="text" value="">\
														<input name="estimated_deptime_y" class="zh-input zh-input-md zh-input-date zh-width-80" type="text" readonly="readonly" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">预计到达</span>\
														<input name="estimated_arrtime_h" class="zh-input zh-input-md zh-width-40" type="text" value="">\
														<input name="estimated_arrtime_y" class="zh-input zh-input-md zh-input-date zh-width-80" type="text" readonly="readonly" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">实际起飞</span>\
														<input name="actual_deptime_h" class="zh-input zh-input-md zh-width-40" type="text" value="">\
														<input name="actual_deptime_y" class="zh-input zh-input-md zh-input-date zh-width-80" type="text" readonly="readonly" value="">\
													</li>\
													<li>\
														<span class="zh-field-name">实际到达</span>\
														<input name="actual_arrtime_h" class="zh-input zh-input-md zh-width-40" type="text" value="">\
														<input name="actual_arrtime_y" class="zh-input zh-input-md zh-input-date zh-width-80" type="text" readonly="readonly" value="">\
													</li>\
												</ul>\
											</dd>\
										</dl>\
										<dl class="zh-news-panel">\
											<dt>特情信息</dt>\
											<dd>\
												<div class="zh-input-close">\
													<input name="aoc_info" class="zh-input zh-input-xmd" type="text" placeholder="请输入特情信息">\
													<span class="zh-close"></span>\
												</div>\
											</dd>\
										</dl>\
									</div>\
								</div>';
        $('#am_addFlightInfo').click(function() {
            layer.open({
                type : 1,
                title : '<strong>新增航班信息</strong>',
                area : ['710px','600px'],
                btn: ['提交', '取消'],
                yes: function(index,layer0) {

                    //航班号
                    var fnum = $("input[name='fnum']").val();
                    if($.trim(fnum) == ''){
                        layer.msg('航班号不能为空！',{time: 1000});
                        return false;
                    }
                    //城市
                    var city = $("input[name='city']").val();
                    if($.trim(city) == ''){
                        layer.msg('城市不能为空！',{time: 1000});
                        return false;
                    }
                    //进港OR出港
                    var in_or_out = $("input[name='in_or_out']").val();
                    //注册号
                    var aircraft_num = $("input[name='aircraft_num']").val();
                    if($.trim(aircraft_num) == ''){
                        layer.msg('注册号不能为空！',{time: 1000});
                        return false;
                    }
                    //机位
                    var parking = $("input[name='parking']").val();
                    //机型
                    var parking_type = $("input[name='parking_type']").val();
                    //航班属性
                    var Cla = $("input[name='Cla']").val();
                    if($.trim(Cla) == ''){
                        layer.msg('航班属性不能为空！',{time: 1000});
                        return false;
                    }
                    //登机口
                    var gate = $("input[name='gate']").val();
                    //行李转盘
                    var baggage_turntable = $("input[name='baggage_turntable']").val();
                    //航班状态
                    var flight_status_code = $("input[name='flight_status_code']").val();
                    //VIP
                    var is_vip = $("input[name='is_vip']").val();
                    //计划起飞
                    var scheduled_deptime_h = $("input[name='scheduled_deptime_h']").val();
                    var scheduled_deptime_y = $("input[name='scheduled_deptime_y']").val();
                    if($.trim(scheduled_deptime_h) == '' || $.trim(scheduled_deptime_y) == ''){
                        layer.msg('计划起飞时间不能为空！',{time: 1000});
                        return false;
                    }
                    //计划到达
                    var scheduled_arrtime_h = $("input[name='scheduled_arrtime_h']").val();
                    var scheduled_arrtime_y = $("input[name='scheduled_arrtime_y']").val();
                    if($.trim(scheduled_arrtime_h) == '' || $.trim(scheduled_arrtime_y) == ''){
                        layer.msg('计划到达时间不能为空！',{time: 1000});
                        return false;
                    }
                    //预计起飞
                    var estimated_deptime_h = $("input[name='estimated_deptime_h']").val();
                    var estimated_deptime_y = $("input[name='estimated_deptime_y']").val();
                    if($.trim(estimated_deptime_h) == '' || $.trim(estimated_deptime_y) == ''){
                        layer.msg('预计起飞时间不能为空！',{time: 1000});
                        return false;
                    }
                    //预计到达
                    var estimated_arrtime_h = $("input[name='estimated_arrtime_h']").val();
                    var estimated_arrtime_y = $("input[name='estimated_arrtime_y']").val();
                    if($.trim(estimated_arrtime_h) == '' || $.trim(estimated_arrtime_y) == ''){
                        layer.msg('预计到达时间不能为空！',{time: 1000});
                        return false;
                    }
                    //实际起飞
                    var actual_deptime_h = $("input[name='actual_deptime_h']").val();
                    var actual_deptime_y = $("input[name='actual_deptime_y']").val();
                    //实际到达
                    var actual_arrtime_h = $("input[name='actual_arrtime_h']").val();
                    var actual_arrtime_y = $("input[name='actual_arrtime_y']").val();
                    //特情信息
                    var aoc_info = $("input[name='aoc_info']").val();


                    var msg_layer = layer.msg('提交中,请稍候...',{time:0});

                    var requestParam={
                        fnum:fnum,
                        city:city,
                        in_or_out:in_or_out,
                        aircraft_num:aircraft_num,
                        parking:parking,
                        parking_type:parking_type,
                        Cla:Cla,
                        gate:gate,
                        baggage_turntable:baggage_turntable,
                        flight_status_code:flight_status_code,
                        is_vip:is_vip,
                        scheduled_deptime_h:scheduled_deptime_h,
                        scheduled_deptime_y:scheduled_deptime_y,
                        scheduled_arrtime_h:scheduled_arrtime_h,
                        scheduled_arrtime_y:scheduled_arrtime_y,
                        estimated_deptime_h:estimated_deptime_h,
                        estimated_deptime_y:estimated_deptime_y,
                        estimated_arrtime_h:estimated_arrtime_h,
                        estimated_arrtime_y:estimated_arrtime_y,
                        actual_deptime_h:actual_deptime_h,
                        actual_deptime_y:actual_deptime_y,
                        actual_arrtime_h:actual_arrtime_h,
                        actual_arrtime_y:actual_arrtime_y,
                        aoc_info:aoc_info
                    };

                    $.ajax({
                        type: 'POST',
                        dataType: "json",
                        data: requestParam,
                        url: "/flight/flight_list/add_flight_info",
                        success:function(data){
                            layer.close(msg_layer);
                            if(data.code == -1)
                            {
                                layer.msg(data.msg,{time: 1000});
                            }else{
                                layer.close(index);
                                layer.msg('提交成功',{time: 1000});
                            }
                        },
                        complete:function(xhr,textStatus){
                            xhr = null;
                        }
                    });
                },
                content : addFlightInfoHtml,
                success : function(){
                    $('#am_inOutSelect li').on('click',function(){
                        var curVal = $(this).attr('data-sort');
                        if(curVal == '0'){
                            $('#am_inSelect').show();
                            $('#am_outSelect').hide();
                        }else if(curVal == '1'){
                            $('#am_outSelect').show();
                            $('#am_inSelect').hide();
                        }
                    });
                }
            });
        });

        // 编辑航班信息
        $('body').on('click', '.zh-table .zh-edit', function(e) {
            e.stopPropagation();
            var msg_layer = layer.msg('正在加载数据中,请稍候...',{time: 0});
            if($(this).data('fid') !== undefined){
                fid = $(this).data('fid');
            }else{
                var fid = $(this).parent().parent().parent().children('td').eq(0).find('label').children("input").val();
                if(fid.indexOf('_') !== -1){
                    fid = $(this).parents('td').data('fid');
                }
            }

            var edit_html = '';
            $.ajax({
                type:"GET",
                url:EDIT_FLIGHT_URL+'?fid='+fid,
               // async:false,
                success: function(html){
                    layer.close(msg_layer);
                    var flag = 0;
                    try{
                        var data = $.parseJSON(html);
                        flag = 1;
                        show_no_permission();
                    }catch(err){
                        //todo
                        flag = 0;
                    }

                    if(flag === 1)
                    {
                        return false;
                    }
                  var layer01 =  layer.open({
                type : 1,
                title : '<strong>编辑航班信息</strong>',
                area : ['710px','600px'],
                btn: ['提交', '取消'],
                yes: function(index,layer0) {
                    //注册号
                    var aircraft_num = $("input[name='aircraft_num']").val();
                    //机位
                    var parking = $("input[name='parking']").val();
                    //机型
                    var parking_type = $("input[name='parking_type']").val();
                    //属性
                    var Cla = $("input[name='Cla']").val();
                    //行李转盘
                    var baggage_turntable = $("input[name='baggage_turntable']").val();
                    //登机口
                    var gate = $("input[name='gate']").val();
                    //航班状态
                    var flight_status_code = $("input[name='flight_status_code']").val();
                    //VIP
                    var is_vip = $("input[name='is_vip']").val();
                    //实际起飞
                    var actual_deptime_h = $("input[name='actual_deptime_h']").val();
                    var actual_deptime_y = $("input[name='actual_deptime_y']").val();
                    //预计起飞
                    var estimated_deptime_h = $("input[name='estimated_deptime_h']").val();
                    var estimated_deptime_y = $("input[name='estimated_deptime_y']").val();
                    //实际到达
                    var actual_arrtime_h = $("input[name='actual_arrtime_h']").val();
                    var actual_arrtime_y = $("input[name='actual_arrtime_y']").val();
                    //预计到达
                    var estimated_arrtime_h = $("input[name='estimated_arrtime_h']").val();
                    var estimated_arrtime_y = $("input[name='estimated_arrtime_y']").val();
                    //特情信息
                    var aoc_info = $("input[name='aoc_info']").val();
                    //备注
                    var remark = $.trim($("input[name='remark']").val());
                    //针对放行情况算法
                    var is_first_depart_flight_for_airport = $('.zh-first_depart .active').find('input').val();
                    // 删除航班
                    var del_flag = 0;
                    if($('.zh-del-flight .zh-fd-radio:first').hasClass('active')) {
                        var layer02 = layer.confirm('确定要删除该航班？', {title: '<strong>删除提示</strong>'}, function() {
                            del_flag = 1;
                            layer.close(layer02);
                            layer.close(layer01);
                            var delmsgIndex = layer.msg('正在删除，请耐心等待···',{time: 0});
                            var del_flight_config = {
                                fid:fid
                            };

                            $.ajax({
                                type:'POST',
                                dataType:'JSON',
                                data:del_flight_config,
                                url:DEL_FLIGHT_URL,
                                cache:false,
                                success:function(data){
                                    if(data.code == 0)
                                    {
                                        layer.close(index);
                                        layer.close(delmsgIndex);
                                        layer.msg('删除成功....',{time: 2000});
                                    }
                                    else
                                    {
                                        layer.close(index);
                                        layer.close(delmsgIndex);
                                        layer.msg(data.msg,{time: 2000});
                                    }
                                }
                            });

                        });

                        return false;
                    }
                    //放行延误原因
                    var first_reason = $("input[name='first_reason']").val();
                    var second_reason = $("input[name='second_reason']").val();
                    var reason_remark = $("input[name='reason_remark']").val();
                    //备注
                    var remark = $("input[name='remark']").val();
                    //预售成人
                    var adult_sale = $("input[name='adult_sale']").val();
                    //预售儿童
                    var children_sale = $("input[name='children_sale']").val();
                    //预售婴儿
                    var baby_sale = $("input[name='baby_sale']").val();
                    //成人
                    var adult = $("input[name='adult']").val();
                    //儿童
                    var children = $("input[name='children']").val();
                    //婴儿
                    var baby = $("input[name='baby']").val();
                    //邮件重量
                    var mail_weight = $("input[name='mail_weight']").val();
                    //行李重量
                    var baggage_weight = $("input[name='baggage_weight']").val();
                    //货物重量
                    var goods_weight = $("input[name='goods_weight']").val();
                    var in_or_out = $("input[name='in_or_out']").val();
                    var requestParamObj_config = {
                        aircraft_num:aircraft_num,
                        parking:parking,
                        parking_type:parking_type,
                        Cla:Cla,
                        baggage_turntable:baggage_turntable,
                        gate:gate,
                        flight_status_code:flight_status_code,
                        is_vip:is_vip,
                        actual_deptime_h:actual_deptime_h,
                        actual_deptime_y:actual_deptime_y,
                        estimated_deptime_h:estimated_deptime_h,
                        estimated_deptime_y:estimated_deptime_y,
                        actual_arrtime_h:actual_arrtime_h,
                        actual_arrtime_y:actual_arrtime_y,
                        estimated_arrtime_h:estimated_arrtime_h,
                        estimated_arrtime_y:estimated_arrtime_y,
                        aoc_info:aoc_info,
                        first_reason:first_reason,
                        second_reason:second_reason,
                        reason_remark:reason_remark,
                        remark:remark,
                        adult_sale:adult_sale,
                        children_sale:children_sale,
                        baby_sale:baby_sale,
                        adult:adult,
                        children:children,
                        baby:baby,
                        mail_weight:mail_weight,
                        baggage_weight:baggage_weight,
                        goods_weight:goods_weight,
                        fid:fid,
                        in_or_out:in_or_out,
                        is_first_depart_flight_for_airport:is_first_depart_flight_for_airport,
                        remark:remark
                    };
                                $.ajax({
                                    type:'POST',
                                    dataType:'JSON',
                                    data:requestParamObj_config,
                                    url:EDIT_FLIGHT_URL,
                                    cache:false,
                                    success:function(data){
                                            if(data.code == 0)
                                            {
                                                layer.close(index);
                                                layer.msg('更新成功....',{time: 2000});

                                            }
                                      }
                                });
                        },
                        btn2: function() {
                            // alert('取消');
                        },
                        content : html
                    });
                }
            });


        });
        function recursiveGetData(data,name){
            var dataArr = {};
            if(typeof data !== 'undefined'){
                if(name === ''){
                    dataArr = data;
                }else{
                    $.each(data,function(key,item){
                        if(item.name === name){
                            dataArr = item.sub;
                        }else if(item.sub && item.sub.length > 0){
                            recursiveGetData(item.sub,name);
                        }
                    });
                }
            }
            return dataArr;
        }
        function renderData(selector,data,changeStatus){
            if(typeof data !== 'undefined'){
                var html = '';
                if(!(data[0] instanceof Array)){
                    $.each(data,function(key,item){
                        var text = item.name ? item.name : item;
                        html += '<li data-reason="'+key+'">'+text+'</li>';
                    });
                }
                if(changeStatus){
                    $(selector).find('input:text').val(data[Object.keys(data)[0]]);
                    $(selector).find('input:hidden').val(Object.keys(data)[0]);
                }
                $(selector).find('ul').html(html);
            }
        }
        //下拉
        $.customSelectFn('.am-delay-cause', 'input:not(:hidden)', 'ul', 'li', function(){
            var _this = $(this),
                wrap = _this.parents('.am-delay-cause'),
                text = $.trim(_this.text());
            wrap.find(':hidden').val(_this.data('reason'));
            if(wrap.is('.first')){
                renderData(wrap.siblings('.am-delay-cause.second'),recursiveGetData(reasonObj, text),true);
            }
        });
        // 超出提示
        $('body').on('mouseenter','.am-delay-cause input,.am-delay-cause li',function(){
            var text = $(this).val() ? $(this).val() : $(this).text();
            if(this.offsetWidth < this.scrollWidth) {
                layer.tips(text, this, {tips: [2, '#429EE5'], time: -1});
            }
        }).on('mouseleave','.am-delay-cause input,.am-delay-cause li',function(){
            layer.closeAll('tips');
        });
        // 航班信息/货邮行tab
        $('body').on('click', '.zh-edit-flight .zh-opt li', function() {
            $(this).addClass('active').siblings().removeClass('active');
            $('.zh-edit-flight .zh-optbody').eq($(this).index()).show().siblings('.zh-optbody').hide();
        });

        // 航班时刻日期
        $('body').on('focus', '.zh-edit-flight .zh-input-date', function() {
            $(this).datetimepicker({
                format: 'yyyy/mm/dd',
                language: 'zh-CN',
                weekStart: 1,
                autoclose: true,
                todayHighlight: 1,
                startView: 2,
                minView: 2
            });
        });

        //航班详情
        $('body').on('click', '.zh-fd-list .zh-table .zh-flight-number', function() {
            var tip_layer = layer.msg('正在加载数据中,请稍候...',{time: 2000});
            var fid = $(this).parent().parent().parent().children('td').eq(0).find('label').children("input").val();
            if(fid.indexOf('_') !== -1){
                fid = $(this).data('fid');
            }
            $.get(GET_FLIGHT_DETAIL_URL+'?fid='+fid,function(html){
                    layer.close(tip_layer);
                     var flag = 0;
                    try{
                        var data = $.parseJSON(html);
                        flag = 1;
                        show_no_permission();
                    }catch(err){
                        //todo
                        flag = 0;
                    }

                    if(flag === 1)
                    {
                        return false;
                    }
                    layer.open({
                        type : 1,
                        moveType: 1,
                        title : '<strong>航班详情</strong>',
                        area : ['1145px','560px'],
                        content : html
                    });
            });

        });
        //进出港航班号点击
        $('body').on('click','.soon_fnum',function(){
             //获取fid
             var fid_str = $(this).parent().attr('class');
             var fid_str_arr = fid_str.split('_');
             var fid = fid_str_arr[1];
            var tip_layer = layer.msg('正在加载数据中,请稍候...',{time: 2000});
            $.get(GET_FLIGHT_DETAIL_URL+'?fid='+fid,function(html){
                layer.close(tip_layer);
                var flag = 0;
                try{
                    var data = $.parseJSON(html);
                    flag = 1;
                    show_no_permission();
                }catch(err){
                    //todo
                    flag = 0;
                }

                if(flag === 1)
                {
                    return false;
                }
                layer.open({
                    type : 1,
                    moveType: 1,
                    title : '<strong>航班详情</strong>',
                    area : ['1145px','560px'],
                    content : html
                });
            });

        });
        // 发送消息

        //获取短语
        $.ajax({
               type:"GET",
               dataType:"JSON",
               url:GET_SHORTCUT_URL,
               async:false,
               success: function(json_data){
                  SHORTCUT_PHRASE = json_data;
               }
        });

        var shortcutPhrase = '';
        $.each(SHORTCUT_PHRASE, function(i, item) {
            shortcutPhrase += '<li>'+item+'</li>';
        });


         $("body").on('click','#zhSendMsg, .zh-table .zh-msg',function(e){
                e.stopPropagation();
                 var flag = $(this).attr('type');
                 var msg_layer = layer.msg('正在加载数据中,请稍候...',{time: 0});


                 if(flag == 'no_flight'){
                    //无关联航班
                    var url = SHOW_MSG_DAILOG_URL+'?flag=1';
                 }else{
                     if($(this).data('fid') !== undefined){
                         link_fid = $(this).data('fid');
                     }else{
                         var link_fid = $(this).parent().parent('td').parent('tr').find('td:first').find('input').val();
                         if(link_fid.indexOf('_') !== -1){
                             link_fid = $(this).parents('td').data('fid');
                         }
                     }

                    var url = SHOW_MSG_DAILOG_URL+'?fid='+link_fid;
                 }

                 var msg_html = '';
                 $.ajax({
                   type:"GET",
                   url:url,
                   //async:false,
                   success: function(html){
                      layer.close(msg_layer);
                       var flag = 0;
                        try{
                            var data = $.parseJSON(html);
                            flag = 1;
                            show_no_permission();
                        }catch(err){
                            //todo
                            flag = 0;
                        }

                        if(flag === 1)
                        {
                            return false;
                        }


                      var index = layer.open({
                        type : 1,
                        title : '<strong>发送事务消息</strong>',
                        area : ['620px','580px'],
                        btn: ['提交', '取消'],
                        btn2: function() {
                            // alert('取消');
                        },
                        content : html,
                        success : function(){
                            receiveFn();
                        },
                        yes: function() {

                                  //1.获取选中的部门
                            var department_ids = [];
                            $("input[name='department[]']").each(function(){
                                    if($(this).parent().hasClass('active') && $(this).val() != ''){
                                       department_ids.push($(this).val());
                                    }

                            });

                            department_ids = department_ids.join(',');
                            //2.获取内容
                            var content = $("textarea[name='content']").val();
                            var type = $("input[name='msg_type']:checked").val();
                            var url = '';
                            var fid= $("input[name='fid']:checked").val();
                            if(fid == undefined){
                                fid = 0;
                            }


                            if(type == 1){
                                var need_confirm = $(".zh-is-confirm").find('.active').children('input').val();
                                url = SEND_FEEDBACK_URL;
                               var requestParamObj_config = {
                                  dpt_ids:department_ids,
                                  fid:fid,
                                  content:content,
                                   need_confirm:need_confirm
                                };

                                var checkLen = $('.zh-receive-box .zh-unit-checkbox.active').size();
                                var sendMsg = $.trim($('.zh-sendmsg-box textarea').val());

                                if(checkLen < 1 && sendMsg == ''){
                                    layer.msg('接收单位不能为空',{time:1000});
                                    return false;
                                }else if(checkLen < 1){
                                    layer.msg('请选择接收单位',{time:1000});
                                    return false;
                                }else if(sendMsg == ''){
                                    layer.msg('信息内容不能为空',{time:1000});
                                    return false;
                                }

                            }else{
                               url = SEND_ANNOUCEMENT_URL;
                               var requestParamObj_config = {
                                content:$("textarea[name='content_info']").val()
                                };

                                if($.trim($("textarea[name='content_info']").val()) == ''){
                                    layer.msg('信息内容不能为空',{time:1000});
                                    return false;
                                }
                            }
                            //保存接收单位);
                            localStorage.setItem("D_"+UID,JSON.stringify(unit_storage));
                              $.ajax({
                                type:'POST',
                                dataType:'JSON',
                                data:requestParamObj_config,
                                url:url,
                                cache: false,
                                timeout: 60000,
                                success:function(data){
                                   if(data.code == 0){
                                     layer.msg('发送成功');
                                   }
                                },
                                error:function(){
                                    //todo
                                }
                            });

                                layer.close(index);

                        },
                        end: function() {
                            $('body').off('click', '.zh-receive-box li');
                            $('body').off('click', '.zh-receive-box .zh-unit-checkbox');
                        }
                    });
            ///////////////////////////////////////////// layer end
                   }    ////ajax end
                });


         });


        // 信息通告
        $('body').on('click', '.zh-send-type .zh-fd-radio', function() {
            if($.trim($(this).text()) === '信息通告') {
                $(this).parents('.zh-news-panel').siblings().not(".zh-info-edit").hide();
                $(this).parents('.zh-news-panel').siblings('.zh-info-edit').show();
            } else {
                $(this).parents('.zh-news-panel').siblings().show();
                $(this).parents('.zh-news-panel').siblings('.zh-info-edit').hide();
            }
        });
        //是否关联航班
        $('body').on('click', '.zh-flight-type .zh-fd-radio', function() {
             var fid = $(this).find('input').val();
             var content_obj = $("textarea[name='content']");
            if(fid == 0){
                 content_obj.val('');
             }else{
                 if(content_obj.val() == ''){
                     //为空则添加
                     var msg_flight = $("input[name='msg_flight']").val();
                     content_obj.val(msg_flight);
                 }
             }
        });

        // 选中统计
        var unit_storage = {
            "firstJson":[],
            "secondJson":{first:'',son:''},
            "thirdNode":''
        };
        //接收单位
        function receiveFn() {

            var selectWrap = $('.zh-receive-box .zh-link-select');
            var groupList = '',dataAttr = '',dataChild = '',groupId,groupName;

            $.each(UNIT_INTERLOCK, function(i,item) {
                dataAttr = 'first' + item['id'];
                if(item['son']){
                    groupList += '<li data-attr="'+dataAttr+'" data-child="second0" class="allCheckLi"><label class="zh-unit-checkbox allCheck"><input type="checkbox"></label>全部分组</li>';
                    $.each(item['son'],function(k,v){
                        dataChild = 'second'+(k+1);
                        groupId = v['id'];
                        groupName = v['name'];
                        groupList += '<li data-attr="'+dataAttr+'" data-child="'+dataChild+'"><label class="zh-unit-checkbox"><input type="checkbox" data-id="'+groupId+'"></label>'+groupName+'</li>';
                    });
                }
            });

            groupList = '<ul class="secondGroup" style="display:none;">'+groupList+'</ul>';
            $('.zh-receive-box').append(groupList);
            //初始化选中节点
            var local_storage = localStorage.getItem("D_"+UID);
            local_storage = JSON.parse(local_storage);
            if(local_storage !== null){
                var firstUnit = local_storage.firstJson !== null ? local_storage.firstJson : '';
                if(firstUnit == 'all'){
                    $('.zh-firstUnit .zh-unit-checkbox').addClass('active').find('input').prop('checked',true);
                }else if(firstUnit.length > 0){
                    $.each(firstUnit,function(i,item){
                        $('.zh-firstUnit li[data-attr="'+item+'"]').find('.zh-unit-checkbox').addClass('active').find('input').prop('checked',true);
                    });
                }
                var secondUnit = local_storage.secondJson !== null ? local_storage.secondJson : '';
                if(typeof secondUnit.first != 'undefined'){
                    $('.zh-SecondUnit ul').html($('.secondGroup').find('li[data-attr="'+secondUnit.first+'"]').clone());
                    if(secondUnit.son == 'all'){
                        $('.zh-SecondUnit .zh-unit-checkbox').addClass('active').find('input').prop('checked',true);
                    }else if(secondUnit.son.length > 0){
                        $.each(secondUnit.son,function(i,item){
                            $('.zh-SecondUnit li[data-child="'+item+'"]').find('.zh-unit-checkbox').addClass('active').find('input').prop('checked',true);
                        });
                    }
                }
                $('.zh-thirdUnit ul').html(local_storage.thirdNode);
            }

            $('body').on('click','.zh-receive-box li',function(){  //点击列表文字展示分组
                var _this = $(this);
                var curWrap = _this.parents('.zh-link-select');

                _this.addClass('on').siblings().removeClass('on');
                dataAttr = _this.attr('data-attr');

                if(curWrap.index() === 0 && dataAttr !== undefined){
                    selectWrap.eq(1).find('ul').empty();
                    var secondLi = $('.secondGroup').find('li[data-attr="'+dataAttr+'"]').clone();
                    selectWrap.eq(1).find('ul').html(secondLi);
                    if(_this.find('.zh-unit-checkbox').hasClass('active')){
                        selectWrap.eq(1).find('.zh-unit-checkbox').addClass('active').find('input').prop('checked',true);
                    }
                }
                //保存选中节点
                unit_storage.secondJson = {
                    first : $('.zh-SecondUnit li').data('attr'),
                    son : []
                };
                $('.zh-SecondUnit .zh-unit-checkbox.active').each(function(){
                    var _this = $(this),
                        li = _this.parents('li');
                    if(li.hasClass('allCheckLi')){
                        unit_storage.secondJson.son = 'all';
                        return false;
                    }else{
                        unit_storage.secondJson.son.push(li.data('child'));
                    }
                });
                //localStorage.secondJson = JSON.stringify(secondJson);

            });

            $('body').on('click','.zh-receive-box .zh-unit-checkbox',function(e){ //点击复选框
                e.stopPropagation();
                e.preventDefault();

                var _this = $(this);
                var curLi = _this.parent('li');
                var curIndex = _this.parents('.zh-link-select').index();
                var n = 0,secondLi = '';
                var dataAttr = curLi.attr('data-attr');
                var dataChild = curLi.attr('data-child');
                var firstLi = '';
                var secondLi = '';
                var cloneLi = '';

                if(_this.hasClass('active')) {
                    _this.removeClass('active').find(':checkbox').prop('checked',false);

                    if(_this.is('.allCheck')){ //全选

                        if(curIndex == 0){

                            $('.zh-receive-box').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);

                            selectWrap.eq(2).children('ul').empty();

                        }else if(curIndex == 1){

                            $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);
                            selectWrap.eq(2).find('li[data-attr="'+dataAttr+'"]').remove();
                        }

                    }else{

                        if(curIndex == 0){

                            $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"] .zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);

                            _this.parents('ul').find('.allCheck').removeClass('active').find(':checkbox').prop('checked',false);

                            selectWrap.eq(2).find('li[data-attr="'+dataAttr+'"]').remove();

                        }else if(curIndex == 1){

                            if(_this.parents('ul').find('.zh-unit-checkbox.active:not(.allCheck)').size() < 1){
                                $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);
                                selectWrap.eq(2).find('li[data-attr="'+dataAttr+'"]').remove();
                            }else{

                                $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.allCheck').removeClass('active').find(':checkbox').prop('checked',false);

                                $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"][data-child="'+dataChild+'"]').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);
                                selectWrap.eq(2).find('li[data-attr="'+dataAttr+'"][data-child="'+dataChild+'"]').remove();
                            }

                        }else if(curIndex == 2){
                            if(!dataChild){
                                $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.allCheck').removeClass('active').find(':checkbox').prop('checked',false);
                                $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);
                            }else{

                                if(curLi.parent().find('li').size() <= 1){
                                    _this.parents('ul').parent('li').remove();
                                    $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);
                                }else{
                                    $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"][data-child="'+dataChild+'"]').find('.zh-unit-checkbox').removeClass('active').find(':checkbox').prop('checked',false);
                                    $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.allCheck').removeClass('active').find(':checkbox').prop('checked',false);
                                }
                            }
                            curLi.remove();
                            if(selectWrap.eq(0).find('ul').find('.zh-unit-checkbox:not(.active,.allCheck)').size() > 0){
                                selectWrap.eq(0).find('ul').find('.allCheck').removeClass('active').find(':checkbox').prop('checked',false);
                            }
                        }
                    }

                    selectWrap.eq(2).find(':checkbox').val(function(){
                        $(this).attr('name','department[]');
                        return $(this).attr('data-id');
                    });

                } else { //点击选中
                    _this.addClass('active').find(':checkbox').prop('checked',true);

                    if(_this.is('.allCheck')){ //全选

                        if(curIndex == 0){
                            selectWrap.eq(2).children('ul').empty();
                            $('.zh-receive-box').find('.zh-unit-checkbox').addClass('active').find(':checkbox').prop('checked',true);

                            firstLi = selectWrap.eq(0).find('li:not(.allCheckLi)').clone();
                            for(var i = 0; i < firstLi.length; i++){
                                dataAttr = $(firstLi[i]).attr('data-attr');
                                secondLi = $('.secondGroup').find('li[data-attr="'+dataAttr+'"]:not(.allCheckLi)').clone();
                                $(firstLi[i]).append('<ul></ul>');
                                $(firstLi[i]).find('ul').append(secondLi);
                                cloneLi = firstLi[i];
                                selectWrap.eq(2).children('ul').append(cloneLi);
                            }

                        }else{
                            selectWrap.eq(2).children('ul').find('li[data-attr="'+dataAttr+'"]').remove();
                            $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.zh-unit-checkbox').addClass('active').find(':checkbox').prop('checked',true);

                            secondLi = $('.secondGroup').find('li[data-attr="'+dataAttr+'"]:not(.allCheckLi)').clone();
                            cloneLi = selectWrap.eq(0).find('li[data-attr="'+dataAttr+'"]').clone();
                            cloneLi.append('<ul></ul>');
                            cloneLi.find('ul').append(secondLi);
                            selectWrap.eq(2).children('ul').append(cloneLi);
                        }

                    }else{
                        if(curIndex == 0){  //一级单位
                            $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"] .zh-unit-checkbox').addClass('active').find(':checkbox').prop('checked',true);

                            if(_this.parents('ul').find('.zh-unit-checkbox:not(.active):not(.allCheck)').size() < 1){
                                _this.parents('ul').find('.allCheck').addClass('active').find(':checkbox').prop('checked',true);
                            }

                            secondLi = $('.secondGroup').find('li[data-attr="'+dataAttr+'"]:not(.allCheckLi)').clone();
                            cloneLi = curLi.clone();
                            cloneLi.append('<ul></ul>');
                            cloneLi.find('ul').append(secondLi);
                            selectWrap.eq(2).children('ul').append(cloneLi);

                        }else if(curIndex == 1){  //二级单位

                            $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]:not([data-child])').find('.zh-unit-checkbox').addClass('active').find(':checkbox').prop('checked',true);
                            $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"][data-child="'+dataChild+'"]').find('.zh-unit-checkbox').addClass('active').find(':checkbox').prop('checked',true);

                            if(_this.parents('ul').find('.zh-unit-checkbox:not(.active,.allCheck)').size() < 1){
                                $('.zh-receive-box').find('li[data-attr="'+dataAttr+'"]').find('.allCheck').addClass('active').find(':checkbox').prop('checked',true);
                            }

                            secondLi = $('.secondGroup').find('li[data-attr="'+dataAttr+'"][data-child="'+dataChild+'"]').clone();
                            if(_this.parents('ul').find('.active:not(.allCheck)').size() <= 1){
                                firstLi = selectWrap.eq(0).find('li[data-attr="'+dataAttr+'"]');
                                cloneLi = firstLi.clone();
                                cloneLi.append('<ul></ul>');
                                cloneLi.find('ul').append(secondLi);
                                selectWrap.eq(2).children('ul').append(cloneLi);
                            }else{
                                cloneLi = secondLi;
                                selectWrap.eq(2).find('li[data-attr="'+dataAttr+'"] > ul').append(cloneLi);
                            }

                        }
                    }
                    selectWrap.eq(2).find(':checkbox').val(function(){
                        $(this).attr('name','department[]');
                        return $(this).attr('data-id');
                    });
                }
                //保存选中单位
                unit_storage.firstJson = [];
                $('.zh-firstUnit .zh-unit-checkbox.active').each(function(){
                    var _this = $(this),
                        li = _this.parents('li');
                    if(li.hasClass('allCheckLi')){
                        unit_storage.firstJson = 'all';
                        return false;
                    }else{
                        unit_storage.firstJson.push(li.data('attr'));
                    }
                });
                unit_storage.secondJson = {
                    first : $('.zh-SecondUnit li').data('attr'),
                    son : []
                };
                $('.zh-SecondUnit .zh-unit-checkbox.active').each(function(){
                    var _this = $(this),
                        li = _this.parents('li');
                    if(li.hasClass('allCheckLi')){
                        unit_storage.secondJson.son = 'all';
                        return false;
                    }else{
                        unit_storage.secondJson.son.push(li.data('child'));
                    }
                });
                unit_storage.thirdNode = $('.zh-thirdUnit .zh-selected-list').html();
            });
        }
       // receiveFn();

        // 快捷短语
        function shortcutFn() {
            // 搜索
            $('body').on('input', '.zh-sendmsg-box .zh-form input', function() {
                var _this = $(this);

                if(_this.val() === '') {
                    //console.log(shortcutPhrase);
                    _this.parents('.zh-heading').siblings('ul').html(shortcutPhrase);
                } else {
                    var matchItem = '';
                       //SHORTCUT_PHRASE

                    $.each(SHORTCUT_PHRASE, function(i, item) {
                        //var pattern = new RegExp("["+_this.val()+"]");
                        var pattern = new RegExp(_this.val(),'g');
                        if(pattern.test(item)) {
                            matchItem += '<li>'+item+'</li>';
                        }
                    });
                    _this.parents('.zh-heading').siblings('ul').html(matchItem);
                }
            });

            // 双击添加/删除
            $('body').on('dblclick', '.zh-sendmsg-box ul li', function() {
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    var delStr = $('.zh-sendmsg-box textarea').val().replace($(this).text(), '');
                    $('.zh-sendmsg-box textarea').val(delStr);
                } else {
                    $(this).addClass('active');
                    var addStr = $('.zh-sendmsg-box textarea').val() + $(this).text();
                    $('.zh-sendmsg-box textarea').val(addStr);
                }
            });
        }
        shortcutFn();

        /* 导入机位  开始 */
        //初始化导入结果提示HTML
        var importFeedbackHtml = '';
		//导入机位
		$('.importFlightNumber input').on('change',function(){
            //判断文件格式
            var path = $(this).val();
            var ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
            if (ext != 'csv') {
                layer.open({
                    type : 1,
                    title : '<strong>导入机位提示</strong>',
                    area : ['300px','220px'],
                    content : '<p class="am_importInfo"><span class="error">导入失败!</span><br/>导入的文件格式不正确，需csv格式</p>',
                    btn: ['确认']
                });
                return false;
            }

            var file = document.getElementById("file").files[0];
            var reader = new FileReader();
            //将文件以文本形式读入页面
            reader.readAsText(file, 'gb2312');
            reader.onload = function(e){
                //读取到文件内容
                var text = e.target.result;
                $('#file').val('');
                var msgIndex = layer.msg('正在导入，请耐心等待···',{time: 0});

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data: {
                        path:path,
                        text:text
                    },
                    url: IMPORT_PARKING_URL,
                    success:function(data){
                        if (data.code == 0) {
                            importFeedbackHtml = '<p class="am_importInfo"><span class="success">导入成功!</span><br/>已成功导入<strong>'+data.num+'</strong>条'+data.type+'机位数据</p>';
                        } else {
                            importFeedbackHtml = '<p class="am_importInfo"><span class="error">导入失败!</span><br/>'+data.msg+'</p>';
                        }

                        //页面提示
                        layer.close(msgIndex);
        				layer.open({
        					type : 1,
        					title : '<strong>导入机位提示</strong>',
        					area : ['300px','220px'],
        					content : importFeedbackHtml,
        					btn: ['确认']
        				});
                    }
                });
            }
		});
        /* 导入机位 结束 */

        //导入航食计划 start
        var importFoodSuccessHtml = '';
        $(".importFlightFood input").on('change',function(){
            if((typeof(Worker) === "undefined"))
            {
                layer.open({
                    type : 1,
                    title : '<strong>导入航食计划提示</strong>',
                    area : ['300px','100px'],
                    content : '<p class="am_importInfo">此浏览器版本不支持此功能,请升级浏览器</p>',
                });
                return false;
            }

            if(IMPORT_FOOD_PERMISSION == false)
            {
                show_no_permission();
                return false;
            }

            var path = $(this).val();
            var ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
            if (ext != 'xls') {
                layer.open({
                    type : 1,
                    title : '<strong>导入航食计划提示</strong>',
                    area : ['300px','220px'],
                    content : '<p class="am_importInfo"><span class="error">导入失败!</span><br/>导入的文件格式不正确，需xls格式</p>',
                    btn: ['确认']
                });
                return false;
            }
            var file = document.getElementById("file2").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                var formData = new FormData();
                formData.append("upload", 1);
                formData.append("upfile", $("#file2").get(0).files[0]);
                var msgIndex = layer.msg('正在导入，请耐心等待···',{time: 0});
                $.ajax({
                    type:"POST",
                    data:formData,
                    url: '/flight/flight_list/import_fresh_air_plan',
                    success:function(data){
                        var data = $.parseJSON(data);
                        if (data.code == 0) {
                            importFoodSuccessHtml = '<p class="am_importInfo"><span class="success">导入成功!</span><br/>已成功导入<strong>'+data.num+'</strong>条航食计划数据</p>';
                        } else {
                            importFoodSuccessHtml = '<p class="am_importInfo"><span class="error">导入失败!</span><br/>'+data.msg+'</p>';
                        }

                        //页面提示
                        layer.close(msgIndex);
                        layer.open({
                            type : 1,
                            title : '<strong>导入航食计划提示</strong>',
                            area : ['300px','220px'],
                            content : importFoodSuccessHtml,
                            btn: ['确认']
                        });

                        $('#file2').val('');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            };

        });

        //导入航食计划 end

        //自定义导出
        function get_export_param(){
            var apron = $("input[name='apron']").val();
            var area = $("input[name='area']").val();
            var export_type = $("input[name='export_type']").val();
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            var export_time_range = $("input[name='export_time_range']").val();
            if(export_time_range == 1){
                //自定义时段
                var export_start_hour = $("input[name='export_start_hour']").val();
                var export_end_hour = $("input[name='export_end_hour']").val();
            }
            //字段配置start
            var export_in_or_out = $("input[name='export_in_or_out']:checked").val();
            var export_in_field = [];
            $(".zh-export-in-field>label.active").each(function (k) {
                if($(this).text() == '全选') return true;
                export_in_field.push($(this).data('id'));
            });
            var export_out_field = [];
            $(".zh-export-out-field>label.active").each(function (k) {
                if($(this).text() == '全选') return true;
                export_out_field.push($(this).data('id'));
            });
            //保障节点
            var export_node_list_field = [];
            $(".zh-export-node-list-field>label.active").each(function(k){
                export_node_list_field.push($(this).data('id'));
            });
            //货邮行
            var export_cargo_field = [];
            $(".zh-export-cargo-field>label.active").each(function(k){
                export_cargo_field.push($(this).data('id'));
            });
            //旅客
            var export_passenger_field = [];
            $(".zh-export-passenger-field>label.active").each(function(k){
                export_passenger_field.push($(this).data('id'));
            });
            var rand_num = parseInt(Math.random()*100000 + 100);
            //字段配置end
            return {
                'rand_num':rand_num,
                'apron':apron,
                'area':area,
                'export_type':export_type,
                'startDate':startDate,
                'endDate':endDate,
                'export_time_range':export_time_range,
                'export_start_hour':export_start_hour,
                'export_end_hour':export_end_hour,
                'export_in_or_out':export_in_or_out,
                'export_in_field':export_in_field,
                'export_out_field':export_out_field,
                'export_node_list_field':export_node_list_field,
                'export_cargo_field':export_cargo_field,
                'export_passenger_field':export_passenger_field
            };
        }
        //自定义导出操作
        function export_flight_node_data(day,param_obj){
            param_obj.day = day;
            $.get('/flight/flight_export/index',param_obj,function(data){
                if(data.code == 0){
                    layer.msg(data.msg,{time:0});
                    day++;
                    export_flight_node_data(day,param_obj);
                }else if(data.code == 1){
                    layer.msg(data.msg);
                    window.location.href=data.file_url;
                }
            },'JSON');
        }
        $('.am-custom-export').on('click',function(){
            if(EXPORT_FLIGHT_PERMISSION == false){
                show_no_permission();
                return false;
            }
            var load_index = layer.msg('正在加载中,请稍候...',{time: 0});
            $.get('/flight/flight_export/get_export_html',function(html){
                layer.close(load_index);
                layer.open({
                    type : 1,
                    title : '<strong>自定义导出</strong>',
                    area : ['900px','545px'],
                    content : html,
                    btn: ['确认'],
                    success:function(){
                        $('#startDate,#endDate').datetimepicker({
                            format: 'yyyy-mm-dd',
                            language: 'zh-CN',
                            weekStart: 1,
                            autoclose: true,
                            todayHighlight: 1,
                            startView: 2,
                            minView: 2,
                            forceParse: 0
                        });
                    },
                    yes: function(index,layer0){
                        var tip_layer = layer.msg('正在导出数据中,请稍候...',{time: 0});
                        //layer.close(index);
                        var param_obj = get_export_param();
                        export_flight_node_data(1,param_obj);
                        //window.location.href = '/flight/flight_export/index' + '?apron='+apron+'&area='+area+'&export_type='+export_type+'&startDate='+startDate+'&endDate='+endDate+'&export_time_range='+export_time_range+'&export_start_hour='+export_start_hour+'&export_end_hour='+export_end_hour+'&export_in_or_out='+export_in_or_out+'&export_in_field='+export_in_field+'&export_out_field='+export_out_field+'&export_node_list_field='+export_node_list_field+'&export_cargo_field='+export_cargo_field+'&export_passenger_field='+export_passenger_field;
                    }
                });
            });
        });

    }

    /*
        确认/已确认
    */
    function confirmFn() {
        $('body').on('click','.zh-confirm',function(e){
             e.stopPropagation();
             var _this = $(this);
             if(_this.text() == "已确认"){
                return false;
             }
             if(CONFIRM_MSG_PERMISSION == false){
                    show_no_permission();
                    return false;
             }
             layer.msg('确认中,请稍候...',{time: 0});
             var info_object_id = _this.data('id');
             if(info_object_id != undefined){
                $.ajax({
                   type: 'POST',
                   dataType: "json",
                   data: {info_object_id:info_object_id},
                   url:CONFIRM_MSG_URL ,
                   cache: false,
                   timeout: 60000,
                   success: function(data){
                     if(data.code == 0){
                        layer.msg('已确认',{time: 1000});
                        _this.parent().html('<a href="###" class="zh-confirm selected">已确认</a>');
                     }
                   },
                });
             }
        });
    }

    //初始化数据
    function init_render_data(data,requestParamObj,field_list)
    {
        //请求类型
        var type = requestParamObj.f_status;

        var cur_field_tab = '';
        if(type.indexOf('in') !== -1){
            cur_field_tab = 'in';
        }else if(type.indexOf('out') !== -1){
            cur_field_tab = 'out';
        }else if(type.indexOf('all') !== -1){
            cur_field_tab = 'all';
        }else if(type.indexOf('food') !== -1){
            cur_field_tab = 'food';
        }else{
            cur_field_tab = type;
        }

       // var attr_html = '';


        //读取cookie判断属性表单html
        if(cur_field_tab !== 'all'){
            var attr_cookie = getCookie(type+'_attr_cookie');
            var attr_arr = [];
            var attr_class = '';
            var vip_class = '';
            var flight_status_class = '';
            var release_class = '';
            if(attr_cookie){
                var f_attr_group = [];
                f_attr_group['f_attr_0'] = '';
                f_attr_group['f_attr_0_active'] = '';
                $.each(f_attr_json,function(k,v){
                    k++;
                    f_attr_group['f_attr_'+k] = '';
                    f_attr_group['f_attr_'+k+'_active'] = '';
                });
                var f_vip_0 = '';
                var f_vip_0_active = '';
                var f_vip_1 = '';
                var f_vip_1_active = '';
                var f_vip_2 = '';
                var f_vip_2_active = '';

                var f_status_code_0 = '';
                var f_status_code_0_active = '';
                var f_status_code_1 = '';
                var f_status_code_1_active = '';
                var f_status_code_2 = '';
                var f_status_code_2_active = '';
                var f_status_code_3 = '';
                var f_status_code_3_active = '';
                var f_status_code_4 = '';
                var f_status_code_4_active = '';
                var f_status_code_5 = '';
                var f_status_code_5_active = '';
                var f_status_code_6 = '';
                var f_status_code_6_active = '';
                var f_status_code_7 = '';
                var f_status_code_7_active = '';
                var f_status_code_8 = '';
                var f_status_code_8_active = '';
                var f_status_code_9 = '';
                var f_status_code_9_active = '';
                var f_release_0 = '';
                var f_release_0_active = '';
                var f_release_1 = '';
                var f_release_1_active = '';
                var f_release_2 = '';
                var f_release_2_active = '';

                attr_arr = attr_cookie.split('|');
                var f_attr_val = attr_arr[0];
                if(f_attr_val != 0){
                    attr_class = 'red';
                    var f_attr_arr = f_attr_val.split(','); //array
                    $.each(f_attr_json,function(k,v){
                        k++;
                        if($.inArray(k.toString(),f_attr_arr) > -1){
                            f_attr_group['f_attr_'+k] = "checked='checked'";;
                            f_attr_group['f_attr_'+k+'_active'] = "active";
                        }
                    });
                }else{
                    f_attr_group['f_attr_0'] = "checked='checked'";
                    f_attr_group['f_attr_0_active'] = "active";
                }

                var f_vip_val = attr_arr[1];
                if(f_vip_val != 0){
                    vip_class = 'red';
                    if(f_vip_val == 1){
                        f_vip_1 = "checked='checked'";
                        f_vip_1_active = "active";
                    }else{
                        f_vip_2 = "checked='checked'";
                        f_vip_2_active = "active";
                    }
                }else{
                    f_vip_0 = "checked='checked'";
                    f_vip_0_active = "active";
                }
                var f_status_code_val = attr_arr[2];
                if(f_status_code_val != 0){
                    flight_status_class = 'red';
                    var f_status_code_arr = f_status_code_val.split(','); //array
                    if($.inArray('1',f_status_code_arr) > -1){
                        f_status_code_1 = "checked='checked'";
                        f_status_code_1_active = "active";
                    }
                    if($.inArray('2',f_status_code_arr) > -1){
                        f_status_code_2 = "checked='checked'";
                        f_status_code_2_active = "active";
                    }
                    if($.inArray('3',f_status_code_arr) > -1){
                        f_status_code_3 = "checked='checked'";
                        f_status_code_3_active = "active";
                    }
                    if($.inArray('4',f_status_code_arr) > -1){
                        f_status_code_4 = "checked='checked'";
                        f_status_code_4_active = "active";
                    }
                    if($.inArray('5',f_status_code_arr) > -1){
                        f_status_code_5 = "checked='checked'";
                        f_status_code_5_active = "active";
                    }
                    if($.inArray('6',f_status_code_arr) > -1){
                        f_status_code_6 = "checked='checked'";
                        f_status_code_6_active = "active";
                    }
                    if($.inArray('7',f_status_code_arr) > -1){
                        f_status_code_7 = "checked='checked'";
                        f_status_code_7_active = "active";
                    }
                    if($.inArray('8',f_status_code_arr) > -1){
                        f_status_code_8 = "checked='checked'";
                        f_status_code_8_active = "active";
                    }
                    if($.inArray('9',f_status_code_arr) > -1){
                        f_status_code_9 = "checked='checked'";
                        f_status_code_9_active = "active";
                    }
                }else{
                    f_status_code_0 = "checked='checked'";
                    f_status_code_0_active = "active";
                }
                var f_release_val = attr_arr[9];
                if(f_release_val != 0){
                    release_class = 'red';
                    var f_release_arr = f_release_val.split(','); //array
                    if($.inArray('1',f_release_arr) > -1){
                        f_release_1 = "checked='checked'";
                        f_release_1_active = "active";
                    }
                    if($.inArray('2',f_release_arr) > -1){
                        f_release_2 = "checked='checked'";
                        f_release_2_active = "active";
                    }
                }else{
                    f_release_0 = "checked='checked'";
                    f_release_0_active = "active";
                }
                var f_attr_html = '<li><label class="zh-fd-checkbox flight_attribute '+ f_attr_group["f_attr_0_active"]+'"><input name="f_attr[]" type="checkbox" value="0" '+f_attr_group["f_attr_0"]+'>全部属性</label></li>';
                $.each(f_attr_json,function(k,v){
                    k++;
                    f_attr_html += '<li><label class="zh-fd-checkbox flight_attribute '+ f_attr_group["f_attr_"+k+"_active"] +'"><input name="f_attr[]" type="checkbox" value="'+k+'" '+ f_attr_group["f_attr_"+k] +'>'+v+'</label></li>';
                });

                var f_vip_html = '<li><label class="zh-fd-checkbox flight_vip '+f_vip_0_active+'"><input name="f_vip[]" type="checkbox" value="0" '+f_vip_0+'>全部航班</label></li>';
                f_vip_html += '<li><label class="zh-fd-checkbox flight_vip '+ f_vip_1_active+'"><input name="f_vip[]" type="checkbox" value="1" '+ f_vip_1 +'>普通航班</label></li>';
                f_vip_html += '<li><label class="zh-fd-checkbox flight_vip '+ f_vip_2_active+'"><input name="f_vip[]" type="checkbox" value="2" '+ f_vip_2 +'>要客航班</label></li>';

                var f_status_code_html = '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_0_active+'"><input name="f_status_code[]" value="0" type="checkbox" '+f_status_code_0+'>全部</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_1_active+'"><input name="f_status_code[]" type="checkbox" value="1" '+ f_status_code_1+'>计划</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_2_active+'"><input name="f_status_code[]" type="checkbox" value="2" '+f_status_code_2+'>起飞</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_3_active+'"><input name="f_status_code[]" type="checkbox" value="3" '+f_status_code_3+'>到达</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_4_active+'"><input name="f_status_code[]" type="checkbox" value="4" '+f_status_code_4+'>延误</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_5_active+'"><input name="f_status_code[]" type="checkbox" value="5" '+f_status_code_5+'>取消</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_6_active+'"><input name="f_status_code[]" type="checkbox" value="6" '+f_status_code_6+'>备降</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_7_active+'"><input name="f_status_code[]" type="checkbox" value="7" '+f_status_code_7+'>滑回</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_8_active+'"><input name="f_status_code[]" type="checkbox" value="8" '+f_status_code_8+'>返航</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+f_status_code_9_active+'"><input name="f_status_code[]" type="checkbox" value="9" '+f_status_code_9+'>非营运</label></li>';

                var f_release_html = '<li><label class="zh-fd-checkbox release '+f_release_0_active+'"><input name="f_release_situation[]" type="checkbox" value="0" '+f_release_0+'>全部</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release '+ f_release_1_active+'"><input name="f_release_situation[]" type="checkbox" value="1" '+ f_release_1 +'>正常</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release '+ f_release_2_active+'"><input name="f_release_situation[]" type="checkbox" value="2" '+ f_release_2 +'>延误</label></li>';
            }
            else{

                var f_attr_html = '<li><label class="zh-fd-checkbox flight_attribute  active"><input name="f_attr[]" type="checkbox" value="0" checked="checked">全部属性</label></li>';
                $.each(f_attr_json,function(k,v){
                    k++;
                    f_attr_html += '<li><label class="zh-fd-checkbox flight_attribute "><input name="f_attr[]" type="checkbox" value="'+k+'">'+v+'</label></li>';
                });

                var f_vip_html = '<li><label class="zh-fd-checkbox flight_vip active"><input name="f_vip[]" type="checkbox" value="0" checked="checked">全部航班</label></li>';
                f_vip_html += '<li><label class="zh-fd-checkbox flight_vip"><input name="f_vip[]" type="checkbox" value="1">普通航班</label></li>';
                f_vip_html += '<li><label class="zh-fd-checkbox flight_vip"><input name="f_vip[]" type="checkbox" value="2">要客航班</label></li>';

                var f_status_code_html = '<li><label class="zh-fd-checkbox flight_status_code active"><input name="f_status_code[]" value="0" type="checkbox" checked="checked">全部</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="1">计划</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="2">起飞</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="3">到达</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="4">延误</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="5">取消</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="6">备降</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="7">滑回</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="8">返航</label></li>';
                f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="f_status_code[]" type="checkbox" value="9">非营运</label></li>';
                var f_release_html = '<li><label class="zh-fd-checkbox release active"><input name="f_release_situation[]" type="checkbox" value="0" checked="checked">全部</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release"><input name="f_release_situation[]" type="checkbox" value="1">正常</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release"><input name="f_release_situation[]" type="checkbox" value="2">延误</label></li>';
            }

            //排序class start
            var scheduled_deptime_sort = '';
            var estimated_deptime_sort = '';
            var actual_deptime_sort = '';
            var scheduled_arrtime_sort = '';
            var estimated_arrtime_sort = '';
            var actual_arrtime_sort = '';
            if(requestParamObj.order_field == 'scheduled_deptime'){
                scheduled_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'estimated_deptime'){
                estimated_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'actual_deptime'){
                actual_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'scheduled_arrtime'){
                scheduled_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'estimated_arrtime'){
                estimated_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'actual_arrtime'){
                actual_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }
            //排序class end

            var head_html = '<tr>';
            head_html += '<th><div class="zh-cell-wrap">关注</div></th>';
            $.each(field_list[cur_field_tab],function(k,v){
                if(field_config[cur_field_tab][v].name == 'in_cla' || field_config[cur_field_tab][v].name == 'out_cla' || field_config[cur_field_tab][v].name == 'cla'){
                    if(cur_field_tab == 'meet'){
                        head_html += ' <th><div class="zh-cell-wrap"><span class="zh-field-name '+attr_class+'">属性</span></div></th>';
                    }else{
                        head_html += ' <th><div class="zh-cell-wrap"><span class="zh-field-name '+attr_class+'">属性</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul class="zh-fd-scrollbar3">' + f_attr_html + '</ul></div></div></th>';
                    }

                }else if(field_config[cur_field_tab][v].name == 'in_fnum' || field_config[cur_field_tab][v].name == 'out_fnum'){
                    if(cur_field_tab == 'meet'){
                        head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name">'+field_config[cur_field_tab][v].cn_name+'</span></div></th>';
                    }else{
                        if(cur_field_tab == 'in' && field_config[cur_field_tab][v].name == 'in_fnum'){
                            head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name '+vip_class+'">'+field_config[cur_field_tab][v].cn_name+'</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul>'+ f_vip_html + '</ul></div></div></th>';
                        }else if(cur_field_tab == 'out' && field_config[cur_field_tab][v].name == 'out_fnum'){
                            head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name '+vip_class+'">'+field_config[cur_field_tab][v].cn_name+'</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul>'+ f_vip_html + '</ul></div></div></th>';
                        }else{
                            head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name">'+field_config[cur_field_tab][v].cn_name+'</span></div></th>';
                        }
                    }


                }else if(field_config[cur_field_tab][v].name == 'in_flight_status_code' || field_config[cur_field_tab][v].name == 'out_flight_status_code' || field_config[cur_field_tab][v].name == 'flight_status_code'){
                    if(cur_field_tab == 'meet'){
                        head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name '+flight_status_class+'">状态</span></div></th>';
                    }else{
                        head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name '+flight_status_class+'">状态</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown zh-width-80"><ul class="zh-fd-scrollbar3">' + f_status_code_html + '</ul></div></div></th>';
                    }

                }else if(field_config[cur_field_tab][v].name == 'release_situation'){
                    head_html += ' <th><div class="zh-cell-wrap"><span class="zh-field-name '+release_class+'">放行情况</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown zh-width-80"><ul class="zh-fd-scrollbar3">' + f_release_html + '</ul></div></div></th>';
                }else if(field_config[cur_field_tab][v].name == 'in_scheduled_deptime' || field_config[cur_field_tab][v].name == 'out_scheduled_deptime' || field_config[cur_field_tab][v].name == 'scheduled_deptime'){
                    head_html += '<th class="zh-order"><div class="zh-cell-wrap"><span title="计划起飞时间" class="zh-field-name">计飞</span> <span class="zh-icon-order '+scheduled_deptime_sort+'" order_field="scheduled_deptime"></span></div></th>';
                }else if(field_config[cur_field_tab][v].name == 'in_estimated_deptime' || field_config[cur_field_tab][v].name == 'estimated_deptime' || field_config[cur_field_tab][v].name == 'out_estimated_deptime'){
                    head_html += '<th class="zh-order"><div class="zh-cell-wrap"><span title="预计起飞时间" class="zh-field-name">预飞(F)</span> <span class="zh-icon-order '+estimated_deptime_sort+'" order_field="estimated_deptime"></span></div></th>';
                }else if(field_config[cur_field_tab][v].name == 'in_actual_deptime' || field_config[cur_field_tab][v].name == 'actual_deptime' || field_config[cur_field_tab][v].name == 'out_actual_deptime'){
                    head_html += '<th class="zh-order"><div class="zh-cell-wrap"><span title="实际起飞时间" class="zh-field-name">实飞</span> <span class="zh-icon-order '+actual_deptime_sort+'" order_field="actual_deptime"></span></div></th>';
                }else if(field_config[cur_field_tab][v].name == 'in_scheduled_arrtime' || field_config[cur_field_tab][v].name == 'scheduled_arrtime' || field_config[cur_field_tab][v].name == 'out_scheduled_arrtime'){
                    head_html += '<th class="zh-order"><div class="zh-cell-wrap"><span title="计划到达时间" class="zh-field-name">计达</span> <span class="zh-icon-order '+scheduled_arrtime_sort+'" order_field="scheduled_arrtime"></span></div></th>';
                }else if(field_config[cur_field_tab][v].name == 'in_estimated_arrtime' || field_config[cur_field_tab][v].name == 'estimated_arrtime' || field_config[cur_field_tab][v].name == 'out_estimated_arrtime'){
                    head_html += '<th class="zh-order"><div class="zh-cell-wrap"><span title="预计到达时间" class="zh-field-name">预达(F)</span> <span class="zh-icon-order '+estimated_arrtime_sort+'" order_field="estimated_arrtime"></span></div></th>';
                }else if(field_config[cur_field_tab][v].name == 'in_actual_arrtime' || field_config[cur_field_tab][v].name == 'actual_arrtime' || field_config[cur_field_tab][v].name == 'out_actual_arrtime'){
                    head_html += '<th class="zh-order"><div class="zh-cell-wrap"><span title="实际到达时间" class="zh-field-name">实达</span> <span class="zh-icon-order '+actual_arrtime_sort+'" order_field="actual_arrtime"></span></div></th>';
                }else{
                    head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name">'+field_config[cur_field_tab][v].cn_name+'</span></div></th>';
                }

            });

            head_html += '<th><div class="zh-cell-wrap"><span class="zh-field-name">操作</span></div></th></tr>';

            var i=0;
            $(".flight-list-table thead").html(head_html);
            var tbody_html = '';
            $.each(data,function(fid,flight){
                var checked = '';
                var id_active = '';
                if(flight.is_attention === 1){
                    checked = "checked='checked'";
                    id_active = "active";
                }
                //是否为VIP
                var in_is_vip = '';
                if(flight.in_is_vip === "1"){
                    in_is_vip = '<span class="zh-vip-yellow">V</span>';
                }
                var out_is_vip = '';
                if(flight.out_is_vip === "1"){
                    out_is_vip = '<span class="zh-vip-black">V</span>';
                }
                var is_vip = '';
                if(flight.is_vip !== undefined && flight.is_vip == "1"){
                    if(flight.in_flag !== undefined)
                    {
                        if(flight.in_flag == 1){
                            //进港
                            is_vip = '<span class="zh-vip-yellow">V</span>';
                        }else{
                            //出港
                            is_vip = '<span class="zh-vip-black">V</span>';
                        }
                    }

                }

                //标识会议航班
                var in_is_meeting = '';
                if(flight.in_is_meeting == 1){
                    in_is_meeting = '<span class="zh-vip-yellow">M</span>';
                }
                var out_is_meeting = '';
                if(flight.out_is_meeting == 1){
                    out_is_meeting = '<span class="zh-vip-black">M</span>';
                }

                var is_meeting = '';
                if(flight.is_meeting !== undefined && flight.is_meeting == 1)
                {
                    if(flight.in_flag !== undefined)
                    {
                        if(flight.in_flag == 1){
                            //进港
                            is_meeting = '<span class="zh-vip-yellow">M</span>';
                        }else{
                            //出港
                            is_meeting = '<span class="zh-vip-black">M</span>';
                        }
                    }
                }

                //航班状态背景色
                var bg_flight_status_code_cn = ['备降','正在备降','返航','正在返航','取消'];
                var flight_status_bg_class = '';

                var flight_status_code_field = '';
                if(cur_field_tab == 'in') {
                    flight_status_code_field = 'in_flight_status_code';
                }else if(cur_field_tab == 'out'){
                    flight_status_code_field = 'out_flight_status_code';
                }else{
                    flight_status_code_field = 'flight_status_code';
                }

                if(flight[flight_status_code_field] !== undefined){
                    if(flight[flight_status_code_field] == "到达"){
                        flight_status_bg_class = 'zh-bg-blue';
                    }else if(flight[flight_status_code_field] == "起飞"){
                        flight_status_bg_class = 'zh-bg-green';
                    }else if(flight[flight_status_code_field] == '延误'){
                        flight_status_bg_class = 'zh-bg-yellow';
                    }else if($.inArray(flight[flight_status_code_field],bg_flight_status_code_cn) !== -1){
                        flight_status_bg_class = 'zh-bg-red';
                    }
                }

                //进港共享航班
                var in_share_flight_str = '';
                var out_share_flight_str = '';
                //出港虚拟航班
                var in_virtual_flight_str = '';
                var out_virtual_flight_str = '';
                //共享航班
                var share_flight_str = '';
                //虚拟航班
                var virtual_flight_str = '';
                var in_flag_class = '';
                var out_flag_class = '';
                var flag_class = '';
                var tips_class = 'class="zh-tip-share"';
                var in_tips_html = "";
                var out_tips_html = "";
                var tips_html = "";
                if(flight.in_share_flight_string !== undefined && flight.in_share_flight_string !== ''){
                    in_share_flight_str = '共享:'+flight.in_share_flight_string;
                    in_flag_class = 'zh-text-black-bold';
                }
                if(flight.in_virtual_flight_string !== undefined && flight.in_virtual_flight_string !== ''){
                    in_virtual_flight_str = ' 虚拟:'+flight.in_virtual_flight_string;
                    in_flag_class = 'zh-text-black-bold';
                }
                if(in_share_flight_str !== '' || in_virtual_flight_str !== ''){
                    in_tips_html += tips_class + 'data-share="'+in_share_flight_str+in_virtual_flight_str+'"';
                }

                if(flight.out_share_flight_string !== undefined && flight.out_share_flight_string !== ''){
                    out_share_flight_str = '共享:'+flight.out_share_flight_string;
                    out_flag_class = 'zh-text-black-bold';
                }
                if(flight.out_virtual_flight_string !== undefined && flight.out_virtual_flight_string !== ''){
                    out_virtual_flight_str += ' 虚拟:'+flight.out_virtual_flight_string;
                    out_flag_class = 'zh-text-black-bold';
                }
                if(out_share_flight_str !== '' || out_virtual_flight_str !== ''){
                    out_tips_html += tips_class + 'data-share="'+out_share_flight_str+out_virtual_flight_str+'"';
                }
                if(flight.share_flight_string !== undefined && flight.share_flight_string !== ''){
                    share_flight_str = '共享:'+flight.share_flight_string;
                    flag_class = 'zh-text-black-bold';
                }
                if(flight.virtual_flight_string !== undefined && flight.virtual_flight_string !== ''){
                    virtual_flight_str = ' 虚拟:'+flight.virtual_flight_string;
                    flag_class = 'zh-text-black-bold';
                }
                if(share_flight_str !== '' || virtual_flight_str !== ''){
                    tips_html += tips_class + 'data-share="'+share_flight_str+virtual_flight_str+'"';
                }
                //second state
                var second_state_str = flight.second_state;
                //预计时间ADSB标记
                var es_time_dep_adsb = '';
                var es_time_arr_adsb = '';
                if(flight.es_arr_time_adsb == 1)
                {
                    es_time_arr_adsb = '<i class="am-icon-A">A</i>';
                }
                if(flight.es_dep_time_adsb == 1)
                {
                    es_time_dep_adsb = '<i class="am-icon-A">A</i>';
                }
                var is_delay_class = '';
                if(flight['is_delay_flight'] == 1) is_delay_class = 'delay';
                tbody_html += '<tr class="'+is_delay_class+' '+flight_status_bg_class+'" data-flight-date="'+flight.flight_date+'" id="flight_list_'+fid+'">';
                tbody_html += '<td><div class="zh-cell-wrap"><label class="zh-fd-checkbox attention_id '+ id_active +'"><input class="attention_flight" type="checkbox" name="attention" value="'+flight.fid+'" '+checked+'>'+flight.id+'</label></div></td>';
                var time_field_arr = ['in_scheduled_deptime','in_estimated_deptime','in_actual_deptime','in_scheduled_arrtime','in_estimated_arrtime','in_actual_arrtime','out_scheduled_deptime','out_estimated_deptime','out_actual_deptime','out_scheduled_arrtime','out_estimated_arrtime','out_actual_arrtime','scheduled_deptime','estimated_deptime','actual_deptime','scheduled_arrtime','estimated_arrtime','actual_arrtime','cobt','ctot'];

                $.each(field_list[cur_field_tab],function(k,v){
                    if(field_config[cur_field_tab][v].name == 'in_fnum'){
                        tbody_html += '<td '+in_tips_html+'><div class="zh-cell-wrap"><a class="zh-field-value zh-flight-number '+ in_flag_class +'" href="###">'+ flight[field_config[cur_field_tab][v].name] +'</a>'+ in_is_vip + in_is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'out_fnum'){
                        tbody_html += '<td '+out_tips_html+'><div class="zh-cell-wrap"><a class="zh-field-value zh-flight-number zh-text-gray2 '+ out_flag_class +'" href="###">'+flight[field_config[cur_field_tab][v].name]+'</a>'+ out_is_vip + out_is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'fnum'){
                        tbody_html += '<td '+tips_html+'><div class="zh-cell-wrap"><a class="zh-field-value zh-flight-number zh-text-gray2 '+ flag_class +'" href="###">'+flight[field_config[cur_field_tab][v].name]+'</a>'+ is_vip + is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'airport_lines'){
                        tbody_html += '<td class="zh-tip-share" data-share="'+flight[field_config[cur_field_tab][v].name]+'"><div class="zh-cell-wrap"><a class="zh-field-value zh-airline" href="###">'+ textEllipsisFn(flight[field_config[cur_field_tab][v].name]) +'</a></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'in_flight_status_code' || field_config[cur_field_tab][v].name == 'out_flight_status_code' || field_config[cur_field_tab][v].name == 'flight_status_code'){
                        tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value">'+ flight[field_config[cur_field_tab][v].name] +'</span> ' + second_state_str + '</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'process_status'){
                        tbody_html += '<td title="'+flight.process_time+'"><div class="zh-cell-wrap"><a target="_blank" href="'+flight.process_detail_link+'" class="zh-field-value">'+ flight[field_config[cur_field_tab][v].name] +'</a></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'aircraft_num'){
                        tbody_html += '<td><div class="zh-cell-wrap"><a data-aircraft-type="'+flight.aircraft_type+'" class="zh-field-value zh-plane-number" href="###">'+flight[field_config[cur_field_tab][v].name]+'</a></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'in_parking' || field_config[cur_field_tab][v].name == 'out_parking'){
                        tbody_html += '<td><div class="zh-cell-wrap">'+flight[field_config[cur_field_tab][v].name]+'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'aircraft_type'){
                        tbody_html += '<td class="am-plane-type"><div class="zh-cell-wrap"><span class="zh-field-value zh-plane-type"><i>'+ flight[field_config[cur_field_tab][v].name] +'</i></span></div></td>';
                    }else if(field_config[cur_field_tab][v].name.indexOf('estimated_deptime') !== -1 && field_config[cur_field_tab][v].name.indexOf('isd') == -1 ){
                        tbody_html += '<td><div class="zh-cell-wrap">'+es_time_dep_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab][v].name.indexOf('estimated_arrtime') !== -1 && field_config[cur_field_tab][v].name.indexOf('isd') == -1 ){
                        tbody_html += '<td><div class="zh-cell-wrap">'+es_time_arr_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if($.inArray(field_config[cur_field_tab][v].name,time_field_arr) !==-1){
                        tbody_html += '<td><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'aoc_info'){
                        tbody_html += '<td><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'release_situation'){
                        tbody_html += '<td class="zh-bg-bgray"><div class="zh-cell-wrap">'+ flight['release_situation'] + flight['release_situation_time'] +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'turnaround_time'){
                        if(flight['turnaround_time'] == ''){
                            tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value "></span></div></td>';
                        }else{
                            var turnaround_time = flight['turnaround_time'];
                            if(turnaround_time.indexOf('+') != -1){
                                tbody_html += '<td class="am-font-red"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                            }else{
                                tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                            }
                        }
                    }
                    else
                    {
                        tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value ">'+ flight[field_config[cur_field_tab][v].name] +'</span></div></td>';
                    }
                });
                tbody_html += '<td class="show_fid"><div class="zh-cell-wrap"><a class="zh-field-value zh-edit" href="###">编辑</a><a class="zh-field-value zh-msg zh-ml-5" href="###">消息</a></div></td></tr>';
            });
            $(".flight-list-table tbody").html(tbody_html);
        }else{
            var in_attr_class = '';var out_attr_class = '';var in_vip_class = '';var out_vip_class = '';var in_flight_status_class = '';var out_flight_status_class = '';
            var release_class = '';
            var attr_cookie = getCookie(type+'_attr_cookie');
            var attr_arr = [];
            if(attr_cookie){
                var f_attr_group = [];
                f_attr_group['in_f_attr_0'] = '';
                f_attr_group['in_f_attr_0_active'] = '';
                $.each(f_attr_json,function(k,v){
                    k++;
                    f_attr_group['in_f_attr_'+k] = '';
                    f_attr_group['in_f_attr_'+k+'_active'] = '';
                });

                var in_f_vip_0 = '';
                var in_f_vip_0_active = '';
                var in_f_vip_1 = '';
                var in_f_vip_1_active = '';
                var in_f_vip_2 = '';
                var in_f_vip_2_active = '';

                var in_f_status_code_0 = '';
                var in_f_status_code_0_active = '';
                var in_f_status_code_1 = '';
                var in_f_status_code_1_active = '';
                var in_f_status_code_2 = '';
                var in_f_status_code_2_active = '';
                var in_f_status_code_3 = '';
                var in_f_status_code_3_active = '';
                var in_f_status_code_4 = '';
                var in_f_status_code_4_active = '';
                var in_f_status_code_5 = '';
                var in_f_status_code_5_active = '';
                var in_f_status_code_6 = '';
                var in_f_status_code_6_active = '';
                var in_f_status_code_7 = '';
                var in_f_status_code_7_active = '';
                var in_f_status_code_8 = '';
                var in_f_status_code_8_active = '';
                var in_f_status_code_9 = '';
                var in_f_status_code_9_active = '';

                f_attr_group['out_f_attr_0'] = '';
                f_attr_group['out_f_attr_0_active'] = '';
                $.each(f_attr_json,function(k,v){
                    k++;
                    f_attr_group['out_f_attr_'+k] = '';
                    f_attr_group['out_f_attr_'+k+'_active'] = '';
                });

                var out_f_vip_0 = '';
                var out_f_vip_0_active = '';
                var out_f_vip_1 = '';
                var out_f_vip_1_active = '';
                var out_f_vip_2 = '';
                var out_f_vip_2_active = '';

                var out_f_status_code_0 = '';
                var out_f_status_code_0_active = '';
                var out_f_status_code_1 = '';
                var out_f_status_code_1_active = '';
                var out_f_status_code_2 = '';
                var out_f_status_code_2_active = '';
                var out_f_status_code_3 = '';
                var out_f_status_code_3_active = '';
                var out_f_status_code_4 = '';
                var out_f_status_code_4_active = '';
                var out_f_status_code_5 = '';
                var out_f_status_code_5_active = '';
                var out_f_status_code_6 = '';
                var out_f_status_code_6_active = '';
                var out_f_status_code_7 = '';
                var out_f_status_code_7_active = '';
                var out_f_status_code_8 = '';
                var out_f_status_code_8_active = '';
                var out_f_status_code_9 = '';
                var out_f_status_code_9_active = '';
                var f_release_0 = '';
                var f_release_0_active = '';
                var f_release_1 = '';
                var f_release_1_active = '';
                var f_release_2 = '';
                var f_release_2_active = '';
                attr_arr = attr_cookie.split('|');
                var in_f_attr_val = attr_arr[3];
                if(in_f_attr_val != 0){
                    in_attr_class = 'red';
                    var in_f_attr_arr = in_f_attr_val.split(','); //array
                    $.each(f_attr_json,function(k,v){
                        k++;
                        if($.inArray(k.toString(),in_f_attr_arr) > -1){
                            f_attr_group['in_f_attr_'+k] = "checked='checked'";
                            f_attr_group['in_f_attr_'+k+'_active'] = "active";
                        }
                    });

                }else{
                    f_attr_group['in_f_attr_0'] = "checked='checked'";
                    f_attr_group['in_f_attr_0_active'] = "active";
                }
                var in_f_vip_val = attr_arr[4];
                if(in_f_vip_val != 0){
                    in_vip_class = 'red';
                    if(in_f_vip_val == 1){
                        in_f_vip_1 = "checked='checked'";
                        in_f_vip_1_active = "active";
                    }else{
                        in_f_vip_2 = "checked='checked'";
                        in_f_vip_2_active = "active";
                    }
                }else{
                    in_f_vip_0 = "checked='checked'";
                    in_f_vip_0_active = "active";
                }
                var in_f_status_code_val = attr_arr[5];
                if(in_f_status_code_val != 0){
                    in_flight_status_class = 'red';
                    var in_f_status_code_arr = in_f_status_code_val.split(','); //array
                    if($.inArray('1',in_f_status_code_arr) > -1){
                        in_f_status_code_1 = "checked='checked'";
                        in_f_status_code_1_active = "active";
                    }
                    if($.inArray('2',in_f_status_code_arr) > -1){
                        in_f_status_code_2 = "checked='checked'";
                        in_f_status_code_2_active = "active";
                    }
                    if($.inArray('3',in_f_status_code_arr) > -1){
                        in_f_status_code_3 = "checked='checked'";
                        in_f_status_code_3_active = "active";
                    }
                    if($.inArray('4',in_f_status_code_arr) > -1){
                        in_f_status_code_4 = "checked='checked'";
                        in_f_status_code_4_active = "active";
                    }
                    if($.inArray('5',in_f_status_code_arr) > -1){
                        in_f_status_code_5 = "checked='checked'";
                        in_f_status_code_5_active = "active";
                    }
                    if($.inArray('6',in_f_status_code_arr) > -1){
                        in_f_status_code_6 = "checked='checked'";
                        in_f_status_code_6_active = "active";
                    }
                    if($.inArray('7',in_f_status_code_arr) > -1){
                        in_f_status_code_7 = "checked='checked'";
                        in_f_status_code_7_active = "active";
                    }
                    if($.inArray('8',in_f_status_code_arr) > -1){
                        in_f_status_code_8 = "checked='checked'";
                        in_f_status_code_8_active = "active";
                    }
                    if($.inArray('9',in_f_status_code_arr) > -1){
                        in_f_status_code_9 = "checked='checked'";
                        in_f_status_code_9_active = "active";
                    }
                }else{
                    in_f_status_code_0 = "checked='checked'";
                    in_f_status_code_0_active = "active";
                }
                var out_f_attr_val = attr_arr[6];
                if(out_f_attr_val != 0){
                    out_attr_class = 'red';
                    var out_f_attr_arr = out_f_attr_val.split(','); //array
                    $.each(f_attr_json,function(k,v){
                        k++;
                        if($.inArray(k.toString(),out_f_attr_arr) > -1){
                            f_attr_group['out_f_attr_'+k] = "checked='checked'";
                            f_attr_group['out_f_attr_'+k+'_active'] = "active";
                        }
                    });
                }else{
                    f_attr_group['out_f_attr_0'] = "checked='checked'";
                    f_attr_group['out_f_attr_0_active'] = "active";
                }
                var out_f_vip_val = attr_arr[7];
                if(out_f_vip_val != 0){
                    out_vip_class = 'red';
                    if(out_f_vip_val == 1){
                        out_f_vip_1 = "checked='checked'";
                        out_f_vip_1_active = "active";
                    }else{
                        out_f_vip_2 = "checked='checked'";
                        out_f_vip_2_active = "active";
                    }
                }else{
                    out_f_vip_0 = "checked='checked'";
                    out_f_vip_0_active = "active";
                }
                var out_f_status_code_val = attr_arr[8];
                if(out_f_status_code_val != 0){
                    out_flight_status_class = 'red';
                    var out_f_status_code_arr = out_f_status_code_val.split(','); //array
                    if($.inArray('1',out_f_status_code_arr) > -1){
                        out_f_status_code_1 = "checked='checked'";
                        out_f_status_code_1_active = "active";
                    }
                    if($.inArray('2',out_f_status_code_arr) > -1){
                        out_f_status_code_2 = "checked='checked'";
                        out_f_status_code_2_active = "active";
                    }
                    if($.inArray('3',out_f_status_code_arr) > -1){
                        out_f_status_code_3 = "checked='checked'";
                        out_f_status_code_3_active = "active";
                    }
                    if($.inArray('4',out_f_status_code_arr) > -1){
                        out_f_status_code_4 = "checked='checked'";
                        out_f_status_code_4_active = "active";
                    }
                    if($.inArray('5',out_f_status_code_arr) > -1){
                        out_f_status_code_5 = "checked='checked'";
                        out_f_status_code_5_active = "active";
                    }
                    if($.inArray('6',out_f_status_code_arr) > -1){
                        out_f_status_code_6 = "checked='checked'";
                        out_f_status_code_6_active = "active";
                    }
                    if($.inArray('7',out_f_status_code_arr) > -1){
                        out_f_status_code_7 = "checked='checked'";
                        out_f_status_code_7_active = "active";
                    }
                    if($.inArray('8',out_f_status_code_arr) > -1){
                        out_f_status_code_8 = "checked='checked'";
                        out_f_status_code_8_active = "active";
                    }
                    if($.inArray('9',out_f_status_code_arr) > -1){
                        out_f_status_code_9 = "checked='checked'";
                        out_f_status_code_9_active = "active";
                    }
                }else{
                    out_f_status_code_0 = "checked='checked'";
                    out_f_status_code_0_active = "active";
                }
                var f_release_val = attr_arr[9];
                if(f_release_val != 0){
                    release_class = 'red';
                    var f_release_arr = f_release_val.split(','); //array
                    if($.inArray('1',f_release_arr) > -1){
                        f_release_1 = "checked='checked'";
                        f_release_1_active = "active";
                    }
                    if($.inArray('2',f_release_arr) > -1){
                        f_release_2 = "checked='checked'";
                        f_release_2_active = "active";
                    }
                }else{
                    f_release_0 = "checked='checked'";
                    f_release_0_active = "active";
                }
                var in_f_attr_html = '<li><label class="zh-fd-checkbox flight_attribute '+ f_attr_group["in_f_attr_0_active"]+'"><input name="in_f_attr[]" type="checkbox" value="0" '+f_attr_group["in_f_attr_0"]+'>全部属性</label></li>';
                $.each(f_attr_json,function(k,v){
                    k++;
                    in_f_attr_html += '<li><label class="zh-fd-checkbox flight_attribute '+ f_attr_group["in_f_attr_"+k+"_active"] +'"><input name="in_f_attr[]" type="checkbox" value="'+k+'" '+ f_attr_group["in_f_attr_"+k] +'>'+v+'</label></li>';
                });

                var in_f_vip_html = '<li><label class="zh-fd-checkbox flight_vip '+in_f_vip_0_active+'"><input name="in_f_vip[]" type="checkbox" value="0" '+in_f_vip_0+'>全部航班</label></li>';
                in_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip '+ in_f_vip_1_active+'"><input name="in_f_vip[]" type="checkbox" value="1" '+ in_f_vip_1 +'>普通航班</label></li>';
                in_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip '+ in_f_vip_2_active+'"><input name="in_f_vip[]" type="checkbox" value="2" '+ in_f_vip_2 +'>要客航班</label></li>';

                var in_f_status_code_html = '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_0_active+'"><input name="in_f_status_code[]" value="0" type="checkbox" '+in_f_status_code_0+'>全部</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_1_active+'"><input name="in_f_status_code[]" type="checkbox" value="1" '+ in_f_status_code_1+'>计划</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_2_active+'"><input name="in_f_status_code[]" type="checkbox" value="2" '+in_f_status_code_2+'>起飞</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_3_active+'"><input name="in_f_status_code[]" type="checkbox" value="3" '+in_f_status_code_3+'>到达</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_4_active+'"><input name="in_f_status_code[]" type="checkbox" value="4" '+in_f_status_code_4+'>延误</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_5_active+'"><input name="in_f_status_code[]" type="checkbox" value="5" '+in_f_status_code_5+'>取消</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_6_active+'"><input name="in_f_status_code[]" type="checkbox" value="6" '+in_f_status_code_6+'>备降</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_7_active+'"><input name="in_f_status_code[]" type="checkbox" value="7" '+in_f_status_code_7+'>滑回</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_8_active+'"><input name="in_f_status_code[]" type="checkbox" value="8" '+in_f_status_code_8+'>返航</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+in_f_status_code_9_active+'"><input name="in_f_status_code[]" type="checkbox" value="9" '+in_f_status_code_9+'>非营运</label></li>';

                var out_f_attr_html = '<li><label class="zh-fd-checkbox flight_attribute '+ f_attr_group["out_f_attr_0_active"]+'"><input name="out_f_attr[]" type="checkbox" value="0" '+f_attr_group["out_f_attr_0"]+'>全部属性</label></li>';
                $.each(f_attr_json,function(k,v){
                    k++;
                    out_f_attr_html += '<li><label class="zh-fd-checkbox flight_attribute '+ f_attr_group["out_f_attr_"+k+"_active"] +'"><input name="out_f_attr[]" type="checkbox" value="'+k+'" '+ f_attr_group["out_f_attr_"+k] +'>'+v+'</label></li>';
                });

                var out_f_vip_html = '<li><label class="zh-fd-checkbox flight_vip '+out_f_vip_0_active+'"><input name="out_f_vip[]" type="checkbox" value="0" '+out_f_vip_0+'>全部航班</label></li>';
                out_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip '+ out_f_vip_1_active+'"><input name="out_f_vip[]" type="checkbox" value="1" '+ out_f_vip_1 +'>普通航班</label></li>';
                out_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip '+ out_f_vip_2_active+'"><input name="out_f_vip[]" type="checkbox" value="2" '+ out_f_vip_2 +'>要客航班</label></li>';

                var out_f_status_code_html = '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_0_active+'"><input name="out_f_status_code[]" value="0" type="checkbox" '+out_f_status_code_0+'>全部</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_1_active+'"><input name="out_f_status_code[]" type="checkbox" value="1" '+ out_f_status_code_1+'>计划</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_2_active+'"><input name="out_f_status_code[]" type="checkbox" value="2" '+out_f_status_code_2+'>起飞</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_3_active+'"><input name="out_f_status_code[]" type="checkbox" value="3" '+out_f_status_code_3+'>到达</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_4_active+'"><input name="out_f_status_code[]" type="checkbox" value="4" '+out_f_status_code_4+'>延误</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_5_active+'"><input name="out_f_status_code[]" type="checkbox" value="5" '+out_f_status_code_5+'>取消</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_6_active+'"><input name="out_f_status_code[]" type="checkbox" value="6" '+out_f_status_code_6+'>备降</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_7_active+'"><input name="out_f_status_code[]" type="checkbox" value="7" '+out_f_status_code_7+'>滑回</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_8_active+'"><input name="out_f_status_code[]" type="checkbox" value="8" '+out_f_status_code_8+'>返航</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code '+out_f_status_code_9_active+'"><input name="out_f_status_code[]" type="checkbox" value="9" '+out_f_status_code_9+'>非营运</label></li>';

                var f_release_html = '<li><label class="zh-fd-checkbox release '+f_release_0_active+'"><input name="f_release_situation[]" type="checkbox" value="0" '+f_release_0+'>全部</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release '+ f_release_1_active+'"><input name="f_release_situation[]" type="checkbox" value="1" '+ f_release_1 +'>正常</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release '+ f_release_2_active+'"><input name="f_release_situation[]" type="checkbox" value="2" '+ f_release_2 +'>延误</label></li>';
            }else{
                var in_f_attr_html = '<li><label class="zh-fd-checkbox flight_attribute  active"><input name="in_f_attr[]" type="checkbox" value="0" checked="checked">全部属性</label></li>';
                $.each(f_attr_json,function(k,v){
                    k++;
                    in_f_attr_html += '<li><label class="zh-fd-checkbox flight_attribute "><input name="in_f_attr[]" type="checkbox" value="'+k+'">'+v+'</label></li>';
                });
                var out_f_attr_html = '<li><label class="zh-fd-checkbox flight_attribute  active"><input name="out_f_attr[]" type="checkbox" value="0" checked="checked">全部属性</label></li>';
                $.each(f_attr_json,function(k,v){
                    k++;
                    out_f_attr_html += '<li><label class="zh-fd-checkbox flight_attribute "><input name="out_f_attr[]" type="checkbox" value="'+k+'">'+v+'</label></li>';
                });

                var in_f_vip_html = '<li><label class="zh-fd-checkbox flight_vip active"><input name="in_f_vip[]" type="checkbox" value="0" checked="checked">全部航班</label></li>';
                in_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip"><input name="in_f_vip[]" type="checkbox" value="1">普通航班</label></li>';
                in_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip"><input name="in_f_vip[]" type="checkbox" value="2">要客航班</label></li>';

                var out_f_vip_html = '<li><label class="zh-fd-checkbox flight_vip active"><input name="out_f_vip[]" type="checkbox" value="0" checked="checked">全部航班</label></li>';
                out_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip"><input name="out_f_vip[]" type="checkbox" value="1">普通航班</label></li>';
                out_f_vip_html += '<li><label class="zh-fd-checkbox flight_vip"><input name="out_f_vip[]" type="checkbox" value="2">要客航班</label></li>';

                var in_f_status_code_html = '<li><label class="zh-fd-checkbox flight_status_code active"><input name="in_f_status_code[]" value="0" type="checkbox" checked="checked">全部</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="1">计划</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="2">起飞</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="3">到达</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="4">延误</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="5">取消</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="6">备降</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="7">滑回</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="8">返航</label></li>';
                in_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="in_f_status_code[]" type="checkbox" value="9">非营运</label></li>';

                var out_f_status_code_html = '<li><label class="zh-fd-checkbox flight_status_code active"><input name="out_f_status_code[]" value="0" type="checkbox" checked="checked">全部</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="1">计划</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="2">起飞</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="3">到达</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="4">延误</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="5">取消</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="6">备降</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="7">滑回</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="8">返航</label></li>';
                out_f_status_code_html += '<li><label class="zh-fd-checkbox flight_status_code"><input name="out_f_status_code[]" type="checkbox" value="9">非营运</label></li>';

                var f_release_html = '<li><label class="zh-fd-checkbox release active"><input name="f_release_situation[]" type="checkbox" value="0" checked="checked">全部</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release"><input name="f_release_situation[]" type="checkbox" value="1">正常</label></li>';
                f_release_html += '<li><label class="zh-fd-checkbox release"><input name="f_release_situation[]" type="checkbox" value="2">延误</label></li>';

            }
            var in_scheduled_deptime_sort = '';
            var in_estimated_deptime_sort = '';
            var in_actual_deptime_sort = '';
            var in_scheduled_arrtime_sort = '';
            var in_estimated_arrtime_sort = '';
            var in_actual_arrtime_sort = '';

            var out_scheduled_deptime_sort = '';
            var out_estimated_deptime_sort = '';
            var out_actual_deptime_sort = '';
            var out_scheduled_arrtime_sort = '';
            var out_estimated_arrtime_sort = '';
            var out_actual_arrtime_sort = '';
            if(requestParamObj.order_field == 'in_scheduled_deptime'){
                in_scheduled_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'in_estimated_deptime'){
                in_estimated_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'in_actual_deptime'){
                in_actual_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'in_scheduled_arrtime'){
                in_scheduled_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'in_estimated_arrtime'){
                in_estimated_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'in_actual_arrtime'){
                in_actual_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'out_scheduled_deptime'){
                out_scheduled_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'out_estimated_deptime'){
                out_estimated_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'out_actual_deptime'){
                out_actual_deptime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'out_scheduled_arrtime'){
                out_scheduled_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'out_estimated_arrtime'){
                out_estimated_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }else if(requestParamObj.order_field == 'out_actual_arrtime'){
                out_actual_arrtime_sort = requestParamObj.order_type == 'ASC' ? 'zh-order-asc':'zh-order-desc';
            }
            var in_width = field_list[cur_field_tab]['in'].length + 1;
            var out_width = field_list[cur_field_tab]['out'].length + 1;
            var head_html = '<tr class="am-thead-row">';
                head_html += '<th class="am-num-cell">&nbsp;</th>';
                head_html += '<th class="am-arrive-cell tc" colspan="'+in_width+'">进港</th>';
                head_html += '<th class="am-leave-cell tc" colspan="'+out_width+'">出港</th>';
                head_html += '</tr>';
                head_html += '<tr>';
                head_html += '<th class="am-num-cell"><div class="zh-cell-wrap">关注</div></th>';
                var in_th_class = 'am-arrive-cell';var out_th_class = 'am-leave-cell';
            var time_field_arr = ['in_scheduled_deptime','in_estimated_deptime','in_actual_deptime','in_scheduled_arrtime','in_estimated_arrtime','in_actual_arrtime','out_scheduled_deptime','out_estimated_deptime','out_actual_deptime','out_scheduled_arrtime','out_estimated_arrtime','out_actual_arrtime','cobt','ctot'];
                $.each(field_list[cur_field_tab]['in'],function(k,v){
                    if(field_config[cur_field_tab]['in'][v].name == 'in_cla'){
                            head_html += ' <th class="'+in_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name '+in_attr_class+'">属性</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul class="zh-fd-scrollbar3">' + in_f_attr_html + '</ul></div></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_fnum'){
                            head_html += '<th class="'+in_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name '+in_vip_class+'">'+field_config[cur_field_tab]['in'][v].cn_name+'</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul>'+ in_f_vip_html + '</ul></div></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_flight_status_code'){
                            head_html += '<th class="'+in_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name '+in_flight_status_class+'">状态</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown zh-width-80"><ul class="zh-fd-scrollbar3">' + in_f_status_code_html + '</ul></div></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_scheduled_deptime'){
                        head_html += '<th class="'+in_th_class+' zh-order"><div class="zh-cell-wrap"><span title="计划起飞时间" class="zh-field-name">计飞</span> <span class="zh-icon-order '+in_scheduled_deptime_sort+'" order_field="in_scheduled_deptime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_estimated_deptime'){
                        head_html += '<th class="'+in_th_class+' zh-order"><div class="zh-cell-wrap"><span title="预计起飞时间" class="zh-field-name">预飞(F)</span> <span class="zh-icon-order '+in_estimated_deptime_sort+'" order_field="in_estimated_deptime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_actual_deptime'){
                        head_html += '<th class="'+in_th_class+' zh-order"><div class="zh-cell-wrap"><span title="实际起飞时间" class="zh-field-name">实飞</span> <span class="zh-icon-order '+in_actual_deptime_sort+'" order_field="in_actual_deptime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_scheduled_arrtime'){
                        head_html += '<th class="'+in_th_class+' zh-order"><div class="zh-cell-wrap"><span title="计划到达时间" class="zh-field-name">计达</span> <span class="zh-icon-order '+in_scheduled_arrtime_sort+'" order_field="in_scheduled_arrtime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_estimated_arrtime'){
                        head_html += '<th class="'+in_th_class+' zh-order"><div class="zh-cell-wrap"><span title="预计到达时间" class="zh-field-name">预达(F)</span> <span class="zh-icon-order '+in_estimated_arrtime_sort+'" order_field="in_estimated_arrtime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_actual_arrtime'){
                        head_html += '<th class="'+in_th_class+' zh-order"><div class="zh-cell-wrap"><span title="实际到达时间" class="zh-field-name">实达</span> <span class="zh-icon-order '+in_actual_arrtime_sort+'" order_field="in_actual_arrtime"></span></div></th>';
                    }else{
                        head_html += '<th class="'+in_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name">'+field_config[cur_field_tab]['in'][v].cn_name+'</span></div></th>';
                    }
                });
                head_html += '<th class="'+in_th_class+'"><span class="zh-field-name">操作</span></th>';
                $.each(field_list[cur_field_tab]['out'],function(k,v){
                    if(field_config[cur_field_tab]['out'][v].name == 'out_cla'){
                        head_html += ' <th class="'+out_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name '+out_attr_class+'">属性</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul class="zh-fd-scrollbar3">' + out_f_attr_html + '</ul></div></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_fnum'){
                        head_html += '<th class="'+out_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name '+out_vip_class+'">'+field_config[cur_field_tab]['out'][v].cn_name+'</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown"><ul>'+ out_f_vip_html + '</ul></div></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_flight_status_code'){
                        head_html += '<th class="'+out_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name '+out_flight_status_class+'">状态</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown zh-width-80"><ul class="zh-fd-scrollbar3">' + out_f_status_code_html + '</ul></div></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_scheduled_deptime'){
                        head_html += '<th class="'+out_th_class+' zh-order"><div class="zh-cell-wrap"><span title="计划起飞时间" class="zh-field-name">计飞</span> <span class="zh-icon-order '+out_scheduled_deptime_sort+'" order_field="out_scheduled_deptime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_estimated_deptime'){
                        head_html += '<th class="'+out_th_class+' zh-order"><div class="zh-cell-wrap"><span title="预计起飞时间" class="zh-field-name">预飞(F)</span> <span class="zh-icon-order '+out_estimated_deptime_sort+'" order_field="out_estimated_deptime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_actual_deptime'){
                        head_html += '<th class="'+out_th_class+' zh-order"><div class="zh-cell-wrap"><span title="实际起飞时间" class="zh-field-name">实飞</span> <span class="zh-icon-order '+out_actual_deptime_sort+'" order_field="out_actual_deptime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_scheduled_arrtime'){
                        head_html += '<th class="'+out_th_class+' zh-order"><div class="zh-cell-wrap"><span title="计划到达时间" class="zh-field-name">计达</span> <span class="zh-icon-order '+out_scheduled_arrtime_sort+'" order_field="out_scheduled_arrtime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_estimated_arrtime'){
                        head_html += '<th class="'+out_th_class+' zh-order"><div class="zh-cell-wrap"><span title="预计到达时间" class="zh-field-name">预达(F)</span> <span class="zh-icon-order '+out_estimated_arrtime_sort+'" order_field="out_estimated_arrtime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_actual_arrtime'){
                        head_html += '<th class="'+out_th_class+' zh-order"><div class="zh-cell-wrap"><span title="实际到达时间" class="zh-field-name">实达</span> <span class="zh-icon-order '+out_actual_arrtime_sort+'" order_field="out_actual_arrtime"></span></div></th>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'release_situation'){
                        head_html += ' <th><div class="zh-cell-wrap"><span class="zh-field-name '+release_class+'">放行情况</span><span class="zh-icon-dropdown"></span><div class="zh-field-dropdown zh-width-80"><ul class="zh-fd-scrollbar3">' + f_release_html + '</ul></div></div></th>';
                    }else{
                        head_html += '<th class="'+out_th_class+'"><div class="zh-cell-wrap"><span class="zh-field-name">'+field_config[cur_field_tab]['out'][v].cn_name+'</span></div></th>';
                    }
                });
                head_html += '<th class="'+out_th_class+'"><span class="zh-field-name">操作</span></th>';
                $(".flight-list-table thead").html(head_html);
                var tbody_html = '';
                $.each(data,function(key,flight){
                    var checked = '';
                    var id_active = '';
                    if(flight.is_attention == 1){
                        checked = "checked='checked'";
                        id_active = "active";
                    }
                    var in_is_vip = '';
                    if(flight.in_is_vip === "1"){
                        in_is_vip = '<span class="zh-vip-yellow">V</span>';
                    }
                    var in_is_meeting = '';
                    if(flight.in_is_meeting == 1){
                        in_is_meeting = '<span class="zh-vip-yellow">M</span>';
                    }
                    var in_share_class = '';
                    var in_share_tip_str = '';
                    var in_flag_class = '';
                    if(flight.in_fnum_share_tip !== ''){
                        in_share_class = 'zh-tip-share';
                        in_share_tip_str = 'data-share="'+flight.in_fnum_share_tip+'"';
                        in_flag_class = 'zh-text-black-bold';
                    }
                    var in_second_state_str = flight.in_second_state_str;
                    //预计时间A-DSB标记
                    var in_es_time_dep_adsb = '';
                    var in_es_time_arr_adsb = '';
                    if(flight.in_es_arr_time_adsb == 1)
                    {
                        in_es_time_arr_adsb = '<i class="am-icon-A">A</i>';
                    }
                    if(flight.in_es_dep_time_adsb == 1)
                    {
                        in_es_time_dep_adsb = '<i class="am-icon-A">A</i>';
                    }
                    var delay_class = '';
                    if(flight['is_delay_flight'] == 1) delay_class = 'delay';
                    tbody_html += '<tr class="'+delay_class+'" id="'+key+'">';
                    tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><label class="zh-fd-checkbox attention_id '+ id_active +'"><input class="attention_flight" type="checkbox" name="attention" value="'+key+'" '+checked+'>'+flight.id+'</label></div></td>';
                    $.each(field_list[cur_field_tab]['in'],function(k,v){
                        if(field_config[cur_field_tab]['in'][v].name == 'in_fnum'){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+' '+in_share_class+'" '+in_share_tip_str+'><div class="zh-cell-wrap"><a data-fid="'+flight.in_fid+'" class="zh-field-value zh-flight-number '+in_flag_class+'" href="###">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</a>'+ in_is_vip + in_is_meeting +'</div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name == 'airport_lines' && flight.in_fid !== ''){
                            tbody_html += '<td class="zh-tip-share '+flight.in_flight_status_code_class+'" data-share="'+flight[field_config[cur_field_tab]['in'][v].name]+'"><div class="zh-cell-wrap"><a data-fid="'+flight.in_fid+'" class="zh-field-value zh-airline" href="###">'+ textEllipsisFn(flight[field_config[cur_field_tab]['in'][v].name]) +'</a></div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name == 'in_flight_status_code'){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</span> ' + in_second_state_str + '</div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name == 'in_process_status'){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><a target="_blank" href="'+flight.in_process_detail_link+'" class="zh-field-value">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</a></div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name == 'in_aircraft_num'){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><a data-flight-date="'+flight.in_flight_date+'" data-aircraft-type="'+flight.aircraft_type+'" class="zh-field-value zh-plane-number" href="###">'+flight[field_config[cur_field_tab]['in'][v].name]+'</a></div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name == 'aircraft_type' && flight.in_fid !== ''){
                            tbody_html += '<td class="am-plane-type '+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value zh-plane-type"><i>'+ flight[field_config[cur_field_tab]['in'][v].name] +'</i></span></div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name.indexOf('estimated_deptime') !== -1 && field_config[cur_field_tab]['in'][v].name.indexOf('isd') == -1){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap">'+in_es_time_dep_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name.indexOf('estimated_arrtime') !== -1 && field_config[cur_field_tab]['in'][v].name.indexOf('isd') == -1){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap">'+in_es_time_arr_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                        }else if($.inArray(field_config[cur_field_tab]['in'][v].name,time_field_arr) !==-1){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                        }else if(field_config[cur_field_tab]['in'][v].name == 'in_aoc_info'){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                        }else
                        {
                            if(flight.in_fid !== ''){
                                tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</span></div></td>';
                            }else{
                                tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                            }
                        }
                    });
                    if(flight.in_fid !== ''){
                        tbody_html += '<td data-fid="'+flight.in_fid+'" class="show_fid '+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><a class="zh-field-value zh-edit" href="###">编辑</a><a class="zh-field-value zh-msg zh-ml-5" href="###">消息</a></div></td>';
                    }else{
                        tbody_html += '<td class="show_fid '+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                    }

                    var out_is_vip = '';
                    if(flight.out_is_vip === "1"){
                        out_is_vip = '<span class="zh-vip-black">V</span>';
                    }
                    var out_is_meeting = '';
                    if(flight.out_is_meeting == 1){
                        out_is_meeting = '<span class="zh-vip-black">M</span>';
                    }
                    var out_share_class = '';
                    var out_share_tip_str = '';
                    var out_flag_class = '';
                    if(flight.out_fnum_share_tip !== ''){
                        out_share_class = 'zh-tip-share';
                        out_share_tip_str = 'data-share="'+flight.out_fnum_share_tip+'"';
                        out_flag_class = 'zh-text-black-bold';
                    }
                    var out_second_state_str = flight.out_second_state_str;
                    //预计时间A-DSB标记
                    var out_es_time_dep_adsb = '';
                    var out_es_time_arr_adsb = '';
                    if(flight.out_es_arr_time_adsb == 1)
                    {
                        out_es_time_arr_adsb = '<i class="am-icon-A">A</i>';
                    }
                    if(flight.out_es_dep_time_adsb == 1)
                    {
                        out_es_time_dep_adsb = '<i class="am-icon-A">A</i>';
                    }
                    $.each(field_list[cur_field_tab]['out'],function (k,v) {
                        if(field_config[cur_field_tab]['out'][v].name == 'out_fnum'){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+' '+out_share_class+'" '+out_share_tip_str+'><div class="zh-cell-wrap"><a data-fid="'+flight.out_fid+'" class="zh-field-value zh-flight-number '+out_flag_class+'" href="###">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</a>'+ out_is_vip + out_is_meeting +'</div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'airport_lines' && flight.out_fid !== ''){
                            tbody_html += '<td class="zh-tip-share '+flight.out_flight_status_code_class+'" data-share="'+flight[field_config[cur_field_tab]['out'][v].name]+'"><div class="zh-cell-wrap"><a data-fid="'+flight.out_fid+'" class="zh-field-value zh-airline" href="###">'+ textEllipsisFn(flight[field_config[cur_field_tab]['out'][v].name]) +'</a></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'out_flight_status_code'){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</span> ' + out_second_state_str + '</div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'out_process_status'){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><a target="_blank" href="'+flight.out_process_detail_link+'" class="zh-field-value">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</a></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'out_aircraft_num'){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><a data-flight-date="'+flight.out_flight_date+'" data-aircraft-type="'+flight.aircraft_type+'" class="zh-field-value zh-plane-number" href="###">'+flight[field_config[cur_field_tab]['out'][v].name]+'</a></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'aircraft_type' && flight.out_fid !== ''){
                            tbody_html += '<td class="am-plane-type '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value zh-plane-type"><i>'+ flight[field_config[cur_field_tab]['out'][v].name] +'</i></span></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name.indexOf('estimated_deptime') !== -1 && field_config[cur_field_tab]['out'][v].name.indexOf('isd') == -1){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap">'+out_es_time_dep_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name.indexOf('estimated_arrtime') !== -1 && field_config[cur_field_tab]['out'][v].name.indexOf('isd') == -1){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap">'+out_es_time_arr_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                        }else if($.inArray(field_config[cur_field_tab]['out'][v].name,time_field_arr) !==-1){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'out_aoc_info'){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'release_situation'){
                            tbody_html += '<td class="zh-bg-bgray '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap">'+ flight['release_situation'] + flight['release_situation_time'] +'</div></td>';
                        }else if(field_config[cur_field_tab]['out'][v].name == 'turnaround_time'){
                            if(flight['turnaround_time'] == ''){
                                tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value "></span></div></td>';
                            }else{
                                var turnaround_time = flight['turnaround_time'];
                                if(turnaround_time.indexOf('+') != -1){
                                    tbody_html += '<td class="am-font-red '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                                }else{
                                    tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                                }
                            }
                        }else
                        {
                            if(flight.out_fid !== ''){
                                tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</span></div></td>';
                            }else{
                                tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                            }

                        }
                    });

                    if(flight.out_fid !== ''){
                        tbody_html += '<td data-fid="'+flight.out_fid+'" class="show_fid '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><a class="zh-field-value zh-edit" href="###">编辑</a><a class="zh-field-value zh-msg zh-ml-5" href="###">消息</a></div></td>';
                    }else{
                        tbody_html += '<td class="show_fid '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                    }
                    tbody_html += '</tr>';
                });

                $(".flight-list-table tbody").html(tbody_html);
        }



    }


    /**
     * [update_render_data 更新操作 ]
     * @param  {[type]} data            [description]
     * @param  {[type]} requestParamObj [description]
     * @return {[type]}                 [description]
     */
    function update_render_data(data,requestParamObj,field_list){
        //console.log(data);
        var f_status = requestParamObj.f_status;
        var cur_field_tab = '';
        if(f_status.indexOf('in') !== -1){
            cur_field_tab = 'in';
        }else if(f_status.indexOf('out') !== -1){
            cur_field_tab = 'out';
        }else if(f_status.indexOf('all') !== -1){
            cur_field_tab = 'all';
        }else if(f_status.indexOf('food') !== -1){
            cur_field_tab = 'food';
        }else{
            cur_field_tab = f_status;
        }

        var time_field_arr = ['in_scheduled_deptime','in_estimated_deptime','in_actual_deptime','in_scheduled_arrtime','in_estimated_arrtime','in_actual_arrtime','out_scheduled_deptime','out_estimated_deptime','out_actual_deptime','out_scheduled_arrtime','out_estimated_arrtime','out_actual_arrtime','scheduled_deptime','estimated_deptime','actual_deptime','scheduled_arrtime','estimated_arrtime','actual_arrtime','cobt','ctot'];

        if(cur_field_tab !== 'all'){
            $.each(field_list[cur_field_tab],function(k,v){
                field_map[cur_field_tab][field_config[cur_field_tab][v].name] = k+1;
            });

            $.each(data,function(fid,flight){
                //1.查找到这一行
                var tr_obj = $("#flight_list_"+fid);
                var field_length = 0;
                //获取字段数量
                $.each(flight,function (field,value) {
                    var index = field_map[cur_field_tab][field];
                    if(index !== undefined){
                        field_length += 1;
                    }
                });
                var iteraor_index = 0;
                $.each(flight,function(field,value){
                    var index = field_map[cur_field_tab][field];
                    if(index != undefined){
                        ++iteraor_index;
                        if(field == 'process_status'){
                            tr_obj.children('td').eq(index).find('a').addClass('zh-text-black-bold');
                            tr_obj.children('td').eq(index).find('a').html(value);
                            if(flight.process_time != undefined){
                                tr_obj.children('td').eq(index).attr('title',flight.process_time);
                            }
                        }else if(field == 'process_time'){
                            tr_obj.children('td').eq(index).attr('title',value);
                        }else if(field == 'airport_lines'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><a href="###" class="zh-field-value zh-text-black-bold zh-airline">'+value+'</a></div>');
                        }else if(field == 'aircraft_num'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><a href="###" class="zh-field-value zh-text-black-bold zh-plane-number">'+value+'</a></div>');
                        }else if(field == 'in_flight_status_code' || field == 'out_flight_status_code' || field == 'flight_status_code'){
                            var flight_status_bg_class = '';
                            if(value == "到达"){
                                flight_status_bg_class = 'zh-bg-blue';
                            }else if(value == "起飞"){
                                flight_status_bg_class = 'zh-bg-green';
                            }else if(value == '延误'){
                                flight_status_bg_class = 'zh-bg-yellow';
                            }else if(value == '备降' || value == '返航' || value == '取消' || value=='正在返航' || value=='正在备降'){
                                flight_status_bg_class = 'zh-bg-red';
                            }

                            //第二状态判断
                            var second_state_str = '';
                            if(flight.second_state !== undefined){
                                second_state_str = flight.second_state;
                            }
                            tr_obj.removeClass('zh-bg-blue zh-bg-green zh-bg-yellow zh-bg-red').addClass(flight_status_bg_class);
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold">'+value+'</span>'+second_state_str+'</div>');

                        }else if(field == 'in_fnum' || field == 'out_fnum' || field == 'fnum'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><a href="###" class="zh-field-value zh-text-black-bold zh-flight-number ">'+value+'</a></div>');
                        }else if($.inArray(field,time_field_arr) !== -1){
                            if(field == 'estimated_deptime' || field == 'in_estimated_deptime' || field == 'out_estimated_deptime'){
                                var adsb_flag = '';
                                if(flight.es_dep_time_adsb == 1){
                                    adsb_flag = '<i class="am-icon-A">A</i>';
                                }
                                tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap">'+adsb_flag+'<input class="zh-input-dynamic zh-text-black-bold" data-field-val="'+value+'" data-field="'+field+'" value="'+value+'" readonly="readonly" type="text"></div>');
                            }else if(field == 'estimated_arrtime' || field == 'in_estimated_arrtime' || field == 'out_estimated_arrtime'){
                                var adsb_flag = '';
                                if(flight.es_arr_time_adsb == 1){
                                    adsb_flag = '<i class="am-icon-A">A</i>';
                                }
                                tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap">'+adsb_flag+'<input class="zh-input-dynamic zh-text-black-bold" data-field-val="'+value+'" data-field="'+field+'" value="'+value+'" readonly="readonly" type="text"></div>');
                            }else{
                                tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><input class="zh-input-dynamic zh-text-black-bold" data-field-val="'+value+'" data-field="'+field+'" value="'+value+'" readonly="readonly" type="text"></div>');
                            }
                        }else if(field == 'aoc_info'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><input class="zh-input-dynamic zh-text-black-bold" data-field-val="'+value+'" data-field="'+field+'" value="'+value+'" readonly="readonly" type="text"></div>');
                        }else if(field == 'release_situation'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap">'+flight['release_situation'] + flight['release_situation_time'] +'</div>');
                        }else if(field == 'turnaround_time'){
                            if(flight['turnaround_time'] == ''){
                                tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"></div>');
                            }else{
                                var turnaround_time = flight['turnaround_time'];
                                if(turnaround_time.indexOf('+') != -1){
                                    tr_obj.children('td').eq(index).addClass('am-font-red').html('<div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div>');
                                }else{
                                    tr_obj.children('td').eq(index).removeClass('am-font-red').html('<div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div>');
                                }
                            }
                        }else if(field == 'aircraft_type'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold"><i>'+value+'</i></span></div>');
                        }else{
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold">'+value+'</span></div>');
                        }
                        if(iteraor_index == field_length){
                            var prev_obj = tr_obj.prev();
                            if(flight.insert_fid_below != ''){
                                if(prev_obj.attr('id') !== "flight_list_"+flight.insert_fid_below && prev_obj.attr('id') !== "flight_list_"+fid){
                                    var tr_html = tr_obj.clone();
                                    tr_obj.remove();
                                    if($("#flight_list_"+fid).length == 0){
                                        $("#flight_list_"+flight.insert_fid_below).after(tr_html);
                                        reset_flight_list_id();
                                    }
                                }
                            }else{
                                if(prev_obj !== undefined && prev_obj.attr('data-flight-date') !== undefined){
                                    var tr_html = tr_obj.clone();
                                    tr_obj.remove();
                                    $(".flight-list-table tbody").prepend(tr_html);
                                    reset_flight_list_id();

                                }
                            }
                        }
                    }
                });

            });
        }else{
            var in_max = '';
            $.each(field_list[cur_field_tab]['in'],function(k,v){
                field_map[cur_field_tab]['in'][field_config[cur_field_tab]['in'][v].name] = k+1;
                in_max = k+1;
            });
            var out_max = in_max + 1;
            $.each(field_list[cur_field_tab]['out'],function (k,v) {
                out_max = out_max + 1;
                field_map[cur_field_tab]['out'][field_config[cur_field_tab]['out'][v].name] = out_max;
            });
            var f_status_code_class = ['zh-bg-blue','zh-bg-green','zh-bg-yellow','zh-bg-red'];
            $.each(data,function (fid,flight) {

                var field_length = 0;
                var iteraor_index = 0;
                $.each(flight,function (field,value) {
                    //判断字段为进港段还是出港段
                    if($.inArray(field,field_config['in_field']) !== -1){
                        var index = field_map[cur_field_tab]['in'][field];
                    }else{
                        var index = field_map[cur_field_tab]['out'][field];
                    }
                    if(index != undefined){
                        field_length += 1;
                    }
                });
                
                var tr_obj = $("#"+fid);
                $.each(flight,function (field,value) {
                    //判断字段为进港段还是出港段
                    if($.inArray(field,field_config['in_field']) !== -1){
                        var index = field_map[cur_field_tab]['in'][field];
                    }else{
                        var index = field_map[cur_field_tab]['out'][field];
                    }
                    if(index != undefined){
                        ++iteraor_index;
                        if(field == 'in_process_status' || field == 'out_process_status'){
                            tr_obj.children('td').eq(index).find('a').addClass('zh-text-black-bold');
                            tr_obj.children('td').eq(index).find('a').html(value);
                        }else if(field == 'airport_lines'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><a href="###" class="zh-field-value zh-text-black-bold zh-airline">'+value+'</a></div>');
                        }else if(field == 'in_aircraft_num' || field == 'out_aircraft_num'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><a href="###" class="zh-field-value zh-text-black-bold zh-plane-number">'+value+'</a></div>');
                        }else if(field == 'in_flight_status_code'){
                            for(var i =0;i<in_max+2;i++){
                                if(tr_obj.children('td').eq(i).hasClass('zh-bg-blue')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-blue');
                                }else if(tr_obj.children('td').eq(i).hasClass('zh-bg-green')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-green');
                                }else if(tr_obj.children('td').eq(i).hasClass('zh-bg-yellow')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-yellow');
                                }else if(tr_obj.children('td').eq(i).hasClass('zh-bg-red')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-red');
                                }
                                tr_obj.children('td').eq(i).addClass(flight.in_flight_status_code_class);
                            }
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold">'+value+'</span></div>');
                        }else if(field == 'out_flight_status_code'){
                            var td_length = tr_obj.find('td').length;
                            for(var i=in_max+2;i<td_length;i++){
                                if(tr_obj.children('td').eq(i).hasClass('zh-bg-blue')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-blue');
                                }else if(tr_obj.children('td').eq(i).hasClass('zh-bg-green')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-green');
                                }else if(tr_obj.children('td').eq(i).hasClass('zh-bg-yellow')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-yellow');
                                }else if(tr_obj.children('td').eq(i).hasClass('zh-bg-red')){
                                    tr_obj.children('td').eq(i).removeClass('zh-bg-red');
                                }
                                tr_obj.children('td').eq(i).addClass(flight.out_flight_status_code_class);
                            }
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold">'+value+'</span></div>');
                        }else if(field == 'in_fnum' || field == 'out_fnum'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><a href="###" class="zh-field-value zh-text-black-bold zh-flight-number ">'+value+'</a></div>');
                        }else if($.inArray(field,time_field_arr) !== -1){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><input class="zh-input-dynamic zh-text-black-bold" data-field-val="'+value+'" data-field="'+field+'" value="'+value+'" readonly="readonly" type="text"></div>');
                        }else if(field == 'in_aoc_info' || field == 'out_aoc_info'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><input class="zh-input-dynamic zh-text-black-bold" data-field-val="'+value+'" data-field="'+field+'" value="'+value+'" readonly="readonly" type="text"></div>');
                        }else if(field == 'release_situation'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap">'+flight['release_situation']+flight['release_situation_time']+'</div>');
                        }else if(field == 'turnaround_time'){
                            if(flight['turnaround_time'] == ''){
                                tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"></div>');
                            }else{
                                var turnaround_time = flight['turnaround_time'];
                                if(turnaround_time.indexOf('+') != -1){
                                    tr_obj.children('td').eq(index).addClass('am-font-red').html('<div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div>');
                                }else{
                                    tr_obj.children('td').eq(index).removeClass('am-font-red').html('<div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div>');
                                }
                            }
                        }else if(field == 'aircraft_type'){
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold"><i>'+value+'</i></span></div>');
                        }else{
                            tr_obj.children('td').eq(index).html('<div class="zh-cell-wrap"><span class="zh-field-value zh-text-black-bold">'+value+'</span></div>');
                        }

                        ///////////////////
                        if(iteraor_index == field_length){
                            var prev_obj = tr_obj.prev();
                            if(flight.insert_fid_below != ''){
                                if(prev_obj.attr('id') !== flight.insert_fid_below && prev_obj.attr('id') !== fid){
                                    var tr_html = tr_obj.clone();
                                    tr_obj.remove();
                                    if($("#"+fid).length == 0){
                                        $("#"+flight.insert_fid_below).after(tr_html);
                                        reset_flight_list_id();
                                    }
                                }
                            }else{
                                if(prev_obj !== undefined && prev_obj.attr('id') !== undefined){
                                    var tr_html = tr_obj.clone();
                                    tr_obj.remove();
                                    $(".flight-list-table tbody").prepend(tr_html);
                                    reset_flight_list_id();
                                }
                            }
                        }
                    }

                });
            });
        }

    }


    /**
     * [del_render_data 删除操作]
     * @param  {[type]} data            [description]
     * @param  {[type]} requestParamObj [description]
     * @return {[type]}                 [description]
     */
    function del_render_data(data,requestParamObj){
        var f_status = requestParamObj.f_status;
        var cur_field_tab = '';
        if(f_status.indexOf('in') !== -1){
            cur_field_tab = 'in';
        }else if(f_status.indexOf('out') !== -1){
            cur_field_tab = 'out';
        }else if(f_status.indexOf('all') !== -1){
            cur_field_tab = 'all';
        }else{
            cur_field_tab = f_status;
        }
        if(cur_field_tab !== 'all'){
            $.each(data,function(fid,value){
                $("#flight_list_"+fid).remove();
            });
        }else{
            $.each(data,function(fid,value){
                $("#"+fid).remove();
            });
        }

        //重置ID值
       reset_flight_list_id();

    }

    /**
     * [add_render_data 添加数据操作]
     * @param {[type]} data            [description]
     * @param {[type]} requestParamObj [description]
     */
    function add_render_data(data,requestParamObj,field_list){
        var f_status = requestParamObj.f_status;
        var cur_field_tab = '';
        if(f_status.indexOf('in') !== -1){
            cur_field_tab = 'in';
        }else if(f_status.indexOf('out') !== -1){
            cur_field_tab = 'out';
        }else if(f_status.indexOf('all') !== -1){
            cur_field_tab = 'all';
        }else if(f_status.indexOf('food') !== -1){
            cur_field_tab = 'food';
        }else{
            cur_field_tab = f_status;
        }

        if(cur_field_tab !== 'all'){
            $.each(data,function(fid,flight){

                //判断当前fid是否存在
                if($("#flight_list_"+fid).length > 0){
                    return false;
                }

                var tbody_html  = '';
                var checked = '';
                var id_active = '';
                if(flight.is_attention === 1){
                    checked = "checked='checked'";
                    id_active = "active";
                }
                //是否为VIP
                var in_is_vip = '';
                if(flight.in_is_vip === "1"){
                    in_is_vip = '<span class="zh-vip-yellow">V</span>';
                }
                var out_is_vip = '';
                if(flight.out_is_vip === "1"){
                    out_is_vip = '<span class="zh-vip-black">V</span>';
                }
                var is_vip = '';
                if(flight.is_vip !== undefined && flight.is_vip == "1"){
                    if(flight.in_flag !== undefined){
                        if(flight.in_flag == 1){
                            //进港
                            is_vip = '<span class="zh-vip-yellow">V</span>';
                        }else{
                            //出港
                            is_vip = '<span class="zh-vip-black">V</span>';
                        }
                    }
                }

                //标识会议航班
                var in_is_meeting = '';
                if(flight.in_is_meeting == 1){
                    in_is_meeting = '<span class="zh-vip-yellow">M</span>';
                }
                var out_is_meeting = '';
                if(flight.out_is_meeting == 1){
                    out_is_meeting = '<span class="zh-vip-black">M</span>';
                }

                var is_meeting = '';
                if(flight.is_meeting !== undefined && flight.is_meeting == 1)
                {
                    if(flight.in_flag !== undefined)
                    {
                        if(flight.in_flag == 1){
                            //进港
                            is_meeting = '<span class="zh-vip-yellow">M</span>';
                        }else{
                            //出港
                            is_meeting = '<span class="zh-vip-black">M</span>';
                        }
                    }
                }


                //航班状态背景色
                var bg_flight_status_code_cn = ['备降','正在备降','返航','正在返航','取消'];
                var flight_status_bg_class = '';

                var flight_status_code_field = '';
                if(cur_field_tab == 'in') {
                    flight_status_code_field = 'in_flight_status_code';
                }else if(cur_field_tab == 'out'){
                    flight_status_code_field = 'out_flight_status_code';
                }else{
                    flight_status_code_field = 'flight_status_code';
                }

                if(flight[flight_status_code_field] !== undefined){
                    if(flight[flight_status_code_field] == "到达"){
                        flight_status_bg_class = 'zh-bg-blue';
                    }else if(flight[flight_status_code_field] == "起飞"){
                        flight_status_bg_class = 'zh-bg-green';
                    }else if(flight[flight_status_code_field] == '延误'){
                        flight_status_bg_class = 'zh-bg-yellow';
                    }else if($.inArray(flight[flight_status_code_field],bg_flight_status_code_cn) !== -1){
                        flight_status_bg_class = 'zh-bg-red';
                    }
                }

                //进港共享航班
                var in_share_flight_str = '';
                var out_share_flight_str = '';
                //出港虚拟航班
                var in_virtual_flight_str = '';
                var out_virtual_flight_str = '';
                //共享航班
                var share_flight_str = '';
                //虚拟航班
                var virtual_flight_str = '';
                var in_flag_class = '';
                var out_flag_class = '';
                var flag_class = '';
                var tips_class = 'class="zh-tip-share"';
                var in_tips_html = "";
                var out_tips_html = "";
                var tips_html = "";
                if(flight.in_share_flight_string !== undefined && flight.in_share_flight_string !== ''){
                    in_share_flight_str = '共享:'+flight.in_share_flight_string;
                    in_flag_class = 'zh-text-black-bold';
                }
                if(flight.in_virtual_flight_string !== undefined && flight.in_virtual_flight_string !== ''){
                    in_virtual_flight_str = '虚拟:'+flight.in_virtual_flight_string;
                    in_flag_class = 'zh-text-black-bold';
                }
                if(in_share_flight_str !== '' || in_virtual_flight_str !== ''){
                    in_tips_html += tips_class + 'data-share="'+in_share_flight_str+in_virtual_flight_str+'"';
                }

                if(flight.out_share_flight_string !== undefined && flight.out_share_flight_string !== ''){
                    out_share_flight_str = '共享:'+flight.out_share_flight_string;
                    out_flag_class = 'zh-text-black-bold';
                }
                if(flight.out_virtual_flight_string !== undefined && flight.out_virtual_flight_string !== ''){
                    out_virtual_flight_str += '虚拟:'+flight.out_virtual_flight_string;
                    out_flag_class = 'zh-text-black-bold';
                }
                if(out_share_flight_str !== '' || out_virtual_flight_str !== ''){
                    out_tips_html += tips_class + 'data-share="'+out_share_flight_str+out_virtual_flight_str+'"';
                }
                if(flight.share_flight_string !== undefined && flight.share_flight_string !== ''){
                    share_flight_str = '共享:'+flight.share_flight_string;
                    flag_class = 'zh-text-black-bold';
                }
                if(flight.virtual_flight_string !== undefined && flight.virtual_flight_string !== ''){
                    virtual_flight_str = '虚拟:'+flight.virtual_flight_string;
                    flag_class = 'zh-text-black-bold';
                }
                if(share_flight_str !== '' || virtual_flight_str !== ''){
                    tips_html += tips_class + 'data-share="'+share_flight_str+virtual_flight_str+'"';
                }
                //second state
                var second_state_str = flight.second_state;
                //预计时间ADSB标记
                var es_time_dep_adsb = '';
                var es_time_arr_adsb = '';
                if(flight.es_arr_time_adsb == 1)
                {
                    es_time_arr_adsb = '<i class="am-icon-A">A</i>';
                }
                if(flight.es_dep_time_adsb == 1)
                {
                    es_time_dep_adsb = '<i class="am-icon-A">A</i>';
                }
                var is_delay_class = '';
                if(flight['is_delay_flight'] == 1) is_delay_class = 'delay';
                tbody_html += '<tr class="'+is_delay_class+' '+flight_status_bg_class+'" data-flight-date="'+flight.flight_date+'"  id="flight_list_'+fid+'">';
                tbody_html += '<td><div class="zh-cell-wrap"><label class="zh-fd-checkbox attention_id '+ id_active +'"><input class="attention_flight" type="checkbox" name="attention" value="'+flight.fid+'" '+checked+'>'+flight.id+'</label></div></td>';

                var time_field_arr = ['in_scheduled_deptime','in_estimated_deptime','in_actual_deptime','in_scheduled_arrtime','in_estimated_arrtime','in_actual_arrtime','out_scheduled_deptime','out_estimated_deptime','out_actual_deptime','out_scheduled_arrtime','out_estimated_arrtime','out_actual_arrtime','scheduled_deptime','estimated_deptime','actual_deptime','scheduled_arrtime','estimated_arrtime','actual_arrtime','cobt','ctot'];

                $.each(field_list[cur_field_tab],function(k,v){
                    if(field_config[cur_field_tab][v].name == 'in_fnum'){
                        tbody_html += '<td '+in_tips_html+'><div class="zh-cell-wrap"><a class="zh-field-value zh-flight-number '+ in_flag_class +'" href="###">'+ flight[field_config[cur_field_tab][v].name] +'</a>'+ in_is_vip + in_is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'out_fnum'){
                        tbody_html += '<td '+out_tips_html+'><div class="zh-cell-wrap"><a class="zh-field-value zh-flight-number zh-text-gray2 '+ out_flag_class +'" href="###">'+flight[field_config[cur_field_tab][v].name]+'</a>'+ out_is_vip + out_is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'fnum'){
                        tbody_html += '<td '+tips_html+'><div class="zh-cell-wrap"><a class="zh-field-value zh-flight-number zh-text-gray2 '+ flag_class +'" href="###">'+flight[field_config[cur_field_tab][v].name]+'</a>'+ is_vip + is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'airport_lines'){
                        tbody_html += '<td class="zh-tip-share" data-share="'+flight[field_config[cur_field_tab][v].name]+'"><div class="zh-cell-wrap"><a class="zh-field-value zh-airline" href="###">'+ textEllipsisFn(flight[field_config[cur_field_tab][v].name]) +'</a></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'in_flight_status_code' || field_config[cur_field_tab][v].name == 'out_flight_status_code' || field_config[cur_field_tab][v].name == 'flight_status_code'){
                        tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value">'+ flight[field_config[cur_field_tab][v].name] +'</span> ' + second_state_str + '</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'process_status'){
                        tbody_html += '<td title="'+flight.process_time+'"><div class="zh-cell-wrap"><a target="_blank" href="'+flight.process_detail_link+'" class="zh-field-value">'+ flight[field_config[cur_field_tab][v].name] +'</a></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'aircraft_num'){
                        tbody_html += '<td><div class="zh-cell-wrap"><a data-aircraft-type="'+flight.aircraft_type+'" class="zh-field-value zh-plane-number" href="###">'+flight[field_config[cur_field_tab][v].name]+'</a></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'in_parking' || field_config[cur_field_tab][v].name == 'out_parking'){
                        tbody_html += '<td><div class="zh-cell-wrap">'+flight[field_config[cur_field_tab][v].name]+'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'aircraft_type'){
                        tbody_html += '<td class="am-plane-type"><div class="zh-cell-wrap"><span class="zh-field-value zh-plane-type"><i>'+ flight[field_config[cur_field_tab][v].name] +'</i></span></div></td>';
                    }else if(field_config[cur_field_tab][v].name.indexOf('estimated_deptime') !== -1 && field_config[cur_field_tab][v].name.indexOf('isd') == -1 ){
                        tbody_html += '<td><div class="zh-cell-wrap">'+es_time_dep_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab][v].name.indexOf('estimated_arrtime') !== -1 && field_config[cur_field_tab][v].name.indexOf('isd') == -1 ){
                        tbody_html += '<td><div class="zh-cell-wrap">'+es_time_arr_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if($.inArray(field_config[cur_field_tab][v].name,time_field_arr) !==-1){
                        tbody_html += '<td><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'aoc_info'){
                        tbody_html += '<td><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab][v].name]+'" data-field="'+field_config[cur_field_tab][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'release_situation'){
                        tbody_html += '<td class="zh-bg-bgray"><div class="zh-cell-wrap">'+ flight['release_situation'] + flight['release_situation_time'] +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'turnaround_time'){
                        if(flight['turnaround_time'] == ''){
                            tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value "></span></div></td>';
                        }else{
                            var turnaround_time = flight['turnaround_time'];
                            if(turnaround_time.indexOf('+') != -1){
                                tbody_html += '<td class="am-font-red"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                            }else{
                                tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                            }
                        }
                    }
                    else
                    {
                        tbody_html += '<td><div class="zh-cell-wrap"><span class="zh-field-value ">'+ flight[field_config[cur_field_tab][v].name] +'</span></div></td>';
                    }
                });
                tbody_html += '<td class="show_fid"><div class="zh-cell-wrap"><a class="zh-field-value zh-edit" href="###">编辑</a><a class="zh-field-value zh-msg zh-ml-5" href="###">消息</a></div></td></tr>';
                $("#flight_list_"+flight.insert_fid_below).after(tbody_html);
            });
        }else{
            var time_field_arr = ['in_scheduled_deptime','in_estimated_deptime','in_actual_deptime','in_scheduled_arrtime','in_estimated_arrtime','in_actual_arrtime','out_scheduled_deptime','out_estimated_deptime','out_actual_deptime','out_scheduled_arrtime','out_estimated_arrtime','out_actual_arrtime','cobt','ctot'];
            $.each(data,function(key,flight){
                var tbody_html = '';
                var checked = '';
                var id_active = '';
                if(flight.is_attention == 1){
                    checked = "checked='checked'";
                    id_active = "active";
                }
                var in_is_vip = '';
                if(flight.in_is_vip === "1"){
                    in_is_vip = '<span class="zh-vip-yellow">V</span>';
                }
                var in_is_meeting = '';
                if(flight.in_is_meeting == 1){
                    in_is_meeting = '<span class="zh-vip-yellow">M</span>';
                }
                var in_share_class = '';
                var in_share_tip_str = '';
                var in_flag_class = '';
                if(flight.in_fnum_share_tip !== ''){
                    in_share_class = 'zh-tip-share';
                    in_share_tip_str = 'data-share="'+flight.in_fnum_share_tip+'"';
                    in_flag_class = 'zh-text-black-bold';
                }
                var in_second_state_str = flight.in_second_state_str;
                //预计时间A-DSB标记
                var in_es_time_dep_adsb = '';
                var in_es_time_arr_adsb = '';
                if(flight.in_es_arr_time_adsb == 1)
                {
                    in_es_time_arr_adsb = '<i class="am-icon-A">A</i>';
                }
                if(flight.in_es_dep_time_adsb == 1)
                {
                    in_es_time_dep_adsb = '<i class="am-icon-A">A</i>';
                }
                tbody_html += '<tr id="'+key+'">';
                tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><label class="zh-fd-checkbox attention_id '+ id_active +'"><input class="attention_flight" type="checkbox" name="attention" value="'+key+'" '+checked+'>'+flight.id+'</label></div></td>';
                $.each(field_list[cur_field_tab]['in'],function(k,v){
                    if(field_config[cur_field_tab]['in'][v].name == 'in_fnum'){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+' '+in_share_class+'" '+in_share_tip_str+'><div class="zh-cell-wrap"><a data-fid="'+flight.in_fid+'" class="zh-field-value zh-flight-number '+in_flag_class+'" href="###">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</a>'+ in_is_vip + in_is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'airport_lines' && flight.in_fid !== ''){
                        tbody_html += '<td class="zh-tip-share '+flight.in_flight_status_code_class+'" data-share="'+flight[field_config[cur_field_tab]['in'][v].name]+'"><div class="zh-cell-wrap"><a data-fid="'+flight.in_fid+'" class="zh-field-value zh-airline" href="###">'+ textEllipsisFn(flight[field_config[cur_field_tab]['in'][v].name]) +'</a></div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_flight_status_code'){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</span> ' + in_second_state_str + '</div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_process_status'){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><a target="_blank" href="'+flight.in_process_detail_link+'" class="zh-field-value">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</a></div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_aircraft_num'){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><a data-flight-date="'+flight.in_flight_date+'" data-aircraft-type="'+flight.aircraft_type+'" class="zh-field-value zh-plane-number" href="###">'+flight[field_config[cur_field_tab]['in'][v].name]+'</a></div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'aircraft_type' && flight.in_fid !== ''){
                        tbody_html += '<td class="am-plane-type '+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value zh-plane-type"><i>'+ flight[field_config[cur_field_tab]['in'][v].name] +'</i></span></div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name.indexOf('estimated_deptime') !== -1 && field_config[cur_field_tab]['in'][v].name.indexOf('isd') == -1){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap">'+in_es_time_dep_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name.indexOf('estimated_arrtime') !== -1 && field_config[cur_field_tab]['in'][v].name.indexOf('isd') == -1){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap">'+in_es_time_arr_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                    }else if($.inArray(field_config[cur_field_tab]['in'][v].name,time_field_arr) !==-1){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab]['in'][v].name == 'in_aoc_info'){
                        tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['in'][v].name]+'" data-field="'+field_config[cur_field_tab]['in'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['in'][v].name]+'" type="text"></div></td>';
                    }else
                    {
                        if(flight.in_fid !== ''){
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ flight[field_config[cur_field_tab]['in'][v].name] +'</span></div></td>';
                        }else{
                            tbody_html += '<td class="'+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                        }
                    }
                });
                if(flight.in_fid !== ''){
                    tbody_html += '<td data-fid="'+flight.in_fid+'" class="show_fid '+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"><a class="zh-field-value zh-edit" href="###">编辑</a><a class="zh-field-value zh-msg zh-ml-5" href="###">消息</a></div></td>';
                }else{
                    tbody_html += '<td class="show_fid '+flight.in_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                }

                var out_is_vip = '';
                if(flight.out_is_vip === "1"){
                    out_is_vip = '<span class="zh-vip-black">V</span>';
                }
                var out_is_meeting = '';
                if(flight.out_is_meeting == 1){
                    out_is_meeting = '<span class="zh-vip-black">M</span>';
                }
                var out_share_class = '';
                var out_share_tip_str = '';
                var out_flag_class = '';
                if(flight.out_fnum_share_tip !== ''){
                    out_share_class = 'zh-tip-share';
                    out_share_tip_str = 'data-share="'+flight.out_fnum_share_tip+'"';
                    out_flag_class = 'zh-text-black-bold';
                }
                var out_second_state_str = flight.out_second_state_str;
                //预计时间A-DSB标记
                var out_es_time_dep_adsb = '';
                var out_es_time_arr_adsb = '';
                if(flight.out_es_arr_time_adsb == 1)
                {
                    out_es_time_arr_adsb = '<i class="am-icon-A">A</i>';
                }
                if(flight.out_es_dep_time_adsb == 1)
                {
                    out_es_time_dep_adsb = '<i class="am-icon-A">A</i>';
                }
                $.each(field_list[cur_field_tab]['out'],function (k,v) {
                    if(field_config[cur_field_tab]['out'][v].name == 'out_fnum'){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+' '+out_share_class+'" '+out_share_tip_str+'><div class="zh-cell-wrap"><a data-fid="'+flight.in_fid+'" class="zh-field-value zh-flight-number '+out_flag_class+'" href="###">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</a>'+ out_is_vip + out_is_meeting +'</div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'airport_lines' && flight.out_fid !== ''){
                        tbody_html += '<td class="zh-tip-share '+flight.out_flight_status_code_class+'" data-share="'+flight[field_config[cur_field_tab]['out'][v].name]+'"><div class="zh-cell-wrap"><a data-fid="'+flight.out_fid+'" class="zh-field-value zh-airline" href="###">'+ textEllipsisFn(flight[field_config[cur_field_tab]['out'][v].name]) +'</a></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_flight_status_code'){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</span> ' + out_second_state_str + '</div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_process_status'){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><a target="_blank" href="'+flight.out_process_detail_link+'" class="zh-field-value">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</a></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_aircraft_num'){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><a data-flight-date="'+flight.out_flight_date+'" data-aircraft-type="'+flight.aircraft_type+'" class="zh-field-value zh-plane-number" href="###">'+flight[field_config[cur_field_tab]['out'][v].name]+'</a></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'aircraft_type' && flight.out_fid !== ''){
                        tbody_html += '<td class="am-plane-type '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value zh-plane-type"><i>'+ flight[field_config[cur_field_tab]['out'][v].name] +'</i></span></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name.indexOf('estimated_deptime') !== -1 && field_config[cur_field_tab]['out'][v].name.indexOf('isd') == -1){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap">'+out_es_time_dep_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name.indexOf('estimated_arrtime') !== -1 && field_config[cur_field_tab]['out'][v].name.indexOf('isd') == -1){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap">'+out_es_time_arr_adsb+'<input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                    }else if($.inArray(field_config[cur_field_tab]['out'][v].name,time_field_arr) !==-1){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'out_aoc_info'){
                        tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><input data-field-val="'+flight[field_config[cur_field_tab]['out'][v].name]+'" data-field="'+field_config[cur_field_tab]['out'][v].name+'" class="zh-input-dynamic" readonly="readonly" value="'+flight[field_config[cur_field_tab]['out'][v].name]+'" type="text"></div></td>';
                    }else if(field_config[cur_field_tab]['out'][v].name == 'release_situation'){
                        tbody_html += '<td class="zh-bg-bgray '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap">'+ flight['release_situation'] + flight['release_situation_time'] +'</div></td>';
                    }else if(field_config[cur_field_tab][v].name == 'turnaround_time'){
                        if(flight['turnaround_time'] == ''){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value "></span></div></td>';
                        }else{
                            var turnaround_time = flight['turnaround_time'];
                            if(turnaround_time.indexOf('+') != -1){
                                tbody_html += '<td class="am-font-red '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                            }else{
                                tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ turnaround_time +'</span></div></td>';
                            }
                        }
                    }else
                    {
                        if(flight.out_fid !== ''){
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><span class="zh-field-value ">'+ flight[field_config[cur_field_tab]['out'][v].name] +'</span></div></td>';
                        }else{
                            tbody_html += '<td class="'+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                        }
                    }
                });
                if(flight.out_fid !== ''){
                    tbody_html += '<td data-fid="'+flight.out_fid+'" class="show_fid '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"><a class="zh-field-value zh-edit" href="###">编辑</a><a class="zh-field-value zh-msg zh-ml-5" href="###">消息</a></div></td>';
                }else{
                    tbody_html += '<td class="show_fid '+flight.out_flight_status_code_class+'"><div class="zh-cell-wrap"></div></td>';
                }
                tbody_html += '</tr>';
                $("#"+flight.insert_fid_below).after(tbody_html);
            });
        }
        reset_flight_list_id();
    }

    //重置页面ID值
    function reset_flight_list_id(){
        $(".flight-list-table tbody").children('tr:not(.zh-thead-pad,.delay)').each(function(k,v){
          var index = k+1;
          var id = $(this).children('td').eq(0).text();
          if(parseInt(id) != index){
              var ele_html = $(this).children("td:first").find("label").html();
              ele_html = ele_html.substring(0,ele_html.length-3);
              if(index.toString().length ==1){
                  ele_html = ele_html + '00'+index.toString();
              }else if(index.toString().length ==2){
                  ele_html = ele_html + '0'+index.toString();
              }else{
                  ele_html = ele_html + index.toString();
              }

              $(this).children("td:first").find("label").html(ele_html);
          }
       });
    }


    /**
     * [renderList 渲染航班列表HTML]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function renderList(data,requestParamObj)
    {
        //统计部分
        //初始化操作
        //获取字段配置
        var field_list = data.field_list;
        //
        if(requestParamObj.init == 1){
             if((data.init !== undefined)){
                init_render_data(data.init,requestParamObj,field_list);
            }
        }else{
            if((data.init !== undefined) && (data.init.length !== 0)){
                init_render_data(data.init,requestParamObj,field_list);
            }
        }

        //更新操作
        if((data.update !== undefined) && data.update != ''){
            time_interval = 3000;
            update_render_data(data.update,requestParamObj,field_list);
        }else{
            time_interval = 5000;
        }

         //添加操作
        if((data.add !== undefined) && (data.add != '')){
            add_render_data(data.add,requestParamObj,field_list);
        }

        //删除操作
        if((data.del !== undefined) && (data.del != '')){
            del_render_data(data.del,requestParamObj);
        }



    }



    /**
     * 添加关注航班
     * [add_flight_attention description]
     */
    function add_flight_attention()
    {
        $("body").on('click',".attention_id input",function(e){
            e.stopPropagation();
            var _this = $(this);
            var fid = $(this).val();
            if($(this).parent().hasClass('active')){
                var url = ADD_FLIGHT_ATTENTION_URL;
            }else{
                var url = CANCLE_FLIGHT_ATTENTION_URL;
            }

            var cur_active = '';
            $(".zh-opt-count li").each(function(){
                if($(this).hasClass("active")){
                    cur_active = $(this).children('a').attr('type');
                }
            });
            var start_time = $("#startTime").val();
            var end_time = $("#endTime").val();
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: {fid:fid,start_time:start_time,end_time:end_time},
                url: url,
                cache: false,
                timeout: 60000,
                success: function(data){
                    if(data.code == 0){
                        //更新关注数量
                        var count = data.count;
                        $(".zh-opt-count a").each(function(){
                            if($(this).attr('type') == 'attention'){
                                $(this).html("关注："+"<span>"+count+"</span>");
                            }
                        });

                        if(cur_active === 'attention'){
                            _this.parent().parent().parent().parent().remove();
                        }
                    }

                },
            });
        });
    }


    function get_cur_active(){
        var cur_active = '';
            $(".zh-opt-count li").each(function(){
                if($(this).hasClass("active")){
                    cur_active = $(this).children('a').attr('type');
                }
            });
        return cur_active;
    }

    /**
     * [filter_flight_attr 筛选航班属性]
     * @return {[type]} [description]
     */
    function filter_flight_attr(){
        $("body").on('click',".flight_attribute",function(e){
            e.preventDefault();
            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }
            var _this = $(this);
            var index = $(this).parent().index();

            var cur_active = get_cur_active();
            if(cur_active == ''){
                cur_active = 'cmd';
            }
            var input_flag = 0;
            var _input_name = _this.find('input').attr('name');
            if(_input_name.indexOf('in') !== -1){
                var _input_obj = $("input[name='in_f_attr[]']:checked");
                input_flag = 1;
            }else if(_input_name.indexOf('out') !== -1){
                var _input_obj = $("input[name='out_f_attr[]']:checked");
                input_flag = 2;
            }else{
                var _input_obj = $("input[name='f_attr[]']:checked");
            }
            if(index !== 0){
                _this.parent().parent().children('li').eq(0).children('label').removeClass('active').children('input').removeAttr('checked');

                if(_this.children('input').attr('checked') == undefined){
                    var _attr_val = _this.children('input').val();
                    var cookie_value = getCookie(cur_active+'_attr_cookie');
                    if(cookie_value){
                        var tmp = cookie_value.split("|");
                        if(input_flag == 0){
                            var f_attr_cookie = tmp[0];
                        }else if(input_flag == 1){
                            var f_attr_cookie = tmp[3];
                        }else{
                            var f_attr_cookie = tmp[6];
                        }
                        var f_attr_arr = f_attr_cookie.split(',');
                        _attr_val = parseInt(_attr_val);
                        if($.inArray(_attr_val,f_attr_arr) !== -1){
                            _attr_val = _attr_val + "";
                            var index = f_attr_arr.indexOf(_attr_val);
                            f_attr_arr.splice(index, 1);
                            f_attr_cookie = f_attr_arr.join(",");
                        }
                        if(input_flag == 0){
                            setCookie(cur_active+'_attr_cookie',f_attr_cookie+"|"+tmp[1]+"|"+tmp[2]+"|"+tmp[3]+"|"+tmp[4]+"|"+tmp[5]+"|"+tmp[6]+"|"+tmp[7]+"|"+tmp[8]);
                        }else if(input_flag == 1){
                            setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+tmp[2]+"|"+f_attr_cookie+"|"+tmp[4]+"|"+tmp[5]+"|"+tmp[6]+"|"+tmp[7]+"|"+tmp[8]);
                        }else{
                            setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+tmp[2]+"|"+tmp[3]+"|"+tmp[4]+"|"+tmp[5]+"|"+f_attr_cookie+"|"+tmp[7]+"|"+tmp[8]);
                        }
                        if(_input_obj.length == 0){
                            _this.parent().parent().children('li').eq(0).children('label').addClass('active').children('input').attr('checked','checked');
                            delCookie(cur_active+'_attr_cookie');
                        }
                    }
                }

            }else{
                _this.parent().parent().children('li').each(function(k){
                       if(k !== 0){
                            $(this).children('label').removeClass('active').children('input').removeAttr('checked');
                            delCookie(cur_active+'_attr_cookie');
                       }
                });
            }
            //获取所有选项的值
            //航班属性
            var f_attr = [];
            var i=0;
            $("input[name='f_attr[]']").each(function(){
                    if($(this).parent().hasClass('active')){
                             f_attr.push($(this).val());
                             i++;
                    }
            });
            var in_f_attr = [];
            var i=0;
            $("input[name='in_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_attr.push($(this).val());
                    i++;
                }
            });
            var out_f_attr = [];
            var i=0;
            $("input[name='out_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_attr.push($(this).val());
                    i++;
                }
            });
            //要客航班
            var f_vip = [];
            $("input[name='f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_vip.push($(this).val());
                }
            });
            var in_f_vip = [];
            $("input[name='in_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_vip.push($(this).val());
                }
            });
            var out_f_vip = [];
            $("input[name='out_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_vip.push($(this).val());
                }
            });

            //航班状态
            var f_status_code = [];
            $("input[name='f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_status_code.push($(this).val());
                }
            });
            var in_f_status_code = [];
            $("input[name='in_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_status_code.push($(this).val());
                }
            });
            var out_f_status_code = [];
            $("input[name='out_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_status_code.push($(this).val());
                }
            });
            //放行情况
            var f_release = [];
            $("input[name='f_release_situation[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_release.push($(this).val());
                }
            });
            //f_status_code
            if(f_attr.length > 0 || in_f_attr.length > 0 || out_f_attr.length > 0){
                //先去设置缓存
                var cache_param = {
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    f_status:cur_active
                };

                //设置筛选属性cookie存储
                set_cache_attr(cache_param);

                var start_time = $("#startTime").val();
                var end_time = $("#endTime").val();
                //请求URL
                var requestParamObj = {
                    init:1,
                    start_time:start_time,
                    end_time:end_time,
                    pid:new Date().getTime(),
                    f_status:cur_active,
                    page:1,
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    is_attr:1,
                    page_hash:PAGE_HASH
                };

                if(requestParamObj.f_status == 'cmd'){
                    var cmd = $("#zhInstuction").find('input').val();
                    cmd = cmd.toUpperCase();
                    requestParamObj.cmd = cmd;
                }
                //请求数据
                requestList(requestParamObj);

            }

        });


        ////////////////////////////
        $("body").on('click',".flight_vip",function(e){
            e.preventDefault();
            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }

            var _this = $(this);
            var index = $(this).parent().index();
            var cur_active = get_cur_active();
            if(cur_active == ''){
                cur_active = 'cmd';
            }
                _this.parent().parent().children('li').each(function(k){
                       if(k !== index){
                            $(this).children('label').removeClass('active').children('input').removeAttr('checked');
                            delCookie(cur_active+'_attr_cookie');
                       }
                });
            //获取所有选项的值
            //航班属性
            var f_attr = [];
            var i=0;
            $("input[name='f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_attr.push($(this).val());
                    i++;
                }
            });
            var in_f_attr = [];
            var i=0;
            $("input[name='in_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_attr.push($(this).val());
                    i++;
                }
            });
            var out_f_attr = [];
            var i=0;
            $("input[name='out_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_attr.push($(this).val());
                    i++;
                }
            });
            //要客航班
            var f_vip = [];
            $("input[name='f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_vip.push($(this).val());
                }
            });
            var in_f_vip = [];
            $("input[name='in_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_vip.push($(this).val());
                }
            });
            var out_f_vip = [];
            $("input[name='out_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_vip.push($(this).val());
                }
            });

            //航班状态
            var f_status_code = [];
            $("input[name='f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_status_code.push($(this).val());
                }
            });
            var in_f_status_code = [];
            $("input[name='in_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_status_code.push($(this).val());
                }
            });
            var out_f_status_code = [];
            $("input[name='out_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_status_code.push($(this).val());
                }
            });
            //f_status_code
            //放行情况
            var f_release = [];
            $("input[name='f_release_situation[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_release.push($(this).val());
                }
            });


            if(f_vip.length > 0 || in_f_vip.length > 0 || out_f_vip.length > 0){

                //先去设置缓存

                var cache_param = {
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    f_status:cur_active
                };

                // 设置筛选属性cookie存储
                set_cache_attr(cache_param);
                var start_time = $("#startTime").val();
                var end_time = $("#endTime").val();
                //请求URL
                var requestParamObj = {
                    init:1,
                    start_time:start_time,
                    end_time:end_time,
                    pid:new Date().getTime(),
                    f_status:cur_active,
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    page_hash:PAGE_HASH
                };
                if(requestParamObj.f_status == 'cmd'){
                    var cmd = $("#zhInstuction").find('input').val();
                    cmd = cmd.toUpperCase();
                    requestParamObj.cmd = cmd;
                }
                //请求数据
                requestList(requestParamObj);

            }

        });

        //////////////////////////////////////////////////
        $("body").on('click',".flight_status_code",function(e){
            e.preventDefault();
            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }

            var _this = $(this);
            var input_flag = 0;
            var _input_name = _this.find('input').attr('name');
            if(_input_name.indexOf('in') !== -1){
                input_flag = 1;
            }else if(_input_name.indexOf('out') !== -1){
                input_flag = 2;
            }


            var index = $(this).parent().index();
            var cur_active = get_cur_active();
            if(cur_active == ''){
                cur_active = 'cmd';
            }
            if(index !== 0){
                _this.parent().parent().children('li').eq(0).children('label').removeClass('active').children('input').removeAttr('checked');
                if(_this.children('input').attr('checked') == undefined){
                        var _attr_val = _this.children('input').val();
                        var cookie_value = getCookie(cur_active+'_attr_cookie');
                        if(cookie_value){
                            var tmp = cookie_value.split("|");
                            if(input_flag == 0){
                                var f_status_code_cookie = tmp[2];
                            }else if(input_flag == 1){
                                var f_status_code_cookie = tmp[5];
                            }else{
                                var f_status_code_cookie = tmp[8];
                            }

                            var f_status_code_arr = f_status_code_cookie.split(',');
                            _attr_val = parseInt(_attr_val);
                            if($.inArray(_attr_val,f_status_code_arr) !== -1){
                                _attr_val = _attr_val + "";
                                var index = f_status_code_arr.indexOf(_attr_val);
                                f_status_code_arr.splice(index, 1);
                                f_status_code_cookie = f_status_code_arr.join(",");
                            }
                            if(input_flag == 0){
                                setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+f_status_code_cookie+"|"+tmp[3]+"|"+tmp[4]+"|"+tmp[5]+"|"+tmp[6]+"|"+tmp[7]+"|"+tmp[8]);
                            }else if(input_flag == 1){
                                setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+tmp[2]+"|"+tmp[3]+"|"+tmp[4]+"|"+f_status_code_cookie+"|"+tmp[6]+"|"+tmp[7]+"|"+tmp[8]);
                            }else{
                                setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+f_status_code_cookie+"|"+tmp[3]+"|"+tmp[4]+"|"+tmp[5]+"|"+tmp[6]+"|"+tmp[7]+"|"+f_status_code_cookie);
                            }
                    }
                }

            }else{
                _this.parent().parent().children('li').each(function(k){
                       if(k !== 0){
                            $(this).children('label').removeClass('active').children('input').removeAttr('checked');
                             delCookie(cur_active+'_attr_cookie');
                       }
                });
            }

            //获取所有选项的值
            //航班属性
            var f_attr = [];
            var i=0;
            $("input[name='f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_attr.push($(this).val());
                    i++;
                }
            });
            var in_f_attr = [];
            var i=0;
            $("input[name='in_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_attr.push($(this).val());
                    i++;
                }
            });
            var out_f_attr = [];
            var i=0;
            $("input[name='out_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_attr.push($(this).val());
                    i++;
                }
            });
            //要客航班
            var f_vip = [];
            $("input[name='f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_vip.push($(this).val());
                }
            });
            var in_f_vip = [];
            $("input[name='in_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_vip.push($(this).val());
                }
            });
            var out_f_vip = [];
            $("input[name='out_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_vip.push($(this).val());
                }
            });

            //航班状态
            var f_status_code = [];
            $("input[name='f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_status_code.push($(this).val());
                }
            });
            var in_f_status_code = [];
            $("input[name='in_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_status_code.push($(this).val());
                }
            });
            var out_f_status_code = [];
            $("input[name='out_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_status_code.push($(this).val());
                }
            });
            //放行情况
            var f_release = [];
            $("input[name='f_release_situation[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_release.push($(this).val());
                }
            });
            if(f_status_code.length > 0 || in_f_status_code.length > 0 || out_f_status_code.length > 0){

                //先去设置缓存
                var cache_param = {
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    f_status:cur_active
                };
                set_cache_attr(cache_param);
                var start_time = $("#startTime").val();
                var end_time = $("#endTime").val();
                //请求URL
                var requestParamObj = {
                    init:1,
                    start_time:start_time,
                    end_time:end_time,
                    pid:new Date().getTime(),
                    f_status:cur_active,
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    page_hash:PAGE_HASH
                };
                //请求数据
                if(requestParamObj.f_status == 'cmd'){
                    var cmd = $("#zhInstuction").find('input').val();
                    cmd = cmd.toUpperCase();
                    requestParamObj.cmd = cmd;
                }
                requestList(requestParamObj);
            }

        });

        //放行情况
        $("body").on('click',".release",function(e){
            e.preventDefault();
            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }

            var _this = $(this);
            var input_flag = 0;
            var _input_name = _this.find('input').attr('name');
            if(_input_name.indexOf('in') !== -1){
                input_flag = 1;
            }else if(_input_name.indexOf('out') !== -1){
                input_flag = 2;
            }


            var index = $(this).parent().index();
            var cur_active = get_cur_active();
            if(cur_active == ''){
                cur_active = 'cmd';
            }
            if(index !== 0){
                _this.parent().parent().children('li').eq(0).children('label').removeClass('active').children('input').removeAttr('checked');
                if(_this.children('input').attr('checked') == undefined){
                    var _attr_val = _this.children('input').val();
                    var cookie_value = getCookie(cur_active+'_attr_cookie');
                    if(cookie_value){
                        var tmp = cookie_value.split("|");
                        if(input_flag == 0){
                            var f_status_code_cookie = tmp[2];
                        }else if(input_flag == 1){
                            var f_status_code_cookie = tmp[5];
                        }else{
                            var f_status_code_cookie = tmp[8];
                        }

                        var f_status_code_arr = f_status_code_cookie.split(',');
                        _attr_val = parseInt(_attr_val);
                        if($.inArray(_attr_val,f_status_code_arr) !== -1){
                            _attr_val = _attr_val + "";
                            var index = f_status_code_arr.indexOf(_attr_val);
                            f_status_code_arr.splice(index, 1);
                            f_status_code_cookie = f_status_code_arr.join(",");
                        }
                        if(input_flag == 0){
                            setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+f_status_code_cookie+"|"+tmp[3]+"|"+tmp[4]+"|"+tmp[5]+"|"+tmp[6]+"|"+tmp[7]+"|"+tmp[8]);
                        }else if(input_flag == 1){
                            setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+tmp[2]+"|"+tmp[3]+"|"+tmp[4]+"|"+f_status_code_cookie+"|"+tmp[6]+"|"+tmp[7]+"|"+tmp[8]);
                        }else{
                            setCookie(cur_active+'_attr_cookie',tmp[0]+"|"+tmp[1]+"|"+f_status_code_cookie+"|"+tmp[3]+"|"+tmp[4]+"|"+tmp[5]+"|"+tmp[6]+"|"+tmp[7]+"|"+f_status_code_cookie);
                        }
                    }
                }

            }else{
                _this.parent().parent().children('li').each(function(k){
                    if(k !== 0){
                        $(this).children('label').removeClass('active').children('input').removeAttr('checked');
                        delCookie(cur_active+'_attr_cookie');
                    }
                });
            }

            //获取所有选项的值
            //航班属性
            var f_attr = [];
            var i=0;
            $("input[name='f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_attr.push($(this).val());
                    i++;
                }
            });
            var in_f_attr = [];
            var i=0;
            $("input[name='in_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_attr.push($(this).val());
                    i++;
                }
            });
            var out_f_attr = [];
            var i=0;
            $("input[name='out_f_attr[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_attr.push($(this).val());
                    i++;
                }
            });
            //要客航班
            var f_vip = [];
            $("input[name='f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_vip.push($(this).val());
                }
            });
            var in_f_vip = [];
            $("input[name='in_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_vip.push($(this).val());
                }
            });
            var out_f_vip = [];
            $("input[name='out_f_vip[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_vip.push($(this).val());
                }
            });

            //航班状态
            var f_status_code = [];
            $("input[name='f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_status_code.push($(this).val());
                }
            });
            var in_f_status_code = [];
            $("input[name='in_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    in_f_status_code.push($(this).val());
                }
            });
            var out_f_status_code = [];
            $("input[name='out_f_status_code[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    out_f_status_code.push($(this).val());
                }
            });
            //放行情况
            var f_release = [];
            $("input[name='f_release_situation[]']").each(function(){
                if($(this).parent().hasClass('active')){
                    f_release.push($(this).val());
                }
            });

            if(f_release.length > 0){

                //先去设置缓存
                var cache_param = {
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    f_status:cur_active
                };
                set_cache_attr(cache_param);
                var start_time = $("#startTime").val();
                var end_time = $("#endTime").val();
                //请求URL
                var requestParamObj = {
                    init:1,
                    start_time:start_time,
                    end_time:end_time,
                    pid:new Date().getTime(),
                    f_status:cur_active,
                    f_attr:f_attr,
                    f_vip:f_vip,
                    f_status_code:f_status_code,
                    in_f_attr:in_f_attr,
                    in_f_vip:in_f_vip,
                    in_f_status_code:in_f_status_code,
                    out_f_attr:out_f_attr,
                    out_f_vip:out_f_vip,
                    out_f_status_code:out_f_status_code,
                    f_release:f_release,
                    page_hash:PAGE_HASH
                };
                //请求数据
                if(requestParamObj.f_status == 'cmd'){
                    var cmd = $("#zhInstuction").find('input').val();
                    cmd = cmd.toUpperCase();
                    requestParamObj.cmd = cmd;
                }
                requestList(requestParamObj);
            }
        });
    }


    /**
     * [set_cache_attr 设置属性缓存]
     * @param {[type]} requestParam [description]
     */
    function set_cache_attr(requestParam)
    {

        //f_attr
        //f_vip
        //f_status_code
        var cookie_name = requestParam.f_status + '_attr_cookie';
        var f_attr = requestParam.f_attr.join(",");
        var f_vip = requestParam.f_vip.join(",");
        var f_status_code = requestParam.f_status_code.join(",");
        var in_f_attr = requestParam.in_f_attr.join(",");
        var in_f_vip = requestParam.in_f_vip.join(",");
        var in_f_status_code = requestParam.in_f_status_code.join(",");
        var out_f_attr = requestParam.out_f_attr.join(",");
        var out_f_vip = requestParam.out_f_vip.join(",");
        var out_f_status_code = requestParam.out_f_status_code.join(",");
        var f_release = requestParam.f_release.join(",");
        setCookie(cookie_name,f_attr+"|"+f_vip+"|"+f_status_code+"|"+in_f_attr+"|"+in_f_vip+"|"+in_f_status_code+"|"+out_f_attr+"|"+out_f_vip+"|"+out_f_status_code+"|"+f_release);
    }

    /**
     * [requestList 航班列表请求]
     * @param  {[type]} requestParamObj [description]
     * @return {[type]}                 [description]
     */
    function requestList(requestParamObj){
        if(ajax_timer != null){
            clearTimeout(ajax_timer);
        }
        if(ajax_request != null){
            ajax_request.abort();
        }

        //页面加载第一次执行没有执行此处代码
        if(requestParamObj.list_type !== undefined){
            if(in_out_all_flag == 0){
                for(var i=0;i<6;i++){
                    if($.inArray(i.toString(),requestParamObj.list_type) == -1){
                        $(".zh-opt-count li").eq(i).addClass('hide');
                    }else{
                        $(".zh-opt-count li").eq(i).removeClass('hide');
                    }
                }
            }else{
                for(var i=2;i<6;i++){
                    if($.inArray(i.toString(),requestParamObj.list_type) == -1){
                        $(".zh-opt-count li").eq(i).addClass('hide');
                    }else{
                        $(".zh-opt-count li").eq(i).removeClass('hide');
                    }
                }
            }
        }

        if(in_out_all_flag == 0){
            var title_arr = ["进港：","出港：","不正常：","关注：","航食责任：","会议："];
        }else{
            var title_arr = ["进出港：","不正常：","关注：","航食责任：","会议："];
        }


        if(requestParamObj.init == 1)
        {
            //显示loading层
            $(".zh-loading-box").removeClass('hide');
            //TAB数量后面添加一个loading效果
            if(requestParamObj.f_status.indexOf('in') !== -1){
                title_arr[0] = all_title_arr[requestParamObj.f_status]+'：';
            }else if(requestParamObj.f_status.indexOf('out') !== -1){
                title_arr[1] = all_title_arr[requestParamObj.f_status]+'：';
            }else if(requestParamObj.f_status.indexOf('all') !== -1){
                title_arr[0] = all_title_arr[requestParamObj.f_status]+'：';
            }else if(requestParamObj.f_status.indexOf('food') !== -1){
                title_arr[title_arr.length-2] = all_title_arr[requestParamObj.f_status]+'：';
            }
            if(requestParamObj.f_status !== 'cmd'){
                $(".zh-opt-count li a").each(function(k){
                    //$(this).find('span').text("").addClass('zh-refresh');
                    $(this).html(title_arr[k] + '<span class="zh-refresh"></span>');
                });
            }
        }

        if(requestParamObj.f_status == "cmd"){
             var url = GET_CMD_FLIGHT_LIST_URL;
             requestParamObj.page_hash = PAGE_HASH;
        }else{
             var url = GET_FLIGHT_LIST_URL;
        }

       ajax_request = $.ajax({
                type: 'POST',
                dataType: "json",
                data: requestParamObj,
                url: url,
                cache: false,
                timeout: 60000,
                beforeSend: function() {
                    if(requestParamObj.init==1){
                        ajax_lock = true;
                    }
                },
                success: function(data){
                    if(requestParamObj.init == 1 && requestParamObj.f_status == 'cmd'){
                         if($.isEmptyObject(data.init)){
                             $(".zh-loading-box").addClass('hide');
                             $('.flight-list-table thead,.flight-list-table tbody').empty();
                             $('.flight-list-table tbody').html('<p class="zh-empty-tip">暂无查询结果,请重新查询</p>');
                            ajax_lock = false;
                            $(".zh-opt-count li:not(.hide)").removeClass('active');
                         }
                    }
                    if(data.count !== undefined){
                        //更新数量
                        if(in_out_all_flag == 0){
                            var count_arr = [data.count.in,data.count.out,data.count.abnormal,data.count.attention,data.count.food,data.count.meet];
                        }else{
                            var count_arr = [data.count.all,data.count.abnormal,data.count.attention,data.count.food,data.count.meet];
                        }
                        if(in_out_all_flag == 0){
                            li_type_arr = ['in_0','out_0','abnormal','attention','food_0','meet'];
                        }else{
                            li_type_arr = ['all_0','abnormal','attention','food_0','meet'];
                        }
                        $(".zh-opt-count li a").each(function(k){
                            $(this).find('span').removeClass('zh-refresh').text(count_arr[k]);
                            if(li_type_arr[k] == 'in_0'){
                                if(requestParamObj.f_status.indexOf('in') == -1){
                                    $(this).attr('type',li_type_arr[k]);
                                }
                            }else if(li_type_arr[k] == 'out_0'){
                                if(requestParamObj.f_status.indexOf('out') == -1){
                                    $(this).attr('type',li_type_arr[k]);
                                }
                            }else if(li_type_arr[k] == 'food_0'){
                                if(requestParamObj.f_status.indexOf('food') == -1){
                                    $(this).attr('type',li_type_arr[k]);
                                }
                            }else{
                                $(this).attr('type',li_type_arr[k]);
                            }
                        });
                    }


                    //取消loading层
                    $(".zh-loading-box").addClass('hide');

                     if(requestParamObj.f_status == 'cmd'){
                         //将tab选中去除
                         $(".zh-opt-count li").each(function(k){
                            $(this).removeClass('active');
                         });
                         //更新数量
                         if(data.count !== undefined){
                             $(".flight-count").html("*共"+ data.count.total +"条航班列表");
                         }
                    }else{
                        if($('.zh-fd-header .zh-opt-count li:not(.hide)').hasClass("active") === false){
                            $('.zh-fd-header .zh-opt-count li:not(.hide):first').addClass('active');
                        }

                        $(".flight-count").html("*共0条航班列表");
                    }

                    renderList(data,requestParamObj);
                    //重新复制
                    if(in_out_all_flag == 0){
                        li_type_arr = ['in_0','out_0','abnormal','attention','food_0','meet'];
                    }else{
                        li_type_arr = ['all_0','abnormal','attention','food_0','meet'];
                    }


                    ajax_lock = false;

                    fdListTheadFixFn($('.zh-fd-list'));
                    if(requestParamObj.init == 1){
                        // 重置
                        $('.zh-thead-fix .zh-table thead').css('position', 'static');
                        $('.zh-fd-list').scrollTop(0);
                    }


                    //轮询
                    // if(requestParamObj.is_attr != undefined){
                    //     return false;
                    // }



                    if(requestParamObj.f_status != 'cmd'){
                        if(ajax_lock == false){
                            if(ajax_timer != null){
                                clearTimeout(ajax_timer);
                            }
                            if(ajax_request != null){
                                ajax_request.abort();
                            }

                         //判断是否进行自动刷新

                         requestParamObj.init = 0;
                         requestParamObj.pid = new Date().getTime();
                         ajax_request = null;
                            if(ajax_timer != null){
                                clearTimeout(ajax_timer);
                            }
                            ajax_timer = setTimeout(function(){
                                requestList(requestParamObj);
                            },time_interval);


                        }
                    }else{


                        if(ajax_timer != null){
                            clearTimeout(ajax_timer);
                        }
                        if(ajax_request != null){
                            ajax_request.abort();
                        }

                         requestParamObj.init = 0;
                         requestParamObj.pid = new Date().getTime();
                         ajax_request = null;
                        if(ajax_timer != null){
                            clearTimeout(ajax_timer);
                        }
                        ajax_timer = setTimeout(function(){
                            requestList(requestParamObj);
                        },time_interval);

                    }



                },
                complete:function(xhr,textStatus){
                    //回收xhr对象
                    xhr = null;
                },
                error: function(){
                    //error re request
                    // setTimeout(function(){
                    //     requestList(requestParamObj);
                    // },3000);
                }
        });

    }

    /**
     * [order_request 排序请求数据]
     * @return {[type]} [description]
     */
    function order_request(requestParamObj){
        $("body").on('click',".zh-fd-list .zh-order",function(){
            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }
            //排序字段
            var order_field =  $(this).find("span").eq(1).attr('order_field');
            $(this).siblings().find('.zh-icon-order').removeClass('zh-order-asc zh-order-desc');
            var orderIcon = $(this).find('.zh-icon-order');
            if(orderIcon.hasClass('zh-order-asc')) {
                orderIcon.removeClass('zh-order-asc');
                orderIcon.addClass('zh-order-desc');
                requestParamObj.order_type = 'DESC';
            } else {
                orderIcon.removeClass('zh-order-desc');
                orderIcon.addClass('zh-order-asc');
                requestParamObj.order_type = 'ASC';
            }

            requestParamObj.order_field = order_field;
            var cur_active = get_cur_active();
            if(cur_active == ''){
                cur_active = 'cmd';
                var cmd = $("#zhInstuction").find("input").val();
                cmd = cmd.toUpperCase();
                requestParamObj.cmd = cmd;
            }
            requestParamObj.f_status = cur_active;
            requestParamObj.init = 1;
            delCookie(cur_active+"_attr_cookie");
            requestList(requestParamObj);

        });
    }

    /*
        指令操作
     */
    function matchInstructionFn(str) {
        if(str.length < 3){
            layer.msg("请输入不少于三位字符的指令",{time:2000});
            return false;
        }
        var start_time = $("#startTime").val();
        var end_time = $("#endTime").val();
        var requestParamObj = {
            init:1,
            pid:new Date().getTime(),
            cmd:str,
            start_time:start_time,
            end_time:end_time,
            f_status:'cmd'
        };

        //请求数据

        if(ajax_timer != null){
            clearTimeout(ajax_timer);
        }
        if(ajax_request != null){
            ajax_request.abort();
        }

        delCookie('cmd_attr_cookie');
        requestList(requestParamObj);


    }




    // 初始化
    var historyInstructionsArr = [],
        historyInstructions = localStorage.getItem('historyInstructions');
    if(historyInstructions) {
        historyInstructionsArr = historyInstructions.split(',');
    }

// 渲染指令
    function renderInstruction() {
        var hiLength = historyInstructionsArr.length,
            li = '';
        if(hiLength == 0) {
            var instruction = $.trim($('#zhInstuction input').val());
            if(instruction.length > 0) {
                historyInstructionsArr.push(instruction);
                localStorage.setItem('historyInstructions', historyInstructionsArr);
                li += '<li>'+instruction+'</li>';
            }
        } else {
            for(var i=hiLength-1; i>=0; i--) {
                li += '<li>'+historyInstructionsArr[i]+'</li>';
            }
        }
        $('.zh-instruction-history>ul').html(li);
    }
    renderInstruction();

// 历史指令点击
    $('.zh-instruction-history>ul').on('click', 'li', function(e) {
        e.stopPropagation();
        $('#zhInstuction input').val($(this).text());
        $('.zh-instruction-history').removeClass('active');
        // alert('查询：'+$(this).text());
        matchInstructionFn($(this).text());

    });

// 清空指令
    $('.zh-instruction-history>.zh-title .zh-clear').click(function(e) {
        e.stopPropagation();
        $('.zh-instruction-history>ul').html('');
        historyInstructionsArr = [];
        localStorage.removeItem('historyInstructions');
    });
    // 显示/隐藏x号
    $('#zhInstuction input').on('keyup', function() {
        var _val = $.trim($(this).val());
        if(_val.length > 0) {
            $(this).siblings('.zh-fd-btn').addClass('active');
        } else {
            $(this).siblings('button').removeClass('active');
        }
    });
// 点击x号
    $('#zhInstuction button').click(function() {
        $(this).removeClass('active');
    });

// 显示历史指令
    $('#zhInstuction input').focus(function(e) {
        e.stopPropagation();
        $('.zh-instruction-history').addClass('active');
    }).click(function(e) {
        e.stopPropagation();
    });
// 隐藏历史指令
    $('body').click(function() {
        $('.zh-instruction-history').removeClass('active');
    });



    function instructionFn() {
        if(in_out_all_flag == 0){
            var f_status = 'in_0';
        }else{
            var f_status = 'all_0';
        }
        var start_time = $("#startTime").val();
        var end_time = $("#endTime").val();
        var requestParamObj = {
            init:1,
            pid:new Date().getTime(),
            start_time:start_time,
            end_time:end_time,
            f_status:f_status,
        };

        $('#zhInstuction input').on('input', function() {
            if($.trim($(this).val()) === '') {

                if(ajax_timer != null){
                    clearTimeout(ajax_timer);
                }
                if(ajax_request != null){
                    ajax_request.abort();
                }
                var start_time = $("#startTime").val();
                var end_time = $("#endTime").val();
                requestParamObj.start_time = start_time;
                requestParamObj.end_time = end_time;
               requestParamObj.init = 1;
                if(in_out_all_flag == 0){
                    var f_status = 'in_0';
                }else{
                    var f_status = 'all_0';
                }
                requestParamObj.f_status = f_status;
               delCookie('cmd_attr_cookie');
               requestList(requestParamObj);
            }
        });

        //重置按钮点击
        $("button[type='reset']").click(function(){
             if($('#zhInstuction input').val() == ''){
                        return false;
             }

            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }
            if(in_out_all_flag == 0){
                var f_status = 'in_0';
            }else{
                var f_status = 'all_0';
            }
            requestParamObj.f_status = f_status;
             requestParamObj.init = 1;
             requestList(requestParamObj);
        });

        $(document).keydown(function(e) {
            switch(e.keyCode) {
                // enter键
                case 13:
                    e.preventDefault();
                    if($('#zhInstuction input').is(':focus')) {
                        var instruction = $.trim($('#zhInstuction input').val());
                        if(instruction !== '') {
                            instruction = instruction.toUpperCase();
                            matchInstructionFn(instruction);

                            if($.inArray(instruction, historyInstructionsArr) == -1) {
                                if(historyInstructionsArr.length >= 6) historyInstructionsArr.shift();
                                historyInstructionsArr.push(instruction);
                                localStorage.setItem('historyInstructions', historyInstructionsArr);
                            }

                            renderInstruction();
                        }
                    } else {
                        $('#zhInstuction input').focus();
                    }
                    break;

                // esc键
                case 27:
                    if($('#zhInstuction input').is(':focus')) {
                        $('#zhInstuction input').blur();
                    }
                    break;

                // delete键
                case 46:
                    if($('#zhInstuction input').val() == ''){
                        return false;
                    }
                    $('#zhInstuction input').val('');
                    if(in_out_all_flag == 0){
                        var f_status = 'in_0';
                    }else{
                        var f_status = 'all_0';
                    }
                    requestParamObj.f_status = f_status;
                    requestList(requestParamObj);
                    break;

            }
        });
    }

    //更新翻转效果
    function updateFn(row){
        $(row).addClass('am_updateRow');
        setTimeout(function(){
            setTimeout(function(){
                $(row).removeClass('am_updateRow');
            },100);
        },1000);
    }
    /**
     * [request_in_flight_list 即将进港数据请求]
     * @return {[type]} [description]
     */
    function request_in_flight_list(){
        var requestParamObj = {
            type:1,
            pid:new Date().getTime(),
            page_hash:PAGE_HASH
        };

          $.ajax({
                   type: 'POST',
                    dataType: "json",
                    data: requestParamObj,
                    url: GET_FLIGHT_LIST_SOON_URL,
                    cache: false,
                    timeout: 60000,
                    success: function(data){

                        if(data.count !== undefined)
                        {
                            $("#in_flight_count").html("进港动态("+data.count+")");
                        }
                        if(data.data.add !== undefined)
                        {


                            $.each(data.data.add,function(k,v){
                                //insert_fid_below
                                var is_vip = '';
                                if(v.is_vip == 1){
                                    is_vip = '<span class="am_statusIcon zh-vip-yellow">V</span>';
                                }
                                var ele_html = '<tr class="flight_'+ v.fid +'">';
                                ele_html += '<td style="cursor:pointer;" class="soon_fnum">' +is_vip + v.fnum +'</td>';
                                ele_html += '<td>'+ v.aircraft_num+'</td>';
                                ele_html += '<td><span class="am_statusIcon am_yuIcon">预</span>'+ v.estimated_arrtime+'</td>';
                                ele_html += '<td>'+ v.flight_status_code_cn+'</td>';
                                ele_html += '</tr>';
                                if(v.insert_fid_below == ''){
                                    $(".in-flight tbody").prepend(ele_html);
                                }else{
                                    $(".in-flight tbody").find(".flight_"+v.insert_fid_below).after(ele_html);
                                }
                                updateFn(".flight_"+v.fid);
                            });
                        }

                        if(data.data.del !== undefined)
                        {
                            //移除
                            $.each(data.data.del,function(k,v){
                               $(".in-flight tbody").find(".flight_"+v).remove();
                            });
                        }


                        if(data.data.update !== undefined && data.data.update != '')
                        {
                            $.each(data.data.update,function(k,v){

                                if(v.flight_status_code_cn != undefined){
                                    $(".flight_"+k+" td").eq(3).html('<span class="zh-text-red-bold">'+v.flight_status_code_cn+'</span>');
                                }
                                if(v.estimated_arrtime != undefined){
                                    $(".flight_"+k+" td").eq(2).html('<span class="am_statusIcon am_yuIcon">预</span><span class="zh-text-red-bold">'+v.estimated_arrtime+'</span>');
                                }
                                updateFn(".flight_"+k);
                            });
                        }

                        setTimeout(request_in_flight_list,20000);

                    },
                    complete:function(xhr,textStatus){
                        //回收xhr对象
                        xhr = null;
                    },
                    error: function(){
                        //todo
                    }
        });

    }

    /**
     * [request_out_flight_list 即将出港数据请求]
     * @return {[type]} [description]
     */
    function request_out_flight_list(){
         var requestParamObj = {
            type:0,
            pid:new Date().getTime(),
             page_hash:PAGE_HASH
        };

         $.ajax({
                   type: 'POST',
                    dataType: "json",
                    data: requestParamObj,
                    url: GET_FLIGHT_LIST_SOON_URL,
                    cache: false,
                    timeout: 60000,
                    success: function(data){
                        if(data.count !== undefined)
                        {
                            $("#out_flight_count").html("出港动态("+data.count+")");
                        }
                        if(data.data.add !== undefined)
                        {
                            $.each(data.data.add,function(k,v){
                                //insert_fid_below
                                var is_vip = '';
                                if(v.is_vip == 1){
                                    is_vip = '<span class="am_statusIcon zh-vip-black">V</span>';
                                }
                                var ele_html = '<tr class="flight_'+ v.fid +'">';
                                ele_html += '<td style="cursor:pointer;" class="soon_fnum">'+ is_vip +v.fnum +'</td>';
                                ele_html += '<td>'+ v.aircraft_num+'</td>';
                                ele_html += '<td><span class="am_statusIcon am_yuIcon">预</span>'+ v.estimated_deptime+'</td>';
                                ele_html += '<td>'+ v.flight_status_code_cn+'</td>';
                                ele_html += '</tr>';

                                 if(v.insert_fid_below == ''){
                                    $(".out-flight tbody").prepend(ele_html);
                                }else{
                                    $(".out-flight tbody").find(".flight_"+v.insert_fid_below).after(ele_html);
                                }

                                updateFn(".flight_"+v.fid);
                                //$(".out-flight tbody tr").eq((v.insert_fid_below-1)).after(ele_html);
                            });
                        }

                        if(data.data.del !== undefined)
                        {
                            //移除
                            $.each(data.data.del,function(k,v){
                                $(".out-flight tbody").find(".flight_"+k).remove();
                                //$(".out-flight tbody tr").eq((v-1)).remove();
                            });
                        }

                        //update
                        if(data.data.update !== undefined && data.data.update != '')
                        {
                            $.each(data.data.update,function(k,v){
                                if(v.flight_status_code_cn != undefined){
                                    $(".flight_"+k+" td").eq(3).html('<span class="zh-text-red-bold">'+v.flight_status_code_cn+'</span>');
                                }
                                if(v.estimated_deptime != undefined){
                                    $(".flight_"+k+" td").eq(2).html('<span class="am_statusIcon am_yuIcon">预</span><span class="zh-text-red-bold">'+v.estimated_deptime+'</span>');
                                }
                                updateFn(".flight_"+k);
                            });
                        }

                        setTimeout(request_out_flight_list,20000);
                    },
                    complete:function(xhr,textStatus){
                        //回收xhr对象
                        xhr = null;
                    },
                    error: function(){
                        //todo
                    }
        });
    }

    //获取cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
        return null;
    }

    //设置cookie
    function setCookie(name,value){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

    //删除cookie
    function delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }

    //轮询方法
    function requestMsg(){
         var param ={init:0};
          msg_request = $.ajax({
            type: 'GET',
            dataType: "json",
            data: param,
            url: GET_FEEDBACK_MSG_URL,
            cache: false,
            timeout: 60000,
            success:function(data){
                if(data.code == 0){
                    var user_default_airport = getCookie('user_default_airport');
                    var count = 0;
                    var html = '';
                     $.each(data.data,function(k,v){
                        var bg_class = '';
                        var info_id = v.info_id;
                        msg_object[info_id] = {
                              from:{
                                department:v.from_department_confirm_info.department,
                                truename:v.from_department_confirm_info.truename,
                                send_time:v.send_time,
                                msg_type:'事务催办'
                              },
                              to:[],
                              content:v.content,
                              need_confirm:v.need_confirm

                        };
                        for(var i in v.to_department_confirm_info){
                             msg_object[info_id]['to'].push({
                                to_department_cn:v.to_department_confirm_info[i].to_department_cn,
                                confirmed_status:v.to_department_confirm_info[i].confirmed_status,
                                confirmed_time:v.to_department_confirm_info[i].confirmed_time
                             });
                        }
                        count++;
                        if(k == 0){
                             bg_class = 'class="zh-bg-light-yellow"';
                        }


                        if(v.flight == null){
                            var fnum = '';
                            var aircraft_num = '';
                            var parking = '';
                            var city = '';
                            var direction = '';
                        }else{
                            var fnum = v.flight.fnum;
                            var aircraft_num = v.flight.aircraft_num;
                            var parking = v.flight.parking;
                            if(v.flight.forg_iata == user_default_airport){
                                var direction = '进';
                                var city = v.flight.fdst_cn;
                            }else{
                                var direction = '出';
                                var city = v.flight.forg_cn;
                            }
                        }


                        var newDate = new Date();
                        newDate.setTime(v.send_time * 1000);
                        var send_time = newDate.Format("yyyy/MM/dd hh:mm");

                        //////
                        var tr_html = '<tr '+ bg_class +' data="'+ info_id+'">';
                        tr_html += '<td>'+send_time+'</td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:64px;">'+fnum+'</span></td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:50px;">'+aircraft_num+'</span></td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:34px;">'+parking+'</span></td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:64px;">'+city+'</span></td>';
                        tr_html += '<td>'+direction+'</td>';
                        tr_html += '<td>事务催办</td>';
                        tr_html += '<td><span class="zh-department" style="max-width:300px;" data-title="'+ v.content +'">'+v.content+'</span></td>';
                        tr_html += '<td><span class="zh-department" data-title="'+ v.from_department_confirm_info.department +'">'+v.from_department_confirm_info.department+'</span></td>';
                        tr_html += '<td><span class="zh-department" data-title="'+ v.to_department_confirm_info[0]['to_department_cn'] +'">'+v.to_department_confirm_info[0]['to_department_cn']+'</span></td>';
                        //接收类型 receive send
                        var info_type = v.info_type;
                        if(v.info_type == "receive"){
                            //接收的消息
                            if(v.need_confirm == 1){
                                if(v.info_confirmed_status == 2){
                                    //已确认
                                    tr_html += '<td><a href="###" class="zh-confirm selected">已确认</a></td>';
                                }else if(v.info_confirmed_status == 1){
                                    //待确认
                                    tr_html += '<td><a data-id="'+v.info_object_id+'" href="###" class="zh-confirm">确认</a></td>';
                                }
                            }else{
                                //已确认
                                tr_html += '<td><span>已接收</span></td>';
                            }
                        }else{
                            //发送的消息
                            //接收的消息
                            if(v.need_confirm == 1){
                                if(v.info_confirmed_status == 2){
                                    //已确认
                                    tr_html += '<td><span>已确认</span></td>';
                                }else if(v.info_confirmed_status == 1){
                                    //待确认
                                    tr_html += '<td><span>待确认</span></td>';
                                }
                            }else{
                                tr_html += '<td><span>已发送</span></td>';
                            }

                        }

                        html += tr_html;
                    });

                     if(html != ''){
                         $(".feed_back_msg tbody").html(html);
                         if(count >0){
                            $(".zh-transaction-heading h3").html("事务消息("+ count +")");
                         }

                     }
               }
            }
        });
    }


    /**
     * [requestMsg 请求事务消息]
     * @return {[type]} [description]
     */
    function requestMsgInit(){
        var param ={init:1};
        msg_request = $.ajax({
            type: 'GET',
            dataType: "json",
            data: param,
            url: GET_FEEDBACK_MSG_URL,
            cache: false,
            timeout: 60000,
            success:function(data){
                if(data.code == 0){
                    var user_default_airport = getCookie('user_default_airport');
                    //console.log(user_default_airport);
                    var count = 0;
                    var html = '';
                    $.each(data.data,function(k,v){
                        var info_id = v.info_id;
                        msg_object[info_id] = {
                              from:{
                                department:v.from_department_confirm_info.department,
                                truename:v.from_department_confirm_info.truename,
                                send_time:v.send_time,
                                msg_type:'事务催办'
                              },
                              to:[],
                              content:v.content,
                              need_confirm:v.need_confirm

                        };

                        for(var i in v.to_department_confirm_info){
                             msg_object[info_id]['to'].push({
                                to_department_cn:v.to_department_confirm_info[i].to_department_cn,
                                confirmed_status:v.to_department_confirm_info[i].confirmed_status,
                                confirmed_time:v.to_department_confirm_info[i].confirmed_time
                             });
                        }
                        count++;

                        var bg_class = '';
                        if(k==0){
                            bg_class = 'class="zh-bg-light-yellow"';
                        }
                        if(v.flight == null){
                            var fnum = '';
                            var aircraft_num = '';
                            var parking = '';
                            var city = '';
                            var direction = '';
                        }else{
                            var fnum = v.flight.fnum;
                            var aircraft_num = v.flight.aircraft_num;
                            var parking = v.flight.parking;
                            if(v.flight.forg_iata == user_default_airport){
                                var direction = '出';
                                var city = v.flight.fdst_cn;
                            }else{
                                var direction = '进';
                                var city = v.flight.forg_cn;
                            }
                        }

                        var newDate = new Date();
                        newDate.setTime(v.send_time * 1000);
                        var send_time = newDate.Format("yy/MM/dd hh:mm");

                        //send_time

                        //////
                        var tr_html = '<tr '+ bg_class +' data="'+ info_id+'">';
                        tr_html += '<td>'+send_time+'</td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:64px;">'+fnum+'</span></td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:50px;">'+aircraft_num+'</span></td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:34px;">'+parking+'</span></td>';
                        tr_html += '<td><span class="am_ellipsis" style="width:64px;">'+city+'</span></td>';
                        tr_html += '<td>'+direction+'</td>';
                        tr_html += '<td>事务催办</td>';
                        tr_html += '<td><span class="zh-department" style="max-width:300px;" data-title="'+ v.content +'">'+v.content+'</span></td>';
                        tr_html += '<td><span class="zh-department" data-title="'+v.from_department_confirm_info.department+'">'+v.from_department_confirm_info.department+'</span></td>';
                        tr_html += '<td><span class="zh-department" data-title="'+v.to_department_confirm_info[0]['to_department_cn']+'">'+v.to_department_confirm_info[0]['to_department_cn']+'</span></td>';
                        //接收类型 receive send
                        var info_type = v.info_type;
                        if(v.info_type == "receive"){
                            //接收的消息
                            if(v.need_confirm == 1){
                                if(v.info_confirmed_status == 2){
                                 //已确认
                                 tr_html += '<td><a href="###" class="zh-confirm selected">已确认</a></td>';
                                 }else if(v.info_confirmed_status == 1){
                                 //待确认
                                 tr_html += '<td><a data-id="'+v.info_object_id+'" href="###" class="zh-confirm">确认</a></td>';
                                 }
                            }else{
                                //已确认
                                tr_html += '<td><span>已接收</span></td>';
                            }

                        }else{
                            //发送的消息
                            //接收的消息
                            if(v.need_confirm == 1){
                                if(v.info_confirmed_status == 2){
                                    //已确认
                                    tr_html += '<td><span>已确认</span></td>';
                                }else if(v.info_confirmed_status == 1){
                                    //待确认
                                    tr_html += '<td><span>待确认</span></td>';
                                }
                            }else{
                                tr_html += '<td><span>已发送</span></td>';
                            }

                        }

                        html += tr_html;

                    });

                    //init
                    $(".feed_back_msg tbody").html(html);
                    $(".zh-transaction-heading h3").html("事务消息("+ count +")");

                    setTimeout(function(){
                        $(".feed_back_msg tbody tr").eq(0).removeClass('zh-bg-light-yellow');
                    },5000);

                    //轮询请求
                    msg_timer = setInterval(requestMsg,40000);
                }
            }
        });


    }

    //获取表头字段
    function get_flight_table_head(field_list,cur_tab){
        var head_html = '<tr>';
        $.each(field_list,function (k,v) {
            head_html += '<th>'+field_config[cur_tab][v]['cn_name']+'</th>';
        });
        head_html += '<th>操作</th></tr>';
        return head_html;
    }
    function get_flight_table_row(field_list,cur_tab,flight){
        var row_html = '<tr class="flight_data_'+flight['fid']+'">';
        $.each(field_list,function (k,v) {
             row_html += '<td>'+flight[field_config[cur_tab][v]['name']]+'</td>';
        });
        row_html += '<td><a data-fid="'+flight['fid']+'" class="zh-edit" href="###">编辑</a><a data-fid="'+flight['fid']+'" class="zh-msg zh-ml-5" href="###">消息</a></td>';
        row_html += '</tr>';

        return row_html;
    }

    //请求航班数据
    function request_flight_data(){
        flight_data_request = $.ajax({
            type: 'GET',
            dataType: "json",
            data: flight_param,
            url: '/flight/flight_data/index',
            cache: false,
            timeout: 60000,
            success: function(data){
                var flight_wrap_obj = $(".am-flight-wrap");
                if(flight_wrap_obj.length > 0){
                    flight_wrap_obj.find('li').eq(0).find('span').text(data.count.depart);
                    flight_wrap_obj.find('li').eq(1).find('span').text(data.count.stop);
                    var tb_content_obj = flight_wrap_obj.children('.am-flight-cont').find('tbody');
                    var field_list = data.field_list;
                    var cur_tab = data.cur_tab;
                    //init
                    if($.isEmptyObject(data.init) == false){
                        var head_html = get_flight_table_head(field_list,cur_tab);
                        var tb_head_obj = flight_wrap_obj.children('.am-flight-cont').find('thead');
                        tb_head_obj.html(head_html);
                        var tbody_html = '';
                        $.each(data.init,function(fid,flight){
                            tbody_html += get_flight_table_row(field_list,cur_tab,flight);
                        });
                        tb_content_obj.html(tbody_html);
                    }
                    //add
                    if($.isEmptyObject(data.add) == false){
                        $.each(data.add,function (fid,flight) {
                            if($(".flight_data_"+fid).length > 0) return false;
                            var tbody_html = get_flight_table_row(field_list,cur_tab,flight);
                            $(".flight_data_"+flight.insert_fid_below).after(tbody_html);
                        });
                    }
                    //update
                    if($.isEmptyObject(data.update) == false){
                        //字段列映射
                        $.each(field_list[cur_tab],function(k,v){
                            field_map[cur_tab][field_config[cur_tab][v]['name']] = k;
                        });
                        $.each(data.update,function(fid,flight){
                            var tr_obj = $(".flight_data_"+fid);
                            $.each(flight,function(field,value){
                                var index = field_map[cur_tab][field];
                                tr_obj.children('td').eq(index).html(value);
                            });
                        });
                    }
                    //del
                    if($.isEmptyObject(data.del) == false){
                        $.each(data.del,function(fid){
                            if($(".flight_data_"+fid).length > 0){
                                $(".flight_data_"+fid).remove();
                            }
                        });
                    }
                }

                fdListTheadFixFn($(".am-flight-table"));

                clearTimeout(flight_data_timer);
                flight_data_timer = setTimeout(function(){
                    flight_param.init = 0;
                    request_flight_data();
                },20000);
            },
            complete:function(xhr,textStatus){
                //回收xhr对象
                xhr = null;
            },
            error: function(){

            }
        });
    }

    /**
     * [export_flight_list 导出航班列表]
     * @return {[type]} [description]
     */
    function export_flight_list(){
        $(".export_list").click(function(){
                if(EXPORT_FLIGHT_PERMISSION == false){
                    show_no_permission();
                    return false;
                }
                layer.msg('正在导出数据中,请稍候...',{time: 2000});

                var start_time = $("#startTime").val();
                var end_time = $("#endTime").val();
                var cur_active = get_cur_active();

                var f_attr = [];
                $("input[name='f_attr[]']").each(function(){
                    if($(this).parent().hasClass('active')){
                             f_attr.push($(this).val());
                    }

                });


                //要客航班
                var f_vip = [];
                $("input[name='f_vip[]']").each(function(){
                    if($(this).parent().hasClass('active')){
                        f_vip.push($(this).val());
                    }

                });

                //航班状态
                var f_status_code = [];
                $("input[name='f_status_code[]']").each(function(){
                    if($(this).parent().hasClass('active')){
                        f_status_code.push($(this).val());
                    }
                });

                var order_field = '';
                var order_type = '';
                var order_obj = $(".flight-list-table").find(".zh-icon-order");
                if(order_obj.length > 0){
                    order_obj.each(function (k) {
                        if($(this).hasClass("zh-order-asc")){
                            order_field = $(this).attr('order_field');
                            order_type = 'ASC';
                            return false;
                        }else if($(this).hasClass("zh-order-desc")){
                            order_field = $(this).attr('order_field');
                            order_type = 'DESC';
                            return false;
                        }
                    });
                }

                if(cur_active == ''){
                    cur_active = 'cmd';
                    var cmd = $("#zhInstuction").find('input').val();
                    cmd = cmd.toUpperCase();
                    window.location.href = EXPORT_FLIGHT_LIST_URL + '?start_time='+start_time+'&end_time='+end_time+'&f_status='+cur_active+'&cmd='+cmd+'&f_attr='+f_attr+'&f_vip='+f_vip+'&f_status_code='+f_status_code+'&order_field='+order_field+'&order_type='+order_type;
                }else{
                    window.location.href = EXPORT_FLIGHT_LIST_URL + '?start_time='+start_time+'&end_time='+end_time+'&f_status='+cur_active+'&f_attr='+f_attr+'&f_vip='+f_vip+'&f_status_code='+f_status_code+'&order_field='+order_field+'&order_type='+order_type;
                }
        });

        //导出vip航班
        $(".export_vip_list").click(function(){
            layer.msg('正在导出数据中,请稍候...',{time: 2000});
            var start_time = $("#startTime").val();
            var end_time = $("#endTime").val();
            window.location.href = EXPORT_FLIGHT_VIP_LIST_URL + '?start_time='+start_time+'&end_time='+end_time;
        });

    }

    function show_fid(){
       $('body').on('click','.show_fid',function(){
           var attr_id = $(this).parent().attr('id');
           var id_info = attr_id.split('_');
           if(id_info.length > 0)
           {
                alert(id_info[2]);
           }


       });
    }

    // 列表配置 - 排序配置
    function orderConfigFn() {
        var timeoutFlag = null;
        // 向上
        $('body').on('click', '.zh-layer-table .zh-order-asc', function() {
            if(!$(this).hasClass('disable')) {
                if(timeoutFlag !== null) clearTimeout(timeoutFlag);
                var statusText = $(this).parent().siblings().eq(1).text();
                var prevStatusText = $(this).parents('tr').prev().children().eq(1).text();
                var dataStatus = $(this).parents('tr').attr('data-flight-status');
                var prevDataStatus = $(this).parents('tr').prev().attr('data-flight-status');

                $(this).parent().siblings().eq(1).text(prevStatusText).parent().addClass('zh-bg-flash-gray').attr('data-flight-status', prevDataStatus);
                $(this).parents('tr').prev().addClass('zh-bg-flash-gray').attr('data-flight-status', dataStatus).children().eq(1).text(statusText);
                timeoutFlag = setTimeout(function() { $('.zh-layer-table tbody tr').removeClass('zh-bg-flash-gray'); }, 1000);
            }
        });
        // 向下
        $('body').on('click', '.zh-layer-table .zh-order-desc', function() {
            if(!$(this).hasClass('disable')) {
                if(timeoutFlag !== null) clearTimeout(timeoutFlag);
                var statusText = $(this).parent().siblings().eq(1).text();
                var nextStatusText = $(this).parents('tr').next().children().eq(1).text();
                var dataStatus = $(this).parents('tr').attr('data-flight-status');
                var nextDataStatus = $(this).parents('tr').next().attr('data-flight-status');

                $(this).parent().siblings().eq(1).text(nextStatusText).parent().addClass('zh-bg-flash-gray').attr('data-flight-status', nextDataStatus);
                $(this).parents('tr').next().addClass('zh-bg-flash-gray').attr('data-flight-status', dataStatus).children().eq(1).text(statusText);
                timeoutFlag = setTimeout(function() { $('.zh-layer-table tbody tr').removeClass('zh-bg-flash-gray'); }, 1000);
            }
        });
    }


    /*
        初始化
    */
    this.init = function() {

        window.all_title_arr = {
            'in_0':'进港',
            'in_1':'前站计划',
            'in_2':'前站起飞',
            'in_3':'到达本场',
            'in_4':'预计停场',
            'out_0':'出港',
            'out_1':'出港计划',
            'out_2':'出港已飞',
            'out_3':'始发航班',
            'food_0':'航食责任',
            'food_1':'航食计划',
            'food_2':'航食已飞',
            'food_3':'航食始发',
            'all_0':'进出港',
            'all_1':'前站计划',
            'all_2':'前站起飞',
            'all_3':'到达本场',
            'all_4':'出港计划',
            'all_5':'出港已飞',
        };
        window.flight_status_code_cn = ['返航','正在返航','备降','正在备降'];
        if(in_out_all_flag == 0){
            window.li_type_arr = ['in_0','out_0','abnormal','attention','food_0','meet'];
        }else{
            window.li_type_arr = ['all_0','abnormal','attention','food_0','meet'];
        }

        //消息存储对象
        msg_object = {};

        window.time_interval = 500;

        ajax_lock = false;

        //全局request对象
        ajax_request = null;
        ajax_timer = null;
        msg_request = null;
        msg_timer = null;
        window.flight_data_request = null;
        window.flight_param = {};
        window.flight_data_timer = null;
        //全局字段映射
        field_map = {
            'in' : {
            },
            'out':{
            },
            'abnormal':{
            },
             'attention':{
            },
            'cmd':{

            },
            'food':{

            },
            'all':{
                'in':{},
                'out':{},
            },
            'depart':{},
            'stop':{}
        };


        dateSelectFn(); // 日期选择
        var default_f_status = 'in_0';
        if(in_out_all_flag == 1){
            default_f_status = 'all_0';
        }
        var requestParamObj = {
            init:1,
            is_first:1,
            pid:new Date().getTime(),
            f_status:default_f_status,
            page_hash:PAGE_HASH,
       };
        // 列表配置 - 排序配置
        orderConfigFn();

        // tab切换
        $('.zh-fd-header .zh-opt-count li:first').addClass('active');
        //var flag = 0;
        $('body').on('click','.zh-fd-header .zh-opt-count li',function(e) {
            e.stopPropagation();

            //显示loading层
            //清空指令内容
            $("#zhInstuction").find('input').val('');
            $(".zh-loading-box").removeClass('hide');
            $('.zh-fd-list').animate({scrollTop: 1}, 0);
            ajax_lock = false;
            //暂停之前的AJAX请求

            if(ajax_timer != null){
                clearTimeout(ajax_timer);
            }
            if(ajax_request != null){
                ajax_request.abort();
            }

            requestParamObj.page = 1;
            //requestParamObj.page_direction = 0;
            $(this).addClass('active').siblings().removeClass('active on');
            var type = $(this).children('a').attr('type');
            requestParamObj.init=1;
            requestParamObj.is_first=1;
            requestParamObj.f_attr = null;
            requestParamObj.f_vip = null;
            requestParamObj.f_status_code = null;
            requestParamObj.f_status = type;
            delCookie(type+'_attr_cookie');
            if(requestParamObj.order_field !== undefined){
                delete requestParamObj.order_field;
            }
            if(requestParamObj.order_type !== undefined){
                delete requestParamObj.order_type;
            }
            requestList(requestParamObj);
        });

            // tab切换

        // tab下拉
        $('body').on('click','.zh-fd-header .zh-opt>li .zh-arrow',function(e) {
            e.stopPropagation();
            $('.zh-fd-header .zh-opt>li').removeClass('on');
            var _parent = $(this).parent();
            if(_parent.hasClass('on')) {
                _parent.removeClass('on');
            } else {
                _parent.addClass('on');
            }
            return false;
        });

        // 点击其他区域关闭下拉
        $('body').click(function() {
            $('.zh-fd-header .zh-opt>li').removeClass('on');
        });

        //航班信息tab切换
        $('.am-flight-tab li').on('click',function(){
            var i = $(this).index();
            $(this).addClass('active').siblings('li').removeClass('active');
            if(i == 0){
                flight_param.init = 1;
                flight_param.type = 'depart';
                if(flight_data_timer != null) clearTimeout(flight_data_timer);
                request_flight_data();
            }else{
                flight_param.init = 1;
                flight_param.type = 'stop';
                if(flight_data_timer != null) clearTimeout(flight_data_timer);
                request_flight_data();
            }
        });

        // tab下拉项点击
        $('body').on('click','.zh-fd-header .zh-opt li .zh-dropdown .zh-item',function(e) {
            e.stopPropagation();
            $(this).addClass('active').siblings().removeClass('active').parents('li').addClass('active').removeClass('on').siblings().removeClass('active on');
            var _cur_text = $(this).clone().remove('span').text();
            if(_cur_text == '全部进港'){
                _cur_text = '进港';
            }else if(_cur_text == '全部出港'){
                _cur_text = '出港';
            }else if(_cur_text == '全部'){
                _cur_text = '进出港';
            }else if(_cur_text == '全部航食'){
                _cur_text = '航食责任';
            }
            var _cur_type = $(this).attr('type');
            $(this).parent().siblings('a').attr('type', _cur_type).html(_cur_text+'：'+'<span></span>');


            //请求数据
            requestParamObj.init=1;

            requestParamObj.f_status = $(this).attr('type');
            if(requestParamObj.order_field !== undefined){
                delete requestParamObj.order_field;
            }
            if(requestParamObj.order_type !== undefined){
                delete requestParamObj.order_type;
            }
            requestList(requestParamObj);
        });

        //按日期查询
        $(".zh-date-range button").click(function(){
            var start_time = $("#startTime").val();
            var end_time = $("#endTime").val();
            var f_status = get_cur_active();
            if(f_status == ''){
                f_status = 'cmd';
                var cmd = $("#zhInstuction").find('input').val();
                requestParamObj.cmd = cmd;
            }
            delCookie(f_status+'_attr_cookie');
            //请求数据
            requestParamObj.init=1;
            requestParamObj.f_status = f_status;
            requestParamObj.start_time = start_time;
            requestParamObj.end_time = end_time;
            requestList(requestParamObj);
        });

        // 动态输入
        $('.zh-fd-list').on('dblclick', '.zh-input-dynamic', function() {
            if(EDIT_PERMISSION == 0){
                return false;
            }
            $(this).addClass('active').removeAttr('readonly');
            var _cur_val = $(this).val();
            if(_cur_val == '--' || _cur_val == ''){
                var date = new Date();
                var day_format = date.Format("dd");
                var day_format_str = '(' + day_format + ')';
                $(this).val(day_format_str);
            }
        }).on('blur', '.zh-input-dynamic', function() {
            $(this).removeClass('active').attr('readonly', 'readonly');
            // 如果有提示层，则修改提示信息
            if($(this).parents('td').hasClass('zh-tip-share')) {
                $(this).parents('td').data('share', $.trim($(this).val()));
            }
            var _this = $(this);
            var update_val = $.trim($(this).val());
            var field_val = $(this).data('field-val');
            var field_name = $(this).data('field');
            //清空不操作
            if(field_name != 'cobt' && field_name != 'ctot'){
                if(update_val == ''){
                    $(this).val(field_val);
                    return false;
                }
            }
            if(update_val == field_val){
                return false;
            }
            if(field_name !== 'aoc_info')
            {
                if(field_name !== 'cobt' && field_name !== 'ctot'){
                    var reg = /^\d{4}\(\d{2}\)$/;
                    if(!reg.test(update_val)){
                        layer.msg("请输入正确的时间格式",{time: 1000});
                        $(this).val(field_val);
                        return false;
                    }
                    var val_0 = update_val.substr(0,2);
                    var val_1 = update_val.substr(2,2);
                    if(parseInt(val_0) >23 || parseInt(val_1) > 59)
                    {
                        layer.msg("请输入正确的时间格式",{time: 1000});
                        $(this).val(field_val);
                        return false;
                    }
                }else{
                    if(update_val !== ''){
                        var reg = /^\d{4}\(\d{2}\)$/;
                        if(!reg.test(update_val)){
                            layer.msg("请输入正确的时间格式",{time: 1000});
                            $(this).val(field_val);
                            return false;
                        }
                        var val_0 = update_val.substr(0,2);
                        var val_1 = update_val.substr(2,2);
                        if(parseInt(val_0) >23 || parseInt(val_1) > 59)
                        {
                            layer.msg("请输入正确的时间格式",{time: 1000});
                            $(this).val(field_val);
                            return false;
                        }
                    }
                }
            }

            var fid = $(this).parents('tr').find('td:eq(0)').find('input').val();

            var request_param = {
                update_val:update_val,
                fid:fid,
                field_name:field_name,
            };
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: request_param,
                url: "/flight/flight_list/up_field_val",
                success:function(data){
                    if(data.code != 0) {
                        //恢复原值
                        _this.val(field_val);
                        layer.confirm('<strong style="display:block;text-align:center;">' + data.msg + '</strong>', {
                            title: '<strong>提示</strong>',
                            btn: ['确定', '取消']
                        });
                    }
                }
            });
        });

        // 复选框
        $.checkboxFn({ele: '.zh-fd-checkbox',evtType:'mousedown'}, function() {
            // 判断有没有全选
            if($(this).siblings('.zh-checkbox-all').size() > 0) {
                var own = $(this).hasClass('active') ? 1 : 0;
                var checkboxLength = $(this).siblings('.zh-fd-checkbox').size();
                var checkedLength = $(this).siblings('.zh-fd-checkbox.active:not(.zh-checkbox-all)').size() + own;
                if(checkedLength == checkboxLength) {
                    $(this).siblings('.zh-checkbox-all').addClass('active').children('input').attr('checked', 'checked');
                } else {
                    $(this).siblings('.zh-checkbox-all').removeClass('active').children('input').removeAttr('checked');
                }
            }
            // 判断是不是拖动列表
            if($(this).closest('.zh-draggable-list').size() > 0) {
                setTimeout(function() {
                    // 添加可拖动
                    if(!$(this).hasClass('zh-checkbox-all')) {
                        if($(this).hasClass('active')) {
                            $(this).parent().addClass('draggable');
                        } else {
                            $(this).parent().removeClass('draggable');
                        }
                    }

                    // 判断有没有全选
                    if($(this).parent().siblings().children('.zh-checkbox-all').size() > 0) {
                        var own = $(this).hasClass('active') ? 1 : 0;
                        var checkboxLength = $(this).parent().siblings().children('.zh-fd-checkbox').size();
                        var checkedLength = $(this).parent().siblings().children('.zh-fd-checkbox.active:not(.zh-checkbox-all)').size() + own;
                        if(checkedLength == checkboxLength) {
                            $(this).parent().siblings().children('.zh-checkbox-all').addClass('active').children('input').attr('checked', 'checked');
                        } else {
                            $(this).parent().siblings().children('.zh-checkbox-all').removeClass('active').children('input').removeAttr('checked');
                        }
                    }

                }.bind(this), 100);

            }
        });
        // 全选
        $('body').on('click', '.zh-checkbox-all', function() {
            if($(this).parents('.zh-draggable-list').size() == 0) { // 如果不是排序字段
                if($(this).hasClass('active')) {
                    $(this).siblings('.zh-fd-checkbox').addClass('active').children('input').attr('checked', 'checked');
                } else {
                    $(this).siblings('.zh-fd-checkbox').removeClass('active').children('input').removeAttr('checked');
                }
            } else { // 排序字段
                if($(this).hasClass('active')) {
                    $(this).parent().siblings().children('.zh-fd-checkbox').addClass('active').children('input').attr('checked', 'checked');
                } else {
                    $(this).parent().siblings().children('.zh-fd-checkbox').removeClass('active').children('input').removeAttr('checked');
                }
            }
        });
        // 单选
        $.radioFn({ele: '.zh-fd-radio'}, function() {
            // 自定义时段
            if($(this).next('.zh-custom-time').size()>0 && $(this).hasClass('active')) {
                $(this).next('.zh-custom-time').children('input').removeAttr('readonly');
            } else {
                $(this).siblings('.zh-custom-time').children('input').attr('readonly', 'readonly');
            }
            //进出港选择
            if($(this).hasClass('am-radio-traffic')){
                var i = $(this).index();
                $('.am-panel-traffic').eq(i).removeClass('hide').siblings('.am-panel-traffic').addClass('hide');
                if($.trim($(this).text()) == '进出港'){
                    $('.am-panel-traffic').removeClass('hide');
                }
            }
        });

        //其他tab切换
        $('body').on('click','.am-export-tab li',function(){
            var i = $('.am-export-tab li').index($(this));
            $(this).addClass('active').siblings().removeClass('active');
            $('.am-export-tab-cont').eq(i).removeClass('hide').siblings('.am-export-tab-cont').addClass('hide');
        });


        layoutFn();  // 弹出层

        confirmFn(); // 确认/已确认

        // 下拉列表
        $.customSelectFn('.zh-fd-select:not(.am-delay-cause)', 'input:not(:hidden)', 'ul', 'li', function() {
            $(this).parents('ul').siblings(':hidden').val($(this).data('sort'));  //把真实值赋值给隐藏域
            if($(this).parents('.zh-fd-select').hasClass('zh-fd-reason')){

                if($(this).parents('ul').data("permission") == 0){
                    show_no_permission();
                    var default_data = $(this).parents('ul').data('value');
                    if(default_data == '无' || default_data == '自定义'){
                        var default_text = default_data;
                        default_data = '';
                        $(".zh-fd-reason>.zh-input").val(default_text);
                    }else{
                        $(".zh-fd-reason>.zh-input").val(default_data);
                    }
                    $("input[name='CAACCode']").val(default_data);

                    return false;
                }
                if($.trim($(this).text()) !== '无') {
                    $('#delayReason').removeClass('hide');
                } else {
                    $('#delayReason').addClass('hide');
                }
            }else if($(this).parents('.zh-fd-select').hasClass('zh-fd-reason2')){
                if($(this).parents('ul').data("permission") == 0){
                    show_no_permission();
                    var default_data = $(this).parents('ul').data('value');
                    if(default_data == '无' || default_data == '自定义'){
                        var default_text = default_data;
                        default_data = '';
                        $(".zh-fd-reason2>.zh-input").val(default_text);
                    }else{
                        $(".zh-fd-reason2>.zh-input").val(default_data);
                    }
                    $("input[name='CAACCode2']").val(default_data);
                    return false;
                }
                if($.trim($(this).text()) !== '无') {
                    $('#delayReason2').removeClass('hide');
                } else {
                    $('#delayReason2').addClass('hide');
                }
            }

            //自定义导出start
            //自定义
            if($(this).attr('data-custom')){
                var data = $(this).data('custom');
                $(this).parents('.zh-fd-select').next('.am-custom-field[data-field="'+data+'"]').removeClass('hide');
            }else{
                $(this).parents('.zh-fd-select').next('.am-custom-field').addClass('hide');
            }
            //日期类型
            if($(this).parents('.zh-fd-select').is('.am-date-select')){
                var oDate = new Date();
                var year = oDate.getFullYear();
                var month = oDate.getMonth() + 1;
                var date = oDate.getDate();
                month = month < 10 ? '0'+month : month;
                date = date < 10 ? '0'+date : date;
                switch($.trim($(this).text())){
                    case '按日':
                        $('#startDate,#endDate').val(year+'-'+month+'-'+date);
                        dateTypeFn('#startDate,#endDate','yyyy-mm-dd', 2);
                        break;
                    case '按月':
                        $('#startDate,#endDate').val(year+'-'+month);
                        dateTypeFn('#startDate,#endDate','yyyy-mm', 3);
                        break;
                }
            }
            //自定义导出end

        });

        //弹层日期
        function dateTypeFn(element,dateFormat, minView) {
            $(element).datetimepicker('remove');
            $(element).datetimepicker({
                format: dateFormat,
                language: 'zh-CN',
                weekStart: 1,
                autoclose: true,
                todayHighlight: 1,
                startView: minView,
                minView: minView,
                forceParse: 0
            });
        }

        //关注航班
        add_flight_attention();

        //筛选属性
        filter_flight_attr();

        order_request(requestParamObj);

        //初始化发送请求 初始化不处理
        requestList(requestParamObj);

       instructionFn();  // 指令
       export_flight_list(); //导出列表

       //即将进港数据请求
       setTimeout(request_in_flight_list,20000);
        setTimeout(request_out_flight_list,20000);

       //事务消息数据请求
        if(in_out_all_flag == 0){
            requestMsgInit();
        }else{
            //始发航班 预计停场航班 数据请求
            flight_param = {
                'init':1,
                'page_hash':PAGE_HASH,
                'type':'depart'
            };
            request_flight_data();
        }
       show_fid();
    }
}
$(function() {
    var flightDynamicObj = new flightDynamicClass();
    flightDynamicObj.init();
});
