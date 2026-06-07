package vn.edu.fpt.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.edu.fpt.userservice.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    @Query("SELECT COUNT(a) > 0 FROM Account a WHERE a.phone = :phone OR a.identityCard = :idCard")
    boolean checkExistByEmailOrPhoneOrIdCard(
            @Param("phone") String phone,
            @Param("idCard") String idCard);

    Account getByUserId(String userId);

    @Transactional // Đảm bảo câu lệnh chạy trong một transaction
    @Modifying // Bắt buộc phải có để Spring Data biết đây là lệnh thay đổi dữ liệu (DML)
    @Query("UPDATE Account a SET a.roleBank = :roleBank WHERE a.id = :id")
    int updateroleBank(@Param("id") Integer id, @Param("roleBank") Boolean isBank);

    @Query("SELECT COUNT(m) FROM Account m " +
            "WHERE MONTH(m.registerDate) = :month " +
            "AND YEAR(m.registerDate) = :year")
    long countAccountsByMonthAndYear(@Param("month") int month, @Param("year") int year);

    Long countByIsDeletedFalse();
}
