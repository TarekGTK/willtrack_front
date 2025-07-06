import { Magasin } from "./magasin.model";
import { Piece } from "./piece.model";

export interface Stock {
  id: number;
  quantite: number;
  emplacement: string;
  piece: Piece;
  magasin: Magasin;
}
