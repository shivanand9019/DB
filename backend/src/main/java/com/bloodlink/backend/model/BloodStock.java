package com.bloodlink.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name="blood_stock")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BloodStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="hospital_id",nullable = false)
    private Hospital hospital;
    @Column(nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private Double unitsAvailable;

    @Column(nullable = false)
    private LocalDateTime  lastUpdated;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
