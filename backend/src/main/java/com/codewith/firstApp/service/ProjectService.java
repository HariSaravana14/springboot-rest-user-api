package com.codewith.firstApp.service;

import com.codewith.firstApp.dto.ProjectRequest;
import com.codewith.firstApp.dto.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest request, String ownerEmail);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(Long id);

    ProjectResponse updateProject(Long id, ProjectRequest request);

    void deleteProject(Long id);
}
