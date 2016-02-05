var main = {

	currentTab:"inicio2",

	startApp: function() {
        main.setListeners();
        main.generateDimensions();
    },
	setListeners: function(){
		document.addEventListener('deviceready', main.onDeviceReady,    false);
		document.addEventListener('click', main.onClickElement, false);
	},
	generateDimensions: function(){
		document.height = document.documentElement.offsetHeight;
        var style = document.createElement("style");
        style.type = "text/css";
    	style.innerHTML = "board content {height:" + (document.height-95) + "px;} board[firstboard='true'] content {height:" + (document.height-60) + "px;}";
    	document.body.appendChild(style);
	},

	onDeviceReady: function() {
        //FastClick.attach(document.body);
        ionic.Platform.fullScreen();
	    main.setPhonePlatform();
	},

	 setComputerPlatform: function() {
	 	var body = document.querySelector("body");
	 	var navegador = navigator.userAgent.toLowerCase();

	    if(navegador.indexOf("android") >= 0){
	        body.setAttribute("platform", "android");
	    }else if(navegador.indexOf("iphone") >= 0 || navegador.indexOf("ipad") >= 0){
	        body.setAttribute("platform", "ios");
	    }
	 },

	setPhonePlatform: function(){
        if(typeof(device) != "undefined"){
            var platform = device.platform.toLowerCase();
            document.querySelector("body").setAttribute("platform", platform);
        }
    },
     
	onClickElement: function(e){
        var focus = e.target || e.srcElement;
        var end = false;

        while(!end){
        	var functionAttr = focus.getAttribute("function");
        	if(functionAttr && functionAttr != ""){
        		if(functionAttr=="mapbambu"){
        			other.openMap("Calle la pasionaria, 1, 29530, Alameda (Málaga)");
                }else if(functionAttr=="mapvendetta"){
                    other.openMap("Calle la pasionaria, 1, 29530, Alameda (Málaga)");
        		}else if(functionAttr=="selectorfromvendetta"){
                    main.switchSection("inicio");
                    document.querySelector("firstbar").setAttribute("status","show");
                    document.querySelector("bar[id='vendettabar']").setAttribute("status","hide");
                }else if(functionAttr=="selectorfrombambu"){
                    main.switchSection("inicio");
                    document.querySelector("firstbar").setAttribute("status","show");
                    document.querySelector("bar[id='bambubar']").setAttribute("status","hide");
                }else if(functionAttr=="bambu"){
                    main.switchBoard("inicio2");
                    document.querySelector("bar[id='bambubar']").setAttribute("status","show");
                    document.querySelector("firstbar").setAttribute("status","hide");
                }else if(functionAttr=="vendetta"){
                    main.switchBoard("inicio3");
                    document.querySelector("bar[id='vendettabar']").setAttribute("status","show");
                    document.querySelector("firstbar").setAttribute("status","hide");
                }else if(functionAttr=="loadMorePhotos"){
                    var photoIndex=parseInt(focus.getAttribute("photoIndex"));
                    var url=document.querySelector("bar tab[name='"+main.currentTab+"']").getAttribute("url");
                    main.loadPhotos(main.currentTab,url,photoIndex);
                }else if(functionAttr=="showPhoto"){
                    window.open(focus.childNodes[0].getAttribute("src"), '_blank', 'location=no');
                }
        		end=true;
			}else if(focus.nodeName == "A"){
                var link = focus.getAttribute("href");
                if(link.substr(0,4) == "http"){
                    window.open(link, "_system");
                }
                end=true;
            }else if(focus.nodeName == "BODY"){
                end = true;
            }else if(focus.nodeName == "TAB"){
                main.switchBoard(focus.getAttribute("name"));
            	url=focus.getAttribute("url");
            	if(url && url!=""){
            		main.createContent(focus.getAttribute("name"),focus.getAttribute("title"),url);
            	}
                end = true;
            }else if(focus.nodeName == "FIRSTAB"){
                main.switchSection(focus.getAttribute("name"));
                url=focus.getAttribute("url");
                if(url && url!=""){
                    main.createContent(focus.getAttribute("name"),focus.getAttribute("title"),url);
                }
                end = true;
            }else{
                focus = focus.parentNode;
            }
        }
        e.stopPropagation();
        e.preventDefault();
    },

    switchBoard: function(newBoard){
        if(newBoard!=main.currentTab){
            document.querySelector("board[name='"+newBoard+"']").setAttribute("status","show");
            document.querySelector("board[name='"+main.currentTab+"']").setAttribute("status","hide");
            document.querySelector("bar tab[status='active']").setAttribute("status","");
            document.querySelector("bar tab[name='"+newBoard+"']").setAttribute("status","active");
            if(newBoard=="inicio2" && main.currentTab!="inicio2"){
                document.getElementById("loguito").src="res/jardinloguito2.png";
            }else if(main.currentTab=="inicio2" && newBoard!="inicio2"){
                document.getElementById("loguito").src="res/jardinloguito.png";
            }
            main.currentTab=newBoard;
        }
    },

    switchSection: function(newBoard){
        if(newBoard!=main.currentTab){
            document.querySelector("board[name='"+newBoard+"']").setAttribute("status","show");
            document.querySelector("board[name='"+main.currentTab+"']").setAttribute("status","hide");
            document.querySelector("firstbar firstab[status='active']").setAttribute("status","");
            document.querySelector("firstbar firstab[name='"+newBoard+"']").setAttribute("status","active");
            main.currentTab=newBoard;
        }
    },

	createContent: function(name,title,url){
        if(name!="photos2" && name!="photos3"){
    		xhr = new XMLHttpRequest();
    		xhr.onreadystatechange = function(){
    			if(xhr.readyState == 4 && xhr.response != "") {
    				var jsonContent = JSON.parse(xhr.responseText);
                        xhr2 = new XMLHttpRequest();
                        xhr2.onreadystatechange = function(){
                            if (xhr2.readyState == 4 && xhr2.response != "") {
                                var source = xhr2.responseText;
                                var template = Handlebars.compile(source);
                                var html = template(jsonContent);
                                document.querySelector("board[name='"+name+"'] content").innerHTML=html;
                            }
                        }
                        xhr2.open("GET","Handlebars/"+title+".html",true);
                        xhr2.send();
    			}else if(xhr.readyState == 4){
                    document.querySelector("board[name='"+name+"'] content").innerHTML="<div class=\"frame\" style=\"text-align: center;\"><i class=\"fa fa-times fa-3x\" style=\"color: red;\"></i><br><b>Error de conexión.</b></div>";
                }
    		}
    		xhr.open("GET",url,true);
    		xhr.send();
        }else{
            main.loadPhotos(name,url,0);
        }
	},

    loadPhotos: function(name,url,photoIndex){
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.response != "") {
                var html="";
                var jsonContent = JSON.parse(xhr.responseText);
                var photos=jsonContent.images;
                var imagesrc;
                if(photos.length>0){
                    var i;
                    for(i=photoIndex; i<photos.length && i<photoIndex+10; i++) {
                        imagesrc="http://bambúandvendetta.com/" + photos[i]._ngiw._orig_image.path+"/"+photos[i]._ngiw._orig_image.filename;
                        html+= "<div function=\"showPhoto\" class=\"foto\"><img src=\""+imagesrc+"\"></div>";
                    }
                    if(i<photos.length){
                        html+="<!--warning--><div class=\"loadwarning\" function=\"loadMorePhotos\" photoIndex="+i+"><i class=\"fa fa-long-arrow-down\" style=\"margin-right: 2%;\"></i>Cargar más</div>";
                    }
                    if(photoIndex==0){
                        document.querySelector("board[name='"+name+"'] content").innerHTML=html;
                    }else{
                        document.querySelector("board[name='"+name+"'] content").innerHTML=document.querySelector("board[name='"+name+"'] content").innerHTML.split("<!--warning-->")[0]+html;
                    }
                }else{
                    html="<div><div class=\"frame\" style=\"text-align: center;\"><i class=\"fa fa-info-circle fa-3x\"></i><br>No hay contenido disponible aún.</div></div>";
                    document.querySelector("board[name='"+name+"'] content").innerHTML=html;
                }
            }else if(xhr.readyState == 4){
                document.querySelector("board[name='"+name+"'] content").innerHTML="<div class=\"frame\" style=\"text-align: center;\"><i class=\"fa fa-times fa-3x\" style=\"color: red;\"></i><br><b>Error de conexión.</b></div>";
            }
        }
        xhr.open("GET",url,true);
        xhr.send();
    }
}
