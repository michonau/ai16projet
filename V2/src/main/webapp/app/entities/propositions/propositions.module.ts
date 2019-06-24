import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VoteCitoyenSharedModule } from 'app/shared';
import {
  PropositionsComponent,
  PropositionsDetailComponent,
  PropositionsUpdateComponent,
  PropositionsDeletePopupComponent,
  PropositionsDeleteDialogComponent,
  propositionsRoute,
  propositionsPopupRoute
} from './';

const ENTITY_STATES = [...propositionsRoute, ...propositionsPopupRoute];

@NgModule({
  imports: [VoteCitoyenSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PropositionsComponent,
    PropositionsDetailComponent,
    PropositionsUpdateComponent,
    PropositionsDeleteDialogComponent,
    PropositionsDeletePopupComponent
  ],
  entryComponents: [
    PropositionsComponent,
    PropositionsUpdateComponent,
    PropositionsDeleteDialogComponent,
    PropositionsDeletePopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VoteCitoyenPropositionsModule {}
