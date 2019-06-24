import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export const enum Statut {
  Elaboration = 'Elaboration',
  Consultation = 'Consultation',
  Fermeture = 'Fermeture'
}

export interface ISujets {
  id?: number;
  titre?: string;
  statut?: Statut;
  dateCreation?: Moment;
  dateFermetureAuto?: Moment;
  user?: IUser;
}

export class Sujets implements ISujets {
  constructor(
    public id?: number,
    public titre?: string,
    public statut?: Statut,
    public dateCreation?: Moment,
    public dateFermetureAuto?: Moment,
    public user?: IUser
  ) {}
}
