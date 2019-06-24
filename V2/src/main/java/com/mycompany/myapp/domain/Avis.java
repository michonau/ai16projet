package com.mycompany.myapp.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;

import com.mycompany.myapp.domain.enumeration.Choix;

/**
 * A Avis.
 */
@Entity
@Table(name = "avis")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Avis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "date_creation", nullable = false)
    private LocalDate dateCreation;

    @Column(name = "commentaire")
    private String commentaire;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "choix", nullable = false)
    private Choix choix;

    @ManyToOne
    @JsonIgnoreProperties("avis")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("avis")
    private Propositions propositions;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public Avis dateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public Avis commentaire(String commentaire) {
        this.commentaire = commentaire;
        return this;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Choix getChoix() {
        return choix;
    }

    public Avis choix(Choix choix) {
        this.choix = choix;
        return this;
    }

    public void setChoix(Choix choix) {
        this.choix = choix;
    }

    public User getUser() {
        return user;
    }

    public Avis user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Propositions getPropositions() {
        return propositions;
    }

    public Avis propositions(Propositions propositions) {
        this.propositions = propositions;
        return this;
    }

    public void setPropositions(Propositions propositions) {
        this.propositions = propositions;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Avis)) {
            return false;
        }
        return id != null && id.equals(((Avis) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Avis{" +
            "id=" + getId() +
            ", dateCreation='" + getDateCreation() + "'" +
            ", commentaire='" + getCommentaire() + "'" +
            ", choix='" + getChoix() + "'" +
            "}";
    }
}
