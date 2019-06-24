/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { VoteCitoyenTestModule } from '../../../test.module';
import { SujetsUpdateComponent } from 'app/entities/sujets/sujets-update.component';
import { SujetsService } from 'app/entities/sujets/sujets.service';
import { Sujets } from 'app/shared/model/sujets.model';

describe('Component Tests', () => {
  describe('Sujets Management Update Component', () => {
    let comp: SujetsUpdateComponent;
    let fixture: ComponentFixture<SujetsUpdateComponent>;
    let service: SujetsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [SujetsUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(SujetsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SujetsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SujetsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Sujets(123);
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
        const entity = new Sujets();
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
