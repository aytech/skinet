import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, map, Observable, of, ReplaySubject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IAddress } from '../shared/models/address'
import { IUser } from '../shared/models/user'

@Injectable( {
  providedIn: 'root'
} )
export class AccountService {

  baseUrl = environment.apiUrl;

  private currentUserSource = new ReplaySubject<IUser | null>( 1 )

  currentUser$ = this.currentUserSource.asObservable()

  constructor( private http: HttpClient, private router: Router ) { }

  loadCurrentUser( token: string | null ): Observable<IUser | null> {
    if ( token === null ) {
      this.currentUserSource.next( null )
      return of( null )
    }
    let headers = new HttpHeaders( {
      "Authorization": `Bearer ${ token }`
    } )
    return this.http.get<IUser>( `${ this.baseUrl }/account`, { headers } )
      .pipe(
        map( ( user: IUser ) => {
          if ( user !== undefined ) {
            localStorage.setItem( "token", user.token )
            this.currentUserSource.next( user )
          }
          return user
        } )
      )
  }

  login( values: any ) {
    return this.http.post<IUser>( `${ this.baseUrl }/account/login`, values )
      .pipe(
        map( ( user: IUser ) => {
          if ( user !== undefined ) {
            localStorage.setItem( "token", user.token )
            this.currentUserSource.next( user )
          }
        } )
      )
  }

  register( values: any ) {
    return this.http.post<IUser>( `${ this.baseUrl }/account/register`, values )
      .pipe(
        map( ( user: IUser ) => {
          if ( user !== undefined ) {
            localStorage.setItem( "token", user.token )
            this.currentUserSource.next( user )
          }
        } )
      )
  }

  logout() {
    localStorage.removeItem( "token" )
    this.currentUserSource.next( null )
    this.router.navigateByUrl( "/" )
  }

  checkEmailExists( email: string ) {
    return this.http.get<boolean>( `${ this.baseUrl }/account/email/exists?email=${ email }` )
  }

  getUserAddress() {
    return this.http.get<IAddress>( `${ this.baseUrl }/account/address` )
  }

  updateUserAddress( address: IAddress ) {
    return this.http.post<IAddress>( `${ this.baseUrl }/account/address`, address )
  }
}
