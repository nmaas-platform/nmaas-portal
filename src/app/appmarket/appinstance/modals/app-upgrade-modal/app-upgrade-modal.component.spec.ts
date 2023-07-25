import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppUpgradeModalComponent } from './app-upgrade-modal.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('AppUpgradeModalComponent', () => {
  let component: AppUpgradeModalComponent;
  let fixture: ComponentFixture<AppUpgradeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUpgradeModalComponent ],
      imports: [
          HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUpgradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
