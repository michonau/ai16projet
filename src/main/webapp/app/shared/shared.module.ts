import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConsultationCitoyenneSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [ConsultationCitoyenneSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [ConsultationCitoyenneSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultationCitoyenneSharedModule {
  static forRoot() {
    return {
      ngModule: ConsultationCitoyenneSharedModule
    };
  }
}
