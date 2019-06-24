package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.VoteCitoyenApp;
import com.mycompany.myapp.domain.Sujets;
import com.mycompany.myapp.repository.SujetsRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.Statut;
/**
 * Integration tests for the {@Link SujetsResource} REST controller.
 */
@SpringBootTest(classes = VoteCitoyenApp.class)
public class SujetsResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final Statut DEFAULT_STATUT = Statut.Elaboration;
    private static final Statut UPDATED_STATUT = Statut.Consultation;

    private static final LocalDate DEFAULT_DATE_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FERMETURE_AUTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FERMETURE_AUTO = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private SujetsRepository sujetsRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restSujetsMockMvc;

    private Sujets sujets;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SujetsResource sujetsResource = new SujetsResource(sujetsRepository);
        this.restSujetsMockMvc = MockMvcBuilders.standaloneSetup(sujetsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sujets createEntity(EntityManager em) {
        Sujets sujets = new Sujets()
            .titre(DEFAULT_TITRE)
            .statut(DEFAULT_STATUT)
            .dateCreation(DEFAULT_DATE_CREATION)
            .dateFermetureAuto(DEFAULT_DATE_FERMETURE_AUTO);
        return sujets;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sujets createUpdatedEntity(EntityManager em) {
        Sujets sujets = new Sujets()
            .titre(UPDATED_TITRE)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateFermetureAuto(UPDATED_DATE_FERMETURE_AUTO);
        return sujets;
    }

    @BeforeEach
    public void initTest() {
        sujets = createEntity(em);
    }

    @Test
    @Transactional
    public void createSujets() throws Exception {
        int databaseSizeBeforeCreate = sujetsRepository.findAll().size();

        // Create the Sujets
        restSujetsMockMvc.perform(post("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sujets)))
            .andExpect(status().isCreated());

        // Validate the Sujets in the database
        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeCreate + 1);
        Sujets testSujets = sujetsList.get(sujetsList.size() - 1);
        assertThat(testSujets.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testSujets.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testSujets.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testSujets.getDateFermetureAuto()).isEqualTo(DEFAULT_DATE_FERMETURE_AUTO);
    }

    @Test
    @Transactional
    public void createSujetsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sujetsRepository.findAll().size();

        // Create the Sujets with an existing ID
        sujets.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSujetsMockMvc.perform(post("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sujets)))
            .andExpect(status().isBadRequest());

        // Validate the Sujets in the database
        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTitreIsRequired() throws Exception {
        int databaseSizeBeforeTest = sujetsRepository.findAll().size();
        // set the field null
        sujets.setTitre(null);

        // Create the Sujets, which fails.

        restSujetsMockMvc.perform(post("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sujets)))
            .andExpect(status().isBadRequest());

        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatutIsRequired() throws Exception {
        int databaseSizeBeforeTest = sujetsRepository.findAll().size();
        // set the field null
        sujets.setStatut(null);

        // Create the Sujets, which fails.

        restSujetsMockMvc.perform(post("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sujets)))
            .andExpect(status().isBadRequest());

        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateCreationIsRequired() throws Exception {
        int databaseSizeBeforeTest = sujetsRepository.findAll().size();
        // set the field null
        sujets.setDateCreation(null);

        // Create the Sujets, which fails.

        restSujetsMockMvc.perform(post("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sujets)))
            .andExpect(status().isBadRequest());

        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSujets() throws Exception {
        // Initialize the database
        sujetsRepository.saveAndFlush(sujets);

        // Get all the sujetsList
        restSujetsMockMvc.perform(get("/api/sujets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sujets.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].dateFermetureAuto").value(hasItem(DEFAULT_DATE_FERMETURE_AUTO.toString())));
    }
    
    @Test
    @Transactional
    public void getSujets() throws Exception {
        // Initialize the database
        sujetsRepository.saveAndFlush(sujets);

        // Get the sujets
        restSujetsMockMvc.perform(get("/api/sujets/{id}", sujets.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sujets.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.dateFermetureAuto").value(DEFAULT_DATE_FERMETURE_AUTO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSujets() throws Exception {
        // Get the sujets
        restSujetsMockMvc.perform(get("/api/sujets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSujets() throws Exception {
        // Initialize the database
        sujetsRepository.saveAndFlush(sujets);

        int databaseSizeBeforeUpdate = sujetsRepository.findAll().size();

        // Update the sujets
        Sujets updatedSujets = sujetsRepository.findById(sujets.getId()).get();
        // Disconnect from session so that the updates on updatedSujets are not directly saved in db
        em.detach(updatedSujets);
        updatedSujets
            .titre(UPDATED_TITRE)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateFermetureAuto(UPDATED_DATE_FERMETURE_AUTO);

        restSujetsMockMvc.perform(put("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSujets)))
            .andExpect(status().isOk());

        // Validate the Sujets in the database
        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeUpdate);
        Sujets testSujets = sujetsList.get(sujetsList.size() - 1);
        assertThat(testSujets.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testSujets.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testSujets.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testSujets.getDateFermetureAuto()).isEqualTo(UPDATED_DATE_FERMETURE_AUTO);
    }

    @Test
    @Transactional
    public void updateNonExistingSujets() throws Exception {
        int databaseSizeBeforeUpdate = sujetsRepository.findAll().size();

        // Create the Sujets

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSujetsMockMvc.perform(put("/api/sujets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sujets)))
            .andExpect(status().isBadRequest());

        // Validate the Sujets in the database
        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSujets() throws Exception {
        // Initialize the database
        sujetsRepository.saveAndFlush(sujets);

        int databaseSizeBeforeDelete = sujetsRepository.findAll().size();

        // Delete the sujets
        restSujetsMockMvc.perform(delete("/api/sujets/{id}", sujets.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sujets> sujetsList = sujetsRepository.findAll();
        assertThat(sujetsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sujets.class);
        Sujets sujets1 = new Sujets();
        sujets1.setId(1L);
        Sujets sujets2 = new Sujets();
        sujets2.setId(sujets1.getId());
        assertThat(sujets1).isEqualTo(sujets2);
        sujets2.setId(2L);
        assertThat(sujets1).isNotEqualTo(sujets2);
        sujets1.setId(null);
        assertThat(sujets1).isNotEqualTo(sujets2);
    }
}
