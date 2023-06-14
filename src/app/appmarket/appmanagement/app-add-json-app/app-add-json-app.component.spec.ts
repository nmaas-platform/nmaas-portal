import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAddJsonAppComponent } from './app-add-json-app.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('AppAddJsonAppComponent', () => {
  let component: AppAddJsonAppComponent;
  let fixture: ComponentFixture<AppAddJsonAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAddJsonAppComponent ],
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
    fixture = TestBed.createComponent(AppAddJsonAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
