import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainuploadComponent } from './domainupload.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('DomainuploadComponent', () => {
  let component: DomainuploadComponent;
  let fixture: ComponentFixture<DomainuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainuploadComponent ],
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
    fixture = TestBed.createComponent(DomainuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
