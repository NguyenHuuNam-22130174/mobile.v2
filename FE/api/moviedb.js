// import axios from "axios";
// import { apiKey } from "../constants/index";

// const apiBaseUrl = "https://api.themoviedb.org/3";
// const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`;
// const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`;
// const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`;
// const searchMoviesEndpoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`;
// const movieDetailsEndpoint = (id) =>
//     `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;
// const movieCreditsEndpoint = (id) =>
//     `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`;
// const similarMoviesEndpoint = (id) =>
//     `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`;
// const personDetailsEndpoint = (id) =>
//     `${apiBaseUrl}/person/${id}?api_key=${apiKey}`;
// const personMoviesEndpoint = (id) =>
//     `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`;

// // them fetchMoviesByGenre
// export const fetchMoviesByGenre = async (genreId) => {
//     const res = await fetch(
//         `${apiBaseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
//     );
//     return await res.json();
// };


// export const image500 = (path) =>
//     path ? "https://image.tmdb.org/t/p/w500" + path : null;
// export const image342 = (path) =>
//     path ? "https://image.tmdb.org/t/p/w342" + path : null;
// export const image185 = (path) =>
//     path ? "https://image.tmdb.org/t/p/w185" + path : null;

// export const fallbackMoviePoster =
//     "https://img.myloview.com/stickers/white-laptop-screen-with-hd-video-technology-icon-isolated-on-grey-background-abstract-circle-random-dots-vector-illustration-400-176057922.jpg";
// export const fallbackPersonImage =
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSjBTwZ0l61E4B3KTS7o&usqp=CAU";

// const apiCall = async (endpoint, params) => {
//     const options = { method: "GET", url: endpoint, params: params || {} };
//     try {
//         const response = await axios.request(options);
//         return response.data;
//     } catch {
//         return {};
//     }
// };

// export const fetchTrendingMovies = () => apiCall(trendingMoviesEndpoint);
// export const fetchUpcomingMovies = () => apiCall(upcomingMoviesEndpoint);
// export const fetchTopRatedMovies = () => apiCall(topRatedMoviesEndpoint);
// export const fetchMovieDetails = (id) => apiCall(movieDetailsEndpoint(id));
// export const fetchMovieCredits = (id) => apiCall(movieCreditsEndpoint(id));
// export const fetchSimilarMovies = (id) => apiCall(similarMoviesEndpoint(id));
// export const fetchPersonDetails = (id) => apiCall(personDetailsEndpoint(id));
// export const fetchPersonMovies = (id) => apiCall(personMoviesEndpoint(id));
// export const searchMovies = (params) => apiCall(searchMoviesEndpoint, params);

// export const trailerVideoMap = {
//     1165067: "4Vgh325lzeQ", // cosmic-chaos
//     1125899: "c8sf0c-cjzQ", // cleaner
//     822119: "1pHDWnXmK7Y", // captain-america-brave-new-world
//     1373723: "73cCv3eWkhs", // the-codes-of-war
//     447273: "iV46TJKL8cU", // snow-white
//     1301650: "boofnnS9imM", // z-zone
//     1297763: "QleeDtH_WWE", // Batman Ninja vs. Yakuza League
//     762509: "o17MF9vnabg", // mufasa-the-lion-king
//     1241982: "hDZ7y8RP5HE", // moana-2
//     1388366: "CGO32Zmh2YI", // popeye-the-slayer-man
//     1356039: "n3YkEva36gs", // contraataque
//     777443: "QIw6ITiwgBU", // the-electric-state
//     1077782: "vAGp4TkTbAE", // old-guy
//     1126166: "ojC9JBuccJA", // flight-risk
//     1151470: "NUzXT8_1LN4", // the-vigilante
//     950396: "rUSdnuOLebE", // the-gorge
//     1217379: "hzMHyzuZSVk", // hellhound
//     1405338: "q-djvN7i5us", // demon-city
//     939243: "qSu6i2iFMO0", // sonic-the-hedgehog-3
//     1143407: "PKsVB1wPZ78", // sky-force
//     1124620: "husMGbXEIho", // the-monkey
//     1139937: "vlXapURCpQA", // frogman
//     1062276: "B8bGs69xdZE", // dark-match
//     1197306: "zTbgNC42Ops", // a-working-man
//     1210938: "5XcVSWOKVsY", // Revelations
//     615453: "nsXQijb0F4I", // NeZha
//     974453: "ReZetOuczXo", // Absolution
//     629078: "mTuPHCyV6mw", // The Glassworker
//     299536: "6ZfuNTqbHE8", // Avengers: Infinity War
//     238: "UaVTIH8mujA", // The Godfather
//     1352774: "5TPytV6FiRI", // Piglet
//     1410082: "YSwYhvG0Hy4", // Snpier: The Last Stand
//     426063: "nulvWqYUM8k", // Nosferatu
//     839033: "gCUg6Td5fgQ", // The Lord of the Rings: The War of the Rohirrim
//     1188104: "7aoDd5iIeFU", // The X-Treme Riders
//     1128752: "Gf8z1OXInLs", // Bird
//     1379074: "8J8-6I-zJIs", // Boreal
//     1147416: "iFN9DouWuYY", // Miraculous World, London: At the Edge of Time
//     1217876: "mYKOQ1QxUac", // Ellie and the Monster Team
//     385687: "32RAq6JzY-w", // Fast X
//     980477: "gsiAYjyiIBM", // Ne Zha 2
//     1333100: "3xNH23QkNpk", // Attack on Titan: THE LAST ATTACK
//     516729: "NTvudSGfHRI", // Paddington in Peru
//     1138749: "_ZyNJ3cKfEg", // The Island
//     1118031: "2mksaSvCG9g", // Apocalypse Z: The Beginning of the End
//     411: "usEkWtuNn-w", // The Chronicles of Narnia: The Lion, the Witch and the Wardrobe
//     1437446: "2o0eLtapwr0", // The Twister: Caught in the Storm
//     278: "PLl99DlL6b4", // The Shawshank Redemption
//     1165464: "rhp3C8onyjs", // You Are Not Me
//     1034541: "zaPcin5knJk", // Terrifier 3
//     1244881: "L6Z7JjwPoFg", // Alone In The Night
//     710295: "kAw4PH2IQgo", // Wolf Man
//     829557: "pyM3z73oMAk", // 365 Days: This Day
//     24428: "eOrNdBpGMv8", // The Avengers
//     573435: "hRFY_Fesa9Q", // Bad Boys: Ride or Die
//     1100782: "0HY6QFlBzUY", // Smile 2
//     945961: "OzY2r2JXsDM", // Alien: Romulus
//     698687: "0rmJXXKDrsM", // Transformers One
//     995926: "eiMJ8BW2EDA", // I, the Executioner (2024)
//     257094: "IJm3LHoqdA4", // Holland (2025)
//     927342: "9SSd9L0SxN0", // Amaran (2024)
//     1145725: "i6NvYfJwq-U", // Tyler Perry's Duplicity (2025)
//     937393: "4VZfmgLLXgY", // Bloat
//     1104845: "IHRScjhllsQ", // Plankton: The Movie
//     539972: "I8gFw4-2RBM", // Kraven the Hunter
//     1084199: "Qr_kX0D3DNA", // Companion
//     1362608: "nStDZkEfnU", // Little Siberia
//     823219: "ZgZccxuj2RY", // Flow
//     1357633: "LrNvF8gcJPM", // Solo Leveling -ReAwakening
//     1064486: "Ehc8cc7g31I", // Memoir of a Snail
//     912649: "__2bjWbetsA", // Venom: The Last Dance trailer
//     696506: "osYpGSz_0i4", // mickey 17
//     1226406: "frYVyUDIwiE", // Love Hurts
//     950387: "8B1EtVPBSMw", // A Minecraft Movie
//     1160956: "ksls6lIiSPg", // PANDA PLAN
//     1140535: "XfSNmYhV8Xc", // PRESENCE
//     558449: "4rgYUipGJNo", // Gladiator II
//     972533: "sNMyooXZZTM", // Last Breath
//     926670: "Rcc9veq0JgM", // HENRY DANGER THE MOVIE
//     1064213: "p1HxTmV5i7c", // ANORA
//     1407861: "yWNwdsXIBks", // The Bayou
//     533535: "73_1biulkYk", // Deadpool & Wolverine
//     1286663: "ZxJ-raCdP6w", // Control Freak
//     7451: "5W4ix0DpKug", // xxx
//     1333099: "VXvsKc7cVDk", // dalia-y-el-libro-rojo
//     157336: "UDVtMYqUAyw", // interstellar
//     1360170: "AVmY401XtDA", // maria-me-muero
//     1035048: "Ak5WTb-mgeA", // elevation
//     845781: "U8XH3W0cMss", // red-one
//     1233575: "Du0Xp8WX_7I", // black-bag
//     574475: "UWMzKXsY9A4", // final-destination-bloodlines
//     426889: "J_3OA_VZVkY", // le-clitoris
//     1177908: "_KiRbcvdUCM", // moscas
//     1156593: "-aCPYvyQ-1M", // culpa-tuya
//     850920: "fn-hc0yf3MY", // the-parenting
//     629078: "mTuPHCyV6mw", // The-Glassworker
//     402431: "6COmYeLsz4c", // wicked
//     1138194: "O9i2vmFhSSY", // heretic
//     774100: "9mTVko4Kmak", // alexander-and-the-terrible-horrible-no-good-very-bad-road-trip
//     1294203: "4WwtfTaW_bM", // my-fault-london
//     811941: "NcCYq3bvlJM", // Devara-Part-1
//     1302151: "zEuHhRUPPqw", // mesa-de-regalos
//     1293263: "Ppj3TLJHFgA", // the-curse-of-the-necklace
//     1255788: "Ol1GWIYk6TU", // le-jardinier
//     993710: "MV2nYw6gL_w", // back-in-action
//     1147416: "z56XMhpYE4o", // miraculous-world-londres-la-course-contre-le-temps
//     299536: "6ZfuNTqbHE8", // avengers-infinity-war
//     426063: "nulvWqYUM8k", // nosferatu
// };
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
