    package com.example.backend.entity;

    import jakarta.persistence.*;
    import lombok.*;
    import org.hibernate.annotations.CreationTimestamp;

    import java.time.LocalDateTime;

    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "applications")
    public class Application {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        @ManyToOne
        @JoinColumn(name = "internship_id", nullable = false)
        private Internship internship;

        @Column(nullable = false, updatable = false)
        @CreationTimestamp
        private LocalDateTime applicationDate;

        @Enumerated(EnumType.STRING)
        private ApplicationStatus status = ApplicationStatus.PENDING;

        // New fields from the form
        @Column(columnDefinition = "TEXT")
        private String about;

        @Column(name = "resume_path")
        private String resumePath; // Store path to uploaded PDF

        @Column(name = "first_name", nullable = false)
        private String firstName;

        @Column(name = "last_name", nullable = false)
        private String lastName;

        @Column(nullable = false)
        private String email;

        @Column(nullable = false)
        private String country;

        @Column(name = "street_address", nullable = false)
        private String streetAddress;

        @Column(nullable = false)
        private String city;

        @Column(nullable = false)
        private String region; // State/Province

        @Column(name = "postal_code", nullable = false)
        private String postalCode; // ZIP code

        private String resumeFilename;


        // Getter for resumeFilename
        public String getResumeFilename() {
            return resumeFilename;
        }

        // Setter for resumeFilename
        public void setResumeFilename(String resumeFilename) {
            this.resumeFilename = resumeFilename;
        }
    }

