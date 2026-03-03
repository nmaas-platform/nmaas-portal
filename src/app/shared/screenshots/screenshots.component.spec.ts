import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {ScreenshotsComponent} from './screenshots.component';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppsService} from '../../service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {PipesModule} from '../../pipe/pipes.module';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

// TODO mock secure pipe

describe('ScreenshotsComponent', () => {
    let component: ScreenshotsComponent;
    let fixture: ComponentFixture<ScreenshotsComponent>;

    beforeEach(waitForAsync(() => {
        const appsServiceSpy = createSpyObj('AppsService', ['getAppScreenshotsByUrl'])
        appsServiceSpy.getAppScreenshotsByUrl.and.returnValue(of([]))

        TestBed.configureTestingModule({
    declarations: [
        ScreenshotsComponent,
    ],
    imports: [RouterTestingModule,
        PipesModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        { provide: AppsService, useValue: appsServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ScreenshotsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
})
