import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppuploadComponent } from './appupload.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';

describe('AppuploadComponent', () => {
  let component: AppuploadComponent;
  let fixture: ComponentFixture<AppuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppuploadComponent ],
      imports : [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
          ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
