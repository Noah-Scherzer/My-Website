const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const outputFile = path.join(__dirname, 'articles.json');

fs.readdir(articlesDir, (err, files) => {
  if (err) {
    console.error("Fehler beim Lesen des 'articles'-Ordners:", err);
    return;
  }

  // Filtere alle Dateien, die auf .md enden
  const mdFiles = files.filter(file => file.endsWith('.md'));

  // Erstelle ein Array mit Objekten, z. B. [{ "filename": "Mein-Erster-Artikel.md" }, …]
  const articlesList = mdFiles.map(file => ({ filename: file }));

  // Schreibe die JSON-Datei (mit schöner Formatierung)
  fs.writeFile(outputFile, JSON.stringify(articlesList, null, 2), err => {
    if (err) {
      console.error("Fehler beim Schreiben von articles.json:", err);
    } else {
      console.log("articles.json wurde erfolgreich erstellt!");
    }
  });
});