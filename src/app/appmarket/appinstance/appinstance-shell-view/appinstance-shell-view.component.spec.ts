import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AppInstanceShellViewComponent} from './appinstance-shell-view.component';
import {SshShellComponent} from '../ssh-shell/ssh-shell.component';
import {NgTerminalModule} from 'ng-terminal';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Component} from '@angular/core';
import {ModalComponent} from '../../../shared/modal';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';
import {ShellClientService} from '../../../service/shell-client.service';
import {SelectPodModalComponent} from '../modals/select-pod-modal/select-pod-modal.component';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

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
        const mockShellClientService = jasmine.createSpyObj('ShellClientService', ['getPossiblePods']);
        mockShellClientService.getPossiblePods.and.returnValue(of([]))

        TestBed.configureTestingModule({
    declarations: [
        AppInstanceShellViewComponent,
        SshShellComponent,
        NmaasModalMockComponent,
        SelectPodModalComponent
    ],
    imports: [NgTerminalModule,
        RouterTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        {provide: ShellClientService, useValue: mockShellClientService},
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
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
