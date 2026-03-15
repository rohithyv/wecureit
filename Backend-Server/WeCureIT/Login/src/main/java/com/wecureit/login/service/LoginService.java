package com.wecureit.login.service;

import com.wecureit.login.entity.User;
import com.wecureit.login.model.request.LoginRequest;
import com.wecureit.login.model.request.SignUpRequest;
import com.wecureit.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final SessionManagementService sessionManagementService;

    public Boolean register(SignUpRequest request) {
        try {
            var user = new User();
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setMobileNumber(request.getMobileNumber());
            user.setPreferredCity(request.getPreferredCity());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setCardholderName(request.getCardholderName());
            user.setCreditCardNumber(passwordEncoder.encode(request.getCreditCardNumber()));
            user.setExpirationDate(request.getExpirationDate());
            user.setBillingZip(request.getBillingZip());
            user.setCvv(passwordEncoder.encode(request.getCvv()));
            userRepository.save(user);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public String processLogin(LoginRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (user != null) {
                boolean isPasswordCorrect = passwordEncoder.matches(request.getPassword(), user.getPassword());
                if (isPasswordCorrect) {
                    return sessionManagementService.createSession(user);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

}
