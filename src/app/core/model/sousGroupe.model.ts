import { Groupe } from "./groupe.model";


export interface SousGroupe {
  id: number;
  nom: string;
  groupe: Groupe;
}
