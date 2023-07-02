/**
 * 
 */
const home = () => {
	document.getElementById("id_goToBuy").addEventListener('click', () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("sellSection").className = "hiddenElement";
		document.getElementById("buySection").className = "buyPage";
		document.getElementById("buySectionTitle").classList.remove("hiddenElement");
		document.getElementById("sellSectionTitle").classList.add("hiddenElement");
	});
	document.getElementById("id_goToSell").addEventListener("click", () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("buySection").className = "hiddenElement";
		document.getElementById("sellSection").className = "sellPage";
		document.getElementById("buySectionTitle").classList.add("hiddenElement");
		document.getElementById("sellSectionTitle").classList.remove("hiddenElement");
	});
	document.getElementById("customTitle").appendChild(document.createTextNode("Hi "+ sessionStorage.getItem("name")+", what do you want to do?"))
};

const main1 = () => {
	home();
};

const floatImage = () => {
	 //immagini hover
		    var lis = document.getElementsByTagName("li");
			for (var i = 0; i < lis.length; i++) {
				if(lis[i].className != "notOver"){
				  lis[i].addEventListener('mouseover', function(event) {
				    showFloatingImage(event, this.className);
				  });
			  }
			}
};

window.addEventListener("load", () => {
	if (sessionStorage.getItem("name") == null){
		window.location.href = "index.html";
		
	} else {
		main1();
		
		//GET gotobuy
		makeCall("GET", "GoToBuy", null, function(response) {
	  	if (response.readyState == XMLHttpRequest.DONE && response.status == 200) {
		    var response = JSON.parse(response.responseText);
		    var auctionInfoList = response.auctionInfoList;
		    var wonAuctionInfoList = response.wonAuctionInfoList;
		
		    // Utilizza i dati dell'oggetto JSON come desideri
		    createOpenAuctionTable(auctionInfoList);
		    createWonAuctionTable(wonAuctionInfoList);
		    
		    floatImage();
				    
		  }
		});

			
			//GET gotosell
			makeCall("GET", "GoToSell", null, function(response1) {
				
			  	if (response1.readyState == XMLHttpRequest.DONE && response1.status == 200) {
				    var finalobject = JSON.parse(response1.responseText);
				    var yourAuctionInfoList = finalobject.auctionInfoList;
				    var ownClosedAuctionInfoList = finalobject.ownClosedAuctionInfoList;
				    //var imageList = finalobject.imageList;
				
				    // Utilizza i dati dell'oggetto JSON come desideri
				    createYourAuctionTable(yourAuctionInfoList);
				    createOwnWonAuctionTable(ownClosedAuctionInfoList);
				    floatImage();
			  }
		});
		
					
	}
});
