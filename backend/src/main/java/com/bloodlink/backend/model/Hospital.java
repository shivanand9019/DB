package com.bloodlink.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NoArgsConstructor
@AllArgsConstructor
@Table(name="hospitals")
@Getter
@Setter
@Data
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id")
    private Long hospitalId;
    @Column(name = "hospital_name")
    private String hospitalName;
    @Column(name = "hospital_address")
    private String hospitalAddress;
    @Column(name = "hospital_email")
    private String email;
    @Column(length = 15, name = "hospital_number")
    private String hospitalContactNumber;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] profilePic;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDate.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDate.now();
    }

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    @JsonIgnoreProperties("hospital") // prevents infinite loop when serializing user
    private User user;


}
