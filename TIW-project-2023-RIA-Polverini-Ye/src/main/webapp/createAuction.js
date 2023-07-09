/**
 * 
 */

 function createArticlePage(article){
	 let formContainer = document.getElementById("createAuction_section");
	 let titolo = document.createElement("h2");
	 titolo.textContent = "Form per la Creazione di un'Asta";
	 formContainer.appendChild(titolo);
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
	 labelDuration.textContent = "Inserisci la durata dell'asta (min 1, max 20)";
	 labelDuration.htmlFor = "duration";
	 labelMinRise.textContent = "Inserisci il rialzo minimo per la tua asta";
	 labelMinRise.htmlFor = "minRise";
	 labelArticle.textContent = "Seleziona l'articolo o gli articoli che vuoi inserire nella tua asta";
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
	 durationInput.max = 20;
	 durationInput.min = 1;
	 durationInput.required = true;
	 labelDuration.appendChild(durationInput);
	 
	 //input per il rialzo minimo
	 let minRiseInput = document.createElement("input");
	 minRiseInput.type = "number";
	 minRiseInput.name = "minRise";
	 minRiseInput.id = "minRise";
	 minRiseInput.step = 0.1;
	 minRiseInput.required = true;
	 labelMinRise.appendChild(minRiseInput);
	 
	 //input per la selezione degli articoli
	 
	 article.forEach(function(article1){
		 let articleInput = document.createElement("input");
		 articleInput.type = "checkbox";
		 articleInput.name = "articleToUpload";
		 articleInput.value = article1;
		 articleInput.id = "articleToUpload-"+article1;
		 //articleInput.required = false;
		 let p = document.createElement("p");
		 p.textContent = article1;
		 p.appendChild(articleInput);
		 let articleImage = document.createElement("img");
		 articleImage.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/" + article1;
	     articleImage.style.width = "50px";
	  	 articleImage.style.height = "50px";
	  	 p.appendChild(articleImage);
	  	 labelArticle.appendChild(p);
	  	 
	 });
	 let createAuctionButton = document.createElement("button");
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
		//resetInputFieldsAndMessages();
		if (form.checkValidity()) {
			makeCall("post", "CreateAuction", form, function(x) {
				
				let message;
				
				try {
				  message = JSON.parse(x.responseText);
				} catch (error) {
				  // Errore di parsing JSON
				  console.error("Errore di parsing JSON:", error);
				  return;
				}
				if (x.readyState == XMLHttpRequest.DONE) {
					switch(x.status) {
						case 200:
							var oldCookie = getCookieValue(sessionStorage.getItem("userMail"));
							updateOldCookie(sessionStorage.getItem("userMail"), oldCookie + "sell" + ",");
							appendNewRow(message);
							break;
						default:
			                //document.getElementById("loginErrorMessage").textContent = message;
			                //document.getElementById("articleName").className = "inputWithError";
			                //document.getElementById("articleDesc").className = "inputWithError";
			                //document.getElementById("articlePrice").className = "inputWithError";
			                //document.getElementById("articleImage").className = "inputWithError";
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

function appendNewRow(message){
	// Find the table body element
	let tableBody = document.getElementById("tbodyown_id");
	let tableBody1 = document.getElementById("id_auctionInfoListOpen_body");
	
	// Create a new table row
	let newRow = document.createElement("tr");
	let newRow1 = document.createElement("tr");
	
	
	
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
    linkId.className = "id";
    linkId.textContent = message.idAuction;;
    idAuctionCell1.appendChild(linkId1);
    newRow.appendChild(idAuctionCell1);
    newRow1.appendChild(idAuctionCell);
    
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
		 makeCall("POST", "MakeBid?bidValue="+formData.get("bidValue"), null, function(response){
			 if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				var response = JSON.parse(response.responseText);
			    appendBid(response);
			} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
				//mettere futuri errori
			}
		 });
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
	document.getElementById("closeAuctionButton").addEventListener("click", () => {
		makeCall("POST", "CloseAuction", null, function(response){
			if (response.readyState == XMLHttpRequest.DONE && response.status == 200){
				let message = JSON.parse(response.responseText);
			    removeRow(message);
			} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
				//mettere futuri errori
			}
		});
	});
}

function removeRow(message){
	document.getElementById("rowOpen_"+message.idAuction).remove();
	document.getElementById("rowOwn_"+message.idAuction).remove();
	
	if (document.getElementById("rowOpen_"+message.idAuction) !== undefined){
		document.getElementById("rowOpen_"+message.idAuction).remove();
	}
	
	removeIdFromCookie(sessionStorage.getItem("userMail"), message.idAuction);
}
 