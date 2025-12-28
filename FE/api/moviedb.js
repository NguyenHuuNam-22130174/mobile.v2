import { API } from "./api";

// ===== IMAGE UTILS (giữ nguyên để FE không đổi) =====
export const image500 = (path) => path;
export const image342 = (path) => path;
export const image185 = (path) => path;

export const fallbackMoviePoster =
  "https://img.myloview.com/stickers/white-laptop-screen-with-hd-video-technology-icon-isolated-on-grey-background-abstract-circle-random-dots-vector-illustration-400-176057922.jpg";

export const fallbackPersonImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSjBTwZ0l61E4B3KTS7o&usqp=CAU";

// ===== MOVIES =====
export const fetchTrendingMovies = async () => {
  const res = await API.get("/movies");
  return { results: res.data };
};

export const fetchUpcomingMovies = fetchTrendingMovies;
export const fetchTopRatedMovies = fetchTrendingMovies;

// ===== SEARCH =====
export const searchMovies = async ({ query }) => {
  const res = await API.get(`/movies/search?q=${query}`);
  return { results: res.data };
};

// ===== MOVIE DETAIL =====
export const fetchMovieDetails = async (id) => {
  const res = await API.get(`/movies/${id}`);
  return res.data;
};

// ===== STUBS (để app không crash) =====
export const fetchMovieCredits = async () => ({ cast: [] });
export const fetchSimilarMovies = async () => ({ results: [] });
export const fetchPersonDetails = async () => ({});
export const fetchPersonMovies = async () => ({ cast: [] });

// ===== TRAILER MAP (giữ nguyên) =====
export const trailerVideoMap = {};

// ===== FETCH MOVIES BY GENRE (FIX TREO APP) =====
export const fetchMoviesByGenre = async (genreId) => {
  const res = await API.get("/movies"); // tạm lấy all
  const filtered = res.data.filter(movie =>
    movie.genres?.some(g => g.genreId === genreId)
  );
  return { results: filtered };
};
