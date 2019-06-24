/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { VoteCitoyenTestModule } from '../../../test.module';
import { SujetsDeleteDialogComponent } from 'app/entities/sujets/sujets-delete-dialog.component';
import { SujetsService } from 'app/entities/sujets/sujets.service';

describe('Component Tests', () => {
  describe('Sujets Management Delete Component', () => {
    let comp: SujetsDeleteDialogComponent;
    let fixture: ComponentFixture<SujetsDeleteDialogComponent>;
    let service: SujetsService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [SujetsDeleteDialogComponent]
      })
        .overrideTemplate(SujetsDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SujetsDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SujetsService);
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
