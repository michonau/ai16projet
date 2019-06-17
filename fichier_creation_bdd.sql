DROP SCHEMA ai16 CASCADE;
CREATE SCHEMA IF NOT EXISTS ai16;

CREATE TABLE IF NOT EXISTS ai16.sujets(
    id SERIAL PRIMARY KEY,
    titre VARCHAR,
    fkmoderateur_createur INTEGER,
    statut VARCHAR(12),
    date_creation DATE,
    date_fermeture_auto DATE,

    CONSTRAINT C_statut CHECK (statut in ('elaboration', 'consultation', 'fermeture'))
);

CREATE TABLE IF NOT EXISTS ai16.propositions(
    id SERIAL PRIMARY KEY,
    fksujet_pere INTEGER,
    fkauteur INTEGER,
    date_creation DATE,
    votes_pour INTEGER,
    contenu TEXT,
    archive BOOLEAN,
    message_justificatif TEXT
);

CREATE TABLE IF NOT EXISTS ai16.avis(
    fkproposition_mere INTEGER,
    fkauteur INTEGER,
    date_creation DATE,
    commentaire TEXT,
    choix VARCHAR,

    CONSTRAINT C_avis CHECK (choix in ('pour','pour mais', 'contre', 'neutre')),
    PRIMARY KEY (fkproposition_mere, fkauteur)
);

CREATE TABLE IF NOT EXISTS ai16.utilisateurs(
    id SERIAL PRIMARY KEY,
    mail VARCHAR,
    mdp VARCHAR,
    nom VARCHAR,
    prenom VARCHAR,
    sexe CHAR,
    age INTEGER,
    telephone VARCHAR,
    statut_actif BOOLEAN,
    est_moderateur BOOLEAN,
    fkvalide_par INTEGER,
    date_ouverture_compte DATE,
    CONSTRAINT sexe CHECK (sexe in ('M', 'F', 'U'))
);
