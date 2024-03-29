import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../account.service';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup
  errors: Array<string> = []

  constructor( private formBuilder: FormBuilder, private accountService: AccountService, private router: Router ) { }

  ngOnInit(): void {
    this.createRegisterForm()
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group( {
      displayName: [ null, [ Validators.required ] ],
      email: [ null, [
        Validators.required,
        Validators.pattern( "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$" )
      ], [ this.validateEmailNotTaken() ]
      ],
      password: [ null, [ Validators.required ] ]
    } )
  }

  onSubmit() {
    this.accountService.register( this.registerForm.value )
      .subscribe( {
        next: _ => this.router.navigateByUrl( "/shop" ),
        error: error => this.errors = error.errors
      } )
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return ( control: AbstractControl ): Observable<ValidationErrors | null> => {
      return timer( 500 ).pipe(
        switchMap( () => {
          if ( !control.value ) {
            return of( null )
          }
          return this.accountService.checkEmailExists( control.value )
            .pipe( map( ( result: boolean ) => result === true ? { emailExists: true } : null ) )
        } )
      )
    }
  }

}
