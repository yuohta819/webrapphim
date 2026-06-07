package vn.edu.fpt.bookingservice.dto;

import java.math.BigInteger;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class MemberDTO {
    private String memberId;
    private BigInteger score;
}
