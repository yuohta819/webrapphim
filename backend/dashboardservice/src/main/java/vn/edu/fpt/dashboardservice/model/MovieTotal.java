package vn.edu.fpt.dashboardservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieTotal {
    private String movieNames;
    private Long ticketsSold;

}
