import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAppListComponent } from './bulk-app-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import createSpyObj = jasmine.createSpyObj;
import {AuthService} from '../../../auth/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BulkAppListComponent', () => {
  let component: BulkAppListComponent;
  let fixture: ComponentFixture<BulkAppListComponent>;

  const authServiceSpy = createSpyObj('AuthService', ['hasRole', 'hasDomainRole', 'getRoles']);
  authServiceSpy.hasRole.and.returnValue(true)
  authServiceSpy.hasDomainRole.and.returnValue(true)
  authServiceSpy.getRoles.and.returnValue([''])


  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [BulkAppListComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [],
    providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
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
