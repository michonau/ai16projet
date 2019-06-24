/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { VoteCitoyenTestModule } from '../../../test.module';
import { PropositionsUpdateComponent } from 'app/entities/propositions/propositions-update.component';
import { PropositionsService } from 'app/entities/propositions/propositions.service';
import { Propositions } from 'app/shared/model/propositions.model';

describe('Component Tests', () => {
  describe('Propositions Management Update Component', () => {
    let comp: PropositionsUpdateComponent;
    let fixture: ComponentFixture<PropositionsUpdateComponent>;
    let service: PropositionsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [PropositionsUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PropositionsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PropositionsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PropositionsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Propositions(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Propositions();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
