import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AppPreviewComponent} from './apppreview.component';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppImagesService, AppsService} from '../../../service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {of} from 'rxjs';
import { CarouselModule } from 'primeng/carousel';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppPreviewComponent', () => {
    let component: AppPreviewComponent;
    let fixture: ComponentFixture<AppPreviewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AppPreviewComponent],
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
                CarouselModule
            ],
            providers: [
                {provide: AppsService, useValue: {}},
                {provide: AppImagesService, useValue: {}},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    })

});
