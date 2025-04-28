package com.example.backend.services.taskRep;

import com.example.backend.dto.TaskRepResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface TaskRepService {
    List<TaskRepResponse> getAllTaskReps();
    TaskRepResponse getTaskRepById(Long taskRepId);
    TaskRepResponse savePdfTaskRep(Long taskId, MultipartFile file) throws IOException;
    TaskRepResponse saveTaskRep(Long taskId, TaskRepResponse taskRep);
    byte[] getPdfFile(Long taskRepId) throws IOException;
    TaskRepResponse getTaskRepByTaskId(Long taskId);
    TaskRepResponse approveTaskRep(Long taskRepId);
    TaskRepResponse rejectTaskRep(Long taskRepId, String feedback);
}