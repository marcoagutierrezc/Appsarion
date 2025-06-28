    package com.Backend.EPI.domain.dto;

    public class UserDTO {
        private String name;
        private String documentType;
        private Long documentNumber;
        private Long phoneNumber;
        private String email;
        private String password;
        private String justification;
        private String supportingDocument;
        private String role;
        private RoleDataDTO roleData;
        private String estado;

        // Getters and Setters

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDocumentType() {
            return documentType;
        }

        public void setDocumentType(String documentType) {
            this.documentType = documentType;
        }

        public Long getDocumentNumber() {
            return documentNumber;
        }

        public void setDocumentNumber(Long documentNumber) {
            this.documentNumber = documentNumber;
        }

        public Long getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(Long phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getJustification() {
            return justification;
        }

        public void setJustification(String justification) {
            this.justification = justification;
        }

        public String getSupportingDocument() {
            return supportingDocument;
        }

        public void setSupportingDocument(String supportingDocument) {
            this.supportingDocument = supportingDocument;
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

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }

        public Long getRoleId(UserDTO userDTO) {
            if (userDTO == null || userDTO.getRole() == null || userDTO.getRoleData() == null) {
                throw new IllegalArgumentException("El usuario o su información de rol es inválida.");
            }

            switch (userDTO.getRole().toLowerCase()) {
                case "piscicultor":
                    if (userDTO.getRoleData().getPiscicultor() != null) {
                        return userDTO.getRoleData().getPiscicultor().getId(); // Asegúrate de que PiscicultorDTO tenga el campo ID
                    }
                    break;

                case "evaluador":
                    if (userDTO.getRoleData().getEvaluador() != null) {
                        return userDTO.getRoleData().getEvaluador().getId(); // Asegúrate de que EvaluadorDTO tenga el campo ID
                    }
                    break;

                case "comercializador":
                    if (userDTO.getRoleData().getComercializador() != null) {
                        return userDTO.getRoleData().getComercializador().getId(); // Asegúrate de que ComercializadorDTO tenga el campo ID
                    }
                    break;

                case "academico":
                    if (userDTO.getRoleData().getAcademico() != null) {
                        return userDTO.getRoleData().getAcademico().getId(); // Asegúrate de que AcademicoDTO tenga el campo ID
                    }
                    break;

                default:
                    throw new IllegalArgumentException("Rol no reconocido: " + userDTO.getRole());
            }

            throw new IllegalArgumentException("No se encontró información del rol especificado.");
        }
    }

