import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAppListComponent } from './bulk-app-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import createSpyObj = jasmine.createSpyObj;
import {AuthService} from '../../../auth/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BulkAppListComponent', () => {
  let component: BulkAppListComponent;
  let fixture: ComponentFixture<BulkAppListComponent>;

  const authServiceSpy = createSpyObj('AuthService', ['hasRole', 'hasDomainRole', 'getRoles']);
  authServiceSpy.hasRole.and.returnValue(true)
  authServiceSpy.hasDomainRole.and.returnValue(true)
  authServiceSpy.getRoles.and.returnValue([''])


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAppListComponent ],
      imports: [
          HttpClientTestingModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
