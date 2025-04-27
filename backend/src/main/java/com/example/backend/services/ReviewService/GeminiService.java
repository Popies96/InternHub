package com.example.backend.services.ReviewService;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service

public class GeminiService {


        private final String API_KEY = "AIzaSyCOv1qlk1Mlhlnwf6xriIObF_GOcOA7Omw";
        private final String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;


        public String generateRecommendation(String reviewSummary) {
                RestTemplate restTemplate = new RestTemplate();

                Map<String, Object> body = new HashMap<>();
                List<Map<String, String>> parts = List.of(Map.of("text", reviewSummary));
                body.put("contents", List.of(Map.of("parts", parts)));

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> partsResponse = (List<Map<String, Object>>) content.get("parts");

                return partsResponse.get(0).get("text").toString();
        }
    }

