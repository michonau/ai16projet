import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAvis } from 'app/shared/model/avis.model';
import { AccountService } from 'app/core';
import { AvisService } from './avis.service';

@Component({
  selector: 'jhi-avis',
  templateUrl: './avis.component.html'
})
export class AvisComponent implements OnInit, OnDestroy {
  avis: IAvis[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected avisService: AvisService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.avisService
      .query()
      .pipe(
        filter((res: HttpResponse<IAvis[]>) => res.ok),
        map((res: HttpResponse<IAvis[]>) => res.body)
      )
      .subscribe(
        (res: IAvis[]) => {
          this.avis = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInAvis();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IAvis) {
    return item.id;
  }

  registerChangeInAvis() {
    this.eventSubscriber = this.eventManager.subscribe('avisListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
