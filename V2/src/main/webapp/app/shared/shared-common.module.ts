import { NgModule } from '@angular/core';

import { VoteCitoyenSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [VoteCitoyenSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [VoteCitoyenSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class VoteCitoyenSharedCommonModule {}
