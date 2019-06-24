package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Avis;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Avis entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AvisRepository extends JpaRepository<Avis, Long> {

    @Query("select avis from Avis avis where avis.user.login = ?#{principal.username}")
    List<Avis> findByUserIsCurrentUser();

}
