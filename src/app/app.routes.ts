import { Routes, RouterModule } from '@angular/router';

import { AppMarketRoutes } from './appmarket';

import { WelcomeRoutes } from './welcome/welcome.routes';
import {ServiceUnavailableRoutes} from './service-unavailable/service-unavailable.routes';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {LoginSuccessComponent} from './auth/login-success/login-success.component';
import {LinkAccountComponent} from './welcome/link-account/link-account.component';

const appRoutes: Routes = [
    ...WelcomeRoutes,
    ...AppMarketRoutes,
    ...ServiceUnavailableRoutes,
    { path: 'notfound', component: PageNotFoundComponent },
    { path: 'login-success', component: LoginSuccessComponent },
    { path: 'login-linking', component: LinkAccountComponent},
    { path: '**', redirectTo: '/welcome' },

];

export const routing = RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' });
