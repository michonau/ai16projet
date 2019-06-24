import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISujets } from 'app/shared/model/sujets.model';

@Component({
  selector: 'jhi-sujets-detail',
  templateUrl: './sujets-detail.component.html'
})
export class SujetsDetailComponent implements OnInit {
  sujets: ISujets;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sujets }) => {
      this.sujets = sujets;
    });
  }

  previousState() {
    window.history.back();
  }
}
