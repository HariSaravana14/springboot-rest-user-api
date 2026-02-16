package com.codewith.firstApp.dto;

import com.codewith.firstApp.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long assignedUserId;

    private TaskStatus status;

    private LocalDate dueDate;
}
