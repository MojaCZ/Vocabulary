package main

import (
  "net/http"
  "html/template"
  "log"
  "io/ioutil"
  "encoding/xml"
  "os"
  "path"
  "strings"
  "path/filepath"
)

var (
  tpl *template.Template
)

func init() {
  tpl = template.Must(template.ParseGlob("./templates/*gohtml"))
}


func main() {
  http.Handle("/Vocabulary/files/", http.StripPrefix("/Vocabulary/files", http.FileServer(http.Dir("./static"))))
  http.Handle("/Vocabulary/dictionary/", http.StripPrefix("/Vocabulary/dictionary", http.FileServer(http.Dir("./dictionary"))))
  http.HandleFunc("/Vocabulary/availableDictionary/", dictionaryFiles)
  // http.HandleFunc("/", index)
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
    http.ServeFile(w, r, "./index.html")
  })

  err := http.ListenAndServe(":8081", nil)
  if err != nil {
    log.Fatalln(err)
  }
}

// func index(w http.ResponseWriter, req *http.Request) {
//   err := tpl.ExecuteTemplate(w, "index.gohtml", nil)
//   if err != nil {
//     log.Fatalln(err)
//   }
// }


// WordsFile is struct that serves for reading name of dictionary file
type WordsFile struct {
  Name string `xml:"name"`
}

// WordFile stores name and is of acrual word file (XML)
type WordFile struct {
  Name string `xml:"name"`
  Id string `xml:"id"`
}

// Dictionary stores all names and ids of available files
type Dictionary struct {
  XMLName xml.Name `xml: "files"`
  Word []WordFile
}


func dictionaryFiles(w http.ResponseWriter, req *http.Request) {
  // get all available files
  files, err := ioutil.ReadDir("./dictionary")
  if err != nil {
    log.Fatalln(err)
  }

  // set structure that holds names and ids before parsing it to XML
  dict := Dictionary{}

  // loop through all files from directory
  for _, file := range files {
    f, err := os.Open("./dictionary/" + file.Name())
    if err != nil {
      log.Fatalln(err)
    }
    defer f.Close()

    W := WordsFile{}
    fileBytes, err := ioutil.ReadAll(f)
    if err != nil {
      log.Fatalln(err)
    }
    err = xml.Unmarshal(fileBytes, &W)
    if err != nil {
      log.Fatalln(err)
    }

    fileName := path.Base(f.Name())
    fileName = strings.TrimSuffix(fileName, filepath.Ext(fileName))
    wordsName := W.Name
    dict.Word = append(dict.Word, WordFile{Name:fileName, Id:wordsName})
  }

  outXML, err := xml.MarshalIndent(dict, " ", "   ")
  if err != nil {
    log.Fatalln(err)
  }
  w.Header().Set("Content-Type", "text/xml; charset=utf-8")
  w.Write(outXML)

}
