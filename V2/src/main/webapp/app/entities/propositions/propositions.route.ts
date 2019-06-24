import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Propositions } from 'app/shared/model/propositions.model';
import { PropositionsService } from './propositions.service';
import { PropositionsComponent } from './propositions.component';
import { PropositionsDetailComponent } from './propositions-detail.component';
import { PropositionsUpdateComponent } from './propositions-update.component';
import { PropositionsDeletePopupComponent } from './propositions-delete-dialog.component';
import { IPropositions } from 'app/shared/model/propositions.model';

@Injectable({ providedIn: 'root' })
export class PropositionsResolve implements Resolve<IPropositions> {
  constructor(private service: PropositionsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPropositions> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Propositions>) => response.ok),
        map((propositions: HttpResponse<Propositions>) => propositions.body)
      );
    }
    return of(new Propositions());
  }
}

export const propositionsRoute: Routes = [
  {
    path: '',
    component: PropositionsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Propositions'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PropositionsDetailComponent,
    resolve: {
      propositions: PropositionsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Propositions'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PropositionsUpdateComponent,
    resolve: {
      propositions: PropositionsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Propositions'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PropositionsUpdateComponent,
    resolve: {
      propositions: PropositionsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Propositions'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const propositionsPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PropositionsDeletePopupComponent,
    resolve: {
      propositions: PropositionsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Propositions'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
