import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VoteCitoyenSharedModule } from 'app/shared';
import {
  SujetsComponent,
  SujetsDetailComponent,
  SujetsUpdateComponent,
  SujetsDeletePopupComponent,
  SujetsDeleteDialogComponent,
  sujetsRoute,
  sujetsPopupRoute
} from './';

const ENTITY_STATES = [...sujetsRoute, ...sujetsPopupRoute];

@NgModule({
  imports: [VoteCitoyenSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [SujetsComponent, SujetsDetailComponent, SujetsUpdateComponent, SujetsDeleteDialogComponent, SujetsDeletePopupComponent],
  entryComponents: [SujetsComponent, SujetsUpdateComponent, SujetsDeleteDialogComponent, SujetsDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VoteCitoyenSujetsModule {}
