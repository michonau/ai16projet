import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPropositions } from 'app/shared/model/propositions.model';
import { PropositionsService } from './propositions.service';

@Component({
  selector: 'jhi-propositions-delete-dialog',
  templateUrl: './propositions-delete-dialog.component.html'
})
export class PropositionsDeleteDialogComponent {
  propositions: IPropositions;

  constructor(
    protected propositionsService: PropositionsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.propositionsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'propositionsListModification',
        content: 'Deleted an propositions'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-propositions-delete-popup',
  template: ''
})
export class PropositionsDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ propositions }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PropositionsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.propositions = propositions;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/propositions', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/propositions', { outlets: { popup: null } }]);
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
