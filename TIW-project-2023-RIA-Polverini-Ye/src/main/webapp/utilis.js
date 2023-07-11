/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, callbak, reset = true) {
	    var req = new XMLHttpRequest();
	    req.onreadystatechange = function() {
	      callbak(req)
	    };
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
	      req.send(new FormData(formElement));
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
    }
    
    function addListener(object) {
    object.addEventListener("click", (e) => {
		
		makeCall("GET", "GoToAuction?idAuction="+e.target.textContent,null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				var response = JSON.parse(response.responseText);
				document.getElementById("msgBid").textContent="";
				
				let buySec = document.getElementById("buySection");
				let sellSec = document.getElementById("sellSection");
				document.getElementById("buySectionTitle").classList.add("hiddenElement");
				document.getElementById("sellSectionTitle").classList.add("hiddenElement");
				
				if(response.isOpen === true){
					if(buySec.className === "buyPage"){
						buySec.className = "hiddenElement";
						document.getElementById("aucPageDetails").className = "buy";
						document.getElementById("OpenAuctionMacroTable").className = "OpenAuctionMacroTable";
						document.getElementById("BuyPage_ClosedAuctions").className = "hiddenElement";
					} else if (sellSec.className === "sellPage") {
						sellSec.className = "hiddenElement";
						document.getElementById("aucPageDetails").className = "sell";
						document.getElementById("OpenAuctionMacroTable").className = "OpenAuctionMacroTable";
						document.getElementById("BuyPage_ClosedAuctions").className = "hiddenElement";
					}
					
				} else {
					
					if(buySec.className === "buyPage"){
						buySec.className = "hiddenElement";
						document.getElementById("aucPageDetails").className = "buy";
						document.getElementById("OpenAuctionMacroTable").className = "hiddenElement";
						document.getElementById("BuyPage_ClosedAuctions").className = "BuyPage_ClosedAuctions";
					} else if (sellSec.className === "sellPage") {
						sellSec.className = "hiddenElement";
						document.getElementById("aucPageDetails").className = "sell";
						document.getElementById("OpenAuctionMacroTable").className = "hiddenElement";
						document.getElementById("BuyPage_ClosedAuctions").className = "BuyPage_ClosedAuctions";
					}
				}
				//AGGIUNTA A COOKIE ASTA VISIONATA
				
				removeIdFromCookie(sessionStorage.getItem("userMail"), e.target.textContent);
				if ((e.target.closest("tr").id !== "rowWon_"+e.target.textContent) && (e.target.closest("tr").id !== "rowOwnClosed_"+e.target.textContent)){
					let oldCookie = getCookieValue(sessionStorage.getItem("userMail"));
					updateOldCookie(sessionStorage.getItem("userMail"), oldCookie + e.target.textContent + ",");
				}
				buildTableDetails(response);
				
			} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
				let errorMessage = response.responseText;
      			alert(errorMessage);
			}
			
		});
	});
	};