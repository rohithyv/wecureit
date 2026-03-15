package com.wecureit.login.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", schema = "wecureit")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String mobileNumber;

    private String preferredCity;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.PATIENT;

    @Column(unique = true, nullable = false)
    private String password;
    private String creditCardNumber;
    private String cardholderName;
    private String expirationDate;
    private String billingZip;
    private String cvv;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
