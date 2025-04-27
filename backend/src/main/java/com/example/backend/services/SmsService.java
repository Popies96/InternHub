package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SmsService {
    @Value("${sms.api.key}")
    private String apiKey;



    public boolean sendValidationCode(String phoneNumber,String verificationCode) {

        // Use an SMS API provider to send the SMS (e.g., Twilio, Nexmo)
        String smsApiUrl = "https://api.smsprovider.com/sendMessage?to=" + phoneNumber + "&message=Your reset code: " + verificationCode;

        try {

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


}
