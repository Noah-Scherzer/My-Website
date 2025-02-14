// Lade die Artikelliste aus articles.json
fetch('articles.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Artikel-Liste');
    }
    return response.json();
  })
  .then(articles => {
    const articleListEl = document.getElementById('articleList');
    articles.forEach(article => {
      // Entferne die Endung ".md" für den angezeigten Titel
      const title = article.filename.replace('.md', '');
      const li = document.createElement('li');
      const a = document.createElement('a');
      // Verlinke zur Detailseite (z. B. pages/article.html) und übergebe den Dateinamen als Query-Parameter
      a.href = 'pages/article.html?file=' + encodeURIComponent(article.filename);
      a.textContent = title;
      li.appendChild(a);
      articleListEl.appendChild(li);
    });
  })
  .catch(error => console.error('Fehler beim Laden der Artikel-Liste:', error));