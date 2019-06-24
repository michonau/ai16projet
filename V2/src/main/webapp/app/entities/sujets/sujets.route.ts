import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Sujets } from 'app/shared/model/sujets.model';
import { SujetsService } from './sujets.service';
import { SujetsComponent } from './sujets.component';
import { SujetsDetailComponent } from './sujets-detail.component';
import { SujetsUpdateComponent } from './sujets-update.component';
import { SujetsDeletePopupComponent } from './sujets-delete-dialog.component';
import { ISujets } from 'app/shared/model/sujets.model';

@Injectable({ providedIn: 'root' })
export class SujetsResolve implements Resolve<ISujets> {
  constructor(private service: SujetsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISujets> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Sujets>) => response.ok),
        map((sujets: HttpResponse<Sujets>) => sujets.body)
      );
    }
    return of(new Sujets());
  }
}

export const sujetsRoute: Routes = [
  {
    path: '',
    component: SujetsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sujets'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: SujetsDetailComponent,
    resolve: {
      sujets: SujetsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sujets'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: SujetsUpdateComponent,
    resolve: {
      sujets: SujetsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sujets'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: SujetsUpdateComponent,
    resolve: {
      sujets: SujetsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sujets'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const sujetsPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: SujetsDeletePopupComponent,
    resolve: {
      sujets: SujetsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sujets'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
