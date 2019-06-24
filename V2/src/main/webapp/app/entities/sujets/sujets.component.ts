import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISujets } from 'app/shared/model/sujets.model';
import { AccountService } from 'app/core';
import { SujetsService } from './sujets.service';

@Component({
  selector: 'jhi-sujets',
  templateUrl: './sujets.component.html'
})
export class SujetsComponent implements OnInit, OnDestroy {
  sujets: ISujets[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected sujetsService: SujetsService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.sujetsService
      .query()
      .pipe(
        filter((res: HttpResponse<ISujets[]>) => res.ok),
        map((res: HttpResponse<ISujets[]>) => res.body)
      )
      .subscribe(
        (res: ISujets[]) => {
          this.sujets = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInSujets();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ISujets) {
    return item.id;
  }

  registerChangeInSujets() {
    this.eventSubscriber = this.eventManager.subscribe('sujetsListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
