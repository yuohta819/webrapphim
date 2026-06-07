package vn.edu.fpt.authservice.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.fpt.authservice.validation.ValidCCCD;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountMap {
    private String userId; // Trường này thường tự tăng hoặc sinh từ DB, không cần validate khi tạo mới

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 32, message = "Mật khẩu phải từ 6 đến 32 ký tự")
    private String password;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 50, message = "Họ và tên không được vượt quá 50 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    // Regex kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08,
    // 09)
    @Pattern(regexp = "^(0[35789])[0-9]{8}$", message = "Số điện thoại không đúng định dạng Việt Nam")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Ngày sinh không được để trống")
    // Kiểm tra định dạng ngày sinh YYYY-MM-DD
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Ngày sinh phải có định dạng YYYY-MM-DD")
    private String dateOfBirth;

    @NotBlank(message = "Số CCCD không được để trống")
    @ValidCCCD // Custom annotation của bạn dùng để check logic 12 số
    private String identityCard;

    private String image; // Ảnh đại diện có thể để trống hoặc validate URL nếu cần
    private LocalDateTime registerDate;
}
