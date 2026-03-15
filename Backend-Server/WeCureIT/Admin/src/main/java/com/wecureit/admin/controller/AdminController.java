package com.wecureit.admin.controller;

import com.wecureit.admin.entity.Doctor;
import com.wecureit.admin.entity.Facility;
import com.wecureit.admin.model.OnboardDoctorRequest;
import com.wecureit.admin.model.OnboardFacilityRequest;
import com.wecureit.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    // Doctor CRUD

    @PostMapping("/onboardDoctor")
    public ResponseEntity<Boolean> onboardDoctor(@RequestBody OnboardDoctorRequest request) {
        return ResponseEntity.ok(adminService.onboardDoctor(request));
    }

    @GetMapping("/getAllDoctors")
    public ResponseEntity<List<Doctor>> allDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @GetMapping("/getDoctor/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long docId) {
        return ResponseEntity.ok(adminService.getDoctorDetails(docId));
    }

    @PostMapping("/updateDoctor/{id}")
    public ResponseEntity<Boolean> updateDoctor(@PathVariable Long id, @RequestBody OnboardDoctorRequest request) {
        return ResponseEntity.ok(adminService.updateDoctorDetails(id, request));
    }

    @GetMapping("/deleteDoctor/{id}")
    public ResponseEntity<Boolean> deleteDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteDoctor(id));
    }

    // Facility CRUD

    @PostMapping("/onboardFacility")
    public ResponseEntity<Boolean> onboardFacility(@RequestBody OnboardFacilityRequest request) {
        return ResponseEntity.ok(adminService.onboardFacility(request));
    }

    @GetMapping("/getAllFacilities")
    public ResponseEntity<List<Facility>> allFacilities() {
        return ResponseEntity.ok(adminService.getAllFacilities());
    }

    @GetMapping("/getFacility/{id}")
    public ResponseEntity<Facility> getFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(adminService.getFacilityDetails(facilityId));
    }

    @PostMapping("/updateFacility/{id}")
    public ResponseEntity<Boolean> updateFacility(@PathVariable Long facilityId, @RequestBody OnboardFacilityRequest request) {
        return ResponseEntity.ok(adminService.updateFacilityDetails(facilityId, request));
    }

    @GetMapping("/deleteFacility/{id}")
    public ResponseEntity<Boolean> deleteFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(adminService.deleteFacility(facilityId));
    }
}