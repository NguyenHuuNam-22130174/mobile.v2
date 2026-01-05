require("dotenv").config();
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Person = require("../models/Person"); // ✅ thêm

const MONGO_URI = process.env.MONGO_URI;

console.log("SEED MONGO_URI =", process.env.MONGO_URI);

// ================= DATA MẪU =================
const genresData = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Drama" },
  { name: "Comedy" },
  { name: "Sci-Fi" },
  { name: "Anime" }
];

// PERSON DATA
const personsData = [
  // Directors
  { name: "Christopher Nolan", knownForDepartment: "Directing", popularity: 95 },
  { name: "James Cameron", knownForDepartment: "Directing", popularity: 96 },
  { name: "Katsuya Shigehara", knownForDepartment: "Directing", popularity: 99 }, // conan


  // Inception cast
  { name: "Leonardo DiCaprio", knownForDepartment: "Acting", popularity: 90, profileUrl: "leonardo-dicaprio.jpg" },
  { name: "Joseph Gordon-Levitt", knownForDepartment: "Acting", popularity: 80, profileUrl: "joseph-gordon-levitt.jpg" },
  { name: "Elliot Page", knownForDepartment: "Acting", popularity: 78, profileUrl: "elliot-page.jpg" },
  { name: "Tom Hardy", knownForDepartment: "Acting", popularity: 85, profileUrl: "tom-hardy.jpg" },

  // Interstellar cast
  { name: "Matthew McConaughey", knownForDepartment: "Acting", popularity: 86, profileUrl: "matthew-mcconaughey.jpg" },
  { name: "Anne Hathaway", knownForDepartment: "Acting", popularity: 84, profileUrl: "anne-hathaway.jpg" },
  { name: "Jessica Chastain", knownForDepartment: "Acting", popularity: 82, profileUrl: "jessica-chastain.jpg" },
  { name: "Michael Caine", knownForDepartment: "Acting", popularity: 88, profileUrl: "michael-caine.jpg" },

  // Dark Knight cast
  { name: "Christian Bale", knownForDepartment: "Acting", popularity: 85, profileUrl: "christian-bale.jpg" },
  { name: "Heath Ledger", knownForDepartment: "Acting", popularity: 90, profileUrl: "heath-ledger.jpg" },
  { name: "Gary Oldman", knownForDepartment: "Acting", popularity: 80, profileUrl: "gary-oldman.jpg" },

  // Avatar 2 cast
  { name: "Sam Worthington", knownForDepartment: "Acting", popularity: 75, profileUrl: "sam-worthington.jpg" },
  { name: "Zoe Saldana", knownForDepartment: "Acting", popularity: 88, profileUrl: "zoe-saldana.jpg" },
  { name: "Sigourney Weaver", knownForDepartment: "Acting", popularity: 83, profileUrl: "sigourney-weaver.jpg" },

  // Conan cast
  { name: "Minami Takayama", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_1.jpg"},
  { name: "Kappei Yamaguchi", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_2.jpg"},
  { name: "Wakana Yamazaki", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_3.jpg"},
  { name: "Rikiya Koyama", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_4.jpg"},
  { name: "Yuji Takada", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_5.jpg"},
  { name: "Ami Koshimizu", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_6.jpg"},
  { name: "Show Hayami", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_7.jpg"},
  { name: "Megumi Hayashibara", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_8.jpg"}

];

const moviesData = [
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology.",
    poster: "inception.jpg",
    videoUrl: "https://www.youtube.com/watch?v=8hP9D6kZseM",
    releaseDate: new Date("2010-07-16"),
    runtime: 148,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 90,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Action", "Sci-Fi"],

    //credits (gán bằng name -> map sang ObjectId)
    directorName: "Christopher Nolan",
    cast: [
      { name: "Leonardo DiCaprio", character: "Cobb", order: 0 },
      { name: "Joseph Gordon-Levitt", character: "Arthur", order: 1 },
      { name: "Elliot Page", character: "Ariadne", order: 2 },
      { name: "Tom Hardy", character: "Eames", order: 3 },
    ],
    productionCountries: [{ code: "US", name: "United States" }],
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space.",
    poster: "interstellar.jpg",
    videoUrl: "https://www.youtube.com/watch?v=QqSp_dwslro",
    releaseDate: new Date("2014-11-07"),
    runtime: 169,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 88,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Adventure", "Drama", "Sci-Fi"],

    directorName: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", order: 0 },
      { name: "Anne Hathaway", character: "Brand", order: 1 },
      { name: "Jessica Chastain", character: "Murph", order: 2 },
      { name: "Michael Caine", character: "Professor Brand", order: 3 },
    ],
    productionCountries: [{ code: "US", name: "United States" }],
  },
  {
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime.",
    poster: "dark_night.jpg",
    videoUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    releaseDate: new Date("2008-07-18"),
    runtime: 152,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 95,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Action", "Drama"],

    directorName: "Christopher Nolan",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", order: 0 },
      { name: "Heath Ledger", character: "Joker", order: 1 },
      { name: "Gary Oldman", character: "Commissioner Gordon", order: 2 },
    ],
    productionCountries: [{ code: "US", name: "United States" }],
  },
  {
    title: "Avatar 2",
    overview: "Jake Sully lives with his newfound family on Pandora.",
    poster: "avatar_2.jpg",
    videoUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    releaseDate: new Date("2022-12-16"),
    runtime: 192,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 85,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Action", "Adventure", "Sci-Fi"],

    directorName: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully", order: 0 },
      { name: "Zoe Saldana", character: "Neytiri", order: 1 },
      { name: "Sigourney Weaver", character: "Kiri", order: 2 },
    ],
    productionCountries: [{ code: "US", name: "United States" }],
  },
  // NhatBan - anime
  {
    title: "Thám Tử Lừng Danh Conan Movie 28: Dư Ảnh của Độc Nhãn",
    overview: "Trên những ngọn núi tuyết của Nagano, một vụ án bí ẩn đã đưa Conan và các thám tử quay trở lại quá khứ. Thanh tra Yamato Kansuke - người đã bị thương nặng trong một trận tuyết lở nhiều năm trước - bất ngờ phải đối mặt với những ký ức đau thương của mình trong khi điều tra một vụ tấn công tại Đài quan sát Nobeyama. Cùng lúc đó, Mori Kogoro nhận được một cuộc gọi từ một đồng nghiệp cũ, tiết lộ mối liên hệ đáng ngờ giữa anh ta và vụ án đã bị lãng quên từ lâu. Sự xuất hiện của Morofushi Takaaki, cùng với những nhân vật chủ chốt như Amuro Tooru, Kazami và cảnh sát Tokyo, càng làm phức tạp thêm cuộc điều tra. Khi quá khứ và hiện tại đan xen, một bí ẩn rùng rợn dần dần được hé lộ - và ký ức của Kansuke nắm giữ chìa khóa cho mọi thứ.",
    poster: "conan_28.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dz5mN-iIC4g",
    releaseDate: new Date("2025-07-25"),
    runtime: 109,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Anime"],

    directorName: "Katsuya Shigehara",
    cast: [
      { name: "Minami Takayama", character: "Conan Edogawa (voice)", order: 0 },
      { name: "Kappei Yamaguchi", character: "Shinichi Kudo (voice)", order: 1 },
      { name: "Wakana Yamazaki", character: "Ran Mouri (voice)", order: 2 },
      { name: "Rikiya Koyama", character: "Kogoro Mouri (voice)", order: 3 },
      { name: "Yuji Takada", character: "Kensuke Yamato (voice)", order: 4 },
      { name: "Ami Koshimizu", character: "Yui Uehara (voice)", order: 5 },
      { name: "Show Hayami", character: "Takaaki Morofushi (voice)", order: 6 },
      { name: "Megumi Hayashibara", character: "Ai Haibara (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  },
 
 {
    title: "Thám Tử Lừng Danh Conan Movie 27: Ngôi Sao 5 Cánh 1 Triệu Đô",
    overview: "Thông báo từ Kaito Kid đã được gửi tới phòng chứa đồ của Axie Zaibatsu ở Hakodate, Hokkaidō. Mục tiêu của Kid lần này là một thanh kiếm Nhật gắn liền với Toshizō Hijikata, phó chỉ huy của Shinsengumi sống vào cuối thời Edo. Tại sao Kid, người đang theo đuổi Big Jewel, lại nhắm đến thanh kiếm...?",
    poster: "conan_27.jpg",
    videoUrl: "https://www.youtube.com/watch?v=C4pG3GbhQZw",
    releaseDate: new Date("2024-08-02"),
    runtime: 110,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Anime"],

    directorName: "Katsuya Shigehara",
    cast: [
      { name: "Minami Takayama", character: "Conan Edogawa (voice)", order: 0 },
      { name: "Kappei Yamaguchi", character: "Shinichi Kudo (voice)", order: 1 },
      { name: "Wakana Yamazaki", character: "Ran Mouri (voice)", order: 2 },
      { name: "Rikiya Koyama", character: "Kogoro Mouri (voice)", order: 3 },
      { name: "Yuji Takada", character: "Kensuke Yamato (voice)", order: 4 },
      { name: "Ami Koshimizu", character: "Yui Uehara (voice)", order: 5 },
      { name: "Show Hayami", character: "Takaaki Morofushi (voice)", order: 6 },
      { name: "Megumi Hayashibara", character: "Ai Haibara (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  },

  {
    title: "Thám Tử Lừng Danh Conan Movie 26: Tàu Ngầm Sắt Màu Đen",
    overview: "Địa điểm lần này được đặt ở vùng biển gần đảo Hachijo-jima, Tokyo. Các kỹ sư từ khắp nơi trên thế giới đã tập hợp để vận hành toàn diện Phao Thái Bình Dương, một cơ sở ngoài khơi để kết nối các camera an ninh thuộc sở hữu của lực lượng cảnh sát trên toàn thế giới. Một thử nghiệm về một công nghệ mới nhất định dựa trên hệ thống nhận dạng khuôn mặt đang được tiến hành ở đó. Trong khi đó, Conan và Đội thám tử nhí đến thăm Hachijo-jima theo lời mời của Sonoko và nhận được một cuộc điện thoại từ Subaru Okiya thông báo rằng một nhân viên Europol đã bị sát hại ở Đức bởi Jin của Tổ chức Áo đen. Conan lo lắng, lẻn vào cơ sở và phát hiện ra rằng một nữ kỹ sư đã bị Tổ chức Áo đen bắt cóc...! Hơn nữa, một ổ USB chứa một số thông tin nhất định mà cô ấy sở hữu lại lọt vào tay tổ chức... Một bóng đen cũng len lỏi vào Ai Haibara..",
    poster: "conan_26.jpg",
    videoUrl: "https://www.youtube.com/watch?v=NwnQI9izPFc",
    releaseDate: new Date("2023-07-21"),
    runtime: 110,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Anime"],

    directorName: "Katsuya Shigehara",
    cast: [
      { name: "Minami Takayama", character: "Conan Edogawa (voice)", order: 0 },
      { name: "Kappei Yamaguchi", character: "Shinichi Kudo (voice)", order: 1 },
      { name: "Wakana Yamazaki", character: "Ran Mouri (voice)", order: 2 },
      { name: "Rikiya Koyama", character: "Kogoro Mouri (voice)", order: 3 },
      { name: "Yuji Takada", character: "Kensuke Yamato (voice)", order: 4 },
      { name: "Ami Koshimizu", character: "Yui Uehara (voice)", order: 5 },
      { name: "Show Hayami", character: "Takaaki Morofushi (voice)", order: 6 },
      { name: "Megumi Hayashibara", character: "Ai Haibara (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  },
  {
    title: "Thám Tử Lừng Danh Conan Movie 25: Nàng Dâu Halloween",
    overview: "Thám tử lừng danh Conan: Nàng dâu Halloween là phim điện ảnh anime trinh thám năm 2022 của Nhật Bản dựa trên nguyên tác là bộ manga Thám tử lừng danh Conan của hoạ sĩ Aoyama Gōshō. Phim do Mitsunaka Susumu đạo diễn, dựa trên phần kịch bản do Okura Takahiro chấp bút.",
    poster: "conan_25.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Pt38ZgehKlI",
    releaseDate: new Date("2022-07-22"),
    runtime: 111,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Anime"],

    directorName: "Katsuya Shigehara",
    cast: [
      { name: "Minami Takayama", character: "Conan Edogawa (voice)", order: 0 },
      { name: "Kappei Yamaguchi", character: "Shinichi Kudo (voice)", order: 1 },
      { name: "Wakana Yamazaki", character: "Ran Mouri (voice)", order: 2 },
      { name: "Rikiya Koyama", character: "Kogoro Mouri (voice)", order: 3 },
      { name: "Yuji Takada", character: "Kensuke Yamato (voice)", order: 4 },
      { name: "Ami Koshimizu", character: "Yui Uehara (voice)", order: 5 },
      { name: "Show Hayami", character: "Takaaki Morofushi (voice)", order: 6 },
      { name: "Megumi Hayashibara", character: "Ai Haibara (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  }    

];
// =================================================

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    console.log("SEED DB NAME =", mongoose.connection.name);

    // RESET DATA
    await Movie.deleteMany();
    await Genre.deleteMany();
    await Person.deleteMany(); //thêm
    console.log("Old data removed");

    // INSERT GENRES
    const genres = await Genre.insertMany(genresData);
    console.log("Genres seeded");

    // MAP genre name → ObjectId
    const genreMap = {};
    genres.forEach((g) => {
      genreMap[g.name] = g._id;
    });

    //INSERT PERSONS
    const persons = await Person.insertMany(personsData);
    console.log("Persons seeded");

    // MAP person name → ObjectId
    const personMap = {};
    persons.forEach((p) => {
      personMap[p.name] = p._id;
    });

    // INSERT MOVIES (kèm credits)
    const movies = moviesData.map((movie) => {
      const directorId = personMap[movie.directorName] || null;

      const castArr = (movie.cast || [])
        .map((c) => {
          const pid = personMap[c.name];
          if (!pid) return null; // nếu thiếu person thì bỏ
          return {
            person: pid,
            character: c.character || "",
            order: c.order ?? 0,
          };
        })
        .filter(Boolean);

      return {
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster,
        videoUrl: movie.videoUrl || null,
        releaseDate: movie.releaseDate,
        runtime: movie.runtime,
        status: movie.status,
        voteAverage: movie.voteAverage,
        voteCount: movie.voteCount ?? 0,
        popularity: movie.popularity,
        viewCount: movie.viewCount ?? 0,
        lastViewedAt: movie.lastViewedAt ?? null,

        // genres như bạn đang làm
        genres: movie.genres.map((name) => ({
          genreId: genreMap[name],
          name,
        })),

        //credits
        director: directorId,
        cast: castArr,
        productionCountries: movie.productionCountries || [],
      };
    });

    await Movie.insertMany(movies);
    console.log("Movies seeded (with credits)");

    console.log("SEED DATA SUCCESS");
    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
