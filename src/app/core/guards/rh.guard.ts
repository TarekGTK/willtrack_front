import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/auth.service";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class RhGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(): boolean {
    
    const isRh = this.authService.isRh(); 

    if (isRh) {
      return true; 
    } else {
      this.router.navigate(['/auth/login']); 
      return false;
    }
  }
}
