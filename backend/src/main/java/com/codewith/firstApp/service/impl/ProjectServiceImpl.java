package com.codewith.firstApp.service.impl;

import com.codewith.firstApp.dto.ProjectRequest;
import com.codewith.firstApp.dto.ProjectResponse;
import com.codewith.firstApp.entity.Project;
import com.codewith.firstApp.entity.User;
import com.codewith.firstApp.exception.ResourceNotFoundException;
import com.codewith.firstApp.repository.ProjectRepository;
import com.codewith.firstApp.repository.UserRepository;
import com.codewith.firstApp.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public ProjectResponse createProject(ProjectRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(owner)
                .build();

        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .ownerName(project.getOwner().getName())
                .ownerId(project.getOwner().getId())
                .taskCount(project.getTasks() != null ? project.getTasks().size() : 0)
                .createdAt(project.getCreatedAt())
                .build();
    }
}
