package com.wecureit.admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecureit.login.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "doctors", schema = "wecureit")
@Getter
@Setter
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @ElementCollection
    @CollectionTable(name = "doctor_specialties", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "specialty")
    private List<String> licensedSpecialties;

    @ElementCollection
    @CollectionTable(name = "doctor_states", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "state_code")
    private List<String> licensedStates;

    @ManyToMany
    @JoinTable(
            name = "doctor_facilities",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "facility_id")
    )
    private List<Facility> preferredFacilities;
    private String preferredStartTime;
    private String preferredEndTime;
    @CreationTimestamp
    private LocalDateTime createdAt;
}