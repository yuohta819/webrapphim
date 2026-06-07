package vn.edu.fpt.authservice.dto;

import java.math.BigInteger;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountMemberDto {
    private BigInteger score;
    @Valid
    private AccountMap accountMap;
}