package vn.edu.fpt.authservice.dto;

import lombok.Data;

@Data
public class ErrorResponse {
    private String code;
    private String message;
    private String status;
}
