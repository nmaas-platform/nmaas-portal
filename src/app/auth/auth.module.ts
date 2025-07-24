import {NgModule} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';
import {AppConfigService} from '../service/appconfig.service';
import {AuthService} from './auth.service'
import {AuthGuard} from './auth.guard'
import {RoleGuard} from './role.guard';
import { LoginSuccessComponent } from './login-success/login-success.component';


export const jwtOptionsFactory = (appConfig: AppConfigService) => ({
    tokenGetter: () => {
        return localStorage.getItem(appConfig.config.tokenName ? appConfig.config.tokenName : 'token');
    },
    whitelistedDomains: [new RegExp("[\s\S]*")]
});

@NgModule({ declarations: [
        LoginSuccessComponent
    ], imports: [JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                deps: [AppConfigService],
                useFactory: jwtOptionsFactory
            }
        })], providers: [
        AuthGuard,
        RoleGuard,
        AuthService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AuthModule {}
