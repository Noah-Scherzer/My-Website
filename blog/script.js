// Hinweis:
// Eine automatische Erstellung der Artikelliste aus dem lokalen "articles"-Ordner
// ist in einer rein statischen Umgebung (z. B. auf GitHub Pages) nicht möglich,
// da der Browser aus Sicherheitsgründen kein Directory Listing erlaubt.
// Um die Liste automatisch zu generieren, benötigst du entweder
// einen Build-Prozess, der eine JSON-Datei mit den Da
const articles = [
  "Mein-Erster-Artikel.md",
  "Zweiter-Artikel.md"
];

const articleListEl = document.getElementById('articleList');

// Erstelle für jeden Artikel einen Link
articles.forEach(filename => {
  const title = filename.replace('.md', '');
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = "#";
  a.textContent = title;
  a.addEventListener('click', e => {
    e.preventDefault();
    loadArticle(filename);
  });
  li.appendChild(a);
  articleListEl.appendChild(li);
});

// Funktion zum Laden und Anzeigen eines Artikels
function loadArticle(filename) {
  fetch('articles/' + filename)
    .then(response => response.text())
    .then(markdown => {
      // Markdown in HTML umwandeln (mithilfe von Marked.js)
      const htmlContent = marked.parse(markdown);
      document.getElementById('content').innerHTML = `<h2>${filename.replace('.md','')}</h2>` + htmlContent;
    })
    .catch(error => console.error('Fehler beim Laden des Artikels:', error));
}