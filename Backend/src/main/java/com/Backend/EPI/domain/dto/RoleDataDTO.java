package com.Backend.EPI.domain.dto;

public class RoleDataDTO {
    private PiscicultorDTO piscicultor;
    private EvaluadorDTO evaluador;
    private ComercializadorDTO comercializador;
    private AcademicoDTO academico;

    // Getters and Setters

    public PiscicultorDTO getPiscicultor() {
        return piscicultor;
    }

    public void setPiscicultor(PiscicultorDTO piscicultor) {
        this.piscicultor = piscicultor;
    }

    public EvaluadorDTO getEvaluador() {
        return evaluador;
    }

    public void setEvaluador(EvaluadorDTO evaluador) {
        this.evaluador = evaluador;
    }

    public ComercializadorDTO getComercializador() {
        return comercializador;
    }

    public void setComercializador(ComercializadorDTO comercializador) {
        this.comercializador = comercializador;
    }

    public AcademicoDTO getAcademico() {
        return academico;
    }

    public void setAcademico(AcademicoDTO academico) {
        this.academico = academico;
    }
}

