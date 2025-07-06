import { SousGroupe } from "./sousGroupe.model";

export interface Piece {
  id: number;
  nom: string;
  reference: string;
  seuilMin: number;
  sousGroupe: SousGroupe;
}
