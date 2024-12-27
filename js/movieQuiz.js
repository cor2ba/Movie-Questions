import { CONFIG } from './config.js';
import { movieData } from './movieData.js';

let currentStep = 1;
let selectedMovies = [];
const moviesGrid = document.getElementById('moviesGrid');

function updateCounter(step) {
    if (!step || step < 1 || step > CONFIG.MAX_STEPS) {
        console.error('Invalid step number:', step);
        return;
    }

    document.querySelector('.current-number').textContent = step;
    document.querySelector('.progress-fill').style.width = `${(step / CONFIG.MAX_STEPS) * 100}%`;
}

function showMovies(movies) {
    if (!movies || !Array.isArray(movies)) {
        console.error('Invalid movies data provided');
        return;
    }

    try {
        moviesGrid.innerHTML = '';
        movies.forEach(movie => {
            if (!movie.image || !movie.title) {
                throw new Error(`Invalid movie data: ${JSON.stringify(movie)}`);
            }
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}" onerror="console.error('Error loading image:', this.src)">
                <div class="movie-title">${movie.title}</div>
            `;

            movieCard.addEventListener('click', () => selectMovie(movie));
            moviesGrid.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error showing movies:', error);
        moviesGrid.innerHTML = '<p>Sorry, there was an error loading the movies.</p>';
    }
}

function redirectToMovie(movie) {
    if (!movie || !movie.link) {
        console.error('Invalid movie data for redirect');
        return;
    }

    moviesGrid.innerHTML = '';
    const movieCard = document.createElement('div');
    movieCard.className = 'watch-now-container';
    movieCard.innerHTML = `
        <div class="movie-card">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
        </div>
        <div class="add-section">
            <h1 class="add-title">Watch new movies for free!</h1>
            <p class="add-description">Do you want to watch movies like this for free?</p>
            <p class="add-description">Have fun watching your favourite movies!</p>
            <a href="${movie.link}" target="_blank">
                <button class="add-button">Watch Here!</button>
            </a>
        </div>
    `;
    moviesGrid.appendChild(movieCard);
}

function updateTitle(step) {
    const title = document.getElementById('title');
    if (!title) return;

    switch (step) {
        case 1:
            title.textContent = CONFIG.TITLES.STEP_1;
            break;
        case 2:
            title.textContent = CONFIG.TITLES.STEP_2;
            break;
        case 3:
            title.textContent = CONFIG.TITLES.STEP_3;
            break;
        case 4:
            title.textContent = CONFIG.TITLES.FINAL;
            break;
        default:
            console.error('Invalid step for title update:', step);
    }
}

function selectMovie(movie) {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    selectedMovies[currentStep - 1] = movie;

    setTimeout(() => {
        if (currentStep === 1) {
            currentStep++;
            updateCounter(currentStep);
            updateTitle(currentStep);
            showMovies(movieData.step2[movie.id]);
        } else if (currentStep === 2) {
            currentStep++;
            updateCounter(currentStep);
            updateTitle(currentStep);
            showMovies(movieData.step3);
        } else if (currentStep === 3) {
            updateTitle(4);
            redirectToMovie(movie);
        }
    }, CONFIG.ANIMATION_DELAY);
}

document.addEventListener('DOMContentLoaded', () => {
    updateTitle(1);
    showMovies(movieData.step1);
}); 