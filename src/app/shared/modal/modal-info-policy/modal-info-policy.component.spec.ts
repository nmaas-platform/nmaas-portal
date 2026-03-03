import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ModalInfoPolicyComponent} from './modal-info-policy.component';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ModalComponent} from '../modal.component';
import {ContentDisplayService} from '../../../service/content-display.service';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('ModalInfoPolicyComponent', () => {
    let component: ModalInfoPolicyComponent;
    let fixture: ComponentFixture<ModalInfoPolicyComponent>;

    beforeEach(waitForAsync(() => {
        const contentDisplayServiceSpy = createSpyObj('ContentDisplayService', ['getContent'])
        contentDisplayServiceSpy.getContent.and.returnValue(of({}))

        TestBed.configureTestingModule({
            declarations: [ModalInfoPolicyComponent, ModalComponent],
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
        fixture = TestBed.createComponent(ModalInfoPolicyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
