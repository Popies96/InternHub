package com.example.backend.dto.certifcate;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SkillBadgeResponse {
    private Long id;

    public Long getId() {
        return id;
    }

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

    public String getSkillName() {
        return skillName;
    }

    public String getBadgeImageUrl() {
        return badgeImageUrl;
    }

    public String getDescription() {
        return description;
    }

    private String skillName;
    private String badgeImageUrl;
    private String description;
}
