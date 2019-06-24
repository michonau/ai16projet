/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { VoteCitoyenTestModule } from '../../../test.module';
import { PropositionsDeleteDialogComponent } from 'app/entities/propositions/propositions-delete-dialog.component';
import { PropositionsService } from 'app/entities/propositions/propositions.service';

describe('Component Tests', () => {
  describe('Propositions Management Delete Component', () => {
    let comp: PropositionsDeleteDialogComponent;
    let fixture: ComponentFixture<PropositionsDeleteDialogComponent>;
    let service: PropositionsService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VoteCitoyenTestModule],
        declarations: [PropositionsDeleteDialogComponent]
      })
        .overrideTemplate(PropositionsDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PropositionsDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PropositionsService);
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
