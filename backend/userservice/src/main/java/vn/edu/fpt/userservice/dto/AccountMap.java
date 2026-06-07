package vn.edu.fpt.userservice.dto;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountMap {
    private String userId;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 50, message = "Họ và tên phải từ 2 đến 50 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
        regexp = "^(0|\\+84)(\\d{9})$", 
        message = "Số điện thoại không đúng định dạng Việt Nam (phải gồm 10 chữ số)"
    )
    private String phone;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String address;

    @NotBlank(message = "Ngày sinh không được để trống")
    @Pattern(
        regexp = "^\\d{4}-\\d{2}-\\d{2}$", 
        message = "Ngày sinh phải đúng định dạng YYYY-MM-DD"
    )
    // Nếu bạn muốn validate xem user đã đủ 18 tuổi hay chưa, khuyên dùng kiểu dữ liệu LocalDate thay vì String.
    private String dateOfBirth;

    @NotBlank(message = "Số CCCD/CMND không được để trống")
    @Pattern(
        regexp = "^(\\d{9}|\\d{12})$", 
        message = "Số CMND phải có 9 chữ số hoặc CCCD phải có 12 chữ số"
    )
    private String identityCard;

    // Đường dẫn ảnh (URL hoặc tên file từ Cloudinary/S3)
    @Size(max = 500, message = "Đường dẫn ảnh quá dài")
    private String image;

    // Thời gian đăng ký thường do hệ thống tự sinh (LocalDateTime.now()), không nên bắt validate từ phía Client.
    private LocalDateTime registerDate;
}
