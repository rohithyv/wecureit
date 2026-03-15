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
public class OnboardFacilityRequest {
    private String facilityName;
    private String facilityOpenTime;
    private String facilityCloseTime;
    private int roomCount;
    private List<String> supportedSpecialties;
}