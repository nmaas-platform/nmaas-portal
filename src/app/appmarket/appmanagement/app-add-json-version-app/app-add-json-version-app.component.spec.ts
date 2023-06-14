import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAddJsonVersionAppComponent } from './app-add-json-version-app.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('AppAddJsonVersionAppComponent', () => {
  let component: AppAddJsonVersionAppComponent;
  let fixture: ComponentFixture<AppAddJsonVersionAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAddJsonVersionAppComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAddJsonVersionAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
