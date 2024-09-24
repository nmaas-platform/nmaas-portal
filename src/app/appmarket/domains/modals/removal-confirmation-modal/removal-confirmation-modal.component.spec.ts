import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovalConfirmationModalComponent } from './removal-confirmation-modal.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RemovalConfirmationModalComponent', () => {
  let component: RemovalConfirmationModalComponent;
  let fixture: ComponentFixture<RemovalConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemovalConfirmationModalComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovalConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
