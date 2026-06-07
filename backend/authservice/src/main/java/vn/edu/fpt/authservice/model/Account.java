
package vn.edu.fpt.authservice.model;

import java.sql.Date;
import java.time.LocalDateTime;

import org.hibernate.mapping.Join;

import jakarta.persistence.CascadeType;
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
    private String userId;
    private String email;
    private String password;
    @ManyToOne
    @JoinColumn(name = "rollId" )
    private Roles roles;
    @OneToOne(mappedBy = "account", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Member member;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
