package com.example.backend.entity;


import lombok.*;
import jakarta.persistence.*;


@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "skill_badges")

public class SkillBadge {
    public void setId(Long id) {
        this.id = id;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public void setBadgeImageUrl(String badgeImageUrl) {
        this.badgeImageUrl = badgeImageUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCertificate(Certificate certificate) {
        this.certificate = certificate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skillName;
    private String badgeImageUrl;

    public Long getId() {
        return id;
    }

    public String getSkillName() {
        return skillName;
    }

    public String getBadgeImageUrl() {
        return badgeImageUrl;
    }

    public String getDescription() {
        return description;
    }

    public Certificate getCertificate() {
        return certificate;
    }

    private String description;

    @ManyToOne
    @JoinColumn(name = "certificate_id")
    private Certificate certificate;
}
