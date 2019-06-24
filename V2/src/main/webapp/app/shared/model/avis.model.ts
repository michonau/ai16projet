import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IPropositions } from 'app/shared/model/propositions.model';

export const enum Choix {
  Pour = 'Pour',
  Mais = 'Mais',
  Neutre = 'Neutre',
  Contre = 'Contre'
}

export interface IAvis {
  id?: number;
  dateCreation?: Moment;
  commentaire?: string;
  choix?: Choix;
  user?: IUser;
  propositions?: IPropositions;
}

export class Avis implements IAvis {
  constructor(
    public id?: number,
    public dateCreation?: Moment,
    public commentaire?: string,
    public choix?: Choix,
    public user?: IUser,
    public propositions?: IPropositions
  ) {}
}
