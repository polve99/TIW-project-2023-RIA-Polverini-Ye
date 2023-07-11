/**
 * 
 */
const home = () => {
	document.getElementById("id_goToBuy").addEventListener('click', () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("sellSection").className = "hiddenElement";
		document.getElementById("buySection").className = "buyPage";
		document.getElementById("prev").className = "prevPage";
		document.getElementById("buySectionTitle").classList.remove("hiddenElement");
		document.getElementById("sellSectionTitle").classList.add("hiddenElement");
	});
	document.getElementById("id_goToSell").addEventListener("click", () => {
		document.getElementById("home").className = "hiddenElement";
		document.getElementById("buySection").className = "hiddenElement";
		document.getElementById("sellSection").className = "sellPage";
		document.getElementById("prev").className = "prevPage";
		document.getElementById("buySectionTitle").classList.add("hiddenElement");
		document.getElementById("sellSectionTitle").classList.remove("hiddenElement");
	});
	document.getElementById("customTitle").appendChild(document.createTextNode("Hi "+ sessionStorage.getItem("userMail")+", what do you want to do?"))
};

const previous = () => {
	document.getElementById("previousPage_id").addEventListener("click", () => {
		
		let homeP = document.getElementById("home");
		let aucD = document.getElementById("aucPageDetails");
		let sellP = document.getElementById("sellSection");
		let buyP = document.getElementById("buySection");
		
		if(homeP.className !== "hiddenElement"){
			document.getElementById("buySectionTitle").classList.add("hiddenElement");
			document.getElementById("sellSectionTitle").classList.add("hiddenElement");
			document.getElementById("prev").className = "hiddenElement";
			
		} else if(sellP.className === "sellPage"){
			document.getElementById("sellSectionTitle").classList.add("hiddenElement");
			document.getElementById("home").className = "homeLinks";
			document.getElementById("prev").className = "hiddenElement";
			sellP.className = "hiddenElement";
			
		} else if(buyP.className === "buyPage"){
			document.getElementById("buySectionTitle").classList.add("hiddenElement");
			document.getElementById("home").className = "homeLinks";
			document.getElementById("prev").className = "hiddenElement";
			buyP.className = "hiddenElement";
			
		} else if (aucD.className === "buy") {
			
			document.getElementById("buySectionTitle").classList.remove("hiddenElement");
			
			if(document.getElementById("OpenAuctionMacroTable").className === "OpenAuctionMacroTable"){
				aucD.className = "hiddenElement";
				document.getElementById("BuyPage_ClosedAuctions").className = "BuyPage_ClosedAuctions";
				document.getElementById("bidform").className = "bidForm";
				document.getElementById("closeform").className = "closeform";
				buyP.className = "buyPage";
			} else {
				aucD.className = "hiddenElement";
				document.getElementById("OpenAuctionMacroTable").className = "OpenAuctionMacroTable";
				buyP.className = "buyPage";
			}
			
		} else if(aucD.className === "sell") {
			
			document.getElementById("sellSectionTitle").classList.remove("hiddenElement");
			
			if(document.getElementById("OpenAuctionMacroTable").className === "OpenAuctionMacroTable"){
				aucD.className = "hiddenElement";
				document.getElementById("BuyPage_ClosedAuctions").className = "BuyPage_ClosedAuctions";
				document.getElementById("bidform").className = "bidForm";
				document.getElementById("closeform").className = "closeform";
				sellP.className = "sellPage";
			} else {
				aucD.className = "hiddenElement";
				document.getElementById("OpenAuctionMacroTable").className = "OpenAuctionMacroTable";
				sellP.className = "sellPage";
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
	createBid();
};

const floatImage = () => {
	 //immagini hover
		    let lis = document.getElementsByTagName("li");
			for (let i = 0; i < lis.length; i++) {
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
				sessionStorage.clear();
				window.location.href = "index.html";
			} else {
				window.location.href = "index.html";
			}
		});
	})};

window.addEventListener("load", () => {
	if (sessionStorage.getItem("userMail") == null){
		window.location.href = "index.html";
		
	} else {
		
		main1();
		
		if (!cookieExistence(sessionStorage.getItem("userMail"))){
			createNewCookie(sessionStorage.getItem("userMail"),"");
			document.getElementById("home").className = "hiddenElement";
			document.getElementById("sellSection").className = "hiddenElement";
			document.getElementById("buySection").className = "buyPage";
			document.getElementById("prev").className = "prevPage";
			document.getElementById("buySectionTitle").classList.remove("hiddenElement");
			document.getElementById("sellSectionTitle").classList.add("hiddenElement");
			
		} else {
			
			if (returnLastValueCookie(sessionStorage.getItem("userMail")) === "sell"){
				document.getElementById("home").className = "hiddenElement";
				document.getElementById("sellSection").className = "sellPage";
				document.getElementById("buySection").className = "hiddenElement";
				document.getElementById("prev").className = "prevPage";
				document.getElementById("buySectionTitle").classList.add("hiddenElement");
				document.getElementById("sellSectionTitle").classList.remove("hiddenElement");
			} else {
				document.getElementById("home").className = "hiddenElement";
				document.getElementById("sellSection").className = "hiddenElement";
				document.getElementById("buySection").className = "buyPage";
				document.getElementById("prev").className = "prevPage";
				document.getElementById("buySectionTitle").classList.remove("hiddenElement");
				document.getElementById("sellSectionTitle").classList.add("hiddenElement");
			}
		}
		
		keyWordTable();
		
		if(/*document.getElementById("id_goToBuy").className !== "hiddenElement"*/ 1===1){
			//GET gotobuy
			makeCall("GET", "GoToBuy", null, function(response) {
		  	if (response.readyState == XMLHttpRequest.DONE && response.status == 200) {
			    let response = JSON.parse(response.responseText);
			    let auctionInfoList = response.auctionInfoList;
			    let wonAuctionInfoList = response.wonAuctionInfoList;
			
			    // Utilizza i dati dell'oggetto JSON come desideri
			    createOpenAuctionTable(auctionInfoList);
			    createWonAuctionTable(wonAuctionInfoList);
			    getCookiesAuctions(sessionStorage.getItem("userMail"));
			    main2();
			    floatImage();
			  }
			});
		}
		if(/*document.getElementById("id_goToSell").className !== "hiddenElement"*/ 1===1){	
			//GET gotosell
			makeCall("GET", "GoToSell", null, function(response1) {
				
			  	if (response1.readyState == XMLHttpRequest.DONE && response1.status == 200) {
				    let finalobject = JSON.parse(response1.responseText);
				    let yourAuctionInfoList = finalobject.auctionInfoList;
				    let ownClosedAuctionInfoList = finalobject.ownClosedAuctionInfoList;
				    let imageList = finalobject.imageList;
				
				    // Utilizza i dati dell'oggetto JSON come desideri
				    
				    if(yourAuctionInfoList.length>0){
						document.getElementById("id_empty_yourAuctionInfoListOpen").classList.add("hiddenElement");
						document.getElementById("id_yourAuctionInfoListOpen_listContainer").classList.remove("hiddenElement");
					} else {
						document.getElementById("id_empty_yourAuctionInfoListOpen").classList.remove("hiddenElement");
						document.getElementById("id_yourAuctionInfoListOpen_listContainer").classList.add("hiddenElement");
					}
					createYourAuctionTable(yourAuctionInfoList);
					
					if(ownClosedAuctionInfoList.length>0 && ownClosedAuctionInfoList!=null){
						document.getElementById("id_empty_yourClosedAuctionInfoListOpen").classList.add("hiddenElement");
						document.getElementById("id_yourClosedAuctionInfoListOpen_listContainer").classList.remove("hiddenElement");
					} else{
						document.getElementById("id_empty_yourClosedAuctionInfoListOpen").classList.remove("hiddenElement");
						document.getElementById("id_yourClosedAuctionInfoListOpen_listContainer").classList.add("hiddenElement");
					
					}
					createOwnWonAuctionTable(ownClosedAuctionInfoList);
					
				    addArticlePage();
				    createArticlePage(imageList);
				    addArticlePost();
				    createAuctionPost();
				    aucDetails();
				    floatImage();
			  }
			});
		}
		closeAuction();
	}
});
