package com.example.backend.services.task;

import com.example.backend.entity.Internship;
import com.example.backend.entity.Task;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService{
    private final StudentRepository studentRepository;
    private final TaskRepository taskRepository;

    public TaskServiceImpl(StudentRepository studentRepository, TaskRepository taskRepository) {
        this.studentRepository = studentRepository;
        this.taskRepository = taskRepository;
    }


    @Override
    public List<Task> retrieveTask() {
        return taskRepository.findAll();
    }

    @Override
    public Task updateTask(Task task) {
        Optional<Task> existingTask = taskRepository.findById(task.getId());
        if (existingTask.isPresent()) {

            return taskRepository.save(task);
        }
        return null;
    }

    @Override
    public Task addTask(Task task)  {
        return taskRepository.save(task);
    }

    @Override
    public Task retrieveTask(long idTask) {
        return taskRepository.findById(idTask).orElse(null);
    }

    @Override
    public void removeTask(long idTask) {
        taskRepository.deleteById(idTask);
    }

 /*   @Override
    public List<Task> getTasksByStudent(Long studentId) {
        return taskRepository.findByStudentId(studentId);
    }

    @Override
    public List<Task> getTasksByEnterprise(Long enterpriseId) {
        return taskRepository.findByEnterpriseId(enterpriseId);
    }*/
}
