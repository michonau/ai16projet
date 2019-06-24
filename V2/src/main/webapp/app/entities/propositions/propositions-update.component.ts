import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IPropositions, Propositions } from 'app/shared/model/propositions.model';
import { PropositionsService } from './propositions.service';
import { IUser, UserService } from 'app/core';
import { ISujets } from 'app/shared/model/sujets.model';
import { SujetsService } from 'app/entities/sujets';

@Component({
  selector: 'jhi-propositions-update',
  templateUrl: './propositions-update.component.html'
})
export class PropositionsUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  sujets: ISujets[];
  dateCreationDp: any;

  editForm = this.fb.group({
    id: [],
    votesPour: [null, [Validators.required]],
    dateCreation: [null, [Validators.required]],
    contenu: [null, [Validators.required]],
    archive: [null, [Validators.required]],
    messageJustificatif: [],
    user: [],
    sujets: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected propositionsService: PropositionsService,
    protected userService: UserService,
    protected sujetsService: SujetsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ propositions }) => {
      this.updateForm(propositions);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.sujetsService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ISujets[]>) => mayBeOk.ok),
        map((response: HttpResponse<ISujets[]>) => response.body)
      )
      .subscribe((res: ISujets[]) => (this.sujets = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(propositions: IPropositions) {
    this.editForm.patchValue({
      id: propositions.id,
      votesPour: propositions.votesPour,
      dateCreation: propositions.dateCreation,
      contenu: propositions.contenu,
      archive: propositions.archive,
      messageJustificatif: propositions.messageJustificatif,
      user: propositions.user,
      sujets: propositions.sujets
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const propositions = this.createFromForm();
    if (propositions.id !== undefined) {
      this.subscribeToSaveResponse(this.propositionsService.update(propositions));
    } else {
      this.subscribeToSaveResponse(this.propositionsService.create(propositions));
    }
  }

  private createFromForm(): IPropositions {
    return {
      ...new Propositions(),
      id: this.editForm.get(['id']).value,
      votesPour: this.editForm.get(['votesPour']).value,
      dateCreation: this.editForm.get(['dateCreation']).value,
      contenu: this.editForm.get(['contenu']).value,
      archive: this.editForm.get(['archive']).value,
      messageJustificatif: this.editForm.get(['messageJustificatif']).value,
      user: this.editForm.get(['user']).value,
      sujets: this.editForm.get(['sujets']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPropositions>>) {
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

  trackSujetsById(index: number, item: ISujets) {
    return item.id;
  }
}
