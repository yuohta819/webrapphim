package vn.edu.fpt.authservice.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CCCDValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCCCD {
    String message() default "Số CCCD không hợp lệ hoặc không đúng định dạng";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}