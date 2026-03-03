import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LanguageListComponent} from './languagelist.component';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {InternationalizationService} from '../../../../service/internationalization.service';
import {AppConfigService} from '../../../../service';
import {of} from 'rxjs';
import {ModalComponent} from '../../../../shared/modal';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('LanguagelistComponent', () => {
    let component: LanguageListComponent;
    let fixture: ComponentFixture<LanguageListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LanguageListComponent, ModalComponent],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
                FormsModule,
                RouterTestingModule
            ],
            providers: [
                {
                    provide: InternationalizationService, useValue: {
                        getAllSupportedLanguages: function () {
                            return of([])
                        }
                    }
                },
                {provide: AppConfigService, useValue: {}}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    });

});
