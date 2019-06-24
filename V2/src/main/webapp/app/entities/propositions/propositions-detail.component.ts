import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPropositions } from 'app/shared/model/propositions.model';

@Component({
  selector: 'jhi-propositions-detail',
  templateUrl: './propositions-detail.component.html'
})
export class PropositionsDetailComponent implements OnInit {
  propositions: IPropositions;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ propositions }) => {
      this.propositions = propositions;
    });
  }

  previousState() {
    window.history.back();
  }
}
