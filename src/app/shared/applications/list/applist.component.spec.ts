import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppListComponent } from './applist.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {UserDataService} from '../../../service/userdata.service';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Domain} from '../../../model/domain';
import {Observable, of} from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppListComponent', () => {
  let component: AppListComponent;
  let fixture: ComponentFixture<AppListComponent>;
  let userDataService: UserDataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AppListComponent],
    imports: [TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        UserDataService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppListComponent);
    component = fixture.componentInstance;
    component.domain = new Observable<Domain>();
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
