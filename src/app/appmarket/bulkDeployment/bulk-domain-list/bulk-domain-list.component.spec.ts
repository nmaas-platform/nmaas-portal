import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDomainListComponent } from './bulk-domain-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import createSpyObj = jasmine.createSpyObj;
import {AuthService} from '../../../auth/auth.service';

describe('BulkDomainListComponent', () => {
  let component: BulkDomainListComponent;
  let fixture: ComponentFixture<BulkDomainListComponent>;

  const authServiceSpy = createSpyObj('AuthService', ['hasRole', 'hasDomainRole', 'getRoles']);
  authServiceSpy.hasRole.and.returnValue(true)
  authServiceSpy.hasDomainRole.and.returnValue(true)
  authServiceSpy.getRoles.and.returnValue([''])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkDomainListComponent ],
      imports: [
          HttpClientTestingModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
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
