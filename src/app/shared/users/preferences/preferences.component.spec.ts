import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesComponent } from './preferences.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DomainService, UserService} from '../../../service';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {InternationalizationService} from '../../../service/internationalization.service';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;

  beforeEach(async () => {
    const domainServiceSpy = createSpyObj<DomainService>(['getMyDomains', 'getGlobalDomainId'])
    domainServiceSpy.getMyDomains.and.returnValue(of([]))
    domainServiceSpy.getGlobalDomainId.and.returnValue(1);
    const internationalizationSpy = createSpyObj('InternationalizationService', ['getEnabledLanguages'])
    internationalizationSpy.getEnabledLanguages.and.returnValue(of(['en', 'pl']))

    await TestBed.configureTestingModule({
      declarations: [ PreferencesComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        {provide: DomainService, useValue: domainServiceSpy},
        {provide: UserService, useValue: {}},
        {provide: InternationalizationService, useValue: internationalizationSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
