package com.cinego.backend.service;

import com.cinego.backend.model.User;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    // TODO [MEMBER-1]: Inject UserRepository

    public List<User> getAllUsers() {
        // TODO [MEMBER-1]: Implement logic to return all users
        return null;
    }

    public User getUserById(Long id) {
        // TODO [MEMBER-1]: Implement logic to return user by ID
        return null;
    }

    public void changeUserRole(Long id, List<String> roleNames) {
        // TODO [MEMBER-1]: Assign new roles to user (Admin action)
    }
}
