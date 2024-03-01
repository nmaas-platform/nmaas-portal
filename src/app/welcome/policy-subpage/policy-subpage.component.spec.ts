import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ContentDisplayService} from '../../service/content-display.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {PolicySubpageComponent} from './policy-subpage.component';
import createSpyObj = jasmine.createSpyObj;

describe('PolicySubpageComponent', () => {
  let component: PolicySubpageComponent;
  let fixture: ComponentFixture<PolicySubpageComponent>;

  beforeEach(waitForAsync(() => {
    const contentDisplayServiceSpy = createSpyObj('ContentDisplayService', ['getContent'])
    contentDisplayServiceSpy.getContent.and.returnValue(of({}))

    TestBed.configureTestingModule({
      declarations: [ PolicySubpageComponent ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {provide: ContentDisplayService, useValue: contentDisplayServiceSpy}
      ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySubpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO mock 'document' object properly
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
