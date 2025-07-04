import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppListComponent } from './applist.component';
import {RouterTestingModule} from '@angular/router/testing';
import {UserDataService} from '../../service/userdata.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {Component, Input} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
    selector: 'nmaas-applications-view',
    template: '<p>Mock application view</p>',
    standalone: false
})
class AppViewMock {
    @Input()
    domainId: number;
    @Input()
    appView: any;
}

describe('ApplistComponent', () => {
  let component: AppListComponent;
  let fixture: ComponentFixture<AppListComponent>;
  let userDataService: UserDataService;

  beforeEach(waitForAsync(() => {
      const mockAuthService = jasmine.createSpyObj('AuthService', ['getDomains']);
      mockAuthService.getDomains.and.returnValue(of([1]));
    TestBed.configureTestingModule({
    declarations: [
        AppListComponent,
        AppViewMock
    ],
    imports: [RouterTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        UserDataService,
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppListComponent);
    component = fixture.componentInstance;
    userDataService = fixture.debugElement.injector.get(UserDataService);
    spyOn(userDataService, 'selectDomainId');
    fixture.detectChanges();
  });

  it('should create component', () => {
      expect(component).toBeDefined();
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
  });

});
