$.extend({
	/*
		select下拉
		@param selectwrap string (selectwrap是select元素的父级标签，如div)
		@tip 最取传id的下元素参数
	*/
	
    /*
        表头固定方法
        @param tabelWrap string 需要固定table的父元素
        @param timeout number 延迟响应
    */
    theadFixedFn: function(tabelWrap, timeout){
        if($(tabelWrap).size() > 0) {
            $(tabelWrap).each(function(){
                var _this = $(this);
                var scrollTop, timeoutFlag;
                // 滚动监听
                if(_this.hasClass('zh-thead-fixed-top')){
                    var obj = $(document);
                }else{
                    var obj = _this;
                }
                if(timeout !== undefined) {
                	obj.on('scroll', function() {
                	    _this.find('thead tr th').css({
                	        '-webkit-transform': '',
                	        '-ms-transform': '',
                	        'transform': ''
                	    });
                	    if(timeoutFlag) clearTimeout(timeoutFlag);
                	    timeoutFlag = setTimeout(function() {
                	        scrollTop = this.scrollTop;
                	        _this.find('thead tr th').css({
                	            '-webkit-transform': 'translateY('+scrollTop+'px)',
                	            '-ms-transform': 'translateY('+scrollTop+'px)',
                	            'transform': 'translateY('+scrollTop+'px)'
                	        });
                	    }.bind(this), timeout);
                	});
                } else {
                	obj.on('scroll', function() {
                		scrollTop = this.scrollTop;
            	        _this.find('thead tr th').css({
            	            '-webkit-transform': 'translateY('+scrollTop+'px)',
            	            '-ms-transform': 'translateY('+scrollTop+'px)',
            	            'transform': 'translateY('+scrollTop+'px)'
            	        });
                	});
                }
            });
        }
    }
});

/* 公共类 */
var commonObj = (function() {
	/* 导航适配 */
	function navAdapterFn() {
		$('.zh-navbar .zh-nav-ul>li').show();
		$('.zh-navbar .zh-nav .zh-arrow-switch').remove();
		// 设置nav margin-left
		var logoWth = $('.zh-navbar .zh-logo').outerWidth();
		$('.zh-navbar .zh-nav').css('margin-left', logoWth);

		var	navWth = $('.zh-navbar .zh-nav-ul').width();
		// 获取item数量及求和
		var navItemWthArr = [];
		$('.zh-navbar .zh-nav-ul>li').each(function() {
			navItemWthArr.push($(this).width());
		});
		var arrLength = navItemWthArr.length, navUlWth = 0;
		for(var i=0; i<arrLength; i++) {
			navUlWth += navItemWthArr[i];
		}
		// 判断是否超出
		var arrowSwitchHtml = '<div class="zh-arrow-switch"><span class="zh-arrow-left" style="visibility: hidden;"></span><span class="zh-arrow-right"></span></div>';
		if(navUlWth > navWth) {
			var diffWth = navUlWth - navWth;
			var iterationSum = 0;
			for(var j=arrLength-1;j>=0;j--) {
				if(iterationSum < diffWth) {
					iterationSum = iterationSum + navItemWthArr[j];
					$('.zh-navbar .zh-nav-ul>li').eq(j).addClass('mark').hide();
				}
			}
			$('.zh-navbar .zh-nav').append(arrowSwitchHtml);
		} else {
			$('.zh-navbar .zh-nav .zh-arrow-switch').remove();
		}
		// 右侧第一个标记项索引
		var firstHideItemIndex = $('.zh-navbar .zh-nav-ul>li.mark:first').index();
		var markItemLength = $('.zh-navbar .zh-nav-ul>li.mark').length;
		var index = 0;
		// 左
		$('body').off('click', '.zh-navbar .zh-arrow-switch .zh-arrow-left');
		$('body').on('click', '.zh-navbar .zh-arrow-switch .zh-arrow-left', function() {
			index--;
			if(index < 0) {
				index = 0;
			}
			$(this).siblings('.zh-arrow-right').css('visibility', 'visible');
			$('.zh-navbar .zh-nav-ul>li.mark').eq(index).hide();
			$('.zh-navbar .zh-nav-ul>li').eq(index).show();
			if(index == 0) {
				$(this).css('visibility', 'hidden');
			}
		});
		// 右
		$('body').off('click', '.zh-navbar .zh-arrow-switch .zh-arrow-right');
		$('body').on('click', '.zh-navbar .zh-arrow-switch .zh-arrow-right', function() {
			index++;
			if(index > markItemLength) {
				index = markItemLength;
			}
			$(this).siblings('.zh-arrow-left').css('visibility', 'visible');
			$('.zh-navbar .zh-nav-ul>li.mark').eq(index-1).show();
			$('.zh-navbar .zh-nav-ul>li').eq(index-1).hide();
			if(index == markItemLength) {
				$(this).css('visibility', 'hidden');
			}
		});
	}

	/* 机场切换 */
	function airportSwitchFn() {
		$('.zh-navbar .zh-logo .dropdown-menu li').click(function() {
			$(this).parents('.zh-logo').children('.logo').text($(this).text());
			var airport=$(this).attr("data");
			$.get('/system_setting/Setting/change_default_airport',{airport:airport},function(){
				window.location.href="/flight/flight_list/index";
			});
		});
	}

	/* 左侧菜单高度 */
	function minHgtAdapterFn() {
		var winHgt = $(window).height(),
			winWth = $(window).width(),
			docHgt = $(document).outerHeight(),
			navHgt = $('.zh-navbar').outerHeight();
		var minWinHgt = winHgt - navHgt;
		var minDocHgt = docHgt - navHgt;
		var minHgt = Math.max(minWinHgt, minDocHgt);
		if($('.data_box').size() > 0) {
			$('.data_box').css('min-height', minHgt);
			$('.data_box .data_left').height(minHgt);
			if($('.data_right .data_footer').size() > 0) {
				$('.data_right').css('min-height', minHgt-$('.data_right .data_footer').outerHeight(true));
			}
		} else {
			if($('.data_footer').size() > 0) {
				if(docHgt-winHgt <= 0) {
					var originWth = $('.data_footer').width();
					var left = (winWth-originWth)/2;
					$('.data_footer').css({
						'position': 'fixed',
						'left': left,
						'bottom': 0,
						'width': originWth
					});
				}
			}
		}
	}

	/* 左侧菜单下拉 */
	function leftMenuFn() {
		if($('.datal_list').size() > 0) {
			$(".datal_list h5").click(function(){
				$(this).parent().parent("dl").addClass("on").siblings().removeClass("on");
				minHgtAdapterFn();
			});
			$(".datal_list li").click(function(){
				$(".datal_list li").removeClass("cur");
				$(this).addClass("cur");
			});
		}
	}

	/* 表头固定 */
	function theadFixedFn() {
		if($('.zh-thead-fixed').size() > 0) {
			$('.zh-thead-fixed').each(function() {
				var _this = $(this);
				// thead高度
				var theadHgt = _this.find('thead').height();
				// th宽度
				var thWthArr = [];
				_this.find('thead th').each(function() {
					thWthArr.push($(this).width());
				});
				var tableWidth = _this.children('table');
				_this.children('table').css({
					'width' : tableWidth,
					'table-layout' : 'fixed'
				});
				// 克隆组装
				var tableClone = _this.children('table').clone();
				tableClone.children('tbody').remove();
				for(var i=0; i<thWthArr.length; i++) {
					tableClone.find('thead th').eq(i).width(thWthArr[i]);
					_this.find('thead th').eq(i).width(thWthArr[i]);
				}
				var theadFake = $('<div class="theadFake">').html(tableClone);
				// 滚动监听
				if(_this.hasClass('zh-thead-fixed-top')) {
					var _thisOffsetTop = _this.offset().top;
					var _thisOffsetLeft = _this.offset().left;
					$(window).scroll(function() {
						var _scrollLeft = $(this).scrollLeft();

						if($(this).scrollTop() > (_thisOffsetTop + theadHgt/2)) {
							_this.prepend(theadFake);
							_this.children('.theadFake').css({
								'position': 'fixed',
								'top': 0,
								'left': _thisOffsetLeft - _scrollLeft,
								'z-index': 100019,
								'width': _this.children('table').outerWidth(),
								'height': _this.children('table').children('thead').outerHeight(),
								'overflow' : 'hidden'
							});
						} else {
							_this.children('.theadFake').remove();
						}
					});
				} else {
					_this.scroll(function() {
						var _scrollTop = $(this).scrollTop();
						if(_scrollTop > theadHgt/2) {
							_this.prepend(theadFake);
							var theadWthMatch;
							if(_this.outerWidth() >= _this.children('table').outerWidth()) {
								theadWthMatch = '100%';
							} else {
								theadWthMatch = _this.children('table').outerWidth();
							}
							theadFake.css({
								'position': 'absolute',
								'left': 0,
								'top': _scrollTop,
								'z-index': 99,
								'width': theadWthMatch
							});
						} else {
							_this.children('.theadFake').remove();
						}
					});
				}
			});
		}
	}

	/* 初始化 */
	function initFn() {
		navAdapterFn(); 	// 导航适配
		airportSwitchFn();  // 机场切换
		minHgtAdapterFn();  // 左侧菜单高度
		leftMenuFn(); 		// 左侧菜单下拉
		theadFixedFn(); 	// 表头固定

		/* 窗口大小改变 */
		$(window).resize(function() {
			// 设置高度
			minHgtAdapterFn();

			// 导航适配
			navAdapterFn(); 

			// 表头固定
			if($('.zh-thead-fixed .theadFake').size() > 0) {
				$('.zh-thead-fixed .theadFake').each(function() {
					var wthMatch;
					if($(this).parent().outerWidth() >= $(this).siblings('table').outerWidth()) {
						wthMatch = '100%';
					} else {
						wthMatch = $(this).siblings('table').outerWidth();
					}
					$(this).css('width', wthMatch);
					$(this).height($(this).siblings('table').children('thead').height());
				});
			}
		});
	}
	return {
		init: initFn,
		minHgtAdapterFn: minHgtAdapterFn
	}
})();

$(function() {
	commonObj.init();
});

// 无权限提示
function show_no_permission() {
	layer.open({
        type : 1,
        title : false,
        area : ['500px','100px'],
        content : '<div class="zh-auth-tip"><img src="/static/images/xh_gantt_warningBig_ico.png" alt="" />非常抱歉! 您没有权限进行该操作</div>'
    });
}

// 分页输入页数点击跳转公共方法
function page_redirect_exec(btn)
{
	var _page = parseInt($(btn).siblings("input[name='page']").val());
	if (isNaN(_page) || _page < 1) { 
		return false;
	} 
	var _action = $(btn).parent("form").attr('action');
	_action += '&page=' + _page;
	window.location.href=_action;
}

//新消息提醒
$(document).on('click','.am-new-msg-box .msg-icon',function(e){
	e.stopPropagation();
	$('.am-new-msg-info').removeClass('active');
	if($(this).parent().find('.am-new-msg-list').hasClass('active')){
		$(this).parent().find('.am-new-msg-list').removeClass('active');
	}else{
		$(this).parent().find('.am-new-msg-list').addClass('active');
	}
});
$(document).on('click',function(){
	$('.am-new-msg-cont').removeClass('active');
});
function newMsgFn(){
	setTimeout(function(){
		$('.am-new-msg-info').addClass('active');
		setTimeout(function(){
			$('.am-new-msg-info').removeClass('active');
		},3000);
	},100);
}
newMsgFn();
//大面积延误新消息提醒
$('body').on('click','.am-mass-tips .close-icon',function(e){
	e.stopPropagation();
	$(this).parents('.am-mass-tips').remove();
});
