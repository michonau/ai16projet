package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Avis;
import com.mycompany.myapp.repository.AvisRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Avis}.
 */
@RestController
@RequestMapping("/api")
public class AvisResource {

    private final Logger log = LoggerFactory.getLogger(AvisResource.class);

    private static final String ENTITY_NAME = "avis";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AvisRepository avisRepository;

    public AvisResource(AvisRepository avisRepository) {
        this.avisRepository = avisRepository;
    }

    /**
     * {@code POST  /avis} : Create a new avis.
     *
     * @param avis the avis to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new avis, or with status {@code 400 (Bad Request)} if the avis has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/avis")
    public ResponseEntity<Avis> createAvis(@Valid @RequestBody Avis avis) throws URISyntaxException {
        log.debug("REST request to save Avis : {}", avis);
        if (avis.getId() != null) {
            throw new BadRequestAlertException("A new avis cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Avis result = avisRepository.save(avis);
        return ResponseEntity.created(new URI("/api/avis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /avis} : Updates an existing avis.
     *
     * @param avis the avis to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated avis,
     * or with status {@code 400 (Bad Request)} if the avis is not valid,
     * or with status {@code 500 (Internal Server Error)} if the avis couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/avis")
    public ResponseEntity<Avis> updateAvis(@Valid @RequestBody Avis avis) throws URISyntaxException {
        log.debug("REST request to update Avis : {}", avis);
        if (avis.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Avis result = avisRepository.save(avis);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, avis.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /avis} : get all the avis.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of avis in body.
     */
    @GetMapping("/avis")
    public List<Avis> getAllAvis() {
        log.debug("REST request to get all Avis");
        return avisRepository.findAll();
    }

    /**
     * {@code GET  /avis/:id} : get the "id" avis.
     *
     * @param id the id of the avis to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the avis, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/avis/{id}")
    public ResponseEntity<Avis> getAvis(@PathVariable Long id) {
        log.debug("REST request to get Avis : {}", id);
        Optional<Avis> avis = avisRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(avis);
    }

    /**
     * {@code DELETE  /avis/:id} : delete the "id" avis.
     *
     * @param id the id of the avis to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/avis/{id}")
    public ResponseEntity<Void> deleteAvis(@PathVariable Long id) {
        log.debug("REST request to delete Avis : {}", id);
        avisRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
