package com.bloodlink.backend.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

import java.time.LocalTime;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="donation_id",nullable = false)
    private Long donationId;

    @ManyToOne
    @JoinColumn(name="donor_id")
    private Donor donor;

    @ManyToOne
    @JoinColumn(name="hospital_id")
    private Hospital hospital;
    @Column(name="donation_date")

    private LocalDate donationDate;
    @Column(name="donation_time")
    private LocalTime donationTime;
    private Double bloodQuantity;
    private String bloodGroup;
    @Enumerated(EnumType.STRING)
    private RequestStatus status;


}
