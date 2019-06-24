/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { VoteCitoyenTestModule } from '../../../test.module';
import { SujetsComponent } from 'app/entities/sujets/sujets.component';
import { SujetsService } from 'app/entities/sujets/sujets.service';
import { Sujets } from 'app/shared/model/sujets.model';

describe('Component Tests', () => {
  describe('Sujets Management Component', () => {
    let comp: SujetsComponent;
    let fixture: ComponentFixture<SujetsComponent>;
    let service: SujetsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [SujetsComponent],
        providers: []
      })
        .overrideTemplate(SujetsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SujetsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SujetsService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Sujets(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.sujets[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
