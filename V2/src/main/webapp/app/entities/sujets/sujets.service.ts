import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISujets } from 'app/shared/model/sujets.model';

type EntityResponseType = HttpResponse<ISujets>;
type EntityArrayResponseType = HttpResponse<ISujets[]>;

@Injectable({ providedIn: 'root' })
export class SujetsService {
  public resourceUrl = SERVER_API_URL + 'api/sujets';

  constructor(protected http: HttpClient) {}

  create(sujets: ISujets): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sujets);
    return this.http
      .post<ISujets>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sujets: ISujets): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sujets);
    return this.http
      .put<ISujets>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISujets>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISujets[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(sujets: ISujets): ISujets {
    const copy: ISujets = Object.assign({}, sujets, {
      dateCreation: sujets.dateCreation != null && sujets.dateCreation.isValid() ? sujets.dateCreation.format(DATE_FORMAT) : null,
      dateFermetureAuto:
        sujets.dateFermetureAuto != null && sujets.dateFermetureAuto.isValid() ? sujets.dateFermetureAuto.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCreation = res.body.dateCreation != null ? moment(res.body.dateCreation) : null;
      res.body.dateFermetureAuto = res.body.dateFermetureAuto != null ? moment(res.body.dateFermetureAuto) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sujets: ISujets) => {
        sujets.dateCreation = sujets.dateCreation != null ? moment(sujets.dateCreation) : null;
        sujets.dateFermetureAuto = sujets.dateFermetureAuto != null ? moment(sujets.dateFermetureAuto) : null;
      });
    }
    return res;
  }
}
