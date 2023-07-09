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
			console.log(e.target);
			//console.log(ids[i]);
		makeCall("GET", "GoToAuction?idAuction="+e.target.textContent,null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				var response = JSON.parse(response.responseText);
				
				let buySec = document.getElementById("buySection");
				let sellSec = document.getElementById("sellSection");
				
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
				var oldCookie = getCookieValue(sessionStorage.getItem("userMail"));
				updateOldCookie(sessionStorage.getItem("userMail"), oldCookie + e.target.textContent + ",");
				
				//document.getElementById("BuyPage_ClassicInitialPage").className = "hiddenElement";
				buildTableDetails(response);
			} else {
				//INSERIRE GLI ERRORI
			}
			
		});
	});
	};