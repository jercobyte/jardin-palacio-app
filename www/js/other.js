var other = {
	openMap: function(address){
		if(document.body.getAttribute("platform") == "android"){
			to = address.replace(/ /g,"+");
			window.open("http://maps.google.com/maps?daddr=" + to, "_system");
		}else{
			to = address.replace(/ /g,"+");
			var url = "http://maps.apple.com/?daddr=" + to;
			var ref = window.open(url, "_system");
		}
	}
}