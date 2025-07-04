import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AppInstanceShellViewComponent} from './appinstance-shell-view.component';
import {SshShellComponent} from '../ssh-shell/ssh-shell.component';
import {NgTerminalModule} from 'ng-terminal';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Component} from '@angular/core';
import {ModalComponent} from '../../../shared/modal';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
    selector: 'nmaas-modal',
    template: '<p>Nmaas Modal Mock</p>',
    standalone: false
})
class NmaasModalMockComponent extends ModalComponent {
}

describe('AppInstanceShellViewComponent', () => {
    let component: AppInstanceShellViewComponent;
    let fixture: ComponentFixture<AppInstanceShellViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [
        AppInstanceShellViewComponent,
        SshShellComponent,
        NmaasModalMockComponent
    ],
    imports: [NgTerminalModule,
        RouterTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppInstanceShellViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
