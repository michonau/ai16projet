package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Propositions;
import com.mycompany.myapp.repository.PropositionsRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Propositions}.
 */
@RestController
@RequestMapping("/api")
public class PropositionsResource {

    private final Logger log = LoggerFactory.getLogger(PropositionsResource.class);

    private static final String ENTITY_NAME = "propositions";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PropositionsRepository propositionsRepository;

    public PropositionsResource(PropositionsRepository propositionsRepository) {
        this.propositionsRepository = propositionsRepository;
    }

    /**
     * {@code POST  /propositions} : Create a new propositions.
     *
     * @param propositions the propositions to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new propositions, or with status {@code 400 (Bad Request)} if the propositions has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/propositions")
    public ResponseEntity<Propositions> createPropositions(@Valid @RequestBody Propositions propositions) throws URISyntaxException {
        log.debug("REST request to save Propositions : {}", propositions);
        if (propositions.getId() != null) {
            throw new BadRequestAlertException("A new propositions cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Propositions result = propositionsRepository.save(propositions);
        return ResponseEntity.created(new URI("/api/propositions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /propositions} : Updates an existing propositions.
     *
     * @param propositions the propositions to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated propositions,
     * or with status {@code 400 (Bad Request)} if the propositions is not valid,
     * or with status {@code 500 (Internal Server Error)} if the propositions couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/propositions")
    public ResponseEntity<Propositions> updatePropositions(@Valid @RequestBody Propositions propositions) throws URISyntaxException {
        log.debug("REST request to update Propositions : {}", propositions);
        if (propositions.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Propositions result = propositionsRepository.save(propositions);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, propositions.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /propositions} : get all the propositions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of propositions in body.
     */
    @GetMapping("/propositions")
    public List<Propositions> getAllPropositions() {
        log.debug("REST request to get all Propositions");
        return propositionsRepository.findAll();
    }

    /**
     * {@code GET  /propositions/:id} : get the "id" propositions.
     *
     * @param id the id of the propositions to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the propositions, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/propositions/{id}")
    public ResponseEntity<Propositions> getPropositions(@PathVariable Long id) {
        log.debug("REST request to get Propositions : {}", id);
        Optional<Propositions> propositions = propositionsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(propositions);
    }

    /**
     * {@code DELETE  /propositions/:id} : delete the "id" propositions.
     *
     * @param id the id of the propositions to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/propositions/{id}")
    public ResponseEntity<Void> deletePropositions(@PathVariable Long id) {
        log.debug("REST request to delete Propositions : {}", id);
        propositionsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
