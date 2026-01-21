require("dotenv").config();
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Person = require("../models/Person");

const MONGO_URI = process.env.MONGO_URI;

console.log("SEED MONGO_URI =", process.env.MONGO_URI);

// ================= DATA MẪU =================
const genresData = [
  { name: "Hành động" },
  { name: "Phiêu lưu" },
  { name: "Kịch tính" },
  { name: "Hài" },
  { name: "Khoa học viễn tưởng" },
  { name: "Hoạt hình" },
  { name: "Phép thuật"},
  { name: "Giả tưởng"},
  { name: "Kinh dị"}

];

// PERSON DATA
const personsData = [
  // Directors
  { name: "Christopher Nolan", knownForDepartment: "Directing", popularity: 95 },
  { name: "James Cameron", knownForDepartment: "Directing", popularity: 96 },
  { name: "Katsuya Shigehara", knownForDepartment: "Directing", popularity: 99 }, // conan
  { name: "Takuya Fujikura", knownForDepartment: "Directing", popularity: 99 }, // dora
  { name: "Shigeo Koshi", knownForDepartment: "Directing", popularity: 99 }, // dora
  { name: "Yukiyo Teramoto", knownForDepartment: "Directing", popularity: 99 }, // dora
  { name: "Takuya Ogasawara", knownForDepartment: "Directing", popularity: 99 }, // dora
  { name: "David R. Ellis", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Michael Michael", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "R.J. Mino", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Michael Stevenson", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Annie Penn", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Chris Columbus", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Chris Carreras", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Ian Dray", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Charlotte Mason-Apps", knownForDepartment: "Directing", popularity: 95}, // harry
  { name: "Christine Ko", knownForDepartment: "Directing", popularity: 95}, // tuyet


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
  { name: "Megumi Hayashibara", knownForDepartment: "Acting", popularity: 80, profileUrl: "conan_act_8.jpg"},

  // doraemon cast
  { name: "Wasabi Mizuta", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_1.jpg"},
  { name: "Megumi Oohara", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_2.jpg"},
  { name: "Yumi Kakazu", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_3.jpg"},
  { name: "Subaru Kimura", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_4.jpg"},
  { name: "Tomokazu Seki", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_5.jpg"},
  { name: "Misaki Watada", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_6.jpg"},
  { name: "Atsumi Tanezaki", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_7.jpg"},
  { name: "Misaki Kuno", knownForDepartment: "Acting", popularity: 80, profileUrl: "dora_act_8.jpg"},

  // harry potter cast
  {name: "Daniel Radcliffe", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_1.jpg"},
  {name: "Rupert Grint", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_2.jpg"},
  {name: "Emma Watson", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_3.jpg"},
  {name: "Richard Harris", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_4.jpg"},
  {name: "Tom Felton", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_5.jpg"},
  {name: "Alan Rickman", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_6.jpg"},
  {name: "Robbie Coltrane", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_7.jpg"},
  {name: "Maggie Smith", knownForDepartment: "Acting", popularity: 90, profileUrl: "harry_act_8.jpg"},

  // tuyet cast
  {name: "Jung Ryeo-won", knownForDepartment: "Acting", popularity: 90, profileUrl: "tuyet_act_1.jpg"},
  {name: "Lee Jung-eun", knownForDepartment: "Acting", popularity: 90, profileUrl: "tuyet_act_2.jpg"},



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
    genres: ["Hành động", "Khoa học viễn tưởng"],

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
    genres: ["Phiêu lưu", "Kịch tính", "Khoa học viễn tưởng"],

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
    genres: ["Hành động", "Kịch tính"],

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
    genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],

    directorName: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully", order: 0 },
      { name: "Zoe Saldana", character: "Neytiri", order: 1 },
      { name: "Sigourney Weaver", character: "Kiri", order: 2 },
    ],
    productionCountries: [{ code: "US", name: "United States" }],
  },
  // NhatBan 
  // conan
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
    genres: ["Hoạt hình", "Hành động", "Kịch tính"],

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
    genres: ["Hoạt hình","Hành động", "Kịch tính"],

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
    genres: ["Hoạt hình", "Hành động", "Kịch tính"],

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
    genres: ["Hoạt hình", "Hành động", "Kịch tính"],

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
  // doraemon
  {
    title: "Doraemon Movie 44: Nobita Và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh",
    overview: "Câu chuyện của phim kể về Doraemon, Nobita và những người bạn bước vào một bức tranh đến thế giới châu Âu thời Trung cổ. Trong bức tranh, họ gặp những đứa trẻ đến từ đất nước Artoria. Họ cũng chạm trán một con quỷ nhỏ có cánh tên là Chai. Cùng nhau, họ đối mặt với một kẻ thù mạnh mẽ để giành lấy một viên ngọc huyền thoại.",
    poster: "dora_44.jpg",
    videoUrl: "https://www.youtube.com/watch?v=nDR_9NCMIYk",
    releaseDate: new Date("2025-05-23"),
    runtime: 111,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Hoạt hình", "Phiêu lưu", "Khoa học viễn tưởng", "Hài"],

    directorName: "Takuya Fujikura, Shigeo Koshi, Yukiyo Teramoto, Takuya Ogasawara",
    cast: [
      { name: "Wasabi Mizuta", character: "Doraemon (voice)", order: 0 },
      { name: "Megumi Oohara", character: "Nobita (voice)", order: 1 },
      { name: "Yumi Kakazu", character: "Shizuka (voice)", order: 2 },
      { name: "Subaru Kimura", character: "Gian (voice)", order: 3 },
      { name: "Tomokazu Seki", character: "Suneo (voice)", order: 4 },
      { name: "Misaki Watada", character: "Claire (voice)", order: 5 },
      { name: "Atsumi Tanezaki", character: "Milo (voice)", order: 6 },
      { name: "Misaki Kuno", character: "Chai (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  },        

{
    title: "Doraemon Movie 42: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời",
    overview: "Phim điện ảnh Doraemon: Nobita Và Vùng Đất Lý Tưởng Trên Bầu Trời kể câu chuyện khi Nobita tìm thấy một hòn đảo hình lưỡi liềm trên trời mây. Ở nơi đó, tất cả đều hoàn hảo… đến mức cậu nhóc Nobita mê ngủ ngày cũng có thể trở thành một thần đồng toán học, một siêu sao thể thao. Cả hội Doraemon cùng sử dụng một món bảo bối độc đáo chưa từng xuất hiện trước đây để đến với vương quốc tuyệt vời này. Cùng với những người bạn ở đây, đặc biệt là chàng robot mèo Sonya, cả hội đã có chuyến hành trình tới vương quốc trên mây tuyệt vời… cho đến khi những bí mật đằng sau vùng đất lý tưởng này được hé lộ.",
    poster: "dora_42.jpg",
    videoUrl: "https://www.youtube.com/watch?v=SthaOnp5uDs",
    releaseDate: new Date("2023-06-01"),
    runtime: 107,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Hoạt hình", "Phiêu lưu", "Khoa học viễn tưởng", "Hài"],

    directorName: "Takuya Fujikura, Shigeo Koshi, Yukiyo Teramoto, Takuya Ogasawara",
    cast: [
      { name: "Wasabi Mizuta", character: "Doraemon (voice)", order: 0 },
      { name: "Megumi Oohara", character: "Nobita (voice)", order: 1 },
      { name: "Yumi Kakazu", character: "Shizuka (voice)", order: 2 },
      { name: "Subaru Kimura", character: "Gian (voice)", order: 3 },
      { name: "Tomokazu Seki", character: "Suneo (voice)", order: 4 },
      { name: "Misaki Watada", character: "Claire (voice)", order: 5 },
      { name: "Atsumi Tanezaki", character: "Milo (voice)", order: 6 },
      { name: "Misaki Kuno", character: "Chai (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  },        

{
    title: "Doraemon Movie 40: Nobita và Những Bạn Khủng Long Mới",
    overview: "Tình cờ tìm thấy trứng khủng long khi tham gia hoạt động khảo cổ, Nobita dùng bảo bối thần kỳ khăn trùm thời gian của Doraemon khiến chúng nở ra một cặp khủng long song sinh và đặt tên là Kyu và Myu. Và rồi cùng với Doraemon và nhóm bạn thân, Nobita đưa Kyu và Myu trở về 66 triệu năm trước.",
    poster: "dora_40.jpg",
    videoUrl: "https://www.youtube.com/watch?v=2vdLzk15Z0w",
    releaseDate: new Date("2020-12-18"),
    runtime: 111,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Hoạt hình", "Phiêu lưu", "Khoa học viễn tưởng", "Hài"],

    directorName: "Takuya Fujikura, Shigeo Koshi, Yukiyo Teramoto, Takuya Ogasawara",
    cast: [
      { name: "Wasabi Mizuta", character: "Doraemon (voice)", order: 0 },
      { name: "Megumi Oohara", character: "Nobita (voice)", order: 1 },
      { name: "Yumi Kakazu", character: "Shizuka (voice)", order: 2 },
      { name: "Subaru Kimura", character: "Gian (voice)", order: 3 },
      { name: "Tomokazu Seki", character: "Suneo (voice)", order: 4 },
      { name: "Misaki Watada", character: "Claire (voice)", order: 5 },
      { name: "Atsumi Tanezaki", character: "Milo (voice)", order: 6 },
      { name: "Misaki Kuno", character: "Chai (voice)", order: 7 },

    ],
    productionCountries: [{ code: "JP", name: "Nhật Bản" }],
  },
  
  // Anh
  {
    title: "Harry Potter và Hòn Đá Phù Thủy",
    overview: "Harry Potter, một cậu bé bình thường, bất ngờ được đưa đến Trường Phù thủy và Pháp sư Hogwarts, nơi cậu bắt đầu hành trình phi thường khám phá thế giới phép thuật. Tại đây, Harry phải học cách sử dụng phép thuật, kết bạn mới và đối mặt với những kẻ thù nguy hiểm, đồng thời nhận ra rằng thế giới phù thủy không hề đơn giản như cậu tưởng tượng.",
    poster: "harry_1.jpg",
    videoUrl: "https://www.youtube.com/watch?v=yBAGclXF3Jk",
    releaseDate: new Date("2001-11-16"),
    runtime: 152,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },

   {
    title: "Harry Potter và Phòng Chứa Bí Mật",
    overview: "Năm thứ hai của Harry Potter tại Hogwarts trở nên hỗn loạn khi những lời đe dọa bí ẩn xuất hiện, báo hiệu sự trở lại của phòng chứa bí mật và âm mưu sát hại học sinh Máu bùn bởi người thừa kế Slytherin. Harry, Ron và Hermione, với lòng dũng cảm và tinh thần quyết tâm, bắt đầu cuộc điều tra để tìm ra kẻ đứng sau âm mưu mở phòng chứa bí mật và ngăn chặn thảm kịch xảy ra.",
    poster: "harry_2.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Cy4fjVMOwsY",
    releaseDate: new Date("2002-11-15"),
    runtime: 161,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },

 {
    title: "Harry Potter và Tù Nhân Ngục Azkaban",
    overview: "Một kẻ thù nguy hiểm đang âm thầm hoạt động trong bóng tối, đe dọa sự bình yên của Hogwarts. Harry, Ron và Hermione một lần nữa phải sát cánh bên nhau, sử dụng trí thông minh và lòng dũng cảm để chống lại kẻ thù này.",
    poster: "harry_3.jpg",
    videoUrl: "https://www.youtube.com/watch?v=BsSmcJcu854",
    releaseDate: new Date("2004-05-31"),
    runtime: 141,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },
  
 {
    title: "Harry Potter và Chiếc Cốc Lửa",
    overview: "Harry Potter, một cách bất ngờ, được chọn tham gia Tam Pháp Thuật, cuộc thi pháp thuật nguy hiểm nhất thế giới phép thuật. Hành trình đầy thử thách và bí ẩn của Harry đã dẫn cậu đến trận chung kết cam go, nơi cậu phải chiến đấu để giành chiến thắng và vạch trần âm mưu đen tối của Lord Voldemort.",
    poster: "harry_4.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Y3bLHHN129k",
    releaseDate: new Date("2005-11-18"),
    runtime: 157,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },  

 {
    title: "Harry Potter và Hội Phượng Hoàng",
    overview: "Bộ trưởng Pháp thuật Cornelius Fudge, một người đàn ông bảo thủ và quyền lực, cho rằng Harry và Albus Dumbledore, Hiệu trưởng Hogwarts, đang nói dối. Ông ta bác bỏ những lời cảnh báo của Harry về sự trỗi dậy của Voldemort, đồng thời ra lệnh cho các phương tiện truyền thông và giới chức phù thủy hạ thấp tầm quan trọng của sự kiện này.",
    poster: "harry_5.jpg",
    videoUrl: "https://www.youtube.com/watch?v=oijDWW1CMt0",
    releaseDate: new Date("2007-07-12"),
    runtime: 138,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },
  
 {
    title: "Harry Potter và Hoàng Tử Lai",
    overview: "Harry Potter trở lại Hogwarts, mang theo nỗi lo lắng về hiểm nguy đang âm thầm gia tăng. Cậu và bạn bè buộc phải bước vào cuộc phiêu lưu đầy bí ẩn và nguy hiểm, rèn luyện bản lĩnh và hy sinh để có thể chống lại thế lực hắc ám.",
    poster: "harry_6.jpg",
    videoUrl: "https://www.youtube.com/watch?v=kLIoLXJTX_c",
    releaseDate: new Date("2009-07-15"),
    runtime: 153,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },  

 {
    title: "Harry Potter và Bảo Bối Tử Thần: Phần 1",
    overview: "Harry Potter, cùng Ron và Hermione, bước vào hành trình nguy hiểm: truy tìm và phá hủy Trường Sinh Linh Giá - bí mật mang lại sự bất tử cho Voldemort. Họ phải đối mặt với vô số thử thách, chiến đấu với thế lực hắc ám và hy sinh nhiều thứ để hoàn thành nhiệm vụ này.",
    poster: "harry_7.jpg",
    videoUrl: "https://www.youtube.com/watch?v=loDgd0irr3Y",
    releaseDate: new Date("2010-11-19"),
    runtime: 146,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },
  
 {
    title: "Harry Potter và Bảo Bối Tử Thần: Phần 2",
    overview: "Tiếp nối phần 1, Harry, Ron và Hermione tiếp tục hành trình truy tìm và tiêu diệt Trường Sinh Linh Giá - bí mật mang lại sự bất tử cho Voldemort. Họ phải đối mặt với vô số thử thách nguy hiểm, chiến đấu với Tử thần Thực tử và dần khám phá ra những bí mật đen tối về quá khứ của Voldemort.",
    poster: "harry_8.jpg",
    videoUrl: "https://www.youtube.com/watch?v=EJrI-WxhU3s",
    releaseDate: new Date("2007-07-15"),
    runtime: 130,
    status: "Released",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Giả tưởng", "Phép thuật", "Kịch tính"],

    directorName: "David R. Ellis, Michael Michael, R.J. Mino, Michael Stevenson, Annie Penn, Chris Columbus, Chris Carreras, Ian Dray, Charlotte Mason-Apps",
    cast: [
      { name: "Daniel Radcliffe", character: "Harry Potter", order: 0 },
      { name: "Rupert Grint", character: "Ron Weasley", order: 1 },
      { name: "Emma Watson", character: "Hermione Granger", order: 2 },
      { name: "Richard Harris", character: "Albus Dumbledore", order: 3 },
      { name: "Tom Felton", character: "Draco Malfoy", order: 4 },
      { name: "Alan Rickman", character: "Severus Snape", order: 5 },
      { name: "Robbie Coltrane", character: "Rubeus Hagrid", order: 6 },
      { name: "Maggie Smith", character: "Minerva McGonagall", order: 7 },

    ],
    productionCountries: [{ code: "UK", name: "Anh" }],
  },

  {
    title: "Avatar: Lửa và Tro Tàn",
    overview: "Sau cuộc chiến tàn khốc với RDA và nỗi mất mát to lớn khi đứa con trai cả hy sinh, Jake Sully và Neytiri phải đối mặt với một mối đe dọa mới trên Pandora: tộc Tro Tàn — một nhóm Na'vi hung bạo và khát khao quyền lực, do thủ lĩnh tàn nhẫn Varang dẫn dắt. Gia đình Jake buộc phải chiến đấu để sinh tồn và bảo vệ tương lai của Pandora, trong một cuộc xung đột đẩy họ đến giới hạn cuối cùng cả về thể xác lẫn tinh thần.",
    poster: "avatar_3.jpg",
    videoUrl: "https://www.youtube.com/watch?v=rZXmSgjxpdQ",
    releaseDate: new Date("2026-02-15"),
    runtime: 192,
    status: "Upcoming",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],

    directorName: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully", order: 0 },
      { name: "Zoe Saldana", character: "Neytiri", order: 1 },
      { name: "Sigourney Weaver", character: "Kiri", order: 2 },
    ],
    productionCountries: [{ code: "US", name: "United States" }],
  },

{
    title: "Không Bông Tuyết Nào Trong Sạch",
    overview: "Phim theo chân Do Kyung (Jung Ryeo-won thủ vai) - người vội vã đưa chị gái của mình đến bệnh viện trong tình trạng đẫm máu. Giữa lúc tâm trí hoảng loạn, cô đưa ra lời khai đầy mâu thuẫn trước cảnh sát Hyun Joo (Lee Jung-eun thủ vai). Khi mỗi người kể lại những gì đã xảy ra theo những góc nhìn khác nhau, sự thật phía sau vụ việc dần được hé mở qua những ký ức đan xen và dối trá, tạo nên một bức tranh tâm lý đầy kịch tính.",
    poster: "tuyet.jpg",
    videoUrl: "https://www.youtube.com/watch?v=VMve-FszDFw",
    releaseDate: new Date("2026-01-25"),
    runtime: 108,
    status: "Upcoming",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Kinh dị"],

    directorName: "Christine Ko",
    cast: [
      { name: "Jung Ryeo-won", character: "Do-kyung", order: 0 },
      { name: "Lee Jung-eun", character: "Hyun-ju", order: 1 }
    ],
    productionCountries: [{ code: "KO", name: "Hàn Quốc" }],
  },
  
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
