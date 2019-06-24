import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { ISujets } from 'app/shared/model/sujets.model';

export interface IPropositions {
  id?: number;
  votesPour?: number;
  dateCreation?: Moment;
  contenu?: string;
  archive?: boolean;
  messageJustificatif?: string;
  user?: IUser;
  sujets?: ISujets;
}

export class Propositions implements IPropositions {
  constructor(
    public id?: number,
    public votesPour?: number,
    public dateCreation?: Moment,
    public contenu?: string,
    public archive?: boolean,
    public messageJustificatif?: string,
    public user?: IUser,
    public sujets?: ISujets
  ) {
    this.archive = this.archive || false;
  }
}
