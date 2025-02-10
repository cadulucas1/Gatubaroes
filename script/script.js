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
    
    // Mostre os posters
    const posters = document.getElementById('poster-container');
    const button = document.getElementById('toggleButton');

    posters.style.bottom = '0';
    console.log(movieName.value)

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
                const movieElement = document.createElement('div');
                movieElement.style.display = 'inline-block';
                movieElement.style.margin = '10px';
                movieElement.innerHTML = `<img src="${posterUrl}" alt="${movie.title} Poster" style="width:150px; height:auto;">`;
                posterContainer.appendChild(movieElement);
            }
        });
    } catch (error) {
        console.error('Error fetching the movie posters:', error);
    }
}



function togglePosters() {

}