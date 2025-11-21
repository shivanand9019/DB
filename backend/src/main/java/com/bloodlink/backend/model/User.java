package com.bloodlink.backend.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
@Enumerated(EnumType.STRING)
@Column(nullable = false,length = 20)
    private Role role;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userID;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private boolean isActive=true;
    @Column(unique = true,nullable = false,length = 100)
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void createdAt() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void updatedAt() {
        this.updatedAt = LocalDateTime.now();
    }
    @OneToOne(mappedBy = "user")
    @JsonIgnoreProperties("user") // prevents circular reference
    private Donor donor;

    private boolean emailNotifications= true;
    private boolean smsNotifications = false;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnoreProperties("user")
    @JsonBackReference
    private Hospital hospital;






}
