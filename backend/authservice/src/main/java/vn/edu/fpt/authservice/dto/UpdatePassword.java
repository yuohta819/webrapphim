package vn.edu.fpt.authservice.dto;

import lombok.Data;

@Data
public class UpdatePassword {
    private String userId;
    private String passwordOld;
    private String passwordNew;
}
