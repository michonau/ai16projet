import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { ISujets, Sujets } from 'app/shared/model/sujets.model';
import { SujetsService } from './sujets.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-sujets-update',
  templateUrl: './sujets-update.component.html'
})
export class SujetsUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];
  dateCreationDp: any;
  dateFermetureAutoDp: any;

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required]],
    statut: [null, [Validators.required]],
    dateCreation: [null, [Validators.required]],
    dateFermetureAuto: [],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected sujetsService: SujetsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ sujets }) => {
      this.updateForm(sujets);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(sujets: ISujets) {
    this.editForm.patchValue({
      id: sujets.id,
      titre: sujets.titre,
      statut: sujets.statut,
      dateCreation: sujets.dateCreation,
      dateFermetureAuto: sujets.dateFermetureAuto,
      user: sujets.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const sujets = this.createFromForm();
    if (sujets.id !== undefined) {
      this.subscribeToSaveResponse(this.sujetsService.update(sujets));
    } else {
      this.subscribeToSaveResponse(this.sujetsService.create(sujets));
    }
  }

  private createFromForm(): ISujets {
    return {
      ...new Sujets(),
      id: this.editForm.get(['id']).value,
      titre: this.editForm.get(['titre']).value,
      statut: this.editForm.get(['statut']).value,
      dateCreation: this.editForm.get(['dateCreation']).value,
      dateFermetureAuto: this.editForm.get(['dateFermetureAuto']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISujets>>) {
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
}
