import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkAccountComponent} from './link-account.component';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('LinkAccountComponent', () => {
    let component: LinkAccountComponent;
    let fixture: ComponentFixture<LinkAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LinkAccountComponent],
            imports: [TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useClass: TranslateFakeLoader
                }
            })],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({
                            oidc_token: 'mocked.jwt.token'
                        }),
                        snapshot: {
                            paramMap: {
                                get: () => null
                            }
                        }
                    }
                },
                {
                    provide: AuthService,
                    useValue: {
                        isLogged: () => true,
                        oidcLogout: jasmine.createSpy('oidcLogout'),
                        oidcLinkingLogin: jasmine.createSpy('oidcLinkingLogin').and.returnValue(of({}))
                    }
                },

            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LinkAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
