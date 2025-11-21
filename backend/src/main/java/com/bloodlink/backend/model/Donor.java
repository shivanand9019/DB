package com.bloodlink.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="donors")
public class Donor {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name="donor_id")
   private Long donorId;
    @Column(name="donor_name")
    private String fullName;
    @Column(name="donor_email")
    private String email;
   @Column(name = "donor_city")
    private String city;
    private String bloodGroup;


    private int age;
    private String gender;
    @Column(length = 15)
    private String phoneNumber;
    private LocalDate lastDonationDate;
    private LocalDate createdAt;
    private  LocalDate updatedAt;

    @Column(name = "available",nullable=false)
    private boolean available = true; // default: available
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] profilePic;



    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("donor") // prevents infinite loop when serializing user
    private User user;

@PrePersist
    public void createdAt(){
        this.createdAt = LocalDate.now();
    }
@PreUpdate
public void onUpdate(){
    updatedAt = LocalDate.now();
}


}