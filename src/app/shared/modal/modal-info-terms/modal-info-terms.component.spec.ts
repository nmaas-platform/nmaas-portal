import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ModalInfoTermsComponent} from './modal-info-terms.component';
import {ModalComponent} from '../modal.component';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ContentDisplayService} from '../../../service/content-display.service';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('ModalInfoTermsComponent', () => {
    let component: ModalInfoTermsComponent;
    let fixture: ComponentFixture<ModalInfoTermsComponent>;

    beforeEach(waitForAsync(() => {
        const contentDisplayServiceSpy = createSpyObj('ContentDisplayService', ['getContent'])
        contentDisplayServiceSpy.getContent.and.returnValue(of({}))

        TestBed.configureTestingModule({
            declarations: [ModalInfoTermsComponent, ModalComponent],
            imports: [
                DialogModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: ContentDisplayService, useValue: contentDisplayServiceSpy}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalInfoTermsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
