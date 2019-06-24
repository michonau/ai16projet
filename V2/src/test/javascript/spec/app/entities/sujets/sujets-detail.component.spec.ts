/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoteCitoyenTestModule } from '../../../test.module';
import { SujetsDetailComponent } from 'app/entities/sujets/sujets-detail.component';
import { Sujets } from 'app/shared/model/sujets.model';

describe('Component Tests', () => {
  describe('Sujets Management Detail Component', () => {
    let comp: SujetsDetailComponent;
    let fixture: ComponentFixture<SujetsDetailComponent>;
    const route = ({ data: of({ sujets: new Sujets(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [SujetsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(SujetsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SujetsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sujets).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
