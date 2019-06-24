import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IAvis, Avis } from 'app/shared/model/avis.model';
import { AvisService } from './avis.service';
import { IUser, UserService } from 'app/core';
import { IPropositions } from 'app/shared/model/propositions.model';
import { PropositionsService } from 'app/entities/propositions';

@Component({
  selector: 'jhi-avis-update',
  templateUrl: './avis-update.component.html'
})
export class AvisUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  propositions: IPropositions[];
  dateCreationDp: any;

  editForm = this.fb.group({
    id: [],
    dateCreation: [null, [Validators.required]],
    commentaire: [],
    choix: [null, [Validators.required]],
    user: [],
    propositions: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected avisService: AvisService,
    protected userService: UserService,
    protected propositionsService: PropositionsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ avis }) => {
      this.updateForm(avis);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.propositionsService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPropositions[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPropositions[]>) => response.body)
      )
      .subscribe((res: IPropositions[]) => (this.propositions = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(avis: IAvis) {
    this.editForm.patchValue({
      id: avis.id,
      dateCreation: avis.dateCreation,
      commentaire: avis.commentaire,
      choix: avis.choix,
      user: avis.user,
      propositions: avis.propositions
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const avis = this.createFromForm();
    if (avis.id !== undefined) {
      this.subscribeToSaveResponse(this.avisService.update(avis));
    } else {
      this.subscribeToSaveResponse(this.avisService.create(avis));
    }
  }

  private createFromForm(): IAvis {
    return {
      ...new Avis(),
      id: this.editForm.get(['id']).value,
      dateCreation: this.editForm.get(['dateCreation']).value,
      commentaire: this.editForm.get(['commentaire']).value,
      choix: this.editForm.get(['choix']).value,
      user: this.editForm.get(['user']).value,
      propositions: this.editForm.get(['propositions']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvis>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackPropositionsById(index: number, item: IPropositions) {
    return item.id;
  }
}
