import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VoteCitoyenSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [VoteCitoyenSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [VoteCitoyenSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VoteCitoyenSharedModule {
  static forRoot() {
    return {
      ngModule: VoteCitoyenSharedModule
    };
  }
}
