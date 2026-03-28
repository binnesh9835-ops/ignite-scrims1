let popupStack = [];

function openPopup(id){
  let popup = document.getElementById(id);
  if(!popup) return;

  popup.style.display = "flex";
  popupStack.push(id);
}

function closePopup(id){
  let popup = document.getElementById(id);
  if(!popup) return;

  popup.style.display = "none";

  // stack se bhi hatao
  popupStack = popupStack.filter(p => p !== id);
}

function goBack(){
  if(popupStack.length > 0){
    let current = popupStack.pop();
    let currentPopup = document.getElementById(current);
    if(currentPopup) currentPopup.style.display = "none";
  }

  // previous popup open ho jayega automatically (kyunki wo already open tha)
}
