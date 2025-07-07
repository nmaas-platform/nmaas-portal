import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppChangeStateModalComponent } from './appchangestatemodal.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppchangestatemodalComponent', () => {
  let component: AppChangeStateModalComponent;
  let fixture: ComponentFixture<AppChangeStateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AppChangeStateModalComponent],
    imports: [TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppChangeStateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
