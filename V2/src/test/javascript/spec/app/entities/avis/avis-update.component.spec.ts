/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { VoteCitoyenTestModule } from '../../../test.module';
import { AvisUpdateComponent } from 'app/entities/avis/avis-update.component';
import { AvisService } from 'app/entities/avis/avis.service';
import { Avis } from 'app/shared/model/avis.model';

describe('Component Tests', () => {
  describe('Avis Management Update Component', () => {
    let comp: AvisUpdateComponent;
    let fixture: ComponentFixture<AvisUpdateComponent>;
    let service: AvisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [AvisUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(AvisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AvisUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AvisService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Avis(123);
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
        const entity = new Avis();
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
