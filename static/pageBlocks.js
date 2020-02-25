class VocabularyOfferDiv {
  constructor() {

  }
}

class GameConnectDiv {
  constructor() {
    this.V = V
    this.gameHeader = document.getElementById("gameConnectHeader")
    this.L1Container = document.getElementById("L1Container")
    this.L2Container = document.getElementById("L2Container")
    this.gameModeOrder = document.getElementById("gameConnectModeOrder")
    this.gameModeOrder.style.borderBottom = "2px solid gray";
    this.gameModeShuffel = document.getElementById("gameConnectModeShuffel")
    this.gameModeShuffel.style.borderBottom = "2px solid lightgray";
  }
  changeHeader(header) {
    this.gameHeader.innerHTML = header
  }

  setWords(wordsArray){
    this.L1Container.innerHTML = ""
    this.L2Container.innerHTML = ""

    let draggedItem = null;
    for(var i=0; i<wordsArray.length; i++) {
      var L1Word = document.createElement("div")
      var L2Word = document.createElement("div")

      L1Word.innerHTML = wordsArray[i][0]
      L2Word.innerHTML = wordsArray[i][1]

      L1Word.setAttribute('draggable', true)
      L2Word.setAttribute('draggable', true)

      this.L1Container.appendChild(L1Word);
      this.L2Container.appendChild(L2Word);
    }
    this.addDragFunctions()
  }

  addDragFunctions(){
    const divs = L2Container.querySelectorAll("div")
    let draggedItem = null;

    for(let i=0; i<divs.length; i++) {
      const item = divs[i];

      item.addEventListener("dragstart", function(){
        draggedItem = item;
        setTimeout(function(){
          item.style.visibility = "hidden"
        }, 0)
      })
      item.addEventListener("dragend", function(){
        setTimeout(function(){
          item.style.visibility = "visible"
          draggedItem = null
        }, 0)
      })

      item.addEventListener("dragover", function(e){
        e.preventDefault()
      })

      item.addEventListener("dragenter", function(e){
        this.style.color = "black";
        this.style.backgroundColor = "#83ccf0";
        e.preventDefault()
      });

      item.addEventListener("dragleave", function(e){
        this.style.color = "white";
        this.style.backgroundColor = "#0078b5"
        // e.preventDefault()
      });

      item.addEventListener("drop", function(e){
        this.style.color = "white";
        this.style.backgroundColor = "#0078b5"

        var c = document.createElement("div");
        item.parentNode.insertBefore(c, item);
        draggedItem.parentNode.insertBefore(item, draggedItem);
        c.parentNode.insertBefore(draggedItem, c);
        c.parentNode.removeChild(c);
      });
    }
  }

  giveWordsFromDivs(){
    var words = []
    let L1Words = this.L1Container.childNodes;
    let L2Words = this.L2Container.childNodes;
    for(let i=0; i<L1Words.length; i++) {
      words.push([L1Words[i].innerHTML, L2Words[i].innerHTML, L1Words[i], L2Words[i]])
    }
    return words
  }
}

class GameWriteDiv {
  constructor(V) {
    this.V = V
    this.gameHeader = document.getElementById("gameWriteHeader")
    this.gameHeader2 = document.getElementById("gameWriteHeader2")
    this.gameModeOrder = document.getElementById("gameWriteModeOrder")
    this.gameModeOrder.style.borderBottom = "2px solid gray";
    this.gameModeShuffel = document.getElementById("gameWriteModeShuffel")
    this.gameModeShuffel.style.borderBottom = "2px solid lightgray";
    this.wordsLeftBar = new GameBarDiv("wordsLeftBar", "wordsLeft", "wordsDone")
    this.inputGive = document.getElementById("Input_Give")
    this.inputGet = document.getElementById("Input_Get")
    this.checkWordBTN = document.getElementById("checkWordBTN")
    this.feedback = document.getElementById("feedBack")
    this.restartBTN = document.getElementById("restartBTN")
    this.gameScore = new GameBarDiv("gameScore", "wordsCorrect", "wordsMissed")
  }

  initializeBar(bar, leftValue, rightValue) {
    bar.initValues(leftValue, rightValue)
  }

  changeHeader(header) {
    this.gameHeader.innerHTML = header
    this.gameHeader2.innerHTML = header
  }

  addToBar(bar, leftIncrement, rightIncrement) {
    bar.left = bar.left + leftIncrement;
    bar.right = bar.right + rightIncrement;
    bar.update();
  }

  // giveWord(string) manage switch of old word for new one
  giveWord(word){
    this.inputGive.value = word;
    this.inputGet.value = "";
    this.inputGet.select();
    this.inputGet.focus()
  }

  // getWord() read value user put as answer into element
  getWord(){
    return this.inputGet.value
  }

  showCorrectAnswer(language1, language2, isCorrect){
    var text = language1 + " - " + language2;
    this.feedback.innerHTML = text;

    if(!isCorrect) {
      this.feedback.style.color = "red";
    } else {
      this.feedback.style.color = "green";

    }
  }

}

class GameBarDiv {
  constructor(barID, leftID, rightID, percent) {
    this.left = 0;
    this.right = 0;
    this.percentLeft = 0;
    this.percentRight = 0;
    this.bar = document.getElementById(barID)
    this.leftEl = document.getElementById(leftID)
    this.rightEl = document.getElementById(rightID)
  }

  // initialize values when start, change words and restart
  initValues(leftValue, rightValue){
    this.left = leftValue;
    this.right = rightValue;
    this.update()
  }

  // calculate percent of left and right bar for width
  percent() {
    if(this.left == this.right) {
      this.percentLeft = 50
      this.percentRight = 50;
      return
    }
    if(this.left == 0) {
      this.percentLeft = 0;
      this.percentRight = 100;
      return
    } else if(this.right == 0) {
      this.percentLeft = 100;
      this.percentRight = 0;
      return
    }
    var sum = this.left + this.right;
    this.percentLeft = Math.round(this.left/sum*100)
    this.percentRight = 100-this.percentLeft;
  }

  // increment(true), increment(false)=decrement, left true, left false = right
  update() {
    this.percent()
    if(this.percentLeft<17) {
      this.percentLeft = 17;
      this.percentRight = 100-17;
    }
    if(this.percentRight < 17) {
      this.percentLeft = 100-17;
      this.percentRight = 17;

    }
    this.leftEl.innerHTML = this.left;
    this.rightEl.innerHTML = this.right;
    this.leftEl.style.width = (this.percentLeft).toString() + "%"
    this.rightEl.style.width = this.percentRight.toString() + "%"
  }

}

class listWordDiv {
  constructor() {
    this.wordsDone = document.getElementById("wordDoneBlock")
    this.wordsLeftBTN = document.getElementById("wordsLeftBTN")
    this.wordsLeft = document.getElementById("wordsLeftBlock")
  }

  init(wordsArray) {
    this.wordsDone.innerHTML = ""
    this.wordsLeft.innerHTML = ""
    for(var i=0; i<wordsArray.length; i++) {
      this.addToLeft(wordsArray[i][0], wordsArray[i][1])
    }
  }

  addToDone(wordL1, wordL2){
    var word = document.createElement("div");
    var worL1Div = document.createElement("div");
    var worL2Div = document.createElement("div");
    word.classList.add("wordDone");
    worL1Div.classList.add("wordDoneL1")
    worL2Div.classList.add("wordDoneL2")
    worL1Div.innerHTML = wordL1;
    worL2Div.innerHTML = wordL2;
    word.appendChild(worL1Div);
    word.appendChild(worL2Div);
    this.wordsDone.appendChild(word);
  }

  addToLeft(wordL1, wordL2) {
    var word = document.createElement("div");
    var worL1Div = document.createElement("div");
    var worL2Div = document.createElement("div");
    word.classList.add("wordLeft");
    worL1Div.classList.add("wordLeftL1")
    worL2Div.classList.add("wordLeftL2")
    word.id = wordL1;
    worL1Div.innerHTML = wordL1;
    worL2Div.innerHTML = wordL2;
    word.appendChild(worL1Div);
    word.appendChild(worL2Div);
    this.wordsLeft.appendChild(word);
  }

  removeFromLeft(id) {
    var el = document.getElementById(id)
    this.wordsLeft.removeChild(el);
  }

  wordDone(wordL1, wordL2) {
    this.removeFromLeft(wordL1)
    this.addToDone(wordL1, wordL2)
  }

  restart() {

  }
}
