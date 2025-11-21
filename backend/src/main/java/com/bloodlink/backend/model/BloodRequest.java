package com.bloodlink.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="blood_requests")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="request_id")
    private Long requestId;
    private String bloodGroup;
    private String patientName;

    private String contact;
    private int unitsRequired;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private RequestStatus status =RequestStatus.PENDING;

    private LocalDate createdAt = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;


    public String getBloodGroup(String bloodGroup) {
        return bloodGroup;
    }
    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;
}
