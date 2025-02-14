// Lade die Artikelliste aus der automatisch generierten JSON-Datei
fetch('articles.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Netzwerkantwort war nicht ok');
    }
    return response.json();
  })
  .then(articles => {
    const articleListEl = document.getElementById('articleList');
    articles.forEach(article => {
      const title = article.filename.replace('.md', '');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = "#";
      a.textContent = title;
      a.addEventListener('click', e => {
        e.preventDefault();
        loadArticle(article.filename);
      });
      li.appendChild(a);
      articleListEl.appendChild(li);
    });
  })
  .catch(error => console.error('Fehler beim Laden der Artikel-Liste:', error));

// Funktion zum Laden und Anzeigen eines Artikels
function loadArticle(filename) {
  fetch('articles/' + filename)
    .then(response => {
      if (!response.ok) {
        throw new Error('Fehler beim Laden des Artikels');
      }
      return response.text();
    })
    .then(markdown => {
      // Markdown in HTML umwandeln (mithilfe von Marked.js)
      const htmlContent = marked.parse(markdown);
      document.getElementById('content').innerHTML = `<h2>${filename.replace('.md', '')}</h2>` + htmlContent;
    })
    .catch(error => console.error('Fehler beim Laden des Artikels:', error));
}