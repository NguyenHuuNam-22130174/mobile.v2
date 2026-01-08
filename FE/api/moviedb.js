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

const API_BASE_URL = "http://10.0.2.2:5000"; 

const toPosterUrl = (m) => {
  const raw =
    m?.posterUrl ||
    m?.posterPath ||
    m?.poster_path ||
    m?.poster;

  if (!raw) return "https://via.placeholder.com/500x750?text=No+Image";
  if (typeof raw !== "string") return "https://via.placeholder.com/500x750?text=No+Image";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/")) return `${API_BASE_URL}${raw}`;
  return `${API_BASE_URL}/uploads/posters/${raw}`;
};

const apiGet = async (path) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
};

const isObjectId = (s) => typeof s === "string" && /^[a-f\d]{24}$/i.test(s);

const extractGenreTokens = (genres) => {
  const ids = new Set();
  const names = new Set();

  if (!Array.isArray(genres)) return { ids, names };

  for (const g of genres) {
    if (!g) continue;

    // genres là string (có thể là objectId hoặc tên)
    if (typeof g === "string") {
      const v = g.trim();
      if (!v) continue;
      if (isObjectId(v)) ids.add(v);
      else names.add(v.toLowerCase());
      continue;
    }

    // genres là object
    if (typeof g === "object") {
      const id = (g._id || g.id || "").toString().trim();
      const name = (g.name || g.title || "").toString().trim();

      if (id) ids.add(id);
      if (name) names.add(name.toLowerCase());
    }
  }

  return { ids, names };
};

const intersectCount = (a, b) => {
  let c = 0;
  for (const x of a) if (b.has(x)) c++;
  return c;
};

/**
 * Fetch danh sách phim tương tự dựa trên `movieId`.
 *
 * Cách hoạt động:
 * - Lấy chi tiết phim hiện tại: GET `/api/movies/:id`
 * - Lấy danh sách tất cả phim: GET `/api/movies`
 * - Tính “độ tương tự” dựa trên thể loại (genres):
 *   + Ưu tiên so khớp theo Genre ID (khi list trả về genres dạng ObjectId).
 *   + Nếu không có ID thì fallback so theo tên Genre (name).
 * - Sắp xếp theo:
 *   1) số lượng genre trùng nhau (giảm dần)
 *   2) độ phổ biến phụ (viewCount hoặc popularity) (giảm dần)
 * - Trả về tối đa `limit` phim, không bao gồm phim hiện tại.
 *
 * Yêu cầu:
 * - `apiGet(path)` phải tồn tại và trả về JSON.
 * - Có helper: `extractGenreTokens(genres)` và `intersectCount(setA, setB)`.
 *
 * @param {string} movieId - ID của phim hiện tại (Mongo _id hoặc id).
 * @param {number} [limit=10] - Số lượng phim tương tự tối đa cần lấy.
 *
 * @returns {Promise<{ results: Array<Object> }>} 
 * Trả về object chứa mảng `results` (mỗi phần tử là movie object).
 * Luôn trả `{ results: [] }` nếu không có dữ liệu hoặc có lỗi.
 */
export const fetchSimilarMovies = async (movieId, limit = 10) => {
  try {
    if (!movieId) return { results: [] };

    const [detail, all] = await Promise.all([
      apiGet(`/api/movies/${movieId}`),
      apiGet(`/api/movies`),
    ]);

    const cur = extractGenreTokens(detail?.genres);

    if ((!cur.ids.size && !cur.names.size) || !Array.isArray(all)) {
      return { results: [] };
    }

    const results = all
      .filter((m) => {
        const id = (m?._id || m?.id || "").toString();
        return id && id !== movieId;
      })
      .map((m) => {
        const tok = extractGenreTokens(m?.genres);

        // ưu tiên match theo ID; nếu list không populate thì ID sẽ match được
        const commonById = intersectCount(cur.ids, tok.ids);
        const commonByName = intersectCount(cur.names, tok.names);
        const score = Math.max(commonById, commonByName);

        const popularity = (m?.viewCount ?? m?.popularity ?? 0) || 0;
        return { movie: m, score, popularity };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => (b.score - a.score) || (b.popularity - a.popularity))
      .slice(0, limit)
      .map((x) => ({ ...x.movie, id: x.movie.id || x.movie._id }));

    console.log("similar results =", results.length);
    return { results };
  } catch (e) {
    console.log("fetchSimilarMovies error:", e?.message || e);
    return { results: [] };
  }
};

// ===== MOVIE CREDITS (director + cast) =====
export const fetchMovieCredits = async (id) => {
  const res = await API.get(`/movies/${id}/credits`);
  // res.data: { director, cast }
  return res.data;
};

// ===== PERSON DETAIL =====
export const fetchPersonDetails = async (id) => {
  const res = await API.get(`/person/${id}`);
  return res.data;
};

// ===== PERSON MOVIES =====
// cần backend có GET /api/person/:id/movies (mình hướng dẫn ở mục 4)
export const fetchPersonMovies = async (id) => {
  const res = await API.get(`/person/${id}/movies`);
  return { results: res.data }; // tuỳ bạn dùng key gì ở UI
};

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

export async function postRating({ movieId, rating, review = "" }) {
  const res = await API.post("/ratings", { movieId, rating, review });
  return res.data; // { summary }
}

export async function fetchRatingSummary(movieId) {
  const res = await API.get(`/ratings/${movieId}/summary`);
  return res.data; // { avgRating, ratingCount }
}

export async function fetchMovieComments(movieId) {
  const res = await API.get("/ratings", { params: { movieId } });
  return res.data; // array hoặc object tuỳ backend
}

// ===== FAVORITES =====

export async function getFavoriteStatus(movieId) {
  const res = await API.get("/favorites"); // backend trả array favorites
  const list = Array.isArray(res.data) ? res.data : [];

  const isFav = list.some((f) => {
    const mid = f?.movieId?._id || f?.movieId; // populate hoặc không
    return mid && String(mid) === String(movieId);
  });

  return { isFavourite: isFav };
}

export async function toggleFavorite(movieId) {
  // cách an toàn: check status trước
  const st = await getFavoriteStatus(movieId);

  if (st.isFavourite) {
    await API.delete(`/favorites/${movieId}`);
    return { isFavourite: false };
  }

  await API.post("/favorites", { movieId });
  return { isFavourite: true };
}

export async function deleteFavorite(movieId) {
  const res = await API.delete(`/favorites/${movieId}`); // DELETE /api/favorites/:movieId
  return res.data;
}

export async function fetchFavorites() {
  const res = await API.get("/favorites");
  const list = Array.isArray(res.data) ? res.data : [];

  // backend trả [{..., movieId: <Movie populated>}, ...]
  return list
    .map((f) => f?.movieId)
    .filter(Boolean)
    .map((m) => ({ ...m, posterUrl: toPosterUrl(m) }));
}

export const fetchUpcomingMovies = async () => {
  const res = await API.get("/movies/upcoming");
  const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
  return { results: list };
};

