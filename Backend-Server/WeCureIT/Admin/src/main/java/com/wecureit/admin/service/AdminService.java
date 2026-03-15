package com.wecureit.admin.service;

import com.wecureit.admin.entity.Doctor;
import com.wecureit.admin.entity.Facility;
import com.wecureit.admin.model.OnboardDoctorRequest;
import com.wecureit.admin.model.OnboardFacilityRequest;
import com.wecureit.admin.repository.DoctorRepository;
import com.wecureit.admin.repository.FacilityRepository;
import com.wecureit.login.entity.User;
import com.wecureit.login.entity.UserRole;
import com.wecureit.login.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final FacilityRepository facilityRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public Boolean onboardDoctor(OnboardDoctorRequest request) {
        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setMobileNumber(request.getMobileNumber());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setRole(UserRole.valueOf("DOCTOR"));

            var rawPass = UUID.randomUUID().toString().substring(0, 8);
            System.out.println("Generated pass: " + rawPass);
            user.setPassword(passwordEncoder.encode(rawPass));
            User savedUser = userRepo.save(user);

            Doctor doctorProfile = new Doctor();
            doctorProfile.setUser(savedUser);
            doctorProfile.setLicensedSpecialties(request.getLicensedSpecialities());
            doctorProfile.setLicensedStates(request.getLicensedStates());
            doctorProfile.setPreferredStartTime(request.getPreferredStartTime());
            doctorProfile.setPreferredEndTime(request.getPreferredEndTime());
            doctorRepo.save(doctorProfile);

            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public List<Doctor> getAllDoctors() {
        try {
            return doctorRepo.findAll();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    public Doctor getDoctorDetails(Long docId) {
        return doctorRepo.findById(docId).orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + docId));
    }

    @Transactional
    public Boolean updateDoctorDetails(Long docId, OnboardDoctorRequest request) {
        try {
            var doctorDetails = doctorRepo.findById(docId).orElseThrow(()-> new RuntimeException("Doctor doesn't exist by id " + docId));
            modelMapper.map(request, doctorDetails);
            modelMapper.map(request, doctorDetails.getUser());
            doctorRepo.save(doctorDetails);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    public Boolean deleteDoctor(Long docId) {
        try {
            doctorRepo.deleteById(docId);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public Boolean onboardFacility(OnboardFacilityRequest request) {
        try {
            Facility facility = new Facility();
            facility.setFacilityName(request.getFacilityName());
            facility.setFacilityOpenTime(request.getFacilityOpenTime());
            facility.setFacilityCloseTime(request.getFacilityCloseTime());
            facility.setRoomCount(request.getRoomCount());
            facility.setSupportedSpecialties(request.getSupportedSpecialties());

            facilityRepo.save(facility);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public List<Facility> getAllFacilities() {
        try {
            return facilityRepo.findAll();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    public Facility getFacilityDetails(Long facilityId) {
        return facilityRepo.findById(facilityId).orElseThrow(() -> new RuntimeException("Facility not found with ID: " + facilityId));
    }

    public Boolean updateFacilityDetails(Long facilityId, OnboardFacilityRequest request) {
        try {
            var facilityDetails = facilityRepo.findById(facilityId).orElseThrow(()-> new RuntimeException("Facility doesn't exist by id " + facilityId));
            modelMapper.map(request, facilityDetails);
            facilityRepo.save(facilityDetails);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    public Boolean deleteFacility(Long facilityId) {
        try {
            facilityRepo.deleteById(facilityId);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }


}