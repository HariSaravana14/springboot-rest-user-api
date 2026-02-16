package com.codewith.firstApp.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String ownerName;
    private Long ownerId;
    private int taskCount;
    private LocalDateTime createdAt;
}
