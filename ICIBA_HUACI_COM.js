var ICIBA_HUAYI_COOKIE = "ICIBA_HUAYI_COOKIE";
var ICIBA_HUAYI_COOKIE = "ICIBA_HUAYI_COOKIE";
var ICIBA_HUAYI_ALLOW = 1;
var ICIBA_WORD = "";
var ICIBA_HUAYI_FLAG = 0;							//是否是本页面第一次划
var ICIBA_HUAYI_GB = 0;								//是否设置固定
var iciba_huaci_url="http://open.iciba.com/huaci_new/";
var POPUP_HTML=`
<div id="icIBahyI-main_box"><div class="icIBahyI-main_title" id="icIBahyI-main_title">    	<a href="javascript:;" id="icIBahyI-gb" class="icIBahyI-gb" title="关闭"></a>		<i class="icIBahyI-logo"></i>    </div>    <div class="icIBahyI-search" id="ICIBA_HUAYI_input">    </div>    <div class="icIBahyI-loading" id="loading"></div>    <div class="icIBahyI-main_cont" id="icIBahyI-main_cont">    </div>    <div class="icIBahyI-CB" id="icIBahyI-scbiframe" style="display:none;"></div><div id="ICIBA_TOO_LONG" style="height: 150px; display: none;" class="icIBahyI-footer">您划取的内容太长，建议您去爱词霸<a href="http://fy.iciba.com">翻译</a>页面。</div><div class="icIBahyI-options">	<div class="icIBahyI-scbbtn" id="icIBahyI-scbbtn" style="display:none;" onclick="scb_scroll();"><i class="scb-icon"></i></div>	<div class="icIBahyI-morebtn" id="icIBahyI-morebtn"><i class="more-icon"></i><a id="more_info" href="#" target="_blank"></a></div></div></div>
`
var ALLOW_HTTP=`
 <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
`;
function htmlToElement(html){
	var template=document.createElement("template");
	html=html.trim();
	template.innerHTML=html;
	return template.content.firstChild;
}
function addCookie(objName,objValue,objHours){//添加cookie
	var str = objName + "=" + escape(objValue);
	if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
	//	alert("添加cookie成功");
}
function getCookie(objName){//获取指定名称的cookie的值
	var arrStr = document.cookie.split("; ");
	for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName) return unescape(temp[1]);
	}
}
function delCookie(name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=a; expires=" + date.toGMTString();
}




String.prototype.Trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

function ICIBA_HUAYI_CPos(x,y){
	this.x = x;
	this.y = y;
}

/**
* 获得对象的相对浏览器的坐标
*/
function ICIBA_HUAYI_GetObjPos(ATarget)
{
	var target = ATarget;
	var pos = new ICIBA_HUAYI_CPos(target.offsetLeft,target.offsetTop);

	var target = target.offsetParent;

	while(target)

	{
		pos.x += target.offsetLeft;
		pos.y += target.offsetTop;
		target = target.offsetParent
	}
	return pos;
}

function ICIBA_HUAYI_funGetSelectTxt() {
	var txt = "";
	if(document.selection) {
		txt = document.selection.createRange().text;
	} else {
		txt = document.getSelection();
	}
	ICIBA_WORD = txt.toString().Trim();
	return txt.toString().Trim();
};
//symphony:add
var doc=htmlToElement(POPUP_HTML);
document.body.appendChild(doc);
var allow_http_meta=htmlToElement(ALLOW_HTTP);
document.head.appendChild(allow_http_meta);
var eleContainer = eleContainer || document;
var ICIBA_HUACI_HUA = 0;   //状态位  0:划词框消失 1：当鼠标按下时置1 2：如果此位为1的时候松开鼠标此位置2
var ICIBA_HUACI_MOVE = 0;   //状态位
var ICIBA_HUACI_pX  = 0;
var ICIBA_HUACI_pY = 0;
eleContainer.onmousedown = function(ev){
	//	alert(1);
	ev= ev || window.event;
	var obj =  document.getElementById("icIBahyI-main_box");
	var obj_title =  document.getElementById("icIBahyI-main_title");
	var mousePos = ICIBA_HUAYI_mouseCoords(ev);

	var obj_left_x = ICIBA_HUAYI_GetObjPos(obj)["x"];
	var obj_left_y = ICIBA_HUAYI_GetObjPos(obj)["y"];
	var obj_right_x = obj_left_x + obj.scrollWidth;
	var obj_right_y = obj_left_y + obj.scrollHeight;
	var obj_title_right_x = obj_left_x + obj_title.scrollWidth;
	var obj_title_right_y = obj_left_y + obj_title.scrollHeight;

	if(obj.style.display == "none" || !(mousePos.x > obj_left_x && mousePos.x<obj_right_x && mousePos.y>obj_left_y && mousePos.y<obj_right_y )){
		ICIBA_HUACI_HUA = 1;
		if(!ICIBA_HUAYI_GB){
			obj.style.display="none";
		}
	}
	if(obj.style.display == "block" && (mousePos.x > obj_left_x && mousePos.x<obj_title_right_x && mousePos.y>obj_left_y && mousePos.y<obj_title_right_y)){
		ICIBA_HUACI_MOVE = 1;
		ICIBA_HUACI_MDown(ev);
		//		alert(ICIBA_HUACI_MOVE);

	}

}
eleContainer.onmousemove = function(ev){
	ev= ev || window.event;
	if(ICIBA_HUACI_MOVE > 0){
		//		ICIBA_HUACI_MOVE = 2;
		ICIBA_HUACI_MMove(ev);
	}else{
		if(ICIBA_HUACI_HUA == 1){
			ICIBA_HUACI_HUA = 2;
		}
	}
}
eleContainer.onmouseup = function(ev){
	//	alert(ICIBA_HUACI_MOVE);
	var obj =  document.getElementById("icIBahyI-main_box");
	ev= ev || window.event;
	var mousePos = ICIBA_HUAYI_mouseCoords(ev);
	var obj_left_x = ICIBA_HUAYI_GetObjPos(obj)["x"];
	var obj_left_y = ICIBA_HUAYI_GetObjPos(obj)["y"];
	var obj_right_x = obj_left_x + obj.scrollWidth;
	var obj_right_y = obj_left_y + obj.scrollHeight;
	var left = mousePos.x+5;
	var top = mousePos.y-30;
	var isWord=function(str){
		return /^\w+$/.test(str)	
	}
	if(ICIBA_HUAYI_ALLOW && ICIBA_HUACI_HUA == 2){
		var dict=document.getElementById('icIBahyI-main_cont');
		var loading=document.getElementById('loading');
		var ICIBA_TOO_LONG=document.getElementById('ICIBA_TOO_LONG');
		if(obj.style.display == "none" || !(mousePos.x > obj_left_x && mousePos.x<obj_right_x && mousePos.y>obj_left_y && mousePos.y<obj_right_y)){
			var txt=ICIBA_HUAYI_funGetSelectTxt();
			if (txt && txt.length<1000 && isWord(txt)) {
				document.getElementById("ICIBA_HUAYI_input").innerHTML=txt;
				var i_s=iciba_huaci_url+'dict.php?word='+encodeURIComponent(txt);
				loading.style.display = "block";
				dict.style.display = "none";
				if(!ICIBA_HUAYI_GB){
					obj.style.left = left + "px";
					obj.style.top = top + "px";
					if(ICIBA_HUAYI_FLAG){
						ICIBA_HUAYI_mm(i_s);
						ICIBA_TOO_LONG.style.display = "none";
						obj.style.display = "block";
					}
				}else{
					ICIBA_HUAYI_mm(i_s);
					ICIBA_TOO_LONG.style.display = "none";
					obj.style.display = "block";
				}
				//dict.style.display = "block";
				ICIBA_HUAYI_mm(i_s);
				ICIBA_TOO_LONG.style.display = "none";
				obj.style.display = "block";
				ICIBA_HUAYI_FLAG = 1;
				return i_s;
			}else if(txt && txt.length>=1000){
				if(!ICIBA_HUAYI_GB){
					obj.style.left = left + "px";
					obj.style.top = top + "px";
				}
				loading.style.display = "none";
				dict.innerHTML='<div id="ICIBA_TOO_LONG" style="height:150px;padding-top:10px;background:#fff;" class="footer">您划取的内容太长，建议您去<a href="http://fy.iciba.com" target="_blank">爱词霸翻译</a>页面。</div>';
				obj.style.display = "block";
			}
			else {
				ICIBA_TOO_LONG.style.display = "none";
				if(!ICIBA_HUAYI_GB){
					obj.style.display = "none";
				}
			}
		}
	}else if(!(mousePos.x > obj_left_x && mousePos.x<obj_right_x && mousePos.y>obj_left_y && mousePos.y<obj_right_y)){
		if(!ICIBA_HUAYI_GB){
			obj.style.position = "absolute";
			obj.style.display = "none";
		}
		//		ICIBA_HUAYI_FLAG = 0;
	}
	if(ICIBA_HUACI_MOVE == 1){
		ICIBA_HUACI_MUp(ev);
	}
	//var scbiframe =  document.getElementById("icIBahyI-scbiframe");
	//scbiframe.style.display = "none";
	ICIBA_HUACI_MOVE = 0;
	ICIBA_HUACI_HUA = 0;
}
eleContainer.ondblclick = function(ev){
	var obj =  document.getElementById("icIBahyI-main_box");
	ev= ev || window.event;
	var mousePos = ICIBA_HUAYI_mouseCoords(ev);
	var obj_left_x = ICIBA_HUAYI_GetObjPos(obj)["x"];
	var obj_left_y = ICIBA_HUAYI_GetObjPos(obj)["y"];
	var obj_right_x = obj_left_x + obj.scrollWidth;
	var obj_right_y = obj_left_y + obj.scrollHeight;
	var left = mousePos.x;
	var top = mousePos.y+10;
	if(ICIBA_HUAYI_ALLOW){
		var dict=document.getElementById('icIBahyI-main_cont');
		var loading=document.getElementById('loading');
		var ICIBA_TOO_LONG=document.getElementById('ICIBA_TOO_LONG');
		if(obj.style.display == "none" || !(mousePos.x > obj_left_x && mousePos.x<obj_right_x && mousePos.y>obj_left_y && mousePos.y<obj_right_y)){
			var txt=ICIBA_HUAYI_funGetSelectTxt();
			if (txt && txt.length<1000) {
				document.getElementById("ICIBA_HUAYI_input").innerHTML=txt;
				var i_s=iciba_huaci_url+'dict.php?word='+encodeURIComponent(txt);
				if(!ICIBA_HUAYI_GB){
					obj.style.left = left + "px";
					obj.style.top = top + "px"
				}
				obj.style.display = "block";
				loading.style.display = "block";
				dict.style.display = "none";
				ICIBA_TOO_LONG.style.display = "none";
				ICIBA_HUAYI_mm(i_s);
			}else if(txt && txt.length>=1000){
				if(!ICIBA_HUAYI_GB){
					obj.style.left = left + "px";
					obj.style.top = top + "px"
				}
				loading.style.display = "none";
				dict.innerHTML='<div id="ICIBA_TOO_LONG" style="height:150px;padding-top:10px;">您划取的内容太长，建议您去<a href="http://fy.iciba.com"  target="_blank">爱词霸翻译</a>页面。</div>';
				obj.style.display = "block";
			}
			else {
				ICIBA_TOO_LONG.style.display = "none";
				if(!ICIBA_HUAYI_GB){
					obj.style.display = "none";
				}
			}
		}
	}
	//var scbiframe =  document.getElementById("icIBahyI-scbiframe");
	//scbiframe.style.display = "none";
}
function ICIBA_HUAYI_mouseCoords(ev)
{
	if(!document.all){
		mouse_x=ev.pageX;
		mouse_y=ev.pageY;
		//firefox By Rlby 2007-12-28
	}else{
		mouse_x=document.documentElement.scrollLeft+ev.clientX;
		mouse_y=document.documentElement.scrollTop+ev.clientY;
		//alert(document.documentElement.scrollTop); 滚动条滚过的高度，+ 显示页面的高度原因是声明后document.body.scrollTop的值永远等于0，解决办法是只需把document.body用 document.documentElement替换即可。By Rlby
	}

	return {
		x:mouse_x,
		y:mouse_y

	};
	//	if(ev.pageX || ev.pageY){
	//		return {x:ev.pageX, y:ev.pageY};
	//	}
	//	return {
	//		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
	//		y:ev.clientY + document.body.scrollTop - document.body.clientTop
	//
	//	};

}
function ICIBA_HUAYI_mm(path)
{
	var   e;   if(e=document.getElementById("meizz"))   e.parentNode.removeChild(e);
	var   script=   document.createElement("SCRIPT");   script.defer   =   true;
	script.type="text/javascript";   script.src=path;   script.id="meizz";
	document.getElementsByTagName("HEAD")[0].appendChild(script);
}

function getFlashObject_hanci(movieName) {
	if (window.document[movieName]) {
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1) {
		if (document.embeds && document.embeds[movieName])
		return document.embeds[movieName];
	} else  {
		return document.getElementById(movieName);
	}
}

function asplay_hanci(c){
	//	var mp3 = "http://news.iciba.com/admin/tts/"+c;
	//	alert(c)
	var asound = getFlashObject_hanci("asound_hanci");
	if(asound){
		asound.SetVariable("f",c);
		asound.GotoFrame(1);
	}
}

function asstop_hanci(){
	var asound = getFlashObject_hanci("asound_hanci");
	if(asound){
		asound.GotoFrame(3);
	}
}

/*点击关闭内容窗口*/
document.getElementById("icIBahyI-gb").onclick=function(){
	//	alert(1);
	ICIBA_HUAYI_FLAG = 0;
	ICIBA_HUAYI_GB = 0;
	document.getElementById("icIBahyI-main_box").style.display="none";
}

/*鼠标移动效果*/
//var ICIBA_HUACI_Obj;
//document.getElementById("icIBahyI-main_title").onmouseup=MUp;// 事件会在鼠标按键被松开时发生
//document.onmousemove=MMove;//事件会在鼠标指针移动时发生。
function ICIBA_HUACI_MDown(event) {//事件会在鼠标按键被按下时发生

	var obj =  document.getElementById("icIBahyI-main_box");
	ICIBA_HUACI_Obj = obj.parentNode;
	if (window.event) {
		event = window.event;
		if (ICIBA_HUACI_Obj.setCapture) {
			ICIBA_HUACI_Obj.setCapture();
		} else if(window.captureEvents){
			window.captureEvents(event.MOUSEMOVE | event.MOUSEUP);
		}
	}
	else {
		window.captureEvents(event.MOUSEMOVE|event.MOUSEUP);
	}

	var mousePos = ICIBA_HUAYI_mouseCoords(event);
	var obj_left_x = ICIBA_HUAYI_GetObjPos(obj)["x"];
	var obj_left_y = ICIBA_HUAYI_GetObjPos(obj)["y"];

	ICIBA_HUACI_pX = mousePos.x - obj_left_x;
	ICIBA_HUACI_pY = mousePos.y - obj_left_y;


}
function ICIBA_HUACI_MMove(event) {
	//	alert(1);
	event = event||window.event;
	document.getElementById("icIBahyI-main_title").style.cursor="move";
	var obj =  document.getElementById("icIBahyI-main_box");
	var mousePos = ICIBA_HUAYI_mouseCoords(event);

	obj.style.left=mousePos.x-ICIBA_HUACI_pX + "px";
	obj.style.top=mousePos.y-ICIBA_HUACI_pY + "px";
}
function ICIBA_HUACI_MUp(event) {
	var obj =  document.getElementById("icIBahyI-main_box");
	document.getElementById("icIBahyI-main_title").style.cursor="default";
	ICIBA_HUACI_Obj = obj.parentNode;
	if(ICIBA_HUACI_Obj){
		if (window.event && ICIBA_HUACI_Obj.releaseCapture) ICIBA_HUACI_Obj.releaseCapture();
		else window.captureEvents(event.MOUSEMOVE|event.MOUSEUP);
		ICIBA_HUACI_Obj=null;
	}

}

var ICIBA_HUACI_TOP = window.ICIBA_HUACI_TOP = {
	_module: 1,
	curTab: 1,
	user: {
		id: 0,
		name: "",
		email: "",
		mobile: "",
		stat: {
			status: false,
			email: false,
			mobile: false
		}
	},
	initUserCookie: function() {

		var _ustat;
		var _stat = this.readCookie("_ustat");
		if (typeof _stat == "string") {
			try {
				_ustat = eval("(" + _stat + ")");
				this.user.id = _ustat.i;
				this.user.name = _ustat.n;
				//				this.user.email = _ustat.e;
				this.user.stat.status = _ustat.s.u;
				//				this.user.stat.email = ustat.e;
				this.user.stat.mobile = ustat.s.m
			} catch(e) {}
		}
		//		this.showHeaderBar()
	},
	readCookie: function(a) {
		var c = "";
		var b = a + "=";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(b);
			if (offset != -1) {
				offset += b.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) {
					end = document.cookie.length
				}
				c = document.cookie.substring(offset, end)
			}
		}
		return decodeURIComponent(c)
	},
	checkLogin: function() {
		if (this.user.id == 0 || this.user.name == "") {
			return false
		}
		return true
	},
	init: function() {
		this.initUserCookie()
	}
};
ICIBA_HUACI_TOP.initUserCookie();
function ICIBA_HUACI_myBrowser(){
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera ; //判断是否IE浏览器
	var isFF = userAgent.indexOf("Firefox") > -1 ; //判断是否Firefox浏览器
	var isSafari = userAgent.indexOf("Safari") > -1 ; //判断是否Safari浏览器
	var isChrome = userAgent.indexOf("Chrome") > -1 ; //判断是否Safari浏览器

	if(isIE){
		var IE5 = IE55 = IE6 = IE7 = IE8 = false;
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);

		IE55 = fIEVersion == 5.5 ;
		IE6 = fIEVersion == 6.0 ;
		IE7 = fIEVersion == 7.0 ;
		IE8 = fIEVersion == 8.0 ;

		if(IE55){ return "IE55"; }
		if(IE6){ return "IE6"; }
		if(IE7){ return "IE7"; }
		if(IE8){ return "IE8"; }
	}//isIE end

	if(isFF){ return "FF"; }
	if(isOpera){ return "Opera"; }
	if(isChrome){ return "Chrome"; }

}
