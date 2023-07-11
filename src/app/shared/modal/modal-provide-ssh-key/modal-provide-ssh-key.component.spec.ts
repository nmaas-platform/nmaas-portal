import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalProvideSshKeyComponent } from './modal-provide-ssh-key.component';

describe('ModalProvideSshKeyComponent', () => {
  let component: ModalProvideSshKeyComponent;
  let fixture: ComponentFixture<ModalProvideSshKeyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProvideSshKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProvideSshKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
