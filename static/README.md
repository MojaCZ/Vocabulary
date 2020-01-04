# JavaScript

## Structure
* [dictionary](#Dictionary)
* [pageBlocks](#Page-Blocks)
* main

## Dictionary
* *Vocabulary* class:
  * stores information about available vocabulary files.
  * stores already loaded files as an object of Words class.
  * holds current words set
* *Words* class:
  * represents one vocabulary file containing list of words
* *GameConnect* class:
  * is game engine for a 'connect' game
* *GameWrite* class:
  * is game engine for a 'write' game

```js
class Vocabulary {
  constructor(){}
  getFiles(){}
  displayFiles(){}
  addWords(){}
}

class Words {
  constructor(){}
  loadWords(){}
  newWords(){}
}

class GameConnect {
  constructor(){}
  setWordsObject(){}
  setCheckedWords(){}
  reorder(){}
  checkWords(){}
  restart(){}
}

class GameWrite {
  constructor(){}
  setWordsObject(){}
  addCounter(){}
  makeOrder(){}
  showNextWord(){}
  isCorrect(){}
  removeFromGame(){}
  restart(){}
}
```
## Page Blocks

serves for displaying changes to user. Will be replaced or changed.
```js
class GameConnectDiv {}
class GameWriteDiv {}
class GameBarDiv {}
```
