package com.Backend.EPI.domain.dto;

public class LoginResponseDTO {
    private String message;
    private Long id;
    private String name;
    private String role;

    private RoleDataDTO roleData;
    public LoginResponseDTO(String message, Long id, String name, String role, RoleDataDTO roleData) {

        this.message = message;
        this.id = id;
        this.name = name;
        this.role = role;
        this.roleData = roleData;
    }

    // Getters y Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public RoleDataDTO getRoleData() {
        return roleData;
    }

    public void setRoleData(RoleDataDTO roleData) {
        this.roleData = roleData;
    }
}