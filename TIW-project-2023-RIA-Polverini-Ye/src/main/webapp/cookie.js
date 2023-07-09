/**
 * 
 */

//TODO: ancora da adattare alla specifica!! e controllare


function createNewCookie(username, asta_id) {
	//per evitare problemi di formattazione
	const d = new Date();
	d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();

	document.cookie = username.replace(/(\r\n|\n|\r)/gm, "") + "=" + asta_id + ";" + expires + ";" + "path=/ ; Secure";
}

function getCookieValue(username) {
	//cerca acquisto o vendita dato un predefinito id;
	var username = username.replace(/(\r\n|\n|\r)/gm, "") + "=";
	var ca = document.cookie.split(';');


	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(username) == 0) {
			return c.substring(username.length, c.length);
		}
	}
	return "";
}

function updateOldCookie(username, lastAction) {
	const d = new Date();
	d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	//provo a creare la lista) mi faccio passare una lista e la formatto in cookie
	document.cookie = username.replace(/(\r\n|\n|\r)/gm, "") + "=" + lastAction + ";" + expires + "; path=/ ; Secure";
}

function cookieExistence(username) {
	if (document.cookie.split(';').some((item) => item.trim().startsWith(username.replace(/(\r\n|\n|\r)/gm, "")))) {
		return true;
	}
	return false;
}

//carica gli id delle aste
function getIdFromCookieSet(username) {
	var cookieRecipe = getCookieValue(username);
	cookieComponents = cookieRecipe.split(',');
	const aste_set = new Set();

	for (const asta of cookieComponents) {
		if(!aste_set.has(asta) && asta !== "sell"){
			aste_set.add(asta);
		}
	}
	var lista_asteId = Array.from(aste_set).join(',');
	lista_asteId.replace("%", ","); //levare
	
	
	return lista_asteId.substring(0,lista_asteId.length - 1);

}

function removeIdFromCookie(username, idToRemove) {
  let cookieValue = getCookieValue(username);
  let cookieComponents = cookieValue.split(',');

  // Crea un nuovo array filtrando gli ID da rimuovere
  let newComponents = cookieComponents.filter(function(id) {
    return id !== idToRemove && id !== 'sell';
  });

  // Crea la nuova stringa di ID separati da virgole
  let newCookieValue = newComponents.join(',');

  // Aggiorna il cookie con i nuovi ID
  updateOldCookie(username, newCookieValue);
}

function returnLastValueCookie(username) {
	//ritorna l'ultima istanza del campo value di un determinato cookie
	var rawCookies = getCookieValue(username);
	var rawSplitCookies = rawCookies.split(',');

	var arrayCookie = Array.from(rawSplitCookies);

	//getta l'ultimo elemento

	var lastNotEmptyValue = arrayCookie[arrayCookie.length - 2];

	return lastNotEmptyValue;
}

function getCookiesAuctions(username){
	let cookieAuctionsId = getIdFromCookieSet(username);
	makeCall("GET", "CookieController?listAsteId="+cookieAuctionsId, null, function(response){
		if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
			let message = JSON.parse(response.responseText);
			console.log(message);
			createCookieAuctionTable(message);
		} else {
			//ERRORI ECCEZIONI DB
		}
	});
};


function createCookieAuctionTable(yourAuctionInfoList){

  // Trova l'elemento HTML in cui verrà generata la tabella
  let tableContainer1 = document.getElementById("cookieTable");

  // Crea l'intestazione della tabella
  let table1 = document.createElement("table");
  table1.className = "tableCookie";
  table1.id = "tableCookie_id";
  let thead1 = document.createElement("thead");
  let headerRow1 = document.createElement("tr");
  let headers1 = ["ID Auction", "Articles", "Max Bid", "Min Rise", "Time Left"];

  headers1.forEach(function(headerText1) {
    let header1 = document.createElement("th");
    header1.textContent = headerText1;
    headerRow1.appendChild(header1);
  });

  thead1.appendChild(headerRow1);
  table1.appendChild(thead1);

  // Crea il corpo della tabella con i dati dell'asta
  let tbody1 = document.createElement("tbody");
  tbody1.id="tbodyCookie_id";

  yourAuctionInfoList.forEach(function(auctionInfo1) {
    let row1 = document.createElement("tr");
    row1.id = "rowCookie_" + auctionInfo1.idAuction;

    // ID Auction
    let idAuctionCell1 = document.createElement("td");
    idAuctionCell1.textContent = auctionInfo1.idAuction;
    row1.appendChild(idAuctionCell1);

    //Articles
    let articlesCell1 = document.createElement("td");
    let articlesList1 = document.createElement("ul");
    
    auctionInfo1.articles.forEach(function(article1) {
      let listItem1 = document.createElement("li");
      listItem1.textContent = article1.articleName;
      //listItem1.id = article1.image;
      listItem1.className = article1.image;
      //var imageItem = document.createElement("img");
      //imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article.image;
      //imageItem.style.width = "30px";
  	  //imageItem.style.height = "30px";
      //listItem.appendChild(imageItem);
      articlesList1.appendChild(listItem1);
    });
    articlesCell1.appendChild(articlesList1);
    row1.appendChild(articlesCell1);

    // Max Bid Value
    let maxBidValueCell1 = document.createElement("td");
    maxBidValueCell1.textContent = auctionInfo1.maxBidValue;
    row1.appendChild(maxBidValueCell1);
    
    //Min Rise
    let minRiseCell1 = document.createElement("td");
    minRiseCell1.textContent = auctionInfo1.minRise;
    row1.appendChild(minRiseCell1);
    
    //Time Left Formatted
    let timeLeftFormattedCell1 = document.createElement("td");
    timeLeftFormattedCell1.textContent = auctionInfo1.timeLeftFormatted;
    row1.appendChild(timeLeftFormattedCell1);

    tbody1.appendChild(row1);
  });

  table1.appendChild(tbody1);

  // Aggiungi la tabella al container HTML
  tableContainer1.appendChild(table1);

};

/**
 * 
 */