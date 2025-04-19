package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private LocalDate issueDate;
    private String verifactionID;
    @Enumerated(EnumType.STRING)
    private CertificateStatus status;
    @Lob
    private String certificateContent;
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne
    @JoinColumn(name = "issuer_id")
    private User issuer;

    //@OneToMany(mappedBy = "certificate", cascade = CascadeType.ALL, orphanRemoval = true)
    //private List<SkillBadge> skillBadges = new ArrayList<>();

}
