import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAvis } from 'app/shared/model/avis.model';
import { AvisService } from './avis.service';

@Component({
  selector: 'jhi-avis-delete-dialog',
  templateUrl: './avis-delete-dialog.component.html'
})
export class AvisDeleteDialogComponent {
  avis: IAvis;

  constructor(protected avisService: AvisService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.avisService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'avisListModification',
        content: 'Deleted an avis'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-avis-delete-popup',
  template: ''
})
export class AvisDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ avis }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(AvisDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.avis = avis;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/avis', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/avis', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
