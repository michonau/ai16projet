import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPropositions } from 'app/shared/model/propositions.model';

type EntityResponseType = HttpResponse<IPropositions>;
type EntityArrayResponseType = HttpResponse<IPropositions[]>;

@Injectable({ providedIn: 'root' })
export class PropositionsService {
  public resourceUrl = SERVER_API_URL + 'api/propositions';

  constructor(protected http: HttpClient) {}

  create(propositions: IPropositions): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(propositions);
    return this.http
      .post<IPropositions>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(propositions: IPropositions): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(propositions);
    return this.http
      .put<IPropositions>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPropositions>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPropositions[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(propositions: IPropositions): IPropositions {
    const copy: IPropositions = Object.assign({}, propositions, {
      dateCreation:
        propositions.dateCreation != null && propositions.dateCreation.isValid() ? propositions.dateCreation.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCreation = res.body.dateCreation != null ? moment(res.body.dateCreation) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((propositions: IPropositions) => {
        propositions.dateCreation = propositions.dateCreation != null ? moment(propositions.dateCreation) : null;
      });
    }
    return res;
  }
}
