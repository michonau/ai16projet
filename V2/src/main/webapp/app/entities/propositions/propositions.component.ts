import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPropositions } from 'app/shared/model/propositions.model';
import { AccountService } from 'app/core';
import { PropositionsService } from './propositions.service';

@Component({
  selector: 'jhi-propositions',
  templateUrl: './propositions.component.html'
})
export class PropositionsComponent implements OnInit, OnDestroy {
  propositions: IPropositions[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected propositionsService: PropositionsService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.propositionsService
      .query()
      .pipe(
        filter((res: HttpResponse<IPropositions[]>) => res.ok),
        map((res: HttpResponse<IPropositions[]>) => res.body)
      )
      .subscribe(
        (res: IPropositions[]) => {
          this.propositions = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPropositions();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPropositions) {
    return item.id;
  }

  registerChangeInPropositions() {
    this.eventSubscriber = this.eventManager.subscribe('propositionsListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
