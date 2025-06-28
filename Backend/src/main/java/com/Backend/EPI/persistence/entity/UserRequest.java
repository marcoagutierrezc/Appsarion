package com.Backend.EPI.persistence.entity;

public class UserRequest {
    private String name;
    private String documentType;
    private Long documentNumber;
    private Long phoneNumber;
    private String email;
    private String password;
    private String justification;
    private String supportingDocument;
    private String role;

    private Piscicultor piscicultor;
    private Evaluador evaluador;
    private Comercializador comercializador;
    private Academico academico;

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

    public Piscicultor getPiscicultor() {
        return piscicultor;
    }

    public void setPiscicultor(Piscicultor piscicultor) {
        this.piscicultor = piscicultor;
    }

    public Evaluador getEvaluador() {
        return evaluador;
    }

    public void setEvaluador(Evaluador evaluador) {
        this.evaluador = evaluador;
    }

    public Comercializador getComercializador() {
        return comercializador;
    }

    public void setComercializador(Comercializador comercializador) {
        this.comercializador = comercializador;
    }

    public Academico getAcademico() {
        return academico;
    }

    public void setAcademico(Academico academico) {
        this.academico = academico;
    }

    public static class Piscicultor {
        private String nameProperty;
        private String department;
        private String municipality;
        private String neighborhood;

        // Getters and Setters

        public String getNameProperty() {
            return nameProperty;
        }

        public void setNameProperty(String nameProperty) {
            this.nameProperty = nameProperty;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getMunicipality() {
            return municipality;
        }

        public void setMunicipality(String municipality) {
            this.municipality = municipality;
        }

        public String getNeighborhood() {
            return neighborhood;
        }

        public void setNeighborhood(String neighborhood) {
            this.neighborhood = neighborhood;
        }
    }

    public static class Evaluador {
        private String company;
        private String employment;

        // Getters and Setters

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }

        public String getEmployment() {
            return employment;
        }

        public void setEmployment(String employment) {
            this.employment = employment;
        }
    }

    public static class Comercializador {
        private String nameProperty;
        private String department;
        private String municipality;
        private String neighborhood;

        // Getters and Setters

        public String getNameProperty() {
            return nameProperty;
        }

        public void setNameProperty(String nameProperty) {
            this.nameProperty = nameProperty;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getMunicipality() {
            return municipality;
        }

        public void setMunicipality(String municipality) {
            this.municipality = municipality;
        }

        public String getNeighborhood() {
            return neighborhood;
        }

        public void setNeighborhood(String neighborhood) {
            this.neighborhood = neighborhood;
        }
    }

    public static class Academico {
        private String institution;
        private String career;
        private String course;

        // Getters and Setters

        public String getInstitution() {
            return institution;
        }

        public void setInstitution(String institution) {
            this.institution = institution;
        }

        public String getCareer() {
            return career;
        }

        public void setCareer(String career) {
            this.career = career;
        }

        public String getCourse() {
            return course;
        }

        public void setCourse(String course) {
            this.course = course;
        }
    }
}
