var blickFunction = function(arrayDivs, on) {
  var colorL1;
  var colorL2;
  if(on) {
    colorL1 = "green"
    colorL2 = "green"
  } else {
    colorL1 = "#3267d6"
    colorL2 = "#0078b5"
  }
  for(var i=0; i<arrayDivs.length; i++){
    arrayDivs[i][0].style.backgroundColor = colorL1
    arrayDivs[i][1].style.backgroundColor = colorL2
  }

}

// getXML load xml file from server
// id is number of file ("00001") give as string withoud .xml extension
var getXML = function(file){
  // load xml file
  if (window.XMLHttpRequest) {
     xhttp = new XMLHttpRequest();
  } else {    // IE 5/6
     xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  url = file + ".xml";
  xhttp.open("GET", url, false);
  xhttp.send(null);
  xmlDoc = xhttp.responseXML;
  return xmlDoc;
};

// Vocabulary is class holding Words onjects in array and manipulating with these objects
class Vocabulary {
  constructor(){
    this.nFiles = 0
    this.availableFiles = []
    this.currentWords = new Words("001");  // initialize with first file
    this.dictionary = {"001": this.currentWords}   // already loaded files stored in key:value objects (at start put 00001)
    this.wordFiles = document.getElementById("availableVocabularyUL") // div into which buttons pointing to files with wordl will be displayed
    this.getFiles()
    this.displayFiles()
  }

  // get XML from server, read it and store available files into this.availableFiles[]
  getFiles(){
    this.availableFiles = []
    this.nFiles = 0
    var XML = getXML("/Vocabulary/availableDictionary/")
    console.log(XML);
    while(1){
      var id = XML.getElementsByTagName("id")[this.nFiles]
      var name = XML.getElementsByTagName("name")[this.nFiles]
      if(id === undefined){
        break;
      }
      this.availableFiles.push([id.textContent, name.textContent])
      this.nFiles++;
    }
  }

  // displayFiles will display buttons with availableFiles
  displayFiles(){
    for(var i=0; i<this.nFiles; i++){
      var fileBTN = document.createElement("li")
      fileBTN.className = "vocabulary"
      fileBTN.innerHTML = this.availableFiles[i][0];

      // create function, bind this and i and pass it to eventListener "click" to buttons
      function setWords(ii) {
        this.addWords(this.availableFiles[ii][1]);
      }
      fileBTN.onclick = setWords.bind(this, i);
      // _________
      this.wordFiles.appendChild(fileBTN);
    }
  }

  // addWords will get fileID (name of file with words)
  // if this file is already loaded from server, it just set the current words
  // if file is not loaded yet, it will load it from server, create new object of Words class, add this object into dictionary array and set current words
  addWords(ID){
    if (ID in this.dictionary) {
      this.currentWords = this.dictionary[ID]
    }else{
      this.currentWords = new Words(ID);
      this.dictionary[ID] = this.currentWords
    }
  }

}

// Words class is class to load store and manipulate words from xml files
// fileNumber takes "xxxxx" string that stands for fileName, fileNumber=0 will create new words
class Words {
  constructor(fileNumber, name="", language1="", language2="") {
    if(fileNumber == 0){
      this.name=name;
      this.language1=language1;
      this.language2=language2;
      this.newWords();
      return
    }
    this.XML = getXML("/Vocabulary/dictionary/"+fileNumber);
    this.nWords = 0;
    this.wordsArray = [];
    this.loadWords();
    return
  };

  // loadWords take XML and explode it to
  loadWords() {
    this.name = this.XML.getElementsByTagName("name")[0].textContent
    this.language1 = this.XML.getElementsByTagName("language1")[0].textContent
    this.language2 = this.XML.getElementsByTagName("language2")[0].textContent
    this.wordsArray = [];

    var n = 0;
    var word = [];
    while(1){
      if(this.XML.getElementsByTagName("word")[n] === undefined){
        break;
      }
      word = [this.XML.getElementsByTagName("word")[n].childNodes[0].textContent, this.XML.getElementsByTagName("word")[n].childNodes[1].textContent];
      this.wordsArray.push(word);
      n++;
    }
    this.nWords = n;
  }

  // Initialize new words, create XML, set is as this.XML
  newWords() {
    var xmlString = "<?xml version='1.0' encoding='UTF-8'?>\n<vocabulary>\n";
    xmlString = xmlString + "\t<name>" + this.name + "</name>\n";
    xmlString = xmlString + "\t<languages>\n\t\t<language1>" + this.language1 + "</language1>\n\t\t<language2>" + this.language2 + "</language2>\n\t</languages>";
    xmlString = xmlString + "\t<words>\n\t</words>\n</vocabulary>"

    var parser = new DOMParser();
    this.XML = parser.parseFromString(xmlString, "text/xml")
    this.sendChanges()
  }

  addWord() {
    console.log("HI");
  }

  removeWord() {
    console.log("HI");
  }

  changeWord() {
    console.log("HI");
  }

  // snedChanges() will send POST request to server with XML containing words to be stored as a new file
  // the XML is sent as a variable in body wordsXML = "..."
  sendChanges() {
    if (window.XMLHttpRequest) {
       xhttp = new XMLHttpRequest();
    } else {    // IE 5/6
       xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("POST","", true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(this.XML);
    xhttp.send("wordsXML=" + sXML);

  }

}

class GameConnect {
  constructor(V){
    this.V = V
    this.GameDiv = new GameConnectDiv(V)
    this.listWordDiv = new listWordDiv()
    this.wordsArray = []
    this.mixedWordsArray = []
    // this.nWords = this.V.currentWords.nWords;
    this.setWordsObject();
  }

  setWordsObject(){
    this.GameDiv.changeHeader(this.V.currentWords.name)
    this.wordsArray = []
    for(let i=0; i<this.V.currentWords.wordsArray.length; i++) {
      this.wordsArray[i] = this.V.currentWords.wordsArray[i].slice();
    }
    this.reorder(this.wordsArray)
    // display
    this.GameDiv.setWords(this.mixedWordsArray);
  }

  setCheckedWords(){
    this.reorder(this.wordsArray)
    this.GameDiv.setWords(this.mixedWordsArray);
  }

  reorder(array){
    var A = []
    for(let i=0; i<array.length; i++) {
      A[i] = array[i].slice();
    }
    var nWords = A.length
    for(var i=0; i<nWords; i++) {

      var rand1 = (Math.floor(Math.random()*nWords)+i)%nWords
      var rand2 = (Math.floor(Math.random()*nWords)+i)%nWords

      var c1 = A[i][0]
      var c2 = A[i][1]

      A[i][0] = A[rand1][0]
      A[i][1] = A[rand2][1]

      A[rand1][0] = c1
      A[rand2][1] = c2
    }
    this.mixedWordsArray = A
  }

  checkWords(){
    var connectedWords = this.GameDiv.giveWordsFromDivs()
    var correctDivs = []
    for(let i=0; i<connectedWords.length; i++) {    // loop through words user had to connect
      for(let j=0; j<this.wordsArray.length; j++){  // loop through current words set containing corrct matches
        if(this.wordsArray[j][0]==connectedWords[i][0]){  // find words corresponding in same language L1 L1
          if(this.wordsArray[j][1] == connectedWords[i][1]) { // check if user connected correct word to its oposite in second language L2 L2
            this.wordsArray.splice(j, 1)
            correctDivs.push([connectedWords[i][2], connectedWords[i][3]])
          } // if L2
          break;
        } //if L1
      } //j
    } //i
    if(this.wordsArray.length == 0) {
      this.restart()
      return
    }
    console.log(correctDivs);
    var that = this

    blickFunction(correctDivs, true)
    setTimeout(function(){
      blickFunction(correctDivs, false)
    }, 400)
    setTimeout(function(){
      blickFunction(correctDivs, true)
    }, 800)
    setTimeout(function(){
      blickFunction(correctDivs, false)
    }, 1200)
    setTimeout(function(){
      blickFunction(correctDivs, true)
    }, 1600)
    setTimeout(function(){
      that.setCheckedWords()
    }, 2000)

  } // checkWords

  restart(){
    var r = confirm("WINNER WINNER CHICKEN DINNER\ndo you wish to restart game?");
    if (r == true) {
      this.setWordsObject();
    } else {
      alert("HMMM, THAN ALL IS DONE AND YOU CAN LEAVE")
    }
    this.setWordsObject()
  }
}

class GameWrite {
  constructor(V) {
    this.V = V
    this.GameDiv = new GameWriteDiv(V)
    this.listWordDiv = new listWordDiv()
    this.order = [];
    this.wordsArray = [];
    this.language = 0;
    this.currentPosition = 0;
    this.nWords = 0;
    this.onWrongMoveTo = 3;
    this.penalty = 2;   // add penalty when user gets the word wrong

    this.setWordsObject();
    this.makeOrder(0)

  }

  // there is need to make a deep coppy of objects
  setWordsObject(){
    this.wordsArray = []
    for(let i=0; i<this.V.currentWords.wordsArray.length; i++) {
      this.wordsArray[i] = this.V.currentWords.wordsArray[i].slice();
    }
    this.addCounter()
    this.nWords = this.V.currentWords.nWords;

    // display
    this.GameDiv.changeHeader(this.V.currentWords.name)
    this.GameDiv.giveWord(this.wordsArray[0][this.language]);

    // percentage bars initialize
    this.GameDiv.initializeBar(this.GameDiv.wordsLeftBar, 0, this.nWords);
    this.GameDiv.initializeBar(this.GameDiv.gameScore, 0, 0);

    this.listWordDiv.init(this.wordsArray)
  }

  addCounter(){
    if(this.wordsArray[0].length = 3) {
      for(var i=0; i<this.wordsArray.length; i++) {
        this.wordsArray[i][2] = 0
      }
    } else {
      for(var i=0; i<this.wordsArray.length; i++) {
        this.wordsArray[i].push(0)
      }
    }
  }

  // order create array of numbers pointing at positions in Words.wordsArray[], it is therefore posible to create order for game without changing list
  // [2, 1, 3, ...]
  // style 0=order due to words in file
  // style 1=order randomly
  // style 2=order alphabetically
  makeOrder(style){
    console.log(style);
  }

  // language = 0 -> display first language; language = 1 -> display second language
  showNextWord(){
    var wordL1 = this.wordsArray[0][this.language]
    var wordL2 = this.wordsArray[0][1-this.language]

    if(this.isCorrect()){
      this.wordsArray[0][2]--
      this.GameDiv.showCorrectAnswer(wordL1, wordL2, true);
    }else{
      this.wordsArray[0][2] += this.penalty
      this.GameDiv.showCorrectAnswer(wordL1, wordL2, false);
    }

    // user succeded and word has no penalty points
    if(this.isCorrect() && this.wordsArray[0][2] < 0) {
      this.listWordDiv.wordDone(wordL1, wordL2);
      this.removeFromGame();
      this.GameDiv.addToBar(this.GameDiv.wordsLeftBar, 1, -1)
      this.GameDiv.addToBar(this.GameDiv.gameScore, 1, 0)

    // user failed
    }else{         // error when there are less words than number of words left
      if(this.onWrongMoveTo >= this.wordsArray.length) {
        var c = this.wordsArray[this.wordsArray.length-1]
        this.wordsArray[this.wordsArray.length-1] = this.wordsArray[0];
        this.wordsArray[0] = c;
      } else {  // enough words
        for(var i=0; i<this.onWrongMoveTo; i++){    // move word of "onWrongMoveTo"
          var c = this.wordsArray[i+1]
          this.wordsArray[i+1] = this.wordsArray[i];
          this.wordsArray[i] = c;
        }
      }

      this.GameDiv.addToBar(this.GameDiv.gameScore, 0, 1)
    }

    // OUT OF WORDS, USER WON
    if (this.nWords <=0 ) {
      this.restart();
      return;
    }

    // give new word
    this.GameDiv.giveWord(this.wordsArray[0][this.language]);
  }

  isCorrect(){
    var is = this.GameDiv.getWord()
    var shoulBe = this.wordsArray[0][1-this.language];
    if( shoulBe == is ){   // 1-x is for swapping 0 to 1 and 1 to 0
      return true;
    }else{
      return false;
    }
  }

  // user was correct -> remove word from array of words and set new max count
  removeFromGame() {
    // remove word from array of words
    var newArray = []
    // newArray = newArray.concat(this.wordsArray.slice(0,this.currentPosition))
    newArray = newArray.concat(this.wordsArray.slice(1,this.wordsArray.length))

    // set new wordsArray and nWords in array
    this.nWords--;
    this.wordsArray = newArray
  }

  // user won, all words get right -> restart game
  restart(){
    var r = confirm("WINNER WINNER CHICKEN DINNER\ndo you wish to restart game?");
    if (r == true) {
      this.setWordsObject();
    } else {
      alert("HMMM, THAN ALL IS DONE AND YOU CAN LEAVE")
    }
  }

}
