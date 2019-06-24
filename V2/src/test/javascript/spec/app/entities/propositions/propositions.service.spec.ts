/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { PropositionsService } from 'app/entities/propositions/propositions.service';
import { IPropositions, Propositions } from 'app/shared/model/propositions.model';

describe('Service Tests', () => {
  describe('Propositions Service', () => {
    let injector: TestBed;
    let service: PropositionsService;
    let httpMock: HttpTestingController;
    let elemDefault: IPropositions;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(PropositionsService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Propositions(0, 0, currentDate, 'AAAAAAA', false, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            dateCreation: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a Propositions', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateCreation: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateCreation: currentDate
          },
          returnedFromService
        );
        service
          .create(new Propositions(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Propositions', async () => {
        const returnedFromService = Object.assign(
          {
            votesPour: 1,
            dateCreation: currentDate.format(DATE_FORMAT),
            contenu: 'BBBBBB',
            archive: true,
            messageJustificatif: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of Propositions', async () => {
        const returnedFromService = Object.assign(
          {
            votesPour: 1,
            dateCreation: currentDate.format(DATE_FORMAT),
            contenu: 'BBBBBB',
            archive: true,
            messageJustificatif: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateCreation: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Propositions', async () => {
        const rxPromise = service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
