import { Movie, Cinema, Showtime } from "@/features/home/types/home.types";

export const MOCK_MOVIES: Movie[] = [
  {
    id: "m-1",
    title: "Captain America: Brave New World",
    description: "Sam Wilson đảm nhận vai trò Captain America mới, đối mặt với một âm mưu toàn cầu nguy hiểm và những bí mật chính trị đen tối liên quan đến tổng thống Hoa Kỳ.",
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    genre: ["Hành động", "Phiêu lưu", "Khoa học Viễn tưởng"],
    duration: 125,
    releaseDate: "14/02/2026",
    ageRating: "T13",
    rating: 8.8,
    status: "NOW_SHOWING"
  },
  {
    id: "m-2",
    title: "Mufasa: The Lion King",
    description: "Khám phá câu chuyện thời niên thiếu của Mufasa, từ một chú sư tử mồ côi lạc lối trở thành vị vua vĩ đại nhất của Vùng Đất Kiêu Hãnh cùng người em Scar.",
    posterUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
    genre: ["Hoạt hình", "Gia đình", "Nhạc kịch"],
    duration: 118,
    releaseDate: "20/12/2025",
    ageRating: "P",
    rating: 9.2,
    status: "NOW_SHOWING"
  },
  {
    id: "m-3",
    title: "Mật vụ Bóng Đêm",
    description: "Một đặc vụ CIA ẩn danh phát hiện ra những bí mật đen tối của tổ chức và buộc phải chạy trốn khỏi cuộc truy quét của các sát thủ hàng đầu thế giới.",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=400",
    backdropUrl: "https://images.unsplash.com/photo-1478720143022-385f704d3b79?auto=format&fit=crop&q=80&w=1200",
    genre: ["Hành động", "Giật gân"],
    duration: 110,
    releaseDate: "10/06/2026",
    ageRating: "T18",
    rating: 8.5,
    status: "NOW_SHOWING"
  },
  {
    id: "m-4",
    title: "Đảo Kính Vạn Hoa",
    description: "Nhóm thám tử học sinh tham gia một kỳ nghỉ hè trên hòn đảo hoang và vô tình bị cuốn vào vụ án giải mã kho báu cổ xưa của một dòng tộc biến mất.",
    posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400",
    backdropUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200",
    genre: ["Hồi hộp", "Bí ẩn", "Hài hước"],
    duration: 105,
    releaseDate: "05/07/2026",
    ageRating: "T13",
    rating: 7.9,
    status: "NOW_SHOWING"
  },
  {
    id: "m-5",
    title: "Avatar: Fire and Ash",
    description: "Jake Sully và Neytiri dẫn dắt bộ tộc Na'vi đối mặt với một mối đe dọa mới từ chính hành tinh Pandora - tộc Người Tro bụi đầy thù hận và hung hãn.",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    genre: ["Hành động", "Khoa học Viễn tưởng", "Kịch tính"],
    duration: 160,
    releaseDate: "18/12/2026",
    ageRating: "T13",
    status: "UPCOMING"
  },
  {
    id: "m-6",
    title: "Kẻ Trộm Mặt Trăng 5",
    description: "Gru cùng các Minions tinh nghịch trở lại trong một phi vụ giải cứu thế giới đầy hài hước trước sự trỗi dậy của một siêu ác nhân công nghệ mới nổi.",
    posterUrl: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&q=80&w=400",
    backdropUrl: "https://images.unsplash.com/photo-1552152974-19b9caf99137?auto=format&fit=crop&q=80&w=1200",
    genre: ["Hoạt hình", "Hài hước", "Gia đình"],
    duration: 98,
    releaseDate: "28/12/2026",
    ageRating: "P",
    status: "UPCOMING"
  }
];

export const MOCK_CINEMAS: Cinema[] = [
  { id: "c-1", name: "CineGo Hùng Vương Plaza", address: "126 Hùng Vương, Quận 5, TP.HCM" },
  { id: "c-2", name: "CineGo Landmark 81", address: "720A Điện Biên Phủ, Bình Thạnh, TP.HCM" },
  { id: "c-3", name: "CineGo Tây Sơn", address: "229 Tây Sơn, Đống Đa, Hà Nội" },
  { id: "c-4", name: "CineGo Vincom Đà Nẵng", address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng" }
];

export const MOCK_SHOWTIMES: Showtime[] = [
  // Lịch chiếu hôm nay & các ngày tới cho các phim đang chiếu
  { id: "s-101", movieId: "m-1", cinemaId: "c-1", time: "10:30", date: "2026-07-16" },
  { id: "s-102", movieId: "m-1", cinemaId: "c-1", time: "14:15", date: "2026-07-16" },
  { id: "s-103", movieId: "m-1", cinemaId: "c-1", time: "19:00", date: "2026-07-16" },
  { id: "s-104", movieId: "m-1", cinemaId: "c-1", time: "21:45", date: "2026-07-16" },

  { id: "s-105", movieId: "m-1", cinemaId: "c-2", time: "13:00", date: "2026-07-16" },
  { id: "s-106", movieId: "m-1", cinemaId: "c-2", time: "18:30", date: "2026-07-16" },
  { id: "s-107", movieId: "m-1", cinemaId: "c-2", time: "20:45", date: "2026-07-16" },

  { id: "s-201", movieId: "m-2", cinemaId: "c-1", time: "09:00", date: "2026-07-16" },
  { id: "s-202", movieId: "m-2", cinemaId: "c-1", time: "11:30", date: "2026-07-16" },
  { id: "s-203", movieId: "m-2", cinemaId: "c-1", time: "14:30", date: "2026-07-16" },
  { id: "s-204", movieId: "m-2", cinemaId: "c-1", time: "17:00", date: "2026-07-16" },

  { id: "s-301", movieId: "m-3", cinemaId: "c-1", time: "16:00", date: "2026-07-16" },
  { id: "s-302", movieId: "m-3", cinemaId: "c-1", time: "20:30", date: "2026-07-16" },
  { id: "s-303", movieId: "m-3", cinemaId: "c-1", time: "22:45", date: "2026-07-16" }
];
