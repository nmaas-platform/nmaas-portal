import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonEditComponent } from './json-edit.component';

describe('JsonEditComponent', () => {
  let component: JsonEditComponent;
  let fixture: ComponentFixture<JsonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
