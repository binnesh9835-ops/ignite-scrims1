let popupStack = [];

/* OPEN POPUP */
function openPopup(id){
  let popup = document.getElementById(id);
  if(popup){
    popup.style.display = "flex";
    popupStack.push(id);
  }
}

/* CLOSE POPUP */
function closePopup(id){
  let popup = document.getElementById(id);
  if(popup){
    popup.style.display = "none";
    popupStack = popupStack.filter(p => p !== id);
  }
}

/* GO BACK */
function goBack(){
  if(popupStack.length > 0){
    let last = popupStack.pop();
    document.getElementById(last).style.display = "none";
  }
}
