import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainGroupViewComponent } from './domain-group-view.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('DomainGroupViewComponent', () => {
  let component: DomainGroupViewComponent;
  let fixture: ComponentFixture<DomainGroupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainGroupViewComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(DomainGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
