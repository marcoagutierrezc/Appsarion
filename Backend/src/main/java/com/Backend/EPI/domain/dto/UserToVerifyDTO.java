package com.Backend.EPI.domain.dto;

import com.Backend.EPI.persistence.entity.Academico;
import com.Backend.EPI.persistence.entity.Comercializador;
import com.Backend.EPI.persistence.entity.Evaluador;
import com.Backend.EPI.persistence.entity.Piscicultor;

public class UserToVerifyDTO {

    private String name;
    private String documentType;
    private Long documentNumber;
    private Long phoneNumber;
    private String email;
    private String password;
    private String justification;
    private String supportingDocument;
    private String role;
    private RoleData roleData;

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

    public RoleData getRoleData() {
        return roleData;
    }

    public void setRoleData(RoleData roleData) {
        this.roleData = roleData;
    }

    public static class RoleData {
        private Piscicultor piscicultor;
        private Evaluador evaluador;
        private Comercializador comercializador;
        private Academico academico;

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
    }
}
