/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { VoteCitoyenTestModule } from '../../../test.module';
import { AvisDeleteDialogComponent } from 'app/entities/avis/avis-delete-dialog.component';
import { AvisService } from 'app/entities/avis/avis.service';

describe('Component Tests', () => {
  describe('Avis Management Delete Component', () => {
    let comp: AvisDeleteDialogComponent;
    let fixture: ComponentFixture<AvisDeleteDialogComponent>;
    let service: AvisService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [AvisDeleteDialogComponent]
      })
        .overrideTemplate(AvisDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AvisDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AvisService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
