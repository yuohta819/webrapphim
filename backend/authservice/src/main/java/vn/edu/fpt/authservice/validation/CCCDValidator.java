package vn.edu.fpt.authservice.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;
import java.util.regex.Pattern;

public class CCCDValidator implements ConstraintValidator<ValidCCCD, String> {

    // Regex kiểm tra phải là 12 chữ số
    private static final Pattern CCCD_PATTERN = Pattern.compile("^\\d{12}$");

    // Danh sách mã tỉnh/thành phố hợp lệ của Việt Nam (từ 001 đến 096)
    private static final Set<String> VALID_PROVINCE_CODES = Set.of(
        "001", "002", "004", "006", "008", "010", "011", "012", "014", "015", "017", "019",
        "020", "022", "024", "025", "026", "027", "030", "031", "033", "034", "035", "036",
        "037", "038", "040", "042", "044", "045", "046", "048", "049", "051", "052", "054",
        "056", "058", "060", "062", "064", "066", "067", "068", "070", "072", "074", "075",
        "077", "079", "080", "082", "083", "084", "086", "087", "089", "091", "092", "093",
        "094", "095", "096"
    );

    @Override
    public boolean isValid(String cccd, ConstraintValidatorContext context) {
        System.out.println(cccd + " dong 25");
        if (cccd == null || !CCCD_PATTERN.matcher(cccd).matches()) {
            return false;
        }

        // 1. Kiểm tra mã tỉnh (3 chữ số đầu)
        String provinceCode = cccd.substring(0, 3);
        if (!VALID_PROVINCE_CODES.contains(provinceCode)) {
            return false;
        }

        // 2. Kiểm tra mã giới tính/thế kỷ (chữ số thứ 4) -> Phải từ '0' đến '9'
        char genderCode = cccd.charAt(3);
        if (genderCode < '0' || genderCode > '9') {
            return false;
        }

        return true;
    }
}