import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddClusterComponent } from './add-cluster.component';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

describe('AddClusterComponent', () => {
  let component: AddClusterComponent;
  let fixture: ComponentFixture<AddClusterComponent>;
  let clusterService: jasmine.SpyObj<ClusterManagerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const clusterServiceSpy = jasmine.createSpyObj('ClusterManagerService', ['sendCluster']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [AddClusterComponent, ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        { provide: ClusterManagerService, useValue: clusterServiceSpy },
        { provide: Router, useValue: routerSpy },
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    clusterService = TestBed.inject(ClusterManagerService) as jasmine.SpyObj<ClusterManagerService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

 
});
