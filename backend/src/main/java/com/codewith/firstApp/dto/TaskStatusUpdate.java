package com.codewith.firstApp.dto;

import com.codewith.firstApp.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskStatusUpdate {

    @NotNull(message = "Status is required")
    private TaskStatus status;
}
