/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { VoteCitoyenTestModule } from '../../../test.module';
import { PropositionsComponent } from 'app/entities/propositions/propositions.component';
import { PropositionsService } from 'app/entities/propositions/propositions.service';
import { Propositions } from 'app/shared/model/propositions.model';

describe('Component Tests', () => {
  describe('Propositions Management Component', () => {
    let comp: PropositionsComponent;
    let fixture: ComponentFixture<PropositionsComponent>;
    let service: PropositionsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [PropositionsComponent],
        providers: []
      })
        .overrideTemplate(PropositionsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PropositionsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PropositionsService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Propositions(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.propositions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
