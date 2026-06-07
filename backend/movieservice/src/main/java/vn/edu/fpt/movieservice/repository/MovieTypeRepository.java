package vn.edu.fpt.movieservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.movieservice.model.Movie;
import vn.edu.fpt.movieservice.model.MovieType;
import vn.edu.fpt.movieservice.model.MovieTypeId;
public interface MovieTypeRepository extends JpaRepository<MovieType, MovieTypeId> {

    @Modifying
    @Transactional
    @Query("DELETE FROM MovieType mt WHERE mt.movie = :movie")
    void deleteByMovie(Movie movie);
}