/**
 * 
 */

function createOpenAuctionTable(auctionInfoList) {
  
  //Cerca il corpo della tabella con i dati dell'asta
  let tbody = document.getElementById("id_auctionInfoListOpen_body");
  tbody.innerHTML = "";

  auctionInfoList.forEach(function(auctionInfo) {
    let row = document.createElement("tr");
    row.id = "rowOpen_"+ auctionInfo.idAuction;

    //ID Auction
    let idAuctionCell = document.createElement("td");
    idAuctionCell.id = "idOpenRow"+auctionInfo.idAuction;
    let linkId = document.createElement("a");
    linkId.className = "id";
    linkId.textContent = auctionInfo.idAuction;
    idAuctionCell.appendChild(linkId);
    row.appendChild(idAuctionCell);

    //Articles
    let articlesCell = document.createElement("td");
    let articlesList = document.createElement("ul");
    
    auctionInfo.articles.forEach(function(article) {
      let listItem = document.createElement("li");
      listItem.textContent = article.articleName;
      listItem.className = "notOver";
      let imageItem = document.createElement("img");
      imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article.image;
      imageItem.style.width = "30px";
  	  imageItem.style.height = "30px";
      listItem.appendChild(imageItem);
      articlesList.appendChild(listItem);
    });
    articlesCell.appendChild(articlesList);
    row.appendChild(articlesCell);
    
    //Max Bid Value
    let maxBidValueCell = document.createElement("td");
    maxBidValueCell.textContent = auctionInfo.maxBidValue;
    maxBidValueCell.id = "value_" + auctionInfo.idAuction;
    row.appendChild(maxBidValueCell);

    //Min Rise
    let minRiseCell = document.createElement("td");
    minRiseCell.textContent = auctionInfo.minRise;
    row.appendChild(minRiseCell);

    //Time Left
    let timeLeftCell = document.createElement("td");
    timeLeftCell.textContent = auctionInfo.timeLeftFormatted;
    row.appendChild(timeLeftCell);

    tbody.appendChild(row);
  });
};

function createWonAuctionTable(wonAuctionInfoList){

  // Trova l'elemento HTML in cui verrà generata la tabella
  let tableContainer = document.getElementById("id_auctionInfoListWon");

  // Crea l'intestazione della tabella
  let table = document.createElement("table");
  table.className = "tableWon";
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  let headers = ["ID Auction", "Articles", "Winning bid"];

  headers.forEach(function(headerText) {
    let header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Crea il corpo della tabella con i dati dell'asta
  let tbody = document.createElement("tbody");

  wonAuctionInfoList.forEach(function(auctionInfo) {
    let row = document.createElement("tr");
    row.id = "rowWon_" + auctionInfo.idAuction;

    // ID Auction
    let idAuctionCell = document.createElement("td");
    idAuctionCell.id = "idClosedRow"+auctionInfo.idAuction;
    let linkId1 = document.createElement("a");
    linkId1.className = "id";
    linkId1.textContent = auctionInfo.idAuction;
    idAuctionCell.appendChild(linkId1);
    row.appendChild(idAuctionCell);

    //Articles
    let articlesCell = document.createElement("td");
    let articlesList = document.createElement("ul");
    
    auctionInfo.articles.forEach(function(article) {
      let listItem = document.createElement("li");
      listItem.textContent = article.articleName;
      //listItem.id = article.image;
      listItem.className = article.image;
      //var imageItem = document.createElement("img");
      //imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article.image;
      //imageItem.style.width = "30px";
  	  //imageItem.style.height = "30px";
      //listItem.appendChild(imageItem);
      articlesList.appendChild(listItem);
    });
    articlesCell.appendChild(articlesList);
    row.appendChild(articlesCell);

    // Max Bid Value
    let maxBidValueCell = document.createElement("td");
    maxBidValueCell.textContent = auctionInfo.maxBidValue;
    row.appendChild(maxBidValueCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Aggiungi la tabella al container HTML
  tableContainer.appendChild(table);

};

// Funzione per mostrare l'immagine fluttuante sopra il cursore
function showFloatingImage(event, image) {
	
  // Crea l'elemento dell'immagine
  let floatingImage = document.createElement('img');
  floatingImage.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+image; // Sostituisci con il percorso corretto dell'immagine
  floatingImage.style.position = 'absolute';
  floatingImage.style.width = '100px'; // Imposta la larghezza desiderata per l'immagine

  // Posizione iniziale dell'immagine sopra il cursore
  floatingImage.style.left = (event.clientX + window.scrollX) + 'px';
  floatingImage.style.top = (event.clientY + window.scrollY) + 'px';

  // Aggiungi l'immagine al body del documento
  document.body.appendChild(floatingImage);

  // Aggiungi un listener per aggiornare la posizione dell'immagine in base al movimento del cursore
  document.addEventListener('mousemove', updateFloatingImagePosition);

  // Funzione per aggiornare la posizione dell'immagine in base al movimento del cursore
  function updateFloatingImagePosition(event) {
    floatingImage.style.left = (event.clientX + window.scrollX) + 'px';
    floatingImage.style.top = (event.clientY + window.scrollY) + 'px';
  }

  // Rimuovi l'immagine quando il cursore esce dall'elemento td
  event.target.addEventListener('mouseout', removeFloatingImage);

  // Funzione per rimuovere l'immagine fluttuante
  function removeFloatingImage() {
    document.removeEventListener('mousemove', updateFloatingImagePosition);
    event.target.removeEventListener('mouseout', removeFloatingImage);
    document.body.removeChild(floatingImage);
  }
};

// Aggiungi un listener a tutti gli elementi li con className = a li_image per attivare la visualizzazione dell'immagine fluttuante
let lis = document.getElementsByTagName("li");
for (let i = 0; i < lis.length; i++) {
				if(lis[i].className != "notOver"){
				  lis[i].addEventListener('mouseover', function(event) {
					  console.log(this.id);
				    showFloatingImage(event, this.id);
				  });
			  }
			}

//funzione per mostrare dettagli asta
const aucDetails = () => {
	let ids = document.getElementsByClassName("id");
	console.log(ids.length);
	for (let i = 0; i < ids.length; i++){
		console.log(ids[i].textContent);
		ids[i].addEventListener("click", (e) => {
			console.log(e.target);
			console.log(ids[i]);
		makeCall("GET", "GoToAuction?idAuction="+e.target.textContent,null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				document.getElementById("msgBid").textContent="";
				var response = JSON.parse(response.responseText);
				
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
				alert(response);
			}
			
		});
	});
	};
	};

function buildTableDetails(details){
	if (details.isOpen){
		//open auction
		let openAuctionBody = document.getElementById("id_auctionDetails_body");
		openAuctionBody.innerHTML="";
		let row = document.createElement("tr");
		
		//id
		let idCell = document.createElement("td");
		idCell.textContent = details.auction.idAuction;
		row.appendChild(idCell);
		
		//articles
		let articlesCell = document.createElement("td");
	    let articlesList = document.createElement("ul");
	    
	    details.articles.forEach(function(article) {
	      let listItem = document.createElement("li");
	      listItem.textContent = article.articleName;
	      listItem.className = "notOver";
	      let imageItem = document.createElement("img");
	      imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article.image;
	      imageItem.style.width = "30px";
	  	  imageItem.style.height = "30px";
	      listItem.appendChild(imageItem);
	      articlesList.appendChild(listItem);
	    });
	    articlesCell.appendChild(articlesList);
	    row.appendChild(articlesCell);
	    
	    //higest bidder
	    let highBidderCell = document.createElement("td");
	    if (details.maxBid === undefined){
	    	highBidderCell.textContent = "No bidders.";
	    	document.getElementById("id_empty_auctionDetailsBids").classList.remove("hiddenElement");
			document.getElementById("id_auctionDetailsBids").classList.add("hiddenElement");
	    } else {
			highBidderCell.textContent = details.maxBid.userMail;
			document.getElementById("id_empty_auctionDetailsBids").classList.add("hiddenElement");
			document.getElementById("id_auctionDetailsBids").classList.remove("hiddenElement");
		}
	    
	    row.appendChild(highBidderCell);
	    
	    //highest bid
	    let highBidCell = document.createElement("td");
	    if (details.maxBid === undefined){
	    	highBidCell.textContent = details.initialPrice;
	    } else {
			highBidCell.textContent = details.maxBid.bidValue;
		}
		highBidCell.id = "detailValue_" + details.auction.idAuction;
	    row.appendChild(highBidCell);
	    
	    //time left
	    let timeLeftCell = document.createElement("td");
	    timeLeftCell.textContent = details.timeLeftFormatted;
	    row.appendChild(timeLeftCell);
	    openAuctionBody.appendChild(row);
	    
	    if (!details.isNotExpired || details.owner){
			document.getElementById("bidform").className = "hiddenElement";
		}
		if (details.auction.userMail !== details.user.userMail){
			document.getElementById("closeform").className = "hiddenElement";
		}
		
		let bidHistoryBody = document.getElementById("id_auctionDetailsBids_body");
		bidHistoryBody.innerHTML = "";
		
		details.bids.forEach(function(bid){
			let bidRow = document.createElement("tr");
			
			//id Bid
			let idBidCell = document.createElement("td");
			idBidCell.textContent=bid.idBid;
			bidRow.appendChild(idBidCell);
			
			//user
			let bidUser = document.createElement("td");
			bidUser.textContent = bid.userMail;
			bidRow.appendChild(bidUser);
			
			//bid
			let bidCell = document.createElement("td");
			bidCell.textContent = bid.bidValue;
			bidRow.appendChild(bidCell);
			
			//date Time
			let dateTimeCell = document.createElement("td");
			dateTimeCell.textContent = bid.bidDateTime;
			bidRow.appendChild(dateTimeCell);
			
			bidHistoryBody.appendChild(bidRow);
			 
		});
		} else{
			
			let closedAuction_body = document.getElementById("id_closedAuctionInfo_body");
			closedAuction_body.innerHTML = "";
			let closedAuctionRow = document.createElement("tr");
			
			//articles
			if(details.articles.lenght > 0){
				let articlesCell = document.createElement("td");
			    let articlesList = document.createElement("ul");
			    
			    details.articles.forEach(function(article) {
			      let listItem = document.createElement("li");
			      listItem.textContent = article.articleName;
			      listItem.className = "notOver";
			      let imageItem = document.createElement("img");
			      imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article.image;
			      imageItem.style.width = "30px";
			  	  imageItem.style.height = "30px";
			      listItem.appendChild(imageItem);
			      articlesList.appendChild(listItem);
			    });
			    articlesCell.appendChild(articlesList);
			    closedAuctionRow.appendChild(articlesCell);
			
			} else {
				let noArt = document.createElement("td");
				noArt.textContent = "artcles reinserted";
				closedAuctionRow.appendChild(noArt);
			}
			
			//max bid
			let maxBidCell = document.createElement("td");
			maxBidCell.textContent = details.closedAuctionInfo[0];
			closedAuctionRow.appendChild(maxBidCell);
			
			//winner
			let winner = document.createElement("td");
			winner.textContent = details.closedAuctionInfo[1];
			closedAuctionRow.appendChild(winner);
			
			//address
			let address = document.createElement("td");
			address.textContent = details.closedAuctionInfo[2];
			closedAuctionRow.appendChild(address);
			
			closedAuction_body.appendChild(closedAuctionRow);
			
		}
};

const keyWordTable = () => {
	document.getElementById("searchButton").addEventListener("click", (e) => {
		e.preventDefault();
		let form = e.target.closest("form");
		let formData = new FormData(form);
		let keyword = formData.get("keyword");
		makeCall("GET", "GoToBuy?keyword="+keyword, null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				let response = JSON.parse(response.responseText);
			    let auctionInfoList = response.auctionInfoList;
			
			    // Utilizza i dati dell'oggetto JSON come desideri
			    if (auctionInfoList.length > 0){
				    createOpenAuctionTable(auctionInfoList);
				    main2();
			    }
			
			} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
				let errorMessage = response.responseText;
      			alert(errorMessage);
			}
		});
		
	});
};

