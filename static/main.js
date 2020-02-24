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


var app = angular.module("vocabularyApp", ["ngAnimate"])

app.run(function($rootScope, $http, $window){

  $rootScope.mobile = $window.innerWidth < 800;
  $rootScope.availableVocabularyOFF = true;
  $rootScope.activeWordsListOFF = true;

  angular.element($window).bind('resize', function(){
    $rootScope.mobile = $window.innerWidth < 800;
    console.log($window.innerWidth, $rootScope.mobile)
    $rootScope.$apply()
  })


  $rootScope.getVocabulary = function(){
  }
  $rootScope.getWords = function(){
  }

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
  })
  // ________________________ ON BUTTON CLICK OR ENTER


})
