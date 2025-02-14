// Funktion, um einen Query-Parameter aus der URL zu extrahieren
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const file = getQueryParam('file');
if (file) {
  // Hier wird "../articles/" genutzt, da article.html in /pages liegt
  fetch('../articles/' + file)
    .then(response => {
      if (!response.ok) {
        throw new Error('Artikel konnte nicht geladen werden');
      }
      return response.text();
    })
    .then(markdown => {
      const title = file.replace('.md', '');
      const htmlContent = marked.parse(markdown);
      document.getElementById('articleContent').innerHTML = `<h2>${title}</h2>` + htmlContent;
    })
    .catch(error => {
      console.error('Fehler beim Laden des Artikels:', error);
      document.getElementById('articleContent').innerHTML = `<p>Artikel konnte nicht geladen werden.</p>`;
    });
} else {
  document.getElementById('articleContent').innerHTML = `<p>Kein Artikel ausgewählt.</p>`;
}