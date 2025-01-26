// client.js
fetch('http://localhost:1234')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((movies) => {
    const html = movies
      .map((movie) => {
        return `
          <article data-id="${movie.id}">
            <h2>${movie.title}</h2>
            <p>Año: ${movie.year}</p>
            <p>Director: ${movie.director}</p>
            <p>Duración: ${movie.duration} minutos</p>
            <p>Géneros: ${movie.genre.join(', ')}</p>
          </article>
        `;
      })
      .join('');
    document.querySelector('main').innerHTML = html;
  })
  .catch((error) => console.error('Error fetching movies:', error));
