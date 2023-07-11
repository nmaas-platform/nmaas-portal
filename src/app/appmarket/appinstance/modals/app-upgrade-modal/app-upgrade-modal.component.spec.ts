import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppUpgradeModalComponent } from './app-upgrade-modal.component';

describe('AppUpgradeModalComponent', () => {
  let component: AppUpgradeModalComponent;
  let fixture: ComponentFixture<AppUpgradeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUpgradeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUpgradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
