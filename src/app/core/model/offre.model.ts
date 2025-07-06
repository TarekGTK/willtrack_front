import {User} from "../../store/Authentication/auth.models";
import {SafeUrl} from "@angular/platform-browser";

export interface Offre {
  id: number;
  titre: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  offerType: string; // Assuming OffreType is a string
  active: boolean;
  user: User;
  img?: SafeUrl;
}
