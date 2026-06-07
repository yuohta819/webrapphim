
package vn.edu.fpt.userservice.model;

import java.sql.Date;
import java.time.LocalDateTime;

import org.hibernate.mapping.Join;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String fullName;
    private String phone;
    private String address;
    private String dateOfBirth;
    private String identityCard;
    private String image;
    private LocalDateTime registerDate;
    private String userId;
    private Boolean roleBank = false;
    private Boolean isDeleted = false;
}
