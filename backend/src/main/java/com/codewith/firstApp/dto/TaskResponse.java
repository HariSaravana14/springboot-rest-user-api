package com.codewith.firstApp.dto;

import com.codewith.firstApp.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Long projectId;
    private String projectTitle;
    private Long assignedUserId;
    private String assignedUserName;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
}
