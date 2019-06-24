/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoteCitoyenTestModule } from '../../../test.module';
import { PropositionsDetailComponent } from 'app/entities/propositions/propositions-detail.component';
import { Propositions } from 'app/shared/model/propositions.model';

describe('Component Tests', () => {
  describe('Propositions Management Detail Component', () => {
    let comp: PropositionsDetailComponent;
    let fixture: ComponentFixture<PropositionsDetailComponent>;
    const route = ({ data: of({ propositions: new Propositions(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [PropositionsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PropositionsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PropositionsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.propositions).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
