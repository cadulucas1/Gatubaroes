// Function to fetch the API key from env.json
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

// Function to search for a movie by name and fetch up to 10 posters
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
            console.error('No movies found with that name.');
            return;
        }

        // Get up to 10 results
        const movies = searchData.results.slice(0, 100);

        const posterContainer = document.getElementById('poster-container');
        posterContainer.innerHTML = ''; // Clear previous results

        movies.forEach(movie => {
            if (movie.poster_path) {
                const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                // Fetch additional movie details (including production countries)
                fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
                    .then(response => response.json())
                    .then(movieDetails => {
                        const productionCountries = movieDetails.production_countries || [];

                        const movieElement = document.createElement('div');
                        movieElement.style.display = 'inline-block';
                        movieElement.style.margin = '10px';

                        // Create a clickable button for each poster
                        const posterButton = document.createElement('button');
                        posterButton.style.background = 'none';
                        posterButton.style.border = 'none';
                        posterButton.style.padding = '0';
                        posterButton.style.cursor = 'pointer';

                        // Add the poster image to the button
                        posterButton.innerHTML = `<img src="${posterUrl}" alt="${movie.title} Poster" style="width:auto; height:240px;">`;

                        // Add click event to redirect to pagina_filme.html with movie data
                        posterButton.addEventListener('click', () => {
                            // Pass movie data as URL parameters
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

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get the elements with animations
    const parallaxImg = document.querySelector('.parallaxImg');
    const empresaNome = document.querySelector('.empresaNome');

    // Listen for the end of the last animation
    empresaNome.addEventListener('animationend', () => {
        // Redirect to another page after the last animation ends
        window.location.href = 'index.html'; // Replace with your desired URL
    });
});