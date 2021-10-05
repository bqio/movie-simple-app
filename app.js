const TOKEN = "222cc667-9a45-4fe9-877b-ce6e544921ea";

function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

const fetchData = (url) => {
  return fetch(url, {
    headers: {
      "X-API-KEY": TOKEN,
      accept: "application/json",
    },
  });
};

let app = new Vue({
  el: "#app",
  data: {
    movies: [],
    currentPage: 1,
    maxPage: -1,
    type: "TOP_100_POPULAR_FILMS",
  },
  methods: {
    async fetchMovies(page = 1) {
      if (page > this.maxPage && page != 1) {
        return;
      }

      const response = await fetchData(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=${this.type}&page=${page}`
      );
      const data = await response.json();
      this.maxPage = data.pagesCount;
      this.movies.push(...data.films);
    },
    checkPosition() {
      const height = document.body.offsetHeight;
      const screenHeight = window.innerHeight;
      const scrolled = window.scrollY;
      const threshold = height - screenHeight / 2;
      const position = scrolled + screenHeight;

      if (position >= threshold) {
        this.currentPage++;
        this.fetchMovies(this.currentPage);
      }
    },
    changeType(type) {
      this.type = type;
      this.currentPage = 1;
      this.maxPage = -1;
      this.movies = [];
      this.fetchMovies();
    },
  },
  mounted() {
    this.fetchMovies();
  },
});

(() => {
  window.addEventListener("scroll", throttle(app.checkPosition, 1000));
  window.addEventListener("resize", throttle(app.checkPosition, 1000));
})();
