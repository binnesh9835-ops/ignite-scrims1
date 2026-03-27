let popupStack = [];

function openPopup(id){
  let el = document.getElementById(id);
  if(el){
    el.style.display = "flex";
    popupStack.push(id);
  }
}

function closePopup(id){
  let el = document.getElementById(id);
  if(el){
    el.style.display = "none";
    popupStack = popupStack.filter(p => p !== id);
  }
}

function goBack(){
  if(popupStack.length > 0){
    let last = popupStack.pop();
    document.getElementById(last).style.display = "none";
  }
}
