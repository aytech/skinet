import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CoreModule } from './core/core.module'
import { HomeModule } from './home/home.module'
import { ErrorInterceptor } from './core/interceptors/error.interceptor'
import { ToastrModule } from 'ngx-toastr'
import { NgxSpinnerModule } from 'ngx-spinner'
import { LoadingInterceptor } from './core/interceptors/loading.interceptor'

@NgModule( {
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    NgxSpinnerModule,
    ToastrModule.forRoot( {
      positionClass: "toast-bottom-right",
      preventDuplicates: true
    } )
  ],
  providers: [
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor
    }
  ],
  bootstrap: [
    AppComponent
  ]
} )
export class AppModule { }
