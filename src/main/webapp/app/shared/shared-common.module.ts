import { NgModule } from '@angular/core';

import { ConsultationCitoyenneSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [ConsultationCitoyenneSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [ConsultationCitoyenneSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class ConsultationCitoyenneSharedCommonModule {}
