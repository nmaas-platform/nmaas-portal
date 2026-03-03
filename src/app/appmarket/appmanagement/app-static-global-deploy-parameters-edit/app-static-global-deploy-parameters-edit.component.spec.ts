import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AppStaticGlobalDeployParametersEditComponent} from './app-static-global-deploy-parameters-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppStaticGlobalDeployParametersEditComponent', () => {
    let component: AppStaticGlobalDeployParametersEditComponent;
    let fixture: ComponentFixture<AppStaticGlobalDeployParametersEditComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AppStaticGlobalDeployParametersEditComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppStaticGlobalDeployParametersEditComponent);
        component = fixture.componentInstance;
        component.appDeploymentSpec = {
            id: 0,
            supportedDeploymentEnvironments: [],
            kubernetesTemplate: undefined,
            exposesWebUI: false,
            allowSshAccess: false,
            allowLogAccess: false,
            deployParameters: {},
            storageVolumes: [],
            accessMethods: [],
            globalDeployParameters: {},
            consumedPods: 1,
            consumedCpu: 100,
            consumedMemory: 128
        }
        component.propertyName = 'deployParameters';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
