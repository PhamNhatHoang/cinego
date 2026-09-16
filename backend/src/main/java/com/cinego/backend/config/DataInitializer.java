package com.cinego.backend.config;

import com.cinego.backend.model.*;
import com.cinego.backend.model.enums.MovieStatus;
import com.cinego.backend.model.enums.RoleName;
import com.cinego.backend.repository.*;
import com.cinego.backend.service.AuditoriumService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CinemaRepository cinemaRepository;
    private final AuditoriumRepository auditoriumRepository;
    private final AuditoriumService auditoriumService;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ShowtimeRepository showtimeRepository;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CinemaRepository cinemaRepository,
            AuditoriumRepository auditoriumRepository,
            AuditoriumService auditoriumService,
            MovieRepository movieRepository,
            GenreRepository genreRepository,
            ShowtimeRepository showtimeRepository
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.cinemaRepository = cinemaRepository;
        this.auditoriumRepository = auditoriumRepository;
        this.auditoriumService = auditoriumService;
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.showtimeRepository = showtimeRepository;
    }

    @Override
    public void run(String... args) {
        initRolesAndUsers();
        initCinemasAndAuditoriums();
        initMoviesAndShowtimes();
    }

    private void initRolesAndUsers() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(RoleName.CUSTOMER));
            roleRepository.save(new Role(RoleName.STAFF));
            roleRepository.save(new Role(RoleName.ADMIN));
        }

        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElse(null);
            Role staffRole = roleRepository.findByName(RoleName.STAFF).orElse(null);
            Role customerRole = roleRepository.findByName(RoleName.CUSTOMER).orElse(null);

            User admin = new User("admin", "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "admin@cinego.com", "Quản Trị Viên", "0900000001");
            if (adminRole != null) admin.getRoles().add(adminRole);
            userRepository.save(admin);

            User staff = new User("staff", "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "staff@cinego.com", "Nhân Viên Soát Vé", "0900000002");
            if (staffRole != null) staff.getRoles().add(staffRole);
            userRepository.save(staff);

            User customer = new User("customer", "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "customer@cinego.com", "Nguyễn Nhật Hoàng", "0901234567");
            if (customerRole != null) customer.getRoles().add(customerRole);
            userRepository.save(customer);
        }
    }

    private void initCinemasAndAuditoriums() {
        if (cinemaRepository.count() == 0) {
            Cinema c1 = cinemaRepository.save(new Cinema("CineGo Hùng Vương Plaza", "Tầng 7, Hùng Vương Plaza, 126 Hồng Bàng, Q.5, TP.HCM", "1900 6017"));
            Cinema c2 = cinemaRepository.save(new Cinema("CineGo Landmark 81", "Tầng B1, Vincom Center Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM", "1900 6018"));
            Cinema c3 = cinemaRepository.save(new Cinema("CineGo Royal City", "Tầng B2, Vincom Mega Mall Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội", "1900 6019"));

            // Create auditoriums with seat matrix for each cinema
            Auditorium a1 = auditoriumRepository.save(new Auditorium("Phòng 1 (Standard 2D)", 80, c1));
            auditoriumService.generateSeatGrid(a1, 8, 10);

            Auditorium a2 = auditoriumRepository.save(new Auditorium("Phòng 2 (IMAX Laser)", 80, c1));
            auditoriumService.generateSeatGrid(a2, 8, 10);

            Auditorium a3 = auditoriumRepository.save(new Auditorium("Phòng 1 (VIP Cinema)", 80, c2));
            auditoriumService.generateSeatGrid(a3, 8, 10);

            Auditorium a4 = auditoriumRepository.save(new Auditorium("Phòng 2 (Dolby Atmos)", 80, c2));
            auditoriumService.generateSeatGrid(a4, 8, 10);

            Auditorium a5 = auditoriumRepository.save(new Auditorium("Phòng 1 (Gold Class)", 80, c3));
            auditoriumService.generateSeatGrid(a5, 8, 10);
        }
    }

    private void initMoviesAndShowtimes() {
        if (movieRepository.count() == 0) {
            Genre action = genreRepository.save(new Genre("Hành động"));
            Genre adventure = genreRepository.save(new Genre("Phiêu lưu"));
            Genre animation = genreRepository.save(new Genre("Hoạt hình"));
            Genre scifi = genreRepository.save(new Genre("Khoa học Viễn tưởng"));
            Genre thriller = genreRepository.save(new Genre("Giật gân"));

            Movie m1 = new Movie("Captain America: Brave New World", "Sam Wilson đảm nhận vai trò Captain America mới, đối mặt với một âm mưu toàn cầu nguy hiểm.", 125, "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400", "https://www.youtube.com", "T13", MovieStatus.NOW_SHOWING);
            m1.getGenres().add(action);
            m1.getGenres().add(adventure);
            m1.getGenres().add(scifi);
            m1.setDirector("Julius Onah");
            m1.setCast("Anthony Mackie, Harrison Ford");
            m1.setReleaseDate(LocalDate.now().minusDays(5));
            m1 = movieRepository.save(m1);

            Movie m2 = new Movie("Mufasa: The Lion King", "Khám phá câu chuyện thời niên thiếu của Mufasa từ chú sư tử mồ côi trở thành vị vua vĩ đại.", 118, "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400", "https://www.youtube.com", "P", MovieStatus.NOW_SHOWING);
            m2.getGenres().add(animation);
            m2.getGenres().add(adventure);
            m2.setDirector("Barry Jenkins");
            m2.setCast("Aaron Pierre, Kelvin Harrison Jr.");
            m2.setReleaseDate(LocalDate.now().minusDays(10));
            m2 = movieRepository.save(m2);

            Movie m3 = new Movie("Mật vụ Bóng Đêm", "Một đặc vụ CIA ẩn danh phát hiện ra những bí mật đen tối của tổ chức.", 110, "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=400", "https://www.youtube.com", "T18", MovieStatus.NOW_SHOWING);
            m3.getGenres().add(action);
            m3.getGenres().add(thriller);
            m3.setReleaseDate(LocalDate.now().minusDays(2));
            m3 = movieRepository.save(m3);

            // Create initial showtimes for today and the next 3 days
            List<Auditorium> auditoriums = auditoriumRepository.findAll();
            if (!auditoriums.isEmpty()) {
                Auditorium aud1 = auditoriums.get(0);
                Auditorium aud2 = auditoriums.size() > 1 ? auditoriums.get(1) : aud1;

                LocalDate today = LocalDate.now();
                for (int dayOffset = 0; dayOffset <= 3; dayOffset++) {
                    LocalDate targetDate = today.plusDays(dayOffset);

                    // Showtimes for m1
                    Showtime s1 = new Showtime(
                            targetDate.atTime(10, 0),
                            targetDate.atTime(12, 20),
                            BigDecimal.valueOf(80000),
                            m1,
                            aud1
                    );
                    showtimeRepository.save(s1);

                    Showtime s2 = new Showtime(
                            targetDate.atTime(14, 30),
                            targetDate.atTime(16, 50),
                            BigDecimal.valueOf(90000),
                            m1,
                            aud1
                    );
                    showtimeRepository.save(s2);

                    Showtime s3 = new Showtime(
                            targetDate.atTime(19, 0),
                            targetDate.atTime(21, 20),
                            BigDecimal.valueOf(100000),
                            m1,
                            aud1
                    );
                    showtimeRepository.save(s3);

                    // Showtimes for m2
                    Showtime s4 = new Showtime(
                            targetDate.atTime(9, 30),
                            targetDate.atTime(11, 45),
                            BigDecimal.valueOf(80000),
                            m2,
                            aud2
                    );
                    showtimeRepository.save(s4);

                    Showtime s5 = new Showtime(
                            targetDate.atTime(15, 0),
                            targetDate.atTime(17, 15),
                            BigDecimal.valueOf(90000),
                            m2,
                            aud2
                    );
                    showtimeRepository.save(s5);
                }
            }
        }
    }
}
