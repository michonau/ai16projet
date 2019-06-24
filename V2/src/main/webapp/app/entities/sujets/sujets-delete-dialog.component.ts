import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISujets } from 'app/shared/model/sujets.model';
import { SujetsService } from './sujets.service';

@Component({
  selector: 'jhi-sujets-delete-dialog',
  templateUrl: './sujets-delete-dialog.component.html'
})
export class SujetsDeleteDialogComponent {
  sujets: ISujets;

  constructor(protected sujetsService: SujetsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.sujetsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'sujetsListModification',
        content: 'Deleted an sujets'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-sujets-delete-popup',
  template: ''
})
export class SujetsDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sujets }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(SujetsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.sujets = sujets;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/sujets', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/sujets', { outlets: { popup: null } }]);
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
