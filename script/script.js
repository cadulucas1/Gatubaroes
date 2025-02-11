// Função para pegar a chave API de filmes do ENV
async function getApiKey() {
    try {
        const response = await fetch('../env');
        const data = await response.json();
        return data.tokenTMDB;
    } catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
}

// Função para procurar até 100 filmes mais parecidos com esse nome.
async function fetchMoviePosters(movieName) {
    const posters = document.getElementById('poster-container');
    const button = document.getElementById('toggleButton');

    posters.style.bottom = '0';
    console.log(movieName.value);

    const apiKey = await getApiKey();
    if (!apiKey) {
        console.error('API key not found.');
        return;
    }

    try {
        const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName.value)}`
        );
        const searchData = await searchResponse.json();

        if (searchData.results.length === 0) {
            console.error('Nenhum filme achado com esse nome.');
            return;
        }

        // Pegue até 100 resultados.
        const movies = searchData.results.slice(0, 100);

        const posterContainer = document.getElementById('poster-container');
        posterContainer.innerHTML = ''; // Limpe os resultados anteriores toda vez que pesquisar.

        movies.forEach(movie => {
            if (movie.poster_path) {
                const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                // Fetch nos detalhes do filme usando a API.
                fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
                    .then(response => response.json())
                    .then(movieDetails => {
                        const productionCountries = movieDetails.production_countries || []; // Locais em que foram produzidos o filme.

                        const movieElement = document.createElement('div');
                        movieElement.style.display = 'inline-block';
                        movieElement.style.margin = '10px';

                        // Cria o botão clicável.
                        const posterButton = document.createElement('button');
                        posterButton.style.background = 'none';
                        posterButton.style.border = 'none';
                        posterButton.style.padding = '0';
                        posterButton.style.cursor = 'pointer';

                        // Adiciona a imagem ao botão.
                        posterButton.innerHTML = `<img src="${posterUrl}" alt="${movie.title} Poster" style="width:auto; height:240px;">`;

                        // Adiciona evento de click no botão de cada poster para enviar para a pagina_filme com dados na url.
                        posterButton.addEventListener('click', () => {
                            // L - Coloca as informações do filme na URL que vai ser mandada para o pagina_filme
                            const urlParams = new URLSearchParams({
                                title: movie.title,
                                poster: posterUrl,
                                countries: JSON.stringify(productionCountries.map(country => country.name)) // Send country names as JSON
                            });
                            window.location.href = `pagina_filme.html?${urlParams.toString()}`;
                        });

                        movieElement.appendChild(posterButton);
                        posterContainer.appendChild(movieElement);
                    })
                    .catch(error => {
                        console.error('Error fetching movie details:', error);
                    });
            }
        });
    } catch (error) {
        console.error('Error fetching the movie posters:', error);
    }
}

// L - Espera pela página html carregar, mais especificamente seu conteúdo. (DOM = Document Object Model).
document.addEventListener('DOMContentLoaded', () => {
    // L - Pega os elementos das animações.
    const parallaxImg = document.querySelector('.parallaxImg');
    const empresaNome = document.querySelector('.empresaNome');

    // L - No Fim da animação do parallax, chama o Index.
    empresaNome.addEventListener('animationend', () => {
        window.location.href = 'index.html';
    });
});