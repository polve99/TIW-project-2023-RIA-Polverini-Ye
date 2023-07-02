/**
 * 
 */


function createOpenAuctionTable(auctionInfoList) {
  
  //Cerca il corpo della tabella con i dati dell'asta
  var tbody = document.getElementById("id_auctionInfoListOpen_body");

  auctionInfoList.forEach(function(auctionInfo) {
    var row = document.createElement("tr");

    //ID Auction
    var idAuctionCell = document.createElement("td");
    idAuctionCell.textContent = auctionInfo.idAuction;
    row.appendChild(idAuctionCell);

    //Articles
    var articlesCell = document.createElement("td");
    var articlesList = document.createElement("ul");
    
    auctionInfo.articles.forEach(function(article) {
      var listItem = document.createElement("li");
      listItem.textContent = article.articleName;
      listItem.className = "notOver";
      var imageItem = document.createElement("img");
      imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article.image;
      imageItem.style.width = "30px";
  	  imageItem.style.height = "30px";
      listItem.appendChild(imageItem);
      articlesList.appendChild(listItem);
    });
    articlesCell.appendChild(articlesList);
    row.appendChild(articlesCell);
    
    //Max Bid Value
    var maxBidValueCell = document.createElement("td");
    maxBidValueCell.textContent = auctionInfo.maxBidValue;
    row.appendChild(maxBidValueCell);

    //Min Rise
    var minRiseCell = document.createElement("td");
    minRiseCell.textContent = auctionInfo.minRise;
    row.appendChild(minRiseCell);

    //Time Left
    var timeLeftCell = document.createElement("td");
    timeLeftCell.textContent = auctionInfo.timeLeftFormatted;
    row.appendChild(timeLeftCell);

    tbody.appendChild(row);
  });
};



function createWonAuctionTable(wonAuctionInfoList){

  // Trova l'elemento HTML in cui verrà generata la tabella
  var tableContainer = document.getElementById("id_auctionInfoListWon");

  // Crea l'intestazione della tabella
  var table = document.createElement("table");
  table.className = "tableWon";
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  var headers = ["ID Auction", "Articles", "Winning bid"];

  headers.forEach(function(headerText) {
    var header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Crea il corpo della tabella con i dati dell'asta
  var tbody = document.createElement("tbody");

  wonAuctionInfoList.forEach(function(auctionInfo) {
    var row = document.createElement("tr");

    // ID Auction
    var idAuctionCell = document.createElement("td");
    idAuctionCell.textContent = auctionInfo.idAuction;
    row.appendChild(idAuctionCell);

    //Articles
    var articlesCell = document.createElement("td");
    var articlesList = document.createElement("ul");
    
    auctionInfo.articles.forEach(function(article) {
      var listItem = document.createElement("li");
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
    var maxBidValueCell = document.createElement("td");
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
	console.log("showFloatingImage called");
  // Crea l'elemento dell'immagine
  var floatingImage = document.createElement('img');
  floatingImage.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+image; // Sostituisci con il percorso corretto dell'immagine
  floatingImage.style.position = 'absolute';
  floatingImage.style.width = '100px'; // Imposta la larghezza desiderata per l'immagine
  // Puoi aggiungere ulteriori stili CSS all'elemento dell'immagine qui

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
var lis = document.getElementsByTagName("li");
for (var i = 0; i < lis.length; i++) {
				if(lis[i].className != "notOver"){
				  lis[i].addEventListener('mouseover', function(event) {
				    showFloatingImage(event, this.className);
				  });
			  }
			}



