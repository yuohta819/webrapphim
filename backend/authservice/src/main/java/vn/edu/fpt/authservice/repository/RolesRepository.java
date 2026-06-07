package vn.edu.fpt.authservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.fpt.authservice.model.Roles;

public interface RolesRepository extends JpaRepository<Roles, Integer> {
    Roles getByRoleName(String roleName);
}
