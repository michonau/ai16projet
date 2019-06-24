import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Avis } from 'app/shared/model/avis.model';
import { AvisService } from './avis.service';
import { AvisComponent } from './avis.component';
import { AvisDetailComponent } from './avis-detail.component';
import { AvisUpdateComponent } from './avis-update.component';
import { AvisDeletePopupComponent } from './avis-delete-dialog.component';
import { IAvis } from 'app/shared/model/avis.model';

@Injectable({ providedIn: 'root' })
export class AvisResolve implements Resolve<IAvis> {
  constructor(private service: AvisService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAvis> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Avis>) => response.ok),
        map((avis: HttpResponse<Avis>) => avis.body)
      );
    }
    return of(new Avis());
  }
}

export const avisRoute: Routes = [
  {
    path: '',
    component: AvisComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Avis'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: AvisDetailComponent,
    resolve: {
      avis: AvisResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Avis'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: AvisUpdateComponent,
    resolve: {
      avis: AvisResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Avis'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: AvisUpdateComponent,
    resolve: {
      avis: AvisResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Avis'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const avisPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: AvisDeletePopupComponent,
    resolve: {
      avis: AvisResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Avis'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
