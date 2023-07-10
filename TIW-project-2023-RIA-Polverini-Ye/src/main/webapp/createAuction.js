/**
 * 
 */

 function createArticlePage(article){
	 let formContainer = document.getElementById("createAuction_section");
	 let titolo = document.createElement("h2");
	 titolo.textContent = "Form per la Creazione di un'Asta";
	 formContainer.appendChild(titolo);
	 let alert = document.createElement("div");
	 alert.className="alertMessage";
	 let alertMessage = document.createElement("p");
	 alertMessage.id = "auctionErrorMessage";
	 alert.appendChild(alertMessage);
	 formContainer.appendChild(alert);
	 let form = document.createElement("form");
	 form.action = "#";
	 form.method = "post";
	 form.id = "formCreateAuction";
	 formContainer.appendChild(form);
	 let fieldset = document.createElement("fieldset");
	 form.appendChild(fieldset);
	 let labelDuration = document.createElement("label");
	 let labelMinRise = document.createElement("label");
	 let labelArticle = document.createElement("label");
	 labelDuration.textContent = "Days before ending (min 1, max 20)";
	 labelDuration.htmlFor = "duration";
	 labelMinRise.textContent = "Minimun rise to offer";
	 labelMinRise.htmlFor = "minRise";
	 labelArticle.textContent = "Select the article or articles you want to add to the auction";
	 labelArticle.htmlFor = "articleToUpload";
	 labelArticle.id = "articleToUpload_id";
	 fieldset.appendChild(labelDuration);
	 fieldset.appendChild(labelMinRise);
	 fieldset.appendChild(labelArticle);
	 
	 //input per la durata
	 let durationInput = document.createElement("input");
	 durationInput.type = "number";
	 durationInput.name = "duration";
	 durationInput.id = "duration";
	 durationInput.step = 1;
	 //durationInput.max = 20;
	 //durationInput.min = 1;
	 durationInput.required = true;
	 labelDuration.appendChild(durationInput);
	 
	 //input per il rialzo minimo
	 let minRiseInput = document.createElement("input");
	 minRiseInput.type = "number";
	 minRiseInput.name = "minRise";
	 minRiseInput.id = "minRise";
	 minRiseInput.step = 0.1;
	 minRiseInput.required = true;
	 //minRiseInput.min = 0.1;
	 labelMinRise.appendChild(minRiseInput);
	 
	 //input per la selezione degli articoli
	 article.forEach(function(article1){
		 let articleInput = document.createElement("input");
		 articleInput.type = "checkbox";
		 articleInput.name = "articleToUpload";
		 articleInput.value = article1.image;
		 articleInput.id = "articleToUpload-"+article1.image;
		 let p = document.createElement("p");
		 p.textContent = article1.articleName;
		 p.appendChild(articleInput);
		 let articleImage = document.createElement("img");
		 articleImage.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/" + article1.image;
	     articleImage.style.width = "50px";
	  	 articleImage.style.height = "50px";
	  	 p.appendChild(articleImage);
	  	 labelArticle.appendChild(p);
	  	 
	 });
	 let createAuctionButton = document.createElement("button");
	 createAuctionButton.textContent = "Create auction";
  	 //createAuctionButton.type = "submit";
  	 createAuctionButton.id = "createAuctionButton";
  	 fieldset.appendChild(createAuctionButton);
 };
 
 const createAuctionPost = () => {
	document.getElementById("createAuctionButton").addEventListener('click', (e) => {
		let form = e.target.closest("form");
		console.log("prova per vedere se entra nella makecall");
		let formatData = new FormData(form);
		let images = formatData.get("articleToUpload");
		console.log(images);
		resetInputFieldsAndMessages();
		if (form.checkValidity() && checkCreateAuction(form)) {
			makeCall("post", "CreateAuction", form, function(x) {
				let message = JSON.parse(x.responseText);
				if (x.readyState == XMLHttpRequest.DONE) {
					switch(x.status) {
						case 200:
							removeIdFromCookie(sessionStorage.getItem("userMail"), "sell");
							var oldCookie = getCookieValue(sessionStorage.getItem("userMail"));
							updateOldCookie(sessionStorage.getItem("userMail"), oldCookie + "sell" + ",");
							appendNewRow(message);
							break;
						default:
			                document.getElementById("auctionErrorMessage").textContent=message;
			                break;
					}
				}
			});
		} else {
			form.reportValidity();
			form.reset();
		}
	});
};

 const checkCreateAuction = (auctionForm) => {
	let formData = new FormData(auctionForm);
	let duration = formData.get("duration");
	let minRise = formData.get("minRise");
	let articleToUpload = formData.get("articleToUpload");
	
	if(minRise<=0){
		document.getElementById("auctionErrorMessage").textContent = "the rise must be greater than zero";
		document.getElementById("minRise").className = "inputWithError";
		return false;
	} else if(minRise.length<=0){
		document.getElementById("auctionErrorMessage").textContent = "missing rise";
		document.getElementById("minRise").className = "inputWithError";
		return false;
	} else if(duration.length<=0){
		document.getElementById("auctionErrorMessage").textContent = "missing duration";
		document.getElementById("duration").className = "inputWithError";
		return false;
	} else if (duration < 1 || duration > 20) {
		document.getElementById("auctionErrorMessage").textContent = "the number inserted doesn't respect the range of possibilities proposed";
		document.getElementById("duration").className = "inputWithError";
		return false;
	} else if(articleToUpload===null){
		document.getElementById("auctionErrorMessage").textContent = "missing article";
		return false;
	} else {
		return true;
	}
};

function appendNewRow(message){
	// Find the table body element
	let tableBody = document.getElementById("tbodyown_id");
	let tableBody1 = document.getElementById("id_auctionInfoListOpen_body");
	
	// Create a new table row
	let newRow = document.createElement("tr");
	newRow.id = "rowOwn_" + message.idAuction;
	let newRow1 = document.createElement("tr");
	newRow1.id = "rowOpen_" + message.idAuction;
	
	
	
	// ID Auction
    let idAuctionCell1 = document.createElement("td");
    let idAuctionCell = document.createElement("td");
    idAuctionCell1.id = "idOpenRow"+message.idAuction;
    idAuctionCell.id = "idOwnOpenRow"+message.idAuction;
    let linkId = document.createElement("a");
    linkId.className = "id";
    linkId.textContent = message.idAuction;
    idAuctionCell.appendChild(linkId);
    let linkId1 = document.createElement("a");
    linkId1.className = "id";
    linkId1.textContent = message.idAuction;;
    idAuctionCell1.appendChild(linkId1);
    newRow.appendChild(idAuctionCell1);
    newRow1.appendChild(idAuctionCell);
    
    addListener(linkId);
    addListener(linkId1);
    
    //Articles
    let articlesCell1 = document.createElement("td");
    let articlesList1 = document.createElement("ul");
    
    let articlesCell = document.createElement("td");
    let articlesList = document.createElement("ul");
    
    message.Article.forEach(function(article1) {
	    let listItem1 = document.createElement("li");
	    let listItem = document.createElement("li");
	    listItem1.textContent = article1.articleName;
	    listItem1.className = article1.image;
	    listItem.textContent = article1.articleName;
        listItem.className = "notOver";
        var imageItem = document.createElement("img");
        imageItem.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/"+article1.image;
        imageItem.style.width = "30px";
    	imageItem.style.height = "30px";
        listItem.appendChild(imageItem);
        articlesList.appendChild(listItem);
	    
	    articlesList1.appendChild(listItem1);
	    
	    let idToRemove = "articleToUpload-" + article1.image;
		let removeArticleFromForm = document.getElementById(idToRemove);
		
		if (removeArticleFromForm) {
	    let parentElement = removeArticleFromForm.parentElement;
	
	    if (parentElement) {
	      while (parentElement.firstChild) {
	        parentElement.firstChild.remove();
	      }
	      parentElement.remove();
	    }
	
	    removeArticleFromForm.remove();
      } else {
	    console.log("Element not found");
	  } 
    });
    articlesCell1.appendChild(articlesList1);
    newRow.appendChild(articlesCell1);
    articlesCell.appendChild(articlesList);
    newRow1.appendChild(articlesCell);
    
    // Max Bid Value
    let maxBidValueCell1 = document.createElement("td");
    let maxBidValueCell = document.createElement("td");
    maxBidValueCell1.textContent = message.MaxBidValue;
    maxBidValueCell.textContent = message.MaxBidValue;
    newRow.appendChild(maxBidValueCell1);
    newRow1.appendChild(maxBidValueCell);
    
    //Min Rise
    let minRiseCell1 = document.createElement("td");
    minRiseCell1.textContent = message.MinRise;
    newRow.appendChild(minRiseCell1);
    let minRiseCell = document.createElement("td");
    minRiseCell.textContent = message.MinRise;
    newRow1.appendChild(minRiseCell);
    
    //Time Left Formatted
    let timeLeftFormattedCell1 = document.createElement("td");
    timeLeftFormattedCell1.textContent = message.TimeLeft;
    newRow.appendChild(timeLeftFormattedCell1);
    let timeLeftFormattedCell = document.createElement("td");
    timeLeftFormattedCell.textContent = message.TimeLeft;
    newRow1.appendChild(timeLeftFormattedCell);
	
	// Get the number of existing rows in the table
	let rowCount = tableBody.children.length;
	let rowCount1 = tableBody1.children.length;
	
	// Find the appropriate position for inserting the new row
	let insertIndex = -1;
	
	// Value formatted for time left of newRow
	let formattedNewRow = parseTimeValue(newRow.cells[4].textContent);
	let formattedNewRow1 = parseTimeValue(newRow1.cells[4].textContent);
	
	// append new line in own auctions table
	for (var i = 0; i < rowCount; i++) {
	  let currentRow = tableBody.children[i];
	  let nextRow = tableBody.children[i + 1];
	
	  if (nextRow) {
	    let currentTime = parseTimeValue(currentRow.cells[4].textContent);
	    let nextTime = parseTimeValue(nextRow.cells[4].textContent);
	
	    if (isTimeGreaterThan(formattedNewRow,currentTime) && isTimeGreaterThan(nextTime,formattedNewRow)) {
	      insertIndex = i + 1;
	      break;
	    }
	  }
	}
	
	// Insert the new row at the determined position
	if (insertIndex !== -1) {
	  tableBody.insertBefore(newRow, tableBody.children[insertIndex]);
	  //tableBody.inserRow
	} else {
	  // If the appropriate position is not found, append the new row at the end
	  tableBody.appendChild(newRow);
	}
	
	
	insertIndex = -1;
	// append new line in auctions table
	for (var i = 0; i < rowCount1; i++) {
	  let currentRow1 = tableBody1.children[i];
	  let nextRow1 = tableBody1.children[i + 1];
	
	  if (nextRow1) {
	    let currentTime1 = parseTimeValue(currentRow1.cells[4].textContent);
	    let nextTime1 = parseTimeValue(nextRow1.cells[4].textContent);
	
	    if (isTimeGreaterThan(formattedNewRow1,currentTime1) && isTimeGreaterThan(nextTime1,formattedNewRow1)) {
	      insertIndex = i + 1;
	      break;
	    }
	  }
	}
	
	// Insert the new row at the determined position
	if (insertIndex !== -1) {
	  tableBody1.insertBefore(newRow1, tableBody1.children[insertIndex]);
	  //tableBody.inserRow
	} else {
	  // If the appropriate position is not found, append the new row at the end
	  tableBody1.appendChild(newRow1);
	}
	
};



// Helper function to parse the time value into an object
function parseTimeValue(timeValue) {
  let regex = /(-?\d+) days, (-?\d+):(-?\d+):(-?\d+)/;
  let matches = timeValue.match(regex);

  if (matches) {
    return {
      days: parseInt(matches[1]),
      hours: parseInt(matches[2]),
      minutes: parseInt(matches[3]),
      seconds: parseInt(matches[4])
    };
  }

  return null;
};

// Helper function to compare two time values
function isTimeGreaterThan(timeA, timeB) {
  if (!timeA || !timeB) {
    return false;
  };

  if (timeA.days > timeB.days) {
    return true;
  } else if (timeA.days === timeB.days) {
    if (timeA.hours > timeB.hours) {
      return true;
    } else if (timeA.hours === timeB.hours) {
      if (timeA.minutes > timeB.minutes) {
        return true;
      } else if (timeA.minutes === timeB.minutes) {
        if (timeA.seconds >= timeB.seconds) {
          return true;
        }
      }
    }
  }

  return false;
};
 
 
 //funzione crea bid
 const createBid = () => {
	 document.getElementById("createBidButton").addEventListener("click", (e) => {
		 e.preventDefault();
		 let form = e.target.closest("form");
		 let formData = new FormData(form);
		 if(!isNaN(formData.get("bidValue")) && form.checkValidity()){
			 makeCall("POST", "MakeBid?bidValue="+formData.get("bidValue"), null, function(response){
				 if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
					var response = JSON.parse(response.responseText);
				    appendBid(response);
				} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
					let message = response.responseText;
	      			document.getElementById("msgBid").textContent(message);
				}
			 });
		 }else{
			 form.reportValidity();
			 form.reset();
		 }
		 
	 });
 };
 
 function appendBid(bid){
	 let bidHistoryBody = document.getElementById("id_auctionDetailsBids_body");
	 
	 let newRow = document.createElement("tr");
	 
	 //id Bid
  	 let idBidCell = document.createElement("td");
     idBidCell.textContent=bid.idBid;
 	 newRow.appendChild(idBidCell);
	
	 //user
	 let bidUser = document.createElement("td");
	 bidUser.textContent = bid.userMail;
	 newRow.appendChild(bidUser);
	
	 //bid
	 let bidCell = document.createElement("td");
	 bidCell.textContent = bid.bidValue;
	 newRow.appendChild(bidCell);
	
	 //date Time
	 let dateTimeCell = document.createElement("td");
	 dateTimeCell.textContent = bid.bidDateTime;
	 newRow.appendChild(dateTimeCell);
	 
	 bidHistoryBody.appendChild(newRow);


	 //AGGIORNO I VALORI DELLE MAX BID NELLE TABELLE
	 let idValueBid = "value_" + bid.idAuction;   
	 document.getElementById(idValueBid).textContent = bid.bidValue; 
	 document.getElementById("detailValue_"+bid.idAuction).textContent = bid.bidValue;	 
	 
 };
 
const closeAuction = () => {
	document.getElementById("closeAuctionButton").addEventListener("click", (e) => {
		e.preventDefault();
		makeCall("POST", "CloseAuction", null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				let message = JSON.parse(response.responseText);
			    removeRow(message);
			    //document.getElementById("closeMsg").textContent=message.closeMsg;
			    alert(message.closeMsg);
			} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
				let errorMessage = response.responseText;
      			//document.getElementById("closeMsg").textContent=errorMessage;
      			alert(errorMessage);
			}
		});
	});
}

function removeRow(message){
	document.getElementById("rowOpen_"+message.idAuction).remove();
	//document.getElementById("rowOwn_"+message.idAuction);
	//document.getElementById("tbodyown_id").removeChild(copyRow);
	document.getElementById("rowOwn_"+message.idAuction).remove();
	
	let cookieRow = document.getElementById("rowCookie_"+message.idAuction);
	if (cookieRow !== null){
		cookieRow.remove();
	}
	
	removeIdFromCookie(sessionStorage.getItem("userMail"), message.idAuction);
	
	let bodyOwnClosed = document.getElementById("tbodyOwnClosed_id");
	
    var row = document.createElement("tr");
    row.id = "rowOwnClosed_" + message.idAuction;

    // ID Auction
    var idAuctionCell = document.createElement("td");
    idAuctionCell.id = "idOwnOpenRow"+message.idAuction;
    let linkId = document.createElement("a");
    linkId.className = "id";
    linkId.textContent = message.idAuction;
    idAuctionCell.appendChild(linkId);
    row.appendChild(idAuctionCell);

    //Articles
    var articlesCell = document.createElement("td");
    var articlesList = document.createElement("ul");
    
    message.articles.forEach(function(article) {
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
    maxBidValueCell.textContent = message.bidValue;
    //console.log(message.maxBidValue);
    row.appendChild(maxBidValueCell);

    bodyOwnClosed.appendChild(row);
    
    let buyP = document.getElementById("buySection");
    let sellP = document.getElementById("sellSection");
    let aucD = document.getElementById("aucPageDetails");
    
    if (aucD.className === "buy") {
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
    
    addListener(linkId);
    message.articles.forEach(function(article){
	    let imageToUploadContainer = document.getElementById("articleToUpload_id");
		let articleInput = document.createElement("input");
	    articleInput.type = "checkbox";
	    articleInput.value = article.image;
	    articleInput.name = "articleToUpload";
	    articleInput.id = "articleToUpload-"+article.image;
	    articleInput.required = true;
	    let p = document.createElement("p");
	    p.textContent = article.articleName;
	    p.appendChild(articleInput);
	    let articleImage = document.createElement("img");
	    articleImage.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/" + article.image;
	    articleImage.style.width = "50px";
	    articleImage.style.height = "50px";
	    p.appendChild(articleImage);
	    imageToUploadContainer.appendChild(p);
    });
	
}
 
 const resetInputFieldsAndMessages = () => {
	var previousErrorFields = document.getElementsByClassName("inputWithError");
	var elementsLength = previousErrorFields.length;
	for (var i = 0; i < elementsLength; i++) {
		previousErrorFields[0].className = "";
	}
	document.getElementById("auctionErrorMessage").innerHTML = "";
};