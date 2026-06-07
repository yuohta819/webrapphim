package vn.edu.fpt.movieservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.fpt.movieservice.model.Type;

public interface TypeRepository extends JpaRepository<Type, Integer> {
    
}
