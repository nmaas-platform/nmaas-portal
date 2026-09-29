import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BundleDetailsComponent} from './bundle-details.component';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {TabsModule} from 'primeng/tabs';
import {MultiSelectModule} from 'primeng/multiselect';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {BundleService} from '../../../service/bundle.service';
import {AppsService} from '../../../service';
import {ToastContainerComponent} from '../../../shared/toast-container/toast-container.component';
import {of} from 'rxjs';
import {Component} from '@angular/core';
import {ModalComponent} from '../../../shared';

@Component({
    selector: 'nmaas-modal',
    template: '<p>Nmaas Modal Mock</p>',
    standalone: false
})
class MockNmaasModalComponent extends ModalComponent {
}

describe('BundleDetailsComponent', () => {
    let component: BundleDetailsComponent;
    let fixture: ComponentFixture<BundleDetailsComponent>;


    const bundleServiceMock = jasmine.createSpyObj('BundleService', ['getById', 'create', 'update']);
    bundleServiceMock.getById.and.returnValue(of({id: 1, name: 'Test bundle', apps: []}));

    const appsServiceMock = jasmine.createSpyObj('AppsService', ['getAllApplicationBase']);
    appsServiceMock.getAllApplicationBase.and.returnValue(of([]));

    const toastMock = jasmine.createSpyObj('ToastContainerComponent', ['showSuccess', 'showError']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BundleDetailsComponent, MockNmaasModalComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                TabsModule,
                MultiSelectModule,

            ],
            providers: [
                provideRouter([]),
                provideNoopAnimations(),
                {provide: ActivatedRoute, useValue: {params: of({id: '1'}), snapshot: {data: {}}}},
                {provide: BundleService, useValue: bundleServiceMock},
                {provide: AppsService, useValue: appsServiceMock},
                {provide: ToastContainerComponent, useValue: toastMock},
            ],
        }).compileComponents();


        fixture = TestBed.createComponent(BundleDetailsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
