/**
 * ZHL 2021-07-05
 */
var poplayer = {
	prependHTML:function(el, html){
		var divTemp = document.createElement("div"),nodes = null,fragment = document.createDocumentFragment();
		divTemp.innerHTML = html;
		nodes = divTemp.childNodes;
		for (var i=0, length=nodes.length; i<length; i+=1) {
			fragment.appendChild(nodes[i].cloneNode(true));
		}
		// 插入到容器的前面 - 差异所在
		el.insertBefore(fragment, el.firstChild);
		// 内存回收？
		nodes = null;
		fragment = null;
	},
	ahref:function(href,inputVal){
		if(!href){
			document.body.removeChild(document.getElementById("pop_tip"));
		}else if(parseInt(href) < 0){
			window.history.go(-1);
		}else if(parseInt(href) == 1){
			window.location.href = document.referrer;
		}else if(href){
			if(inputVal){
				if(href.indexOf("?") != -1){
					window.location.href=href+'&pop_val='+inputVal;
				}else{
					window.location.href=href+'?pop_val='+inputVal;
				}
			}else{
				window.location.href=href;
			}
		}
	},
	html:function(text,btn1,btn2,inputflag){
		let pop_tip_html = '<style>';
		pop_tip_html += '*{margin:0;padding:0;}';
		pop_tip_html += '.pop_tip{position: fixed;top: 0;width: 100%;height: 100%;z-index: 999;background: rgba(0,0,0,0.5);}';
		pop_tip_html += '.pop_tip .pop_tip_box{position: absolute;top: 34%;width: 300px;left: 50%;margin-left:-150px;background: #fff;z-index: 1000;text-align: center;border-radius: 10px;}';
		pop_tip_html += '.pop_tip .pop_tip_box .pop_tip_text{font-size: 16px;font-size: 16px;line-height: 25px;padding: 20px;text-align: center;}';
		pop_tip_html += '.pop_tip .pop_tip_box .popbtm .left{display:inline-block;width: 50%;text-align: center;line-height: 35px;font-size: 16px;background: #ccc;color: #fff;border-radius: 0 0 0 10px;}';
		pop_tip_html += '.pop_tip .pop_tip_box .popbtm .right{display:inline-block;width: 50%;text-align: center;line-height: 35px;font-size: 16px;background: #3dc6da;color: #fff;border-radius: 0 0 10px 0;}';
		pop_tip_html += '.pop_tip .pop_tip_btn_box{margin:10px 0 20px 0;color:#fff;font-size:14px;}';
		pop_tip_html += '.pop_tip .pop_tip_btn_box #pop_tip_btn{display:inline-block;width:200px;background:#70b4fd;text-align:center;line-height:30px;border-radius: 10px;cursor: pointer;}';
		pop_tip_html += '.pop_tip .pop_tip_btn_box #pop_tip_btn1,.pop_tip .pop_tip_btn_box #pop_tip_btn2{margin:0 2px;display:inline-block;width:calc(50% - 20px);background:#999;text-align:center;line-height:30px;border-radius:10px;cursor: pointer;}';
		pop_tip_html += '.pop_tip .pop_tip_btn_box #pop_tip_btn1{background:#70b4fd;}';
		pop_tip_html += '.pop_tip .pop_tip_box .pop_tip_input_box{text-align:center;margin-bottom: 20px;}';
		pop_tip_html += '.pop_tip .pop_tip_box .pop_tip_input_box input{width:(80% - 10px);height:30px;padding:0 10px;border:1px solid #ccc;}';
		pop_tip_html += '</style>';
		pop_tip_html += '<div class="pop_tip" id="pop_tip">';
		pop_tip_html += '<div class="pop_tip_box"><div class="pop_tip_text">'+text+'</div>';
		if(inputflag){
			pop_tip_html += '<div class="pop_tip_input_box" ><input type="text" id="pop_tip_input" placeholder="'+inputflag+'"/></div>';
		}
		if(btn1 && btn2){
			pop_tip_html += '<div class="pop_tip_btn_box"><span id="pop_tip_btn1">'+btn1+'</span><span id="pop_tip_btn2">'+btn2+'</span></div>';
		}else if(btn1){
			pop_tip_html += '<div class="pop_tip_btn_box"><span id="pop_tip_btn">'+btn1+'</span></div>';
		}
		pop_tip_html += '</div></div>';
		return pop_tip_html;
	},
	msg:function(text,time,href){
		var _this = this;
		_this.prependHTML(document.body,_this.html(text));
		time = time ? parseInt(time)*1000 : 3000;
		setTimeout(function(){
			_this.ahref(href);
		},time);
	},
	alert:function(text,btn,href){
		var _this = this;
		btn = btn ? btn : '确定';
		_this.prependHTML(document.body,_this.html(text,btn));
		document.getElementById("pop_tip_btn").onclick = function(){
			_this.ahref(href);
		};
	},
	confirm:function(text,btn1,btn2,href){
		var _this = this;
		btn1 = btn1 ? btn1 : '确定';
		btn2 = btn2 ? btn2 : '取消';
		_this.prependHTML(document.body,_this.html(text,btn1,btn2));

		document.getElementById("pop_tip_btn1").onclick = function(){
			_this.ahref(href);
		};
		document.getElementById("pop_tip_btn2").onclick = function(){
			document.body.removeChild(document.getElementById("pop_tip"));
		};
	},
	prompt:function(text,btn1,btn2,href,inputFlag,mustFlag){
		var _this = this;
		btn1 = btn1 ? btn1 : '确定';
		_this.prependHTML(document.body,_this.html(text,btn1,btn2,inputFlag));
		let domBtn1= document.getElementById("pop_tip_btn");
		if(btn1 && btn2){
			domBtn1= document.getElementById("pop_tip_btn1");
		}
		domBtn1.onclick = function(){
			let inputVal = inputFlag ? document.getElementById("pop_tip_input").value : '';
			if(mustFlag && !inputVal){
				document.body.removeChild(document.getElementById("pop_tip"));
				_this.msg(inputFlag,3);
				setTimeout(function(){
					_this.prompt(text,btn1,btn2,href,inputFlag,mustFlag);
				},3000);
			}else{
				_this.ahref(href,inputVal);
			}
		};
		if(btn2){
			document.getElementById("pop_tip_btn2").onclick = function(){
				document.body.removeChild(document.getElementById("pop_tip"));
			};
		}
	},
	prompt1:function(text,btn1,btn2,inputFlag,mustFlag,f){
		var _this = this;
		btn1 = btn1 ? btn1 : '确定';
		_this.prependHTML(document.body,_this.html(text,btn1,btn2,inputFlag));
		let domBtn1= document.getElementById("pop_tip_btn");
		if(btn1 && btn2){
			domBtn1= document.getElementById("pop_tip_btn1");
		}
		domBtn1.onclick = function(){
			let inputVal = inputFlag ? document.getElementById("pop_tip_input").value : '';
			if(mustFlag && !inputVal){
				document.body.removeChild(document.getElementById("pop_tip"));
				_this.msg(inputFlag,3);
				setTimeout(function(){
					_this.prompt(text,btn1,btn2,href,inputFlag,mustFlag);
				},3000);
			}else{
				f(inputVal)
				//_this.ahref(href,inputVal);
			}
		};
		if(btn2){
			document.getElementById("pop_tip_btn2").onclick = function(){
				document.body.removeChild(document.getElementById("pop_tip"));
			};
		}
	}
}