package vn.edu.fpt.authservice.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.fpt.authservice.model.Member;



@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
}
