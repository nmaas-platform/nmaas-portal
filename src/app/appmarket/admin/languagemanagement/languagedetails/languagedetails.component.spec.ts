import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LanguageDetailsComponent } from './languagedetails.component';
import {TranslateModule} from '@ngx-translate/core';
// import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {InternationalizationService} from '../../../../service/internationalization.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {AppConfigService} from '../../../../service';
import {RouterTestingModule} from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ToggleSwitchModule} from 'primeng/toggleswitch';

describe('LanguageDetailsComponent', () => {
  let component: LanguageDetailsComponent;
  let fixture: ComponentFixture<LanguageDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [LanguageDetailsComponent],
    imports: [TranslateModule.forRoot(), ToggleSwitchModule,  ReactiveFormsModule, FormsModule, CommonModule, RouterTestingModule],
    providers: [InternationalizationService, AppConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
