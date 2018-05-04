/*
	指令
*/
function ztIntructionFn() {
	alert('状态指令');
}
function hsIntructionFn() {
	alert('航司指令');
}
function jcIntructionFn() {
	alert('机场指令');
}
function sxIntructionFn() {
	alert('属性指令');
}
function vipIntructionFn() {
	alert('VIP指令');
}
function jwIntructionFn() {
	alert('机位指令');
}
function qyIntructionFn() {
	alert('区域指令');
}
function djkIntructionFn() {
	alert('登机口指令');
}
function xlIntructionFn() {
	alert('行李指令');
}
function skwcIntructionFn() {
	alert('上客完成指令');
}
function hbhIntructionFn() {
	alert('航班号指令');
}
function matchInstructionFn(str) {
	if(/^ZT:/i.test(str)) { 	   // 状态指令
		ztIntructionFn();
	} else if(/^HS:/i.test(str)) { // 航司指令
		hsIntructionFn();
	} else if(/^JC:/i.test(str)) { // 机场指令
		jcIntructionFn();
	} else if(/^SX:/i.test(str)) { // 属性指令
		sxIntructionFn();
	} else if(/^(VIP)$/i.test(str)) { // VIP指令
		vipIntructionFn();
	} else if(/^JW:/i.test(str)) { // 机位指令
		jwIntructionFn();
	} else if(/^QY:/i.test(str)) { // 区域指令
		qyIntructionFn();
	} else if(/^DJK:/i.test(str)) { // 登机口指令
		djkIntructionFn();
	} else if(/^XL:/i.test(str)) { // 行李指令
		xlIntructionFn();
	} else if(/^(SKWC)$/i.test(str)) { // 上客完成指令
		skwcIntructionFn();
	} else {							// 航班号指令
		hbhIntructionFn();
	}
}

/*
进入页面，判断有没有历史指令
点击搜索或enter搜索保存指令(此指令不在历史指令里)
删除历史指令
*/

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
	alert('查询：'+$(this).text());
});

// 清空指令
$('.zh-instruction-history>.zh-title .zh-clear').click(function(e) {
	e.stopPropagation();
	$('.zh-instruction-history>ul').html('');
	historyInstructionsArr = [];
	localStorage.removeItem('historyInstructions');
});

// 显示历史指令
$('#zhInstuction input').focus(function(e) {
	e.stopPropagation();
	$('.zh-instruction-history').addClass('active');
}).click(function(e) {
	e.stopPropagation();
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
// 隐藏历史指令
$('body').click(function() {
	$('.zh-instruction-history').removeClass('active');
});

function instructionFn() {
	$(document).keydown(function(e) {
		switch(e.keyCode) {
			// enter键
			case 13:
				e.preventDefault();
				if(document.activeElement == $('.zh-fd-footer .zh-search .zh-fd-input')[0]) {
					if($('#zhInstuction input').is(':focus')) {
						var instruction = $.trim($('#zhInstuction input').val());
						if(instruction !== '') {
							// matchInstructionFn(instructionStr);

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
				}
				break;

			// esc键
			case 27: 
				$('#zhInstuction input').blur();
				$('.zh-instruction-history').removeClass('active');
				break;

			// delete键
			case 46:
				$('#zhInstuction input').val('');
				break;

		}
	});
}
$(function() {
	instructionFn(); // 指令
});