package com.example.backend.repository;

import com.example.backend.entity.SkillBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillBadgeRepository extends JpaRepository<SkillBadge, Long> {
    List<SkillBadge> findByCertificateId(Long certificateId);

}
