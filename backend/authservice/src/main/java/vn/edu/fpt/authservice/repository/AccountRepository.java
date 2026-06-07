package vn.edu.fpt.authservice.repository;

import java.math.BigInteger;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.edu.fpt.authservice.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    @Query("SELECT a FROM Account a WHERE a.email = :email")
    Account checkEmail(@Param("email") String email);

    @Modifying // Báo cho JPA biết đây là câu lệnh thay đổi dữ liệu (DML)
    @Transactional // Tự động tạo transaction riêng cho hàm này khi được gọi
    Long deleteByEmail(String email);

    Account findByEmailOrderByIdAsc(String email);

    @Modifying
    @Transactional
    @Query("UPDATE Account a SET a.userId = :id WHERE a.email =:email")
    int updateUserIdByAccountId(@Param("id") String userId, @Param("email") String emailDB);

    @Query("SELECT a FROM Account a WHERE a.userId = :id")
    Account getByUserId(@Param("id") String userId);

    @Modifying
    @Transactional
    @Query("UPDATE Member m SET m.score = :score WHERE m.id = (SELECT a.member.id FROM Account a WHERE a.userId = :userId)")
    int updateScore(@Param("userId") String userId, @Param("score") BigInteger score);

    @Modifying
    @Transactional
    @Query("UPDATE Account a SET a.password = :password WHERE a.id = :id")
    void updatePasswordById(Integer id, String password);

    Optional<Account> findByUserId(String userId);
}
