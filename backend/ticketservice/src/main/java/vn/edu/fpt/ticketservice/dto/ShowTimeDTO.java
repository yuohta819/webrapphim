package vn.edu.fpt.ticketservice.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShowTimeDTO {
    private Long showTimeId;

    private Long roomId;

    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;

    public String getFormattedShowTime() {
        if (showDate == null || startTime == null || endTime == null) {
            return "";
        }

        // Định dạng ngày theo kiểu Việt Nam: ngày/tháng/năm (ví dụ: 11/01/2026)
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        // Định dạng giờ: Giờ:Phút (ví dụ: 07:00)
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        String dateStr = showDate.format(dateFormatter);
        String startStr = startTime.format(timeFormatter);
        String endStr = endTime.format(timeFormatter);

        // Kết quả trả ra dạng: "07:00 - 08:21 (11/01/2026)"
        return String.format("%s - %s (%s)", startStr, endStr, dateStr);
    }
}
