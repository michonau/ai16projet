package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.VoteCitoyenApp;
import com.mycompany.myapp.domain.Avis;
import com.mycompany.myapp.repository.AvisRepository;
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

import com.mycompany.myapp.domain.enumeration.Choix;
/**
 * Integration tests for the {@Link AvisResource} REST controller.
 */
@SpringBootTest(classes = VoteCitoyenApp.class)
public class AvisResourceIT {

    private static final LocalDate DEFAULT_DATE_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_COMMENTAIRE = "AAAAAAAAAA";
    private static final String UPDATED_COMMENTAIRE = "BBBBBBBBBB";

    private static final Choix DEFAULT_CHOIX = Choix.Pour;
    private static final Choix UPDATED_CHOIX = Choix.Mais;

    @Autowired
    private AvisRepository avisRepository;

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

    private MockMvc restAvisMockMvc;

    private Avis avis;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AvisResource avisResource = new AvisResource(avisRepository);
        this.restAvisMockMvc = MockMvcBuilders.standaloneSetup(avisResource)
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
    public static Avis createEntity(EntityManager em) {
        Avis avis = new Avis()
            .dateCreation(DEFAULT_DATE_CREATION)
            .commentaire(DEFAULT_COMMENTAIRE)
            .choix(DEFAULT_CHOIX);
        return avis;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Avis createUpdatedEntity(EntityManager em) {
        Avis avis = new Avis()
            .dateCreation(UPDATED_DATE_CREATION)
            .commentaire(UPDATED_COMMENTAIRE)
            .choix(UPDATED_CHOIX);
        return avis;
    }

    @BeforeEach
    public void initTest() {
        avis = createEntity(em);
    }

    @Test
    @Transactional
    public void createAvis() throws Exception {
        int databaseSizeBeforeCreate = avisRepository.findAll().size();

        // Create the Avis
        restAvisMockMvc.perform(post("/api/avis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isCreated());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeCreate + 1);
        Avis testAvis = avisList.get(avisList.size() - 1);
        assertThat(testAvis.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testAvis.getCommentaire()).isEqualTo(DEFAULT_COMMENTAIRE);
        assertThat(testAvis.getChoix()).isEqualTo(DEFAULT_CHOIX);
    }

    @Test
    @Transactional
    public void createAvisWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = avisRepository.findAll().size();

        // Create the Avis with an existing ID
        avis.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAvisMockMvc.perform(post("/api/avis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDateCreationIsRequired() throws Exception {
        int databaseSizeBeforeTest = avisRepository.findAll().size();
        // set the field null
        avis.setDateCreation(null);

        // Create the Avis, which fails.

        restAvisMockMvc.perform(post("/api/avis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isBadRequest());

        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkChoixIsRequired() throws Exception {
        int databaseSizeBeforeTest = avisRepository.findAll().size();
        // set the field null
        avis.setChoix(null);

        // Create the Avis, which fails.

        restAvisMockMvc.perform(post("/api/avis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isBadRequest());

        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        // Get all the avisList
        restAvisMockMvc.perform(get("/api/avis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(avis.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].commentaire").value(hasItem(DEFAULT_COMMENTAIRE.toString())))
            .andExpect(jsonPath("$.[*].choix").value(hasItem(DEFAULT_CHOIX.toString())));
    }
    
    @Test
    @Transactional
    public void getAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        // Get the avis
        restAvisMockMvc.perform(get("/api/avis/{id}", avis.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(avis.getId().intValue()))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.commentaire").value(DEFAULT_COMMENTAIRE.toString()))
            .andExpect(jsonPath("$.choix").value(DEFAULT_CHOIX.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAvis() throws Exception {
        // Get the avis
        restAvisMockMvc.perform(get("/api/avis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        int databaseSizeBeforeUpdate = avisRepository.findAll().size();

        // Update the avis
        Avis updatedAvis = avisRepository.findById(avis.getId()).get();
        // Disconnect from session so that the updates on updatedAvis are not directly saved in db
        em.detach(updatedAvis);
        updatedAvis
            .dateCreation(UPDATED_DATE_CREATION)
            .commentaire(UPDATED_COMMENTAIRE)
            .choix(UPDATED_CHOIX);

        restAvisMockMvc.perform(put("/api/avis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAvis)))
            .andExpect(status().isOk());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
        Avis testAvis = avisList.get(avisList.size() - 1);
        assertThat(testAvis.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testAvis.getCommentaire()).isEqualTo(UPDATED_COMMENTAIRE);
        assertThat(testAvis.getChoix()).isEqualTo(UPDATED_CHOIX);
    }

    @Test
    @Transactional
    public void updateNonExistingAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();

        // Create the Avis

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvisMockMvc.perform(put("/api/avis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        int databaseSizeBeforeDelete = avisRepository.findAll().size();

        // Delete the avis
        restAvisMockMvc.perform(delete("/api/avis/{id}", avis.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Avis.class);
        Avis avis1 = new Avis();
        avis1.setId(1L);
        Avis avis2 = new Avis();
        avis2.setId(avis1.getId());
        assertThat(avis1).isEqualTo(avis2);
        avis2.setId(2L);
        assertThat(avis1).isNotEqualTo(avis2);
        avis1.setId(null);
        assertThat(avis1).isNotEqualTo(avis2);
    }
}
