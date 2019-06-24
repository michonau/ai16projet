import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VoteCitoyenSharedModule } from 'app/shared';
import {
  AvisComponent,
  AvisDetailComponent,
  AvisUpdateComponent,
  AvisDeletePopupComponent,
  AvisDeleteDialogComponent,
  avisRoute,
  avisPopupRoute
} from './';

const ENTITY_STATES = [...avisRoute, ...avisPopupRoute];

@NgModule({
  imports: [VoteCitoyenSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [AvisComponent, AvisDetailComponent, AvisUpdateComponent, AvisDeleteDialogComponent, AvisDeletePopupComponent],
  entryComponents: [AvisComponent, AvisUpdateComponent, AvisDeleteDialogComponent, AvisDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VoteCitoyenAvisModule {}
