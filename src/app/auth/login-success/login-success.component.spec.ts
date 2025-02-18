import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSuccessComponent } from './login-success.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/test-utils';
import { AuthService } from '../auth.service';

describe('LoginSuccessComponent', () => {
  let component: LoginSuccessComponent;
  let fixture: ComponentFixture<LoginSuccessComponent>;

  const authUserSpy = jasmine.createSpyObj('AuthService', ['storeToken']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSuccessComponent ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: new ActivatedRouteStub({token: '123'})},
        {provide: AuthService, useValue: authUserSpy},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
