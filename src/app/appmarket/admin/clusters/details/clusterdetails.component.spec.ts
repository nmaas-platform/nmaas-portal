import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ClusterDetailsComponent} from './clusterdetails.component';
import {ClusterDetailsComponent as ClusterSharedDetailsComponent} from '../../../../shared/admin/clusters/details/clusterdetails.component';
import {ClusterService} from '../../../../service/cluster.service';
import {RouterTestingModule} from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppConfigService} from '../../../../service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('Cluster details component', () => {
    let component: ClusterDetailsComponent;
    let fixture: ComponentFixture<ClusterDetailsComponent>;

    beforeEach(waitForAsync (() => {
        TestBed.configureTestingModule({
    declarations: [ClusterDetailsComponent, ClusterSharedDetailsComponent],
    imports: [FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [ClusterService, AppConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClusterDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
