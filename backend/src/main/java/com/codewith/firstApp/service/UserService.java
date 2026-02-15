package com.codewith.firstApp.service;

import java.util.List;

import com.codewith.firstApp.entity.User;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    User updateUser(Long id, User updatedUser);

    void deleteUser(Long id);
}
