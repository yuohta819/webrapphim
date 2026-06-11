import axios from "axios";

// const BASE_URL = "http://localhost:8080"; // URL backend của bạn
const BASE_URL = "http://localhost:30080/movieservice"; // URL backend của bạn
const movieService = {
  getAllMovies: () =>
    axios.get(`${BASE_URL}/movie/find-all`),

  getMovieById: (id) =>
    axios.get(`${BASE_URL}/movie/find/${id}`),

  createMovie: (data) =>
    axios.post(`${BASE_URL}/movie/role-not-member/create`, data),

  updateMovie: (data) =>
    axios.post(`${BASE_URL}/movie/role-employee/edit`, data),

  deleteMovie: (id) =>
    axios.get(`${BASE_URL}/movie/role-employee/delete`, {
      params: { id }
    }),
};

export default movieService;