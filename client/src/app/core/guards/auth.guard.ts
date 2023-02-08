import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { IUser } from 'src/app/shared/models/user';

@Injectable( {
  providedIn: 'root'
} )
export class AuthGuard implements CanActivate {

  constructor( private accountService: AccountService, private router: Router ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map( ( user: IUser | null ) => {
        if ( user !== null ) {
          return true
        }
        this.router.navigate( [ 'account/login' ], { queryParams: { returnUrl: state.url } } )
        return false
        // this.router.navigate( [ 'account/login' ], { queryParams: { returnUrl: state.url } } )
      } )
    )
  }
}
