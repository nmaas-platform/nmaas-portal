import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppAddJsonAppComponent } from './app-add-json-app.component';
import { ModalComponent } from '../../../shared';
import { AppsService } from '../../../service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {  TranslateLoader, TranslateModule } from '@ngx-translate/core';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('AppAddJsonAppComponent', () => {
  let component: AppAddJsonAppComponent;
  let fixture: ComponentFixture<AppAddJsonAppComponent>;
  let mockAppsService: jasmine.SpyObj<AppsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAppsService = jasmine.createSpyObj('AppsService', ['createApplicationDTO']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppAddJsonAppComponent, ModalComponent],
      imports: [
          TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
      ],
      providers: [
        { provide: AppsService, useValue: mockAppsService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppAddJsonAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valid JSON upload', () => {
    const mockFile = new Blob([JSON.stringify({ key: 'value' })], { type: 'application/json' });
    const mockEvent = { files: [mockFile] };
    mockAppsService.createApplicationDTO.and.returnValue(of({ id: '123' }));

    spyOn(component, 'uploadHandler');
    component.onUpload(mockEvent);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      expect(component.uploadHandler).toHaveBeenCalledWith({ id: '123' });
    };
  });

  it('should handle invalid JSON upload', () => {
    const mockFile = new Blob(['invalid json'], { type: 'application/json' });
    const mockEvent = { files: [mockFile] };

    component.onUpload(mockEvent);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      expect(component.JsonError).toBeTrue();
    };
  });

  it('should handle valid JSON text submission', () => {
    component.jsonText = JSON.stringify({ key: 'value' });
    mockAppsService.createApplicationDTO.and.returnValue(of({ id: '123' }));

    spyOn(component, 'uploadHandler');
    component.sendJsonText();

    expect(component.uploadHandler).toHaveBeenCalledWith({ id: '123' });
  });

  it('should handle invalid JSON text submission', () => {
    component.jsonText = 'invalid json';

    component.sendJsonText();

    expect(component.JsonError).toBeTrue();
  });

  it('should handle error during JSON submission', () => {
    component.jsonText = JSON.stringify({ key: 'value' });
    mockAppsService.createApplicationDTO.and.returnValue(throwError({ message: 'Error occurred' }));

    component.sendJsonText();

    expect(component.error).toBe('Error occurred');
  });

  it('should navigate to app details on successful upload', () => {
    const mockResult = { id: '123' };

    component.uploadHandler(mockResult);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['apps', '123']);
  });

  it('should show modal', () => {
    spyOn(component.modal, 'show');
    component.show();

    expect(component.modal.show).toHaveBeenCalled();
  });
});
