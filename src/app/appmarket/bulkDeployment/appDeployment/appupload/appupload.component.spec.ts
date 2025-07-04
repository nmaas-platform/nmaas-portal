import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppuploadComponent } from './appupload.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SecurePipe} from '../../../../pipe';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Pipe({
  name: 'secure'
})
class SecurePipeMock implements PipeTransform {
  public name = 'secure';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

describe('AppuploadComponent', () => {
  let component: AppuploadComponent;
  let fixture: ComponentFixture<AppuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AppuploadComponent, SecurePipeMock],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [RouterModule.forRoot([]),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
