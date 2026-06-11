/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import {
  initialMovies,
  initialRooms,
  initialShowtimes,
  initialPromotions,
  initialBookings
} from '../data/mockData';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Movies state
  const [movies, setMovies] = useState(() => {
    const localMovies = localStorage.getItem('movies');
    if (localMovies) return JSON.parse(localMovies);
    localStorage.setItem('movies', JSON.stringify(initialMovies));
    return initialMovies;
  });

  // Rooms state
  const [rooms, setRooms] = useState(() => {
    const localRooms = localStorage.getItem('rooms');
    if (localRooms) return JSON.parse(localRooms);
    localStorage.setItem('rooms', JSON.stringify(initialRooms));
    return initialRooms;
  });

  // Showtimes state
  const [showtimes, setShowtimes] = useState(() => {
    const localShowtimes = localStorage.getItem('showtimes');
    if (localShowtimes) return JSON.parse(localShowtimes);
    localStorage.setItem('showtimes', JSON.stringify(initialShowtimes));
    return initialShowtimes;
  });

  // Promotions state
  const [promotions, setPromotions] = useState(() => {
    const localPromotions = localStorage.getItem('promotions');
    if (localPromotions) return JSON.parse(localPromotions);
    localStorage.setItem('promotions', JSON.stringify(initialPromotions));
    return initialPromotions;
  });

  // Bookings state
  const [bookings, setBookings] = useState(() => {
    const localBookings = localStorage.getItem('bookings');
    if (localBookings) return JSON.parse(localBookings);
    localStorage.setItem('bookings', JSON.stringify(initialBookings));
    return initialBookings;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('showtimes', JSON.stringify(showtimes));
  }, [showtimes]);

  useEffect(() => {
    localStorage.setItem('promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  // --- MOVIES CRUD ---
  const addMovie = (movie) => {
    const newMovie = { ...movie, id: `movie-${Date.now()}` };
    setMovies(prev => [newMovie, ...prev]);
  };

  const updateMovie = (id, movieData) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...movieData } : m));
  };

  const deleteMovie = (id) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    // Cascade delete showtimes
    setShowtimes(prev => prev.filter(s => s.movieId !== id));
  };

  // --- ROOMS CRUD ---
  const addRoom = (room) => {
    const newRoom = { ...room, id: `room-${Date.now()}` };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (id, roomData) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...roomData } : r));
  };

  const deleteRoom = (id) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    // Cascade delete showtimes
    setShowtimes(prev => prev.filter(s => s.roomId !== id));
  };

  // --- SHOWTIMES CRUD ---
  const addShowtime = (showtime) => {
    const newShowtime = {
      ...showtime,
      id: `showtime-${Date.now()}`,
      bookedSeats: []
    };
    setShowtimes(prev => [...prev, newShowtime]);
  };

  const updateShowtime = (id, showtimeData) => {
    setShowtimes(prev => prev.map(s => s.id === id ? { ...s, ...showtimeData } : s));
  };

  const deleteShowtime = (id) => {
    setShowtimes(prev => prev.filter(s => s.id !== id));
  };

  // --- PROMOTIONS CRUD ---
  const addPromotion = (promo) => {
    const newPromo = { ...promo, id: `promo-${Date.now()}` };
    setPromotions(prev => [...prev, newPromo]);
  };

  const updatePromotion = (id, promoData) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...promoData } : p));
  };

  const deletePromotion = (id) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // --- BOOKING LOGIC ---
  const createBooking = (bookingData) => {
    const { showtimeId, seats, userId, price, discount, totalPrice, promoCode, paymentMethod } = bookingData;
    
    // 1. Fetch showtime to ensure double check seat availability
    const showtime = showtimes.find(s => s.id === showtimeId);
    if (!showtime) throw new Error("Suất chiếu không tồn tại.");

    const isAnySeatTaken = seats.some(seat => showtime.bookedSeats.includes(seat));
    if (isAnySeatTaken) throw new Error("Một hoặc nhiều ghế bạn chọn đã có người khác đặt nhanh hơn. Vui lòng chọn lại!");

    // 2. Fetch movie and room names for receipt
    const movie = movies.find(m => m.id === showtime.movieId);
    const room = rooms.find(r => r.id === showtime.roomId);

    const newBooking = {
      id: `booking-${Date.now()}`,
      userId,
      showtimeId,
      movieTitle: movie ? movie.title : "Phim không xác định",
      roomName: room ? room.name : "Phòng không xác định",
      showDate: showtime.date,
      showTime: showtime.time,
      seats,
      price,
      discount,
      totalPrice,
      promoCode: promoCode || "",
      paymentMethod,
      status: "completed",
      bookingTime: new Date().toISOString()
    };

    // 3. Mark seats as booked in showtime
    setShowtimes(prev => prev.map(s => {
      if (s.id === showtimeId) {
        return {
          ...s,
          bookedSeats: [...s.bookedSeats, ...seats]
        };
      }
      return s;
    }));

    // 4. Save booking
    setBookings(prev => [newBooking, ...prev]);

    return newBooking;
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        // If booking is cancelled, release the seats!
        if (status === 'cancelled' && b.status !== 'cancelled') {
          setShowtimes(prevShowtimes => prevShowtimes.map(s => {
            if (s.id === b.showtimeId) {
              return {
                ...s,
                bookedSeats: s.bookedSeats.filter(seat => !b.seats.includes(seat))
              };
            }
            return s;
          }));
        }
        // If cancelled is reactivated (unlikely but just in case)
        else if (status === 'completed' && b.status === 'cancelled') {
          setShowtimes(prevShowtimes => prevShowtimes.map(s => {
            if (s.id === b.showtimeId) {
              return {
                ...s,
                bookedSeats: [...s.bookedSeats, ...b.seats]
              };
            }
            return s;
          }));
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  return (
    <BookingContext.Provider value={{
      movies,
      rooms,
      showtimes,
      promotions,
      bookings,
      addMovie,
      updateMovie,
      deleteMovie,
      addRoom,
      updateRoom,
      deleteRoom,
      addShowtime,
      updateShowtime,
      deleteShowtime,
      addPromotion,
      updatePromotion,
      deletePromotion,
      createBooking,
      updateBookingStatus
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
