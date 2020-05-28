# Vocabulary

Vocabulary is a application which helps you to learn and practice new words.

Games:
* **Write**: the word is given to user and his task is to write correct opposite. If he misspell it, the world will be repeatedly displayed until user type it x-times correctly.
* **Connect**: words are given to user in blocks in random order. User's task is to match word from language1 with language2. When user submit, words are checked and the wrong ones are reordered and displayed again.

## Technologies used
at the backend runs **GO** which serves html templates and data requested by client (AJAX).

On frontend is used JavaScript

## structure
* [dictionary](#Dictionary)
* [GO](#GO)
* [JavaScript](./static/)

## Dictionary
Dictionary is a folder in which are stored XML files with words. If client side requests, the server will send this files by id which is represented by file name.

```xml
<vocabulary>
  <name></name>
  <languages>
    <language1></language1>
    <language2></language2>
  </languages>
  <words>
    <word><L1>já jsem</L1><L2>ich bin</L2></word>
    <word><L1>ty jsi</L1><L2>du bist</L2></word>
              .
              .
              .
  </words>
</vocabulary>
```

## GO
`vocabylary.go` is listening on port :8081
* serves html templates (index.gohtml)
* sends user available dictionary by searching through XML files
* sends XML files if requested (AJAX)
