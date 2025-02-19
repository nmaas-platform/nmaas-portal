import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftMenuComponent } from './admin-left-menu.component';
import { MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminLeftMenuComponent', () => {
  let component: AdminLeftMenuComponent;
  let fixture: ComponentFixture<AdminLeftMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLeftMenuComponent],
      providers: [MessageService],
      schemas: [
                            CUSTOM_ELEMENTS_SCHEMA,
                            NO_ERRORS_SCHEMA
                        ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
