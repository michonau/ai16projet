package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Sujets;
import com.mycompany.myapp.repository.SujetsRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Sujets}.
 */
@RestController
@RequestMapping("/api")
public class SujetsResource {

    private final Logger log = LoggerFactory.getLogger(SujetsResource.class);

    private static final String ENTITY_NAME = "sujets";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SujetsRepository sujetsRepository;

    public SujetsResource(SujetsRepository sujetsRepository) {
        this.sujetsRepository = sujetsRepository;
    }

    /**
     * {@code POST  /sujets} : Create a new sujets.
     *
     * @param sujets the sujets to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sujets, or with status {@code 400 (Bad Request)} if the sujets has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sujets")
    public ResponseEntity<Sujets> createSujets(@Valid @RequestBody Sujets sujets) throws URISyntaxException {
        log.debug("REST request to save Sujets : {}", sujets);
        if (sujets.getId() != null) {
            throw new BadRequestAlertException("A new sujets cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sujets result = sujetsRepository.save(sujets);
        return ResponseEntity.created(new URI("/api/sujets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sujets} : Updates an existing sujets.
     *
     * @param sujets the sujets to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sujets,
     * or with status {@code 400 (Bad Request)} if the sujets is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sujets couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sujets")
    public ResponseEntity<Sujets> updateSujets(@Valid @RequestBody Sujets sujets) throws URISyntaxException {
        log.debug("REST request to update Sujets : {}", sujets);
        if (sujets.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Sujets result = sujetsRepository.save(sujets);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sujets.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /sujets} : get all the sujets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sujets in body.
     */
    @GetMapping("/sujets")
    public List<Sujets> getAllSujets() {
        log.debug("REST request to get all Sujets");
        return sujetsRepository.findAll();
    }

    /**
     * {@code GET  /sujets/:id} : get the "id" sujets.
     *
     * @param id the id of the sujets to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sujets, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sujets/{id}")
    public ResponseEntity<Sujets> getSujets(@PathVariable Long id) {
        log.debug("REST request to get Sujets : {}", id);
        Optional<Sujets> sujets = sujetsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sujets);
    }

    /**
     * {@code DELETE  /sujets/:id} : delete the "id" sujets.
     *
     * @param id the id of the sujets to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sujets/{id}")
    public ResponseEntity<Void> deleteSujets(@PathVariable Long id) {
        log.debug("REST request to delete Sujets : {}", id);
        sujetsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
