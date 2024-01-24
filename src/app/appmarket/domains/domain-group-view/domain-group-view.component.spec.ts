import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainGroupViewComponent } from './domain-group-view.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {UserService} from '../../../service';
import {AuthService} from '../../../auth/auth.service';

describe('DomainGroupViewComponent', () => {
  let component: DomainGroupViewComponent;
  let fixture: ComponentFixture<DomainGroupViewComponent>;

  const userServiceSpy = createSpyObj('UserService', ['getAll'])
  userServiceSpy.getAll.and.returnValue(of([]))

  const authServiceSpy = createSpyObj('AuthService', ['hasRole', 'hasDomainRole', 'getRoles']);
  authServiceSpy.hasRole.and.returnValue(true)
  authServiceSpy.hasDomainRole.and.returnValue(true)
  authServiceSpy.getRoles.and.returnValue([''])


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
      ],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: AuthService, useValue: authServiceSpy},
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
