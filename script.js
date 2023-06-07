// Consts
const apikey = "8a435a366771820ad42b4c3f44e817dc";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=cc01231d2amshf3f24cbfaa21df3p14ea8fjsn0ee418a2e994`,
};

// Boots up the app
function init() {
  fetchTrendingMovies();
  fetchAndBulidAllSections();
}

function fetchTrendingMovies() {
  fetchAndbulidMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then((list) => {
      const randamIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randamIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner-section");
  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

  const div = document.createElement("div");
  div.innerHTML = `
    <h2 class="banner__title">${movie.title}</h2>
    <p class="banner__info">Trending in movies | Released - ${
      movie.release_date
    } </p>
    <p class="banner__overview">${
      movie.overview && movie.overview.length > 200
        ? movie.overview.slice(0, 200).trim() + "..."
        : movie.overview
    }</p>
    <div class="action-buttons-cont">
    <button class="action-button">
        <svg
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6"
        >
        <path
            fill-rule="evenodd"
            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
            clip-rule="evenodd"
        />
        </svg>
        &nbsp; Play
    </button>
    <button class="action-button">
        <svg
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
        >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
        </svg>
        &nbsp; More Info
    </button>
    </div>
`;

  bannerCont.append(div);
}

function fetchAndBulidAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndbulidMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      //   console.table(movies);
    })
    .catch((err) => console.error(err));
}

function fetchAndbulidMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      //   console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies.slice(0, 6), categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);

  const moivesCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      return `
      <div class="movies-item" onmouseenter="searchMovieTrailer('${item.title}'), yt${item.id}">
       <img class="movies-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
       <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
      </div>
    `;
    })
    .join("");

  const moviesSectionHTML = `
    <h2 class="movies-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
    <div class="movies-row">
       ${moviesListHTML}
    </div>
  `;

  console.log(moviesSectionHTML);

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;

  // append html into container
  moivesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
  console.log(document.getElementById(iframId), iframId);
  if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResult = res.items[0];

      const elements = document.getElementById(iframId);
      elements.src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`;
    })
    .catch((err) => console.error(err));
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    // header ui update
    const header = this.document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});
