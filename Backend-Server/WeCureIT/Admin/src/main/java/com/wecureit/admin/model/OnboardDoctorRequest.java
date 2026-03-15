package com.wecureit.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OnboardDoctorRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String mobileNumber;
    private String preferredStartTime;
    private String preferredEndTime;
    private List<String> licensedStates;
    private List<String> licensedSpecialities;
    private List<String> preferredFacilities;
}