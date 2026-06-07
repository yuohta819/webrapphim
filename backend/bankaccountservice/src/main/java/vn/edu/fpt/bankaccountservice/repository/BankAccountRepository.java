package vn.edu.fpt.bankaccountservice.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.fpt.bankaccountservice.model.BankAccount;
import java.util.List;

@Repository
public interface BankAccountRepository extends MongoRepository<BankAccount, String> {
    Optional<BankAccount> findByBankAccountIdAndIsDeleted(String bankAccountId, Boolean isDeleted);

    BankAccount findByBankAccountId(String bankAccountId);

    @Transactional // Đảm bảo câu lệnh chạy trong một transaction
    @Query("{ 'bankAccountId' : ?0 }")
    @Update("{ '$set' : { 'isDeleted' : ?1 } }")
    long updateIsDeletedStatus(String id, boolean isDeleted);

    List<BankAccount> findByIsDeleted(Boolean isDeleted);
}
