import { Metadata } from "next";
import {
  MOCK_MOVIES,
  HomeHero,
  QuickBooking,
  NowShowingSection,
  UpcomingMoviesSection,
  FeaturedShowtimes,
  CinemaExperience,
  HomeCallToAction
} from "@/features/home";

// SEO Metadata
export const metadata: Metadata = {
  title: "CineGo - Hệ thống Đặt vé xem phim trực tuyến cực nhanh",
  description: "Trang chủ đặt vé phim CineGo. Lịch chiếu phim, phim bom tấn đang chiếu, chọn ghế VIP rạp IMAX rực rỡ và thanh toán 60 giây.",
};

export default function HomePage() {
  // Lấy dữ liệu phim nổi bật làm banner (Captain America)
  const featuredMovie = MOCK_MOVIES.find(m => m.id === "m-1") || MOCK_MOVIES[0];

  // Lọc phim đang chiếu và sắp chiếu
  const nowShowingMovies = MOCK_MOVIES.filter(m => m.status === "NOW_SHOWING");
  const upcomingMovies = MOCK_MOVIES.filter(m => m.status === "UPCOMING");

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Block */}
      <HomeHero movie={featuredMovie} />

      {/* 2. Quick Booking Bar */}
      <QuickBooking />

      {/* 3. Now Showing Section */}
      <NowShowingSection movies={nowShowingMovies} />

      {/* 4. Upcoming Movies Section */}
      <UpcomingMoviesSection movies={upcomingMovies} />

      {/* 5. Featured Showtimes */}
      <FeaturedShowtimes />

      {/* 6. Experience Advantages */}
      <CinemaExperience />

      {/* 7. Bottom Call to Action */}
      <HomeCallToAction />
    </div>
  );
}
