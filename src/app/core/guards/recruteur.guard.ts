import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/auth.service";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class RecruteurGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(): boolean {
    
    const isRecruteur = this.authService.isRecruteur(); 

    if (isRecruteur) {
      return true; 
    } else {
      this.router.navigate(['/auth/login']); 
      return false;
    }
  }
}
