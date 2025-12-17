import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoFirstLoginComponent } from './sso-first-login.component';

describe('SsoFirstLoginComponent', () => {
  let component: SsoFirstLoginComponent;
  let fixture: ComponentFixture<SsoFirstLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsoFirstLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsoFirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
