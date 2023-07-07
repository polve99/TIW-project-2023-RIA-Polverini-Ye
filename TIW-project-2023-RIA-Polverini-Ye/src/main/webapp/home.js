/**
 * 
 */
const home = () => {
	document.getElementById("id_goToBuy").addEventListener('click', () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("sellSection").className = "hiddenElement";
		document.getElementById("buySection").className = "buyPage";
		document.getElementById("prev").className = "prevPage";
	});
	document.getElementById("id_goToSell").addEventListener("click", () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("buySection").className = "hiddenElement";
		document.getElementById("sellSection").className = "sellPage";
		document.getElementById("prev").className = "prevPage";
	});
	document.getElementById("customTitle").appendChild(document.createTextNode("Hi "+ sessionStorage.getItem("name")+", what do you want to do?"))
};

const previous = () => {
	document.getElementById("previousPage_id").addEventListener("click", () => {
		
		let homeP = document.getElementById("home");
		let sellP = document.getElementById("sellSection");
		let buyP = document.getElementById("buySection");
		
		if(sellP.className === buyP.className){
			document.getElementById("prev").className = "hiddenElement";
		} else if(sellP.className === "sellPage"){
			
			document.getElementById("home").className = "homeLinks";
			document.getElementById("prev").className = "hiddenElement";
			sellP.className = "hiddenElement";
			
		} else if(buyP.className === "buyPage"){
			
			let detOpen = document.getElementById("OpenAuctionMacroTable");
			let detClose = document.getElementById("BuyPage_ClosedAuctions");
			
			if(detOpen.className === "OpenAuctionMacroTable"){
				document.getElementById("bidform").className = "bidform";
				detOpen.className = "hiddenElement";
				document.getElementById("BuyPage_ClassicInitialPage").className = "BuyPage_ClassicInitialPage";
			} else if(detClose.className === "BuyPage_ClosedAuctions"){
				detClose.className = "hiddenElement";
				document.getElementById("BuyPage_ClassicInitialPage").className = "BuyPage_ClassicInitialPage";
			} else if (detOpen.className === detClose.className){
			
				document.getElementById("home").className = "homeLinks";
				document.getElementById("prev").className = "hiddenElement";
				buyP.className = "hiddenElement";
			}
		} 
	})};

const main1 = () => {
	home();
	previous();
	
	logoutEvent();
};

const main2 = () => {
	aucDetails();
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

const logoutEvent = () => {
	document.getElementById("logout_id").addEventListener("click", () =>{
		makeCall("GET", "Logout", null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				//sessionStorage.clear();
				window.location.href = "index.html";
			} else {
				window.location.href = "index.html";
			}
		});
	})};

window.addEventListener("load", () => {
	if (sessionStorage.getItem("name") == null){
		window.location.href = "index.html";
		
	} else {
		main1();
		keyWordTable();
		
		if(document.getElementById("id_goToBuy").className !== "hiddenElement"){
			//GET gotobuy
			makeCall("GET", "GoToBuy", null, function(response) {
		  	if (response.readyState == XMLHttpRequest.DONE && response.status == 200) {
			    var response = JSON.parse(response.responseText);
			    var auctionInfoList = response.auctionInfoList;
			    var wonAuctionInfoList = response.wonAuctionInfoList;
			
			    // Utilizza i dati dell'oggetto JSON come desideri
			    createOpenAuctionTable(auctionInfoList);
			    createWonAuctionTable(wonAuctionInfoList);
			    main2();
			    floatImage();
					    
			  }
			});
		}
		if(document.getElementById("id_goToSell").className !== "hiddenElement"){	
			//GET gotosell
			makeCall("GET", "GoToSell", null, function(response1) {
				
			  	if (response1.readyState == XMLHttpRequest.DONE && response1.status == 200) {
				    var finalobject = JSON.parse(response1.responseText);
				    var yourAuctionInfoList = finalobject.auctionInfoList;
				    var ownClosedAuctionInfoList = finalobject.ownClosedAuctionInfoList;
				    var imageList = finalobject.imageList;
				
				    // Utilizza i dati dell'oggetto JSON come desideri
				    createYourAuctionTable(yourAuctionInfoList);
				    createOwnWonAuctionTable(ownClosedAuctionInfoList);
				    addArticlePage();
				    createArticlePage(imageList);
				    addArticlePost();
				    createAuctionPost();
				    floatImage();
			  }
			});
		}
					
	}
});
