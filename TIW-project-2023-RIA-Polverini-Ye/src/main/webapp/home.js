/**
 * 
 */
const home = () => {
	document.getElementById("id_goToBuy").addEventListener('click', () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("sellSection").className = "hiddenElement";
		document.getElementById("buySection").className = "buyPage";
	});
	document.getElementById("id_goToSell").addEventListener("click", () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("buySection").className = "hiddenElement";
		document.getElementById("sellSection").className = "sellPage";
	});
	document.getElementById("customTitle").appendChild(document.createTextNode("Hi "+ sessionStorage.getItem("name")+", what do you want to do?"))
};

const main1 = () => {
	home();
};

window.addEventListener("load", () => {
	if (sessionStorage.getItem("name") == null){
		window.location.href = "index.html";
		
	} else {
		main1();
		makeCall("GET", "GoToBuy", null, function(response) {
	  	if (response.readyState == XMLHttpRequest.DONE && response.status == 200) {
			console.log(response.responseText);
		    var response = JSON.parse(response.responseText);
		    var auctionInfoList = response.auctionInfoList;
		    var wonAuctionInfoList = response.wonAuctionInfoList;
		
		    // Utilizza i dati dell'oggetto JSON come desideri
		    createOpenAuctionTable(auctionInfoList);
		    createWonAuctionTable(wonAuctionInfoList);
		    
		    //immagini hover
		    var lis = document.getElementsByClassName("li_image");
			for (var i = 0; i < lis.length; i++) {
			  lis[i].addEventListener('mouseover', function(event) {
			    showFloatingImage(event, this.id);
			  });
			}
	  }
});
	}
});
