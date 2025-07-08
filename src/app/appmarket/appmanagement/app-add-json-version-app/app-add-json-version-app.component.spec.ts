import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppAddJsonVersionAppComponent } from './app-add-json-version-app.component';
import { AppsService } from '../../../service';
import { Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ModalComponent } from '../../../shared';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppAddJsonVersionAppComponent', () => {
  let component: AppAddJsonVersionAppComponent;
  let fixture: ComponentFixture<AppAddJsonVersionAppComponent>;
  let mockAppsService: jasmine.SpyObj<AppsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAppsService = jasmine.createSpyObj('AppsService', ['createApplication']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
    declarations: [AppAddJsonVersionAppComponent, ModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        { provide: AppsService, useValue: mockAppsService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAddJsonVersionAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valid JSON version upload', () => {
    const mockFile = new Blob([JSON.stringify({ version: '1.0.0' })], { type: 'application/json' });
    const mockEvent = { files: [mockFile] };
    mockAppsService.createApplication.and.returnValue(of({ id: '123' }));

    component.onUpload(mockEvent);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      expect(mockAppsService.createApplication).toHaveBeenCalledWith(jasmine.objectContaining({ version: '1.0.0' }));
    };
    fileReader.readAsText(mockFile);
  });

  it('should call modal.hide on successful upload', () => {
    spyOn(component.modal, 'hide');
    const mockResult = { id: '123' };
    component.handleUpload(mockResult);

    expect(component.modal.hide).toHaveBeenCalled();
  });


  it('should handle valid JSON version text submission', () => {
    component.jsonText = JSON.stringify({ version: '1.0.0' });
    mockAppsService.createApplication.and.returnValue(of({ id: '123' }));

    spyOn(component, 'handleUpload');
    component.sendJsonText();

    expect(component.handleUpload).toHaveBeenCalledWith({ id: '123' });
  });

  it('should handle invalid JSON version text submission', () => {
    component.jsonText = 'invalid json';

    component.sendJsonText();

    expect(component.JsonError).toBeTrue();
  });

  it('should handle error during JSON version submission', () => {
    component.jsonText = JSON.stringify({ version: '1.0.0' });
    mockAppsService.createApplication.and.returnValue(throwError({ message: 'Error occurred' }));

    component.sendJsonText();

    expect(component.error).toBe('Error occurred');
  });

});
