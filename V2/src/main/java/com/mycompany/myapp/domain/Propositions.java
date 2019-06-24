package com.mycompany.myapp.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Propositions.
 */
@Entity
@Table(name = "propositions")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Propositions implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "votes_pour", nullable = false)
    private Integer votesPour;

    @NotNull
    @Column(name = "date_creation", nullable = false)
    private LocalDate dateCreation;

    @NotNull
    @Column(name = "contenu", nullable = false)
    private String contenu;

    @NotNull
    @Column(name = "archive", nullable = false)
    private Boolean archive;

    @Column(name = "message_justificatif")
    private String messageJustificatif;

    @ManyToOne
    @JsonIgnoreProperties("propositions")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("propositions")
    private Sujets sujets;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getVotesPour() {
        return votesPour;
    }

    public Propositions votesPour(Integer votesPour) {
        this.votesPour = votesPour;
        return this;
    }

    public void setVotesPour(Integer votesPour) {
        this.votesPour = votesPour;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public Propositions dateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getContenu() {
        return contenu;
    }

    public Propositions contenu(String contenu) {
        this.contenu = contenu;
        return this;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public Boolean isArchive() {
        return archive;
    }

    public Propositions archive(Boolean archive) {
        this.archive = archive;
        return this;
    }

    public void setArchive(Boolean archive) {
        this.archive = archive;
    }

    public String getMessageJustificatif() {
        return messageJustificatif;
    }

    public Propositions messageJustificatif(String messageJustificatif) {
        this.messageJustificatif = messageJustificatif;
        return this;
    }

    public void setMessageJustificatif(String messageJustificatif) {
        this.messageJustificatif = messageJustificatif;
    }

    public User getUser() {
        return user;
    }

    public Propositions user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Sujets getSujets() {
        return sujets;
    }

    public Propositions sujets(Sujets sujets) {
        this.sujets = sujets;
        return this;
    }

    public void setSujets(Sujets sujets) {
        this.sujets = sujets;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Propositions)) {
            return false;
        }
        return id != null && id.equals(((Propositions) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Propositions{" +
            "id=" + getId() +
            ", votesPour=" + getVotesPour() +
            ", dateCreation='" + getDateCreation() + "'" +
            ", contenu='" + getContenu() + "'" +
            ", archive='" + isArchive() + "'" +
            ", messageJustificatif='" + getMessageJustificatif() + "'" +
            "}";
    }
}
