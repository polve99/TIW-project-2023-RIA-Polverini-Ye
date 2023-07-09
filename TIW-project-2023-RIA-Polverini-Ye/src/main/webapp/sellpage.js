/**
 * 
 */

 function createYourAuctionTable(yourAuctionInfoList){

  // Trova l'elemento HTML in cui verrà generata la tabella
  var tableContainer1 = document.getElementById("id_yourAuctionInfoListOpen_listContainer");

  // Crea l'intestazione della tabella
  var table1 = document.createElement("table");
  table1.className = "tableOwn";
  table1.id = "tableOwn_id";
  var thead1 = document.createElement("thead");
  var headerRow1 = document.createElement("tr");
  var headers1 = ["ID Auction", "Articles", "Max Bid", "Min Rise", "Time Left"];

  headers1.forEach(function(headerText1) {
    var header1 = document.createElement("th");
    header1.textContent = headerText1;
    headerRow1.appendChild(header1);
  });

  thead1.appendChild(headerRow1);
  table1.appendChild(thead1);

  // Crea il corpo della tabella con i dati dell'asta
  var tbody1 = document.createElement("tbody");
  tbody1.id="tbodyown_id";

  yourAuctionInfoList.forEach(function(auctionInfo1) {
    var row1 = document.createElement("tr");
    row1.id = "rowOwn_" + auctionInfo1.idAuction;

    // ID Auction
    let idAuctionCell1 = document.createElement("td");
    idAuctionCell1.id = "idOwnOpenRow"+auctionInfo1.idAuction;
    let linkId = document.createElement("a");
    linkId.className = "id";
    linkId.textContent = auctionInfo1.idAuction;
    idAuctionCell1.appendChild(linkId);
    row1.appendChild(idAuctionCell1);

    //Articles
    var articlesCell1 = document.createElement("td");
    var articlesList1 = document.createElement("ul");
    
    auctionInfo1.articles.forEach(function(article1) {
      var listItem1 = document.createElement("li");
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
    var maxBidValueCell1 = document.createElement("td");
    maxBidValueCell1.textContent = auctionInfo1.maxBidValue;
    row1.appendChild(maxBidValueCell1);
    
    //Min Rise
    var minRiseCell1 = document.createElement("td");
    minRiseCell1.textContent = auctionInfo1.minRise;
    row1.appendChild(minRiseCell1);
    
    //Time Left Formatted
    var timeLeftFormattedCell1 = document.createElement("td");
    timeLeftFormattedCell1.textContent = auctionInfo1.timeLeftFormatted;
    row1.appendChild(timeLeftFormattedCell1);

    tbody1.appendChild(row1);
  });

  table1.appendChild(tbody1);

  // Aggiungi la tabella al container HTML
  tableContainer1.appendChild(table1);

};

function createOwnWonAuctionTable(wonAuctionInfoList){

  // Trova l'elemento HTML in cui verrà generata la tabella
  var tableContainer = document.getElementById("id_yourClosedAuctionInfoListOpen_listContainer");

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
  let tbody = document.createElement("tbody");
  tbody.id = "tbodyOwnClosed_id";

  wonAuctionInfoList.forEach(function(auctionInfo) {
    var row = document.createElement("tr");
    row.id = "rowOwnClosed_" + auctionInfo.idAuction;

    // ID Auction
    var idAuctionCell = document.createElement("td");
    idAuctionCell.id = "idOwnOpenRow"+auctionInfo.idAuction;
    let linkId = document.createElement("a");
    linkId.className = "id";
    linkId.textContent = auctionInfo.idAuction;
    idAuctionCell.appendChild(linkId);
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
    console.log(auctionInfo.maxBidValue);
    row.appendChild(maxBidValueCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Aggiungi la tabella al container HTML
  tableContainer.appendChild(table);

};