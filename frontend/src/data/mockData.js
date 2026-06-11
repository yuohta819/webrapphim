export const initialUsers = [
  {
    id: "user-1",
    email: "admin@cineluxe.com",
    password: "adminpassword",
    name: "System Admin",
    role: "admin",
    status: "active"
  },
  {
    id: "user-2",
    email: "user@gmail.com",
    password: "userpassword",
    name: "Nguyễn Văn A",
    role: "user",
    status: "active"
  },
  {
    id: "user-3",
    email: "blocked@gmail.com",
    password: "blockedpassword",
    name: "Trần Văn Block",
    role: "user",
    status: "blocked"
  }
];

export const initialRooms = [
  {
    id: "room-1",
    name: "Phòng 1 - IMAX Premium",
    rows: ["A", "B", "C", "D", "E", "F", "G", "H"],
    cols: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    type: "IMAX"
  },
  {
    id: "room-2",
    name: "Phòng 2 - Gold Class",
    rows: ["A", "B", "C", "D", "E", "F"],
    cols: [1, 2, 3, 4, 5, 6, 7, 8],
    type: "Gold Class"
  },
  {
    id: "room-3",
    name: "Phòng 3 - Standard 2D",
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    cols: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    type: "Standard"
  }
];

export const initialMovies = [
  {
    id: "movie-1",
    title: "Avengers: Secret Wars",
    category: "Hành động, Viễn tưởng, Phiêu lưu",
    duration: 180,
    rating: "C16 - Cấm khán giả dưới 16 tuổi",
    imdbRating: 9.3,
    description: "Trận chiến vĩ đại nhất của các siêu anh hùng Marvel nhằm giải cứu đa vũ trụ khỏi sự hủy diệt hoàn toàn. Trận chiến thế kỷ kết hợp tất cả các nhánh dòng thời gian khác nhau.",
    releaseDate: "2026-05-01",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isHot: true
  },
  {
    id: "movie-2",
    title: "Dune: Part Three (Sứ Cát - Phần 3)",
    category: "Viễn tưởng, Tâm lý, Epic",
    duration: 165,
    rating: "C13 - Cấm khán giả dưới 13 tuổi",
    imdbRating: 9.5,
    description: "Paul Atreides tiếp tục dẫn dắt cuộc thánh chiến thiên hà của người Fremen, đối diện với những thế lực đen tối nhất vũ trụ và gánh vác sứ mệnh tiên tri đầy bi kịch.",
    releaseDate: "2026-03-15",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isHot: true
  },
  {
    id: "movie-3",
    title: "Lật Mặt 7: Một Điều Ước",
    category: "Gia đình, Tâm lý, Tình cảm",
    duration: 125,
    rating: "P - Cho phép mọi lứa tuổi",
    imdbRating: 8.8,
    description: "Câu chuyện gia đình đầy cảm động xoay quanh người mẹ già tảo tần nuôi nấng những đứa con khôn lớn. Khi bà gặp nạn, người con nào sẽ về bên bà chăm sóc?",
    releaseDate: "2026-04-30",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isHot: false
  },
  {
    id: "movie-4",
    title: "Spider-Man: Beyond the Spider-Verse",
    category: "Hoạt hình, Hành động, Đa vũ trụ",
    duration: 140,
    rating: "P - Cho phép mọi lứa tuổi",
    imdbRating: 9.4,
    description: "Miles Morales cùng nhóm Người Nhện hợp tác xuyên không gian để đánh bại phản diện nguy hiểm nhất, tìm kiếm sự tự do và giải cứu gia đình khỏi số phận đã định sẵn.",
    releaseDate: "2026-07-10",
    poster: "https://images.unsplash.com/photo-1608889174633-81499f32d395?q=80&w=600&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200&auto=format&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isHot: true
  }
];

export const initialShowtimes = [
  // Movie 1: Avengers: Secret Wars
  {
    id: "showtime-1",
    movieId: "movie-1",
    roomId: "room-1", // IMAX
    date: "2026-06-12",
    time: "09:30",
    price: 150000,
    bookedSeats: ["A3", "A4", "B5", "B6"]
  },
  {
    id: "showtime-2",
    movieId: "movie-1",
    roomId: "room-1",
    date: "2026-06-12",
    time: "14:00",
    price: 150000,
    bookedSeats: ["E1", "E2", "E3", "F5"]
  },
  {
    id: "showtime-3",
    movieId: "movie-1",
    roomId: "room-3", // Standard
    date: "2026-06-13",
    time: "20:30",
    price: 95000,
    bookedSeats: []
  },
  
  // Movie 2: Dune: Part Three
  {
    id: "showtime-4",
    movieId: "movie-2",
    roomId: "room-2", // Gold Class
    date: "2026-06-12",
    time: "18:00",
    price: 250000,
    bookedSeats: ["C3", "C4"]
  },
  {
    id: "showtime-5",
    movieId: "movie-2",
    roomId: "room-3",
    date: "2026-06-13",
    time: "15:30",
    price: 95000,
    bookedSeats: ["A1", "A2", "C10"]
  },

  // Movie 3: Lật Mặt 7
  {
    id: "showtime-6",
    movieId: "movie-3",
    roomId: "room-3",
    date: "2026-06-12",
    time: "10:00",
    price: 85000,
    bookedSeats: ["A5", "A6", "A7"]
  },
  {
    id: "showtime-7",
    movieId: "movie-3",
    roomId: "room-3",
    date: "2026-06-12",
    time: "17:15",
    price: 90000,
    bookedSeats: []
  }
];

export const initialPromotions = [
  {
    id: "promo-1",
    code: "CINELUXE10",
    description: "Giảm 10% tổng giá trị hóa đơn đặt vé.",
    discountType: "percent",
    value: 10,
    minApplicable: 100000,
    isActive: true
  },
  {
    id: "promo-2",
    code: "GOLDCLASS20",
    description: "Giảm giá 20% cho các suất chiếu Gold Class đẳng cấp.",
    discountType: "percent",
    value: 20,
    minApplicable: 200000,
    isActive: true
  },
  {
    id: "promo-3",
    code: "GIAM50K",
    description: "Giảm trực tiếp 50,000 VND cho giao dịch từ 150,000 VND.",
    discountType: "fixed",
    value: 50000,
    minApplicable: 150000,
    isActive: true
  },
  {
    id: "promo-4",
    code: "VIP80K",
    description: "Giảm 80,000 VND tri ân khách hàng thân thiết.",
    discountType: "fixed",
    value: 80000,
    minApplicable: 250000,
    isActive: false // Demo blocked code
  }
];

export const initialBookings = [
  {
    id: "booking-1",
    userId: "user-2", // Nguyễn Văn A
    showtimeId: "showtime-1",
    movieTitle: "Avengers: Secret Wars",
    roomName: "Phòng 1 - IMAX Premium",
    showDate: "2026-06-12",
    showTime: "09:30",
    seats: ["A3", "A4"],
    price: 300000,
    discount: 30000,
    totalPrice: 270000,
    promoCode: "CINELUXE10",
    paymentMethod: "vnpay",
    status: "completed", // completed, cancelled
    bookingTime: "2026-06-10T10:30:00.000Z"
  },
  {
    id: "booking-2",
    userId: "user-2",
    showtimeId: "showtime-4",
    movieTitle: "Dune: Part Three (Sứ Cát - Phần 3)",
    roomName: "Phòng 2 - Gold Class",
    showDate: "2026-06-12",
    showTime: "18:00",
    seats: ["C3", "C4"],
    price: 500000,
    discount: 100000,
    totalPrice: 400000,
    promoCode: "GOLDCLASS20",
    paymentMethod: "momo",
    status: "completed",
    bookingTime: "2026-06-10T11:15:00.000Z"
  }
];

export const onePieceCharacters = [
  {
    id: "char-1",
    name: "Monkey D. Luffy",
    role: "Thuyền Trưởng Băng Mũ Rơm",
    bounty: "3,000,000,000 Berry",
    quote: "Tôi sẽ trở thành Vua Hải Tặc!!!",
    avatar: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop",
    color: "from-red-600 via-orange-500 to-yellow-500",
    stats: { Haki: 98, Strength: 95, Agility: 92, HakiType: "Haki Bá Vương" }
  },
  {
    id: "char-2",
    name: "Roronoa Zoro",
    role: "Kiếm Sĩ / Thuyền Phó Băng Mũ Rơm",
    bounty: "1,111,000,000 Berry",
    quote: "Không có gì xảy ra cả.",
    avatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop",
    color: "from-emerald-600 via-green-500 to-teal-500",
    stats: { Haki: 90, Strength: 94, Agility: 88, HakiType: "Haki Vũ Trang" }
  },
  {
    id: "char-3",
    name: "Vinsmoke Sanji",
    role: "Đầu Bếp Băng Mũ Rơm / Chân Đen",
    bounty: "1,032,000,000 Berry",
    quote: "Lịch lãm là vũ khí mạnh nhất của người đàn ông.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    color: "from-blue-600 via-cyan-500 to-indigo-500",
    stats: { Haki: 85, Strength: 90, Agility: 95, HakiType: "Haki Quan Sát" }
  },
  {
    id: "char-4",
    name: "Nami",
    role: "Hoa Tiêu Băng Mũ Rơm / Miêu Tặc",
    bounty: "366,000,000 Berry",
    quote: "Tiền bạc và bản đồ thế giới là tất cả những gì tôi cần!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    color: "from-amber-500 via-orange-400 to-yellow-300",
    stats: { Haki: 40, Strength: 60, Agility: 82, HakiType: "Thời Tiết Hầu" }
  }
];

export const latestEpisodes = [
  {
    id: "ep-1115",
    number: "Tập 1115",
    title: "Chấn Động Toàn Cầu! Sức Mạnh Khủng Khiếp Của Ngũ Hoàng",
    description: "Trận chiến Egghead đạt tới đỉnh điểm khi Ngũ Lão Tinh đồng loạt thức tỉnh năng lực ác quỷ. Luffy Gear 5 phải hợp lực cùng các đồng minh chống lại ngày tàn của thế giới.",
    duration: "24 phút",
    rating: 9.8,
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=500&auto=format&fit=crop",
    releaseTime: "3 giờ trước"
  },
  {
    id: "ep-1114",
    number: "Tập 1114",
    title: "Đột Kích Đảo Hải Tặc! Nắm Đấm Của Anh Hùng Garp",
    description: "Anh Hùng Hải Quân Garp phát động đòn tấn công nghiền nát Đảo Hachinosu để cứu Koby, phô diễn sức mạnh Haki chấn động trời đất bất chấp tuổi già.",
    duration: "24 phút",
    rating: 9.9,
    thumbnail: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=500&auto=format&fit=crop",
    releaseTime: "1 ngày trước"
  },
  {
    id: "ep-1113",
    number: "Tập 1113",
    title: "Chạy Đi Koby! Kế Hoạch Đào Tẩu Khỏi Đảo Hải Tặc",
    description: "Koby nỗ lực giải cứu các nô lệ và trốn thoát khỏi sự giam cầm của băng Râu Đen, nhận được sự giúp đỡ bất ngờ từ các thành viên SWORD.",
    duration: "24 phút",
    rating: 9.4,
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
    releaseTime: "1 tuần trước"
  }
];

export const storyArcs = [
  {
    id: "arc-1",
    title: "Saga Biển Đông (East Blue)",
    period: "Tập 1 - 61",
    description: "Điểm khởi đầu của chuyến hành trình vĩ đại. Monkey D. Luffy bắt đầu gầy dựng băng Mũ Rơm, tập hợp Zoro, Nami, Usopp và Sanji để tiến vào Đại Hải Trình.",
    highlight: "Luffy nhận chiếc Mũ Rơm và đánh bại Arlong.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "arc-2",
    title: "Saga Alabasta",
    period: "Tập 62 - 135",
    description: "Trận chiến giải cứu vương quốc cát Alabasta khỏi âm mưu thâu tóm của Thất Vũ Hải Crocodile và tổ chức bí ẩn Baroque Works.",
    highlight: "Tinh thần đồng đội gắn kết và đánh bại Crocodile.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "arc-3",
    title: "Saga Water 7 / Enies Lobby",
    period: "Tập 229 - 325",
    description: "Trận chiến đi vào huyền thoại cứu Nico Robin chống lại chính quyền thế giới CP9. Băng Mũ Rơm tuyên chiến với cả thế giới tại Enies Lobby.",
    highlight: "Sự thức tỉnh Gear 2/Gear 3 và câu nói 'Tôi muốn sống!'.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "arc-4",
    title: "Saga Marineford (Hội Nghị Thượng Đỉnh)",
    period: "Tập 385 - 516",
    description: "Trận đại chiến lớn nhất lịch sử Hải Quân giữa Râu Trắng và Hải Quân nhằm cứu hỏa chí Portgas D. Ace. Bước ngoặt đau lòng thay đổi thời đại.",
    highlight: "Sự ra đi của Râu Trắng, Ace và quyết định tập luyện 2 năm.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "arc-5",
    title: "Saga Wano Quốc",
    period: "Tập 890 - 1085",
    description: "Trận chiến lật đổ Tứ Hoàng Kaido Bách Thú và Kurozumi Orochi, giải phóng đất nước Wano samurai và tìm hiểu nguồn gốc Joy Boy.",
    highlight: "Luffy thức tỉnh Gear 5 và giải phóng sức mạnh Thần Mặt Trời Nika.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400&auto=format&fit=crop"
  }
];

export const fanArtGallery = [
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=600&auto=format&fit=crop"
];

export const systemStatistics = [
  { label: "Tổng số Tập", value: "1100+" },
  { label: "Phim Điện Ảnh", value: "15 phim" },
  { label: "Năm Phát Hành", value: "25+ năm" },
  { label: "Người Hâm Mộ", value: "50M+" }
];

export const initialCinemas = [
  {
    id: "cinema-1",
    name: "CineLuxe Opera Grand",
    address: "Số 1 Công Xã Paris, Quận 1, TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop",
    phone: "1900 6017",
    rooms: ["room-1", "room-2", "room-3"]
  },
  {
    id: "cinema-2",
    name: "CineLuxe Landmark Gold",
    address: "Tầng 5 Landmark 81, Bình Thạnh, TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&auto=format&fit=crop",
    phone: "1900 6018",
    rooms: ["room-1", "room-2", "room-3"]
  },
  {
    id: "cinema-3",
    name: "CineLuxe IMAX Mall",
    address: "Tầng 3 SC VivoCity, Quận 7, TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop",
    phone: "1900 6019",
    rooms: ["room-1", "room-3"]
  }
];

export const foodAndDrinks = [
  {
    id: "food-1",
    name: "Bắp Ngọt Lớn (Sweet Popcorn L)",
    description: "Bắp rang bơ vị ngọt truyền thống, giòn tan thơm bơ Pháp.",
    price: 65000,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=300&auto=format&fit=crop",
    category: "popcorn"
  },
  {
    id: "food-2",
    name: "Pepsi Premium Lớn",
    description: "Nước ngọt có ga Pepsi ly lớn 32oz mát lạnh sảng khoái.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop",
    category: "drink"
  },
  {
    id: "food-3",
    name: "Combo CineLuxe Solo",
    description: "1 Bắp ngọt lớn + 1 Nước ngọt Pepsi ly lớn.",
    price: 85000,
    image: "https://images.unsplash.com/photo-1605809787352-7b003a628841?q=80&w=300&auto=format&fit=crop",
    category: "combo"
  },
  {
    id: "food-4",
    name: "Combo CineLuxe Couple",
    description: "1 Bắp ngọt lớn + 2 Nước ngọt Pepsi ly lớn + 1 Snack Khoai tây.",
    price: 120000,
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=300&auto=format&fit=crop",
    category: "combo"
  },
  {
    id: "food-5",
    name: "Gold VIP Combo",
    description: "1 Bắp Caramel VIP + 2 Nước ngọt tùy chọn + 1 Hot Dog premium.",
    price: 160000,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=300&auto=format&fit=crop",
    category: "combo"
  }
];

export const comingSoonMovies = [
  {
    id: "coming-1",
    title: "One Piece Film: Red (Re-run 4K)",
    category: "Anime, Hành động, Âm nhạc",
    releaseDate: "2026-07-15",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop",
    duration: 115,
    imdbRating: 8.9
  },
  {
    id: "coming-2",
    title: "Avatar: Fire and Ash (Phần 3)",
    category: "Viễn tưởng, Epic, Phiêu lưu",
    releaseDate: "2026-12-18",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop",
    duration: 190,
    imdbRating: 9.0
  },
  {
    id: "coming-3",
    title: "Joker: Folie à Deux",
    category: "Tâm lý, Nhạc kịch, Giật gân",
    releaseDate: "2026-08-05",
    poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=300&auto=format&fit=crop",
    duration: 138,
    imdbRating: 8.4
  }
];

export const topRatedMovies = [
  {
    id: "rated-1",
    title: "Interstellar (Hố Đen Vũ Trụ)",
    rating: 9.8,
    category: "Viễn tưởng, Khoa học, Tâm lý",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "rated-2",
    title: "The Dark Knight (Kỵ Sĩ Bóng Đêm)",
    rating: 9.7,
    category: "Hành động, Tội phạm, Giật gân",
    poster: "https://images.unsplash.com/photo-1608889174633-81499f32d395?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "rated-3",
    title: "Spirited Away (Vùng Đất Linh Hồn)",
    rating: 9.6,
    category: "Hoạt hình, Kỳ ảo, Phiêu lưu",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop"
  }
];

export const popularActors = [
  { name: "Christian Bale", role: "Batman / Bruce Wayne", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" },
  { name: "Cillian Murphy", role: "J. Robert Oppenheimer", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
  { name: "Zendaya", role: "Chani (Dune)", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
  { name: "Timothée Chalamet", role: "Paul Atreides", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" }
];

export const customerReviews = [
  { name: "Lâm Hải Nam", comment: "Hệ thống đặt vé cực kỳ mượt mà, sơ đồ ghế 3D và các hiệu ứng nhìn sang trọng hẳn so với các app rạp chiếu khác!", rating: 5, date: "2026-06-08" },
  { name: "Trần Kim Thư", comment: "Bắp ngọt ngon thơm lừng, đặt vé qua MoMo tích điểm nhanh, phòng IMAX chất lượng âm thanh đỉnh cao.", rating: 5, date: "2026-06-09" },
  { name: "Hoàng Minh Đức", comment: "Giao diện tối huyền ảo màu vàng gold rất đẹp mắt, các bước đặt vé rõ ràng và phản hồi nhanh chóng.", rating: 4, date: "2026-06-10" }
];

export const newsAndEvents = [
  { title: "Đại Tiệc Đồng Giá IMAX - Thứ 4 Vui Vẻ", date: "12/06/2026", desc: "Thưởng thức các siêu phẩm IMAX đẳng cấp chỉ với 99,000 VND mỗi vé vào các ngày Thứ 4 hàng tuần.", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop" },
  { title: "Ra Mắt Combo Rạp Độc Quyền One Piece Film Red", date: "15/06/2026", desc: "Sở hữu ngay Ly nước Luffy Gear 5 giới hạn khi mua Gold VIP Combo tại hệ thống quầy vé CineLuxe.", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=300&auto=format&fit=crop" }
];

export const faqList = [
  { q: "Tôi có thể hủy vé và hoàn tiền sau khi thanh toán không?", a: "CineLuxe hỗ trợ hủy vé và hoàn tiền hoàn toàn tự động trực tuyến trước giờ chiếu 60 phút thông qua mục Lịch sử đặt vé trên hệ thống." },
  { q: "Rạp chiếu IMAX khác Standard như thế nào?", a: "Phòng chiếu IMAX được trang bị màn hình cong cực đại, máy chiếu laser kép kép và hệ thống âm thanh vòm kỹ thuật số chuyên dụng, cho trải nghiệm điện ảnh sâu và chân thực gấp nhiều lần phòng 2D tiêu chuẩn." },
  { q: "Làm thế nào để áp dụng mã giảm giá?", a: "Tại bước 7 (Thanh Toán), bạn chỉ cần nhập mã code khuyến mãi của bạn vào ô 'Mã Giảm Giá' và bấm 'Áp dụng'. Hệ thống sẽ tự động trừ tiền chiết khấu nếu đơn hàng đạt điều kiện áp dụng." }
];


