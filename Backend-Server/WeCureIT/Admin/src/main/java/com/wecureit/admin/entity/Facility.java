package com.wecureit.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "facilities", schema = "wecureit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String facilityName;
    private String facilityOpenTime;
    private String facilityCloseTime;
    private int roomCount;
    @ElementCollection
    @CollectionTable(name = "facility_specialties", joinColumns = @JoinColumn(name = "facility_id"))
    @Column(name = "specialty")
    private List<String> supportedSpecialties;

}