import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAvis } from 'app/shared/model/avis.model';

@Component({
  selector: 'jhi-avis-detail',
  templateUrl: './avis-detail.component.html'
})
export class AvisDetailComponent implements OnInit {
  avis: IAvis;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ avis }) => {
      this.avis = avis;
    });
  }

  previousState() {
    window.history.back();
  }
}
