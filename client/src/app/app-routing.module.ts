import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "./core/guards/auth.guard"
import { NotFoundComponent } from "./core/not-found/not-found.component"
import { ServerErrorComponent } from "./core/server-error/server-error.component"
import { TestErrorComponent } from "./core/test-error/test-error.component"
import { HomeComponent } from "./home/home.component"

const routes: Routes = [
  { path: "", component: HomeComponent, data: { breadcrumb: "Home" } },
  { path: "test-error", component: TestErrorComponent, data: { breadcrumb: "Test errors" } },
  { path: "server-error", component: ServerErrorComponent, data: { breadcrumb: "Server error" } },
  { path: "not-found", component: NotFoundComponent, data: { breadcrumb: "Not found" } },
  { path: "shop", loadChildren: () => import( "./shop/shop.module" ).then( mod => mod.ShopModule ), data: { breadcrumb: "Shop" } },
  { path: "basket", loadChildren: () => import( "./basket/basket.module" ).then( mod => mod.BasketModule ), data: { breadcrumb: "Basket" } },
  {
    canActivate: [ AuthGuard ],
    data: { breadcrumb: "Checkout" },
    loadChildren: () => import( "./checkout/checkout.module" ).then( mod => mod.CheckoutModule ),
    path: "checkout"
  },
  {
    canActivate: [ AuthGuard ],
    data: { breadcrumb: "Orders" },
    loadChildren: () => import( "./orders/orders.module" )
      .then( mod => mod.OrdersModule ),
    path: "orders"
  },
  {
    canActivate: [ AuthGuard ],
    data: { breadcrumb: { skip: true } },
    loadChildren: () => import( "./account/account.module" )
      .then( mod => mod.AccountModule ),
    path: "account",
  },
  { path: "**", redirectTo: "not-found", pathMatch: "full" }
]

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
