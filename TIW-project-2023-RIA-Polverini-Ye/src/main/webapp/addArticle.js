/**
 * 
 */

 function addArticlePage(){
	 let formContainer = document.getElementById("addArticle_section");
	 let titolo = document.createElement("h2");
	 titolo.textContent = "Form to Add an Article";
	 formContainer.appendChild(titolo);
	 let alert = document.createElement("div");
	 alert.className="alertMessage";
	 let alertMessage = document.createElement("p");
	 alertMessage.id = "articleErrorMessage";
	 alert.appendChild(alertMessage);
	 formContainer.appendChild(alert);
	 let form = document.createElement("form");
	 form.action = "#";
	 form.method = "post";
	 form.id = "formaAddArticle";
	 formContainer.appendChild(form);
	 let fieldset = document.createElement("fieldset");
	 form.appendChild(fieldset);
	 let labelName = document.createElement("label");
	 let labelDesc = document.createElement("label");
	 let labelPrice = document.createElement("label");
	 let labelImage = document.createElement("label");
	 labelName.htmlFor = "articleName";
	 labelName.textContent = "Article name:";
	 labelDesc.htmlFor = "articleDesc";
	 labelDesc.textContent = "Description";
	 labelPrice.htmlFor = "articlePrice";
	 labelPrice.textContent = "Price";
	 labelImage.htmlFor = "articleImage";
	 labelImage.textContent = "Image";
	 fieldset.appendChild(labelName);
	 fieldset.appendChild(labelDesc);
	 fieldset.appendChild(labelPrice);
	 fieldset.appendChild(labelImage);
	 
	 //input nome articolo
	 let inputName = document.createElement("input");
	 inputName.type = "text";
	 //inputName.className = "articleName";
	 inputName.name = "articleName";
	 inputName.id = "articleName";
	 //inputName.maxLength = 20;
	 inputName.required = true;
	 labelName.appendChild(inputName);
	 
	 //input descrizione articolo
	 let inputDesc = document.createElement("input");
	 inputDesc.type = "text";
	 //inputDesc.className = "articleDesc";
	 inputDesc.name = "articleDesc";
	 inputDesc.id = "articleDesc";
	 //inputDesc.maxLength = 255;
	 labelDesc.appendChild(inputDesc);
	 
	 //input prezzo articolo
	 let inputPrice = document.createElement("input");
	 inputPrice.type = "number";
	 //inputPrice.className = "articlePrice";
	 inputPrice.name = "articlePrice";
	 inputPrice.id = "articlePrice";
	 inputPrice.step = 1;
	 //inputPrice.min = 0;
	 inputPrice.required = true;
	 labelPrice.appendChild(inputPrice);
	 
	 //input immagine articolo
	 let inputImage = document.createElement("input");
	 inputImage.type = "file";
	 //inputImage.className = "articleImage";
	 inputImage.id = "articleImage";
	 inputImage.name = "articleImage";
	 inputImage.accept = ".jpeg, .jpg, .png";
	 inputImage.required = true;
	 labelImage.appendChild(inputImage);
	 
	 let p = document.createElement("p");
	 fieldset.appendChild(p);
	 
	 //bottone di submit
	 let addArticleButton = document.createElement("button");
	 addArticleButton.textContent = "Add article";
	 //addArticleButton.type = "submit";
	 addArticleButton.value = "addArticleButton";
	 addArticleButton.id = "addArticleButton";
	 p.appendChild(addArticleButton);
	 
 };
 
 const addArticlePost = () => {
	document.getElementById("addArticleButton").addEventListener('click', (e) => {
		let form = e.target.closest("form");
		resetInputFieldsAndMessages();
		if (form.checkValidity() && checkAddArticle(form)) {
			makeCall("post", "AddArticle", form, function(x) {
				let message = JSON.parse(x.responseText);
				if (x.readyState == XMLHttpRequest.DONE) {
					switch(x.status) {
						case 200:
							let imageToUploadContainer = document.getElementById("articleToUpload_id");
							let articleInput = document.createElement("input");
						    articleInput.type = "checkbox";
						    articleInput.value =message.image;
						    articleInput.name = "articleToUpload";
						    articleInput.id = "articleToUpload-"+message.image;
						    articleInput.required = true;
						    let p = document.createElement("p");
						    p.textContent = message.articleName;
						    p.appendChild(articleInput);
						    let articleImage = document.createElement("img");
						    articleImage.src = "http://localhost:8080/TIW-project-2023-RIA-Polverini-Ye/images/" + message.image;
					        articleImage.style.width = "50px";
					   	    articleImage.style.height = "50px";
					  	    p.appendChild(articleImage);
					  	    imageToUploadContainer.appendChild(p);
							break;
						default:
     						document.getElementById("articleErrorMessage").textContent=message;
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

  const checkAddArticle = (articleForm) => {
	let formData = new FormData(articleForm);
	let articleName = formData.get("articleName");
	let articleDesc = formData.get("articleDesc");
	let articlePrice = formData.get("articlePrice");
	let articleImage = formData.get("articleImage");
	
	if(articlePrice<0){
		document.getElementById("articleErrorMessage").textContent = "the price must be greater or equal zero";
		document.getElementById("articlePrice").className = "inputWithError";
		return false;
	} else if(articlePrice===null){
		document.getElementById("articleErrorMessage").textContent = "missing article price";
		document.getElementById("articlePrice").className = "inputWithError";
		return false;
	} else if(articleName===null || articleName.length<1 ||articleName.length>20){
		document.getElementById("articleErrorMessage").textContent = "Article name must be at least 1 and max 20";
		document.getElementById("articleName").className = "inputWithError";
		return false;
	} else if (articleDesc!=null && articleDesc.length>255) {
		document.getElementById("articleErrorMessage").textContent = "Article description must be at max 255";
		document.getElementById("articleDesc").className = "inputWithError";
		return false;
	} else if(articleImage===null){
		document.getElementById("articleErrorMessage").textContent = "missing article";
		return false;
	} else {
		return true;
	}
};
 