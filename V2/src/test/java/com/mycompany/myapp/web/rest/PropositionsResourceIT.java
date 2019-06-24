package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.VoteCitoyenApp;
import com.mycompany.myapp.domain.Propositions;
import com.mycompany.myapp.repository.PropositionsRepository;
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

/**
 * Integration tests for the {@Link PropositionsResource} REST controller.
 */
@SpringBootTest(classes = VoteCitoyenApp.class)
public class PropositionsResourceIT {

    private static final Integer DEFAULT_VOTES_POUR = 1;
    private static final Integer UPDATED_VOTES_POUR = 2;

    private static final LocalDate DEFAULT_DATE_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CONTENU = "AAAAAAAAAA";
    private static final String UPDATED_CONTENU = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ARCHIVE = false;
    private static final Boolean UPDATED_ARCHIVE = true;

    private static final String DEFAULT_MESSAGE_JUSTIFICATIF = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_JUSTIFICATIF = "BBBBBBBBBB";

    @Autowired
    private PropositionsRepository propositionsRepository;

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

    private MockMvc restPropositionsMockMvc;

    private Propositions propositions;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PropositionsResource propositionsResource = new PropositionsResource(propositionsRepository);
        this.restPropositionsMockMvc = MockMvcBuilders.standaloneSetup(propositionsResource)
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
    public static Propositions createEntity(EntityManager em) {
        Propositions propositions = new Propositions()
            .votesPour(DEFAULT_VOTES_POUR)
            .dateCreation(DEFAULT_DATE_CREATION)
            .contenu(DEFAULT_CONTENU)
            .archive(DEFAULT_ARCHIVE)
            .messageJustificatif(DEFAULT_MESSAGE_JUSTIFICATIF);
        return propositions;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Propositions createUpdatedEntity(EntityManager em) {
        Propositions propositions = new Propositions()
            .votesPour(UPDATED_VOTES_POUR)
            .dateCreation(UPDATED_DATE_CREATION)
            .contenu(UPDATED_CONTENU)
            .archive(UPDATED_ARCHIVE)
            .messageJustificatif(UPDATED_MESSAGE_JUSTIFICATIF);
        return propositions;
    }

    @BeforeEach
    public void initTest() {
        propositions = createEntity(em);
    }

    @Test
    @Transactional
    public void createPropositions() throws Exception {
        int databaseSizeBeforeCreate = propositionsRepository.findAll().size();

        // Create the Propositions
        restPropositionsMockMvc.perform(post("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isCreated());

        // Validate the Propositions in the database
        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeCreate + 1);
        Propositions testPropositions = propositionsList.get(propositionsList.size() - 1);
        assertThat(testPropositions.getVotesPour()).isEqualTo(DEFAULT_VOTES_POUR);
        assertThat(testPropositions.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testPropositions.getContenu()).isEqualTo(DEFAULT_CONTENU);
        assertThat(testPropositions.isArchive()).isEqualTo(DEFAULT_ARCHIVE);
        assertThat(testPropositions.getMessageJustificatif()).isEqualTo(DEFAULT_MESSAGE_JUSTIFICATIF);
    }

    @Test
    @Transactional
    public void createPropositionsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = propositionsRepository.findAll().size();

        // Create the Propositions with an existing ID
        propositions.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPropositionsMockMvc.perform(post("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isBadRequest());

        // Validate the Propositions in the database
        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkVotesPourIsRequired() throws Exception {
        int databaseSizeBeforeTest = propositionsRepository.findAll().size();
        // set the field null
        propositions.setVotesPour(null);

        // Create the Propositions, which fails.

        restPropositionsMockMvc.perform(post("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isBadRequest());

        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateCreationIsRequired() throws Exception {
        int databaseSizeBeforeTest = propositionsRepository.findAll().size();
        // set the field null
        propositions.setDateCreation(null);

        // Create the Propositions, which fails.

        restPropositionsMockMvc.perform(post("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isBadRequest());

        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkContenuIsRequired() throws Exception {
        int databaseSizeBeforeTest = propositionsRepository.findAll().size();
        // set the field null
        propositions.setContenu(null);

        // Create the Propositions, which fails.

        restPropositionsMockMvc.perform(post("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isBadRequest());

        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkArchiveIsRequired() throws Exception {
        int databaseSizeBeforeTest = propositionsRepository.findAll().size();
        // set the field null
        propositions.setArchive(null);

        // Create the Propositions, which fails.

        restPropositionsMockMvc.perform(post("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isBadRequest());

        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPropositions() throws Exception {
        // Initialize the database
        propositionsRepository.saveAndFlush(propositions);

        // Get all the propositionsList
        restPropositionsMockMvc.perform(get("/api/propositions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(propositions.getId().intValue())))
            .andExpect(jsonPath("$.[*].votesPour").value(hasItem(DEFAULT_VOTES_POUR)))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].contenu").value(hasItem(DEFAULT_CONTENU.toString())))
            .andExpect(jsonPath("$.[*].archive").value(hasItem(DEFAULT_ARCHIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].messageJustificatif").value(hasItem(DEFAULT_MESSAGE_JUSTIFICATIF.toString())));
    }
    
    @Test
    @Transactional
    public void getPropositions() throws Exception {
        // Initialize the database
        propositionsRepository.saveAndFlush(propositions);

        // Get the propositions
        restPropositionsMockMvc.perform(get("/api/propositions/{id}", propositions.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(propositions.getId().intValue()))
            .andExpect(jsonPath("$.votesPour").value(DEFAULT_VOTES_POUR))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.contenu").value(DEFAULT_CONTENU.toString()))
            .andExpect(jsonPath("$.archive").value(DEFAULT_ARCHIVE.booleanValue()))
            .andExpect(jsonPath("$.messageJustificatif").value(DEFAULT_MESSAGE_JUSTIFICATIF.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPropositions() throws Exception {
        // Get the propositions
        restPropositionsMockMvc.perform(get("/api/propositions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePropositions() throws Exception {
        // Initialize the database
        propositionsRepository.saveAndFlush(propositions);

        int databaseSizeBeforeUpdate = propositionsRepository.findAll().size();

        // Update the propositions
        Propositions updatedPropositions = propositionsRepository.findById(propositions.getId()).get();
        // Disconnect from session so that the updates on updatedPropositions are not directly saved in db
        em.detach(updatedPropositions);
        updatedPropositions
            .votesPour(UPDATED_VOTES_POUR)
            .dateCreation(UPDATED_DATE_CREATION)
            .contenu(UPDATED_CONTENU)
            .archive(UPDATED_ARCHIVE)
            .messageJustificatif(UPDATED_MESSAGE_JUSTIFICATIF);

        restPropositionsMockMvc.perform(put("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPropositions)))
            .andExpect(status().isOk());

        // Validate the Propositions in the database
        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeUpdate);
        Propositions testPropositions = propositionsList.get(propositionsList.size() - 1);
        assertThat(testPropositions.getVotesPour()).isEqualTo(UPDATED_VOTES_POUR);
        assertThat(testPropositions.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testPropositions.getContenu()).isEqualTo(UPDATED_CONTENU);
        assertThat(testPropositions.isArchive()).isEqualTo(UPDATED_ARCHIVE);
        assertThat(testPropositions.getMessageJustificatif()).isEqualTo(UPDATED_MESSAGE_JUSTIFICATIF);
    }

    @Test
    @Transactional
    public void updateNonExistingPropositions() throws Exception {
        int databaseSizeBeforeUpdate = propositionsRepository.findAll().size();

        // Create the Propositions

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPropositionsMockMvc.perform(put("/api/propositions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(propositions)))
            .andExpect(status().isBadRequest());

        // Validate the Propositions in the database
        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePropositions() throws Exception {
        // Initialize the database
        propositionsRepository.saveAndFlush(propositions);

        int databaseSizeBeforeDelete = propositionsRepository.findAll().size();

        // Delete the propositions
        restPropositionsMockMvc.perform(delete("/api/propositions/{id}", propositions.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Propositions> propositionsList = propositionsRepository.findAll();
        assertThat(propositionsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Propositions.class);
        Propositions propositions1 = new Propositions();
        propositions1.setId(1L);
        Propositions propositions2 = new Propositions();
        propositions2.setId(propositions1.getId());
        assertThat(propositions1).isEqualTo(propositions2);
        propositions2.setId(2L);
        assertThat(propositions1).isNotEqualTo(propositions2);
        propositions1.setId(null);
        assertThat(propositions1).isNotEqualTo(propositions2);
    }
}
