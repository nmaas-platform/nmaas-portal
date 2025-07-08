import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDomainListComponent } from './bulk-domain-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import createSpyObj = jasmine.createSpyObj;
import {AuthService} from '../../../auth/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BulkDomainListComponent', () => {
  let component: BulkDomainListComponent;
  let fixture: ComponentFixture<BulkDomainListComponent>;

  const authServiceSpy = createSpyObj('AuthService', ['hasRole', 'hasDomainRole', 'getRoles']);
  authServiceSpy.hasRole.and.returnValue(true)
  authServiceSpy.hasDomainRole.and.returnValue(true)
  authServiceSpy.getRoles.and.returnValue([''])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [BulkDomainListComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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
    fixture = TestBed.createComponent(BulkDomainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
