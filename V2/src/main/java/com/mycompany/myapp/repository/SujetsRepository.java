package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Sujets;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Sujets entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SujetsRepository extends JpaRepository<Sujets, Long> {

    @Query("select sujets from Sujets sujets where sujets.user.login = ?#{principal.username}")
    List<Sujets> findByUserIsCurrentUser();

}
