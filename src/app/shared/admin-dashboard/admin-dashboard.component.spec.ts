import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../service/dashboard.service';
import { UserDataService } from '../../service/userdata.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {AppImagesService, AppsService} from '../../service';
import {ActivatedRoute} from '@angular/router';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockUserDataService: jasmine.SpyObj<UserDataService>;

  const applications = [
    { id: 1, name: 'App1' },
    { id: 2, name: 'App2' }
  ];

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['getAdmin', 'getDomainAdmin']);
    mockUserDataService = jasmine.createSpyObj('UserDataService', ['selectedDomainId']);
    const appImagesServiceSpy = jasmine.createSpyObj('AppImagesService', ['getAppLogoUrl']);
    const appsServiceSpy = jasmine.createSpyObj('AppsService', ['getAllApplicationBase']);
    appsServiceSpy.getAllApplicationBase.and.returnValue(of(applications));
    mockUserDataService.selectedDomainId = of(123); // Replace 'test-domain-id' with a numeric value
    mockDashboardService.getAdmin.and.returnValue(of({ 
      popularApps: { App1: 10, App2: 20 },
      instanceCountInPeriodDetails: []
    }));
    mockDashboardService.getDomainAdmin.and.returnValue(of({
      applicationUpgradeStatus: []
    }));

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        {provide: AppImagesService, useValue: appImagesServiceSpy},
        { provide: UserDataService, useValue: mockUserDataService },
        {provide: ActivatedRoute, useValue: {params: of({id: 1})}},
        { provide: AppsService, useValue: appsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA] // Add this to allow unknown properties
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with admin data and chart data', () => {
    expect(component.adminData).toBeDefined();
    expect(component.popularAppsChartData).toBeDefined();
    expect(component.instanceCountInPeriodDetails).toEqual([]);
  });

  it('should subscribe to selectedDomainId and fetch domain admin data', () => {
    expect(component.domainId).toBe(123);
    expect(component.domainAdminData).toBeDefined();
    expect(component.applicationUpgradeStatus).toEqual([]);
  });

  it('should format date correctly', () => {
    const date = '2023-01-01T00:00:00Z';
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toBe(new Date(date).toLocaleString());
  });

  it('should call chartData method and populate chart data', () => {
    component.chartData();
    expect(component.popularAppsChartData.labels).toEqual(['App2', 'App1']);
    expect(component.popularAppsChartData.datasets[0].data).toEqual([20, 10]);
  });
});
