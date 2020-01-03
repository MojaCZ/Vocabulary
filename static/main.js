var showHideEl = function(el, a, property){
  // just switch from show to hide
  if(a == -1) {
    if (el.style.display == "none"){
      el.style.display = property;
      return;
    } else {
      el.style.display = "none";
      return;
    }
  }

  // otherwise
  if(a == 1) {
    el.style.display="none";
  } else {
    el.style.display=property;
  }
  return;
}

window.onload = function(evt){
  V = new Vocabulary();
  G1 = new GameWrite(V);
  G2 = new GameConnect(V);

  document.getElementById("availableVocabulary").onclick = function(){
    G1.setWordsObject()
    G2.setWordsObject()
  }
  // .bind(this)

  var writeGameEl = document.getElementById("writeGame")
  var connectGameEl = document.getElementById("connectGame")
  showHideEl(writeGameEl, 0, "block");
  showHideEl(connectGameEl, 1, "block");

  document.getElementById("gameChangeBTN").onclick = function(){
    showHideEl(writeGameEl, -1, "block");
    showHideEl(connectGameEl, -1, "block");
  };

  document.getElementById("restartWriteBTN").onclick = function(){
    G1.restart()
  };
  document.getElementById("restartConnectBTN").onclick = function(){
    G2.restart()
  };

  // SHOW/HIDE WORDS LEFT________________________________________________________
  var wordsLeftBlock = document.getElementById("wordsLeftBlock")
  var wordsLeftBTN = document.getElementById("wordsLeftBTN")
  wordsLeftBTN.addEventListener("click", function(){
    showHideEl(wordsLeftBlock, -1, "block");
  });

  var wordsLeftL1 = document.getElementsByClassName("wordLeftL1")
  var wordsLeftL2 = document.getElementsByClassName("wordLeftL2")
  var wordsLeftL1BTN = document.getElementById("wordsLeftL1BTN")
  var wordsLeftL2BTN = document.getElementById("wordsLeftL2BTN")
  wordsLeftL1BTN.addEventListener("click", function(){
    for(var i=0; i<wordsLeftL1.length; i++) {
      showHideEl(wordsLeftL1[i], -1, "inline-block");
    }
  });
  wordsLeftL2BTN.addEventListener("click", function(){
    for(var i=0; i<wordsLeftL2.length; i++) {
      showHideEl(wordsLeftL2[i], -1, "inline-block");
    }
  });
  // ___________________________________________________________________________SHOW/HIDE WORDS LEFT


  // W = new Words(0, "ahoj", "L1", "L2");

  // FORM NEW WORDS
  // newVocabForm = document.getElementById("newVocabFormContainer");
  // newVocabForm.style.display = "none";
  // newVocabFormShowBTN = document.getElementById("newVocabFormShowBTN");
  // newVocabFormHideBTN = document.getElementById("newVocabFormHideBTN");
  // newVocabFormShowBTN.addEventListener("click", function(){
  //   showHideEl(newVocabForm, 0);
  // });
  // newVocabFormHideBTN.addEventListener("click", function(){
  //   showHideEl(newVocabForm, 1);
  // });

  // ON BUTTON CLICK OR ENTER
  document.getElementById('checkWordWriteBTN').addEventListener("click", function(){
    G1.showNextWord()
  });
  document.getElementById('checkWordConnectBTN').addEventListener("click", function(){
    G2.checkWords()
  });
  document.addEventListener('keyup',function(e){
    if (e.keyCode === 13) {
    G1.showNextWord()
  }
  // ________________________ ON BUTTON CLICK OR ENTER

});
}
