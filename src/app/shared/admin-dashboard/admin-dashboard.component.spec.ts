import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject} from 'rxjs';

import {AuthService} from '../../auth/auth.service';
import {AppImagesService, AppsService} from '../../service';
import {DashboardService} from '../../service/dashboard.service';
import {UserDataService} from '../../service/userdata.service';
import {AdminDashboardComponent} from './admin-dashboard.component';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let dashboardServiceMock: jasmine.SpyObj<DashboardService>;
  let userDataServiceMock: { selectedDomainId: Subject<number> };
  let appsServiceMock: jasmine.SpyObj<AppsService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let translateServiceMock: jasmine.SpyObj<TranslateService>;

  const applications = [
    {id: 1, name: 'App1'},
    {id: 2, name: 'App2'}
  ];

  const adminResponse = {
    popularApps: {App1: 10, App2: 20},
    instanceCountInPeriodDetails: [
      {
        instanceId: 101,
        applicationName: 'App2',
        applicationVersion: '1.0.0',
        domainName: 'Domain A'
      },
      {
        instanceId: 102,
        applicationName: 'Unknown App',
        applicationVersion: '2.0.0',
        domainName: 'Domain B'
      }
    ]
  };

  const domainAdminResponse = {
    applicationUpgradeStatus: [
      {
        appId: 11,
        baseAppId: 1,
        appName: 'App1',
        instanceName: 'Instance 1',
        appVersion: '1.0.0',
        upgradePossible: true
      }
    ],
    applicationDeployed: [],
    userLogins: []
  };

  beforeEach(async () => {
    dashboardServiceMock = jasmine.createSpyObj<DashboardService>('DashboardService', [
      'getAdmin',
      'getDomainAdmin',
      'getOperator'
    ]);
    userDataServiceMock = {selectedDomainId: new Subject<number>()};
    appsServiceMock = jasmine.createSpyObj<AppsService>('AppsService', ['getAllApplicationBase']);
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['hasDomainRole', 'hasRole']);
    translateServiceMock = jasmine.createSpyObj<TranslateService>('TranslateService', ['getCurrentLang']);

    dashboardServiceMock.getAdmin.and.returnValue(of(adminResponse));
    dashboardServiceMock.getDomainAdmin.and.returnValue(of(domainAdminResponse));
    dashboardServiceMock.getOperator.and.returnValue(of({domainsCount: 3}));
    appsServiceMock.getAllApplicationBase.and.returnValue(of(applications as any));
    authServiceMock.hasRole.and.returnValue(false);
    authServiceMock.hasDomainRole.and.returnValue(false);
    translateServiceMock.getCurrentLang.and.returnValue('en');

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [
        {provide: DashboardService, useValue: dashboardServiceMock},
        {provide: UserDataService, useValue: userDataServiceMock},
        {provide: AppImagesService, useValue: jasmine.createSpyObj<AppImagesService>('AppImagesService', ['getAppLogoUrl'])},
        {provide: AppsService, useValue: appsServiceMock},
        {provide: AuthService, useValue: authServiceMock},
        {provide: TranslateService, useValue: translateServiceMock}
      ]
    })
      .overrideComponent(AdminDashboardComponent, {
        set: {template: ''}
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize default date range', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.rangeDates.length).toBe(2);
    expect(component.startDate).toBe(component.rangeDates[0].toISOString());
    expect(component.endDate).toBe(component.rangeDates[1].toISOString());
    expect(component.basicOptions).toBeDefined();
  });

  it('should subscribe to selected domain id and fetch domain admin data', () => {
    fixture.detectChanges();

    userDataServiceMock.selectedDomainId.next(123);

    expect(component.domainId).toBe(123);
    expect(dashboardServiceMock.getDomainAdmin).toHaveBeenCalledWith(123);
    expect(component.domainAdminData).toEqual(domainAdminResponse);
    expect(component.applicationUpgradeStatus).toEqual(domainAdminResponse.applicationUpgradeStatus);
  });

  it('should fetch system admin dashboard data and map application ids', () => {
    authServiceMock.hasRole.and.callFake((role: string) => role === 'ROLE_SYSTEM_ADMIN');

    fixture.detectChanges();

    expect(appsServiceMock.getAllApplicationBase).toHaveBeenCalled();
    expect(dashboardServiceMock.getAdmin).toHaveBeenCalledWith(component.startDate, component.endDate);
    expect(component.instanceCountInPeriodDetails).toEqual([
      jasmine.objectContaining({instanceId: 101, applicationName: 'App2', appId: 2}),
      jasmine.objectContaining({instanceId: 102, applicationName: 'Unknown App', appId: null})
    ]);
    expect(component.popularAppsChartData.labels).toEqual(['App2', 'App1']);
    expect(component.popularAppsChartData.datasets[0].data).toEqual([20, 10]);
  });

  it('should fetch operator data for operator users', () => {
    authServiceMock.hasRole.and.callFake((role: string) => role === 'ROLE_OPERATOR');

    fixture.detectChanges();

    expect(dashboardServiceMock.getOperator).toHaveBeenCalled();
    expect(component.operatorData).toEqual({domainsCount: 3});
  });

  it('should refresh admin data when system admin changes date range', () => {
    authServiceMock.hasRole.and.callFake((role: string) => role === 'ROLE_SYSTEM_ADMIN');
    fixture.detectChanges();
    dashboardServiceMock.getAdmin.calls.reset();

    const start = new Date('2026-06-01T00:00:00.000Z');
    const end = new Date('2026-06-10T00:00:00.000Z');
    component.onDateChange([start, end]);

    expect(component.rangeDates).toEqual([start, end]);
    expect(component.startDate).toBe(start.toISOString());
    expect(component.endDate).toBe(end.toISOString());
    expect(dashboardServiceMock.getAdmin).toHaveBeenCalledWith(start.toISOString(), end.toISOString());
  });

  it('should format dates according to current language', () => {
    fixture.detectChanges();

    expect(component.formatDate('2023-01-01T00:00:00Z')).toBe(
      new Date('2023-01-01T00:00:00Z').toLocaleString('en-GB')
    );
  });

  it('should check guest role in current domain', () => {
    fixture.detectChanges();
    authServiceMock.hasDomainRole.and.returnValue(true);
    component.domainId = 123;

    expect(component.userHasGuestRoleInCurrentDomain()).toBeTrue();
    expect(authServiceMock.hasDomainRole).toHaveBeenCalledWith(123, 'ROLE_GUEST');
  });

  it('should unsubscribe from domain selection on destroy', () => {
    fixture.detectChanges();
    const subscription = (component as any).refresh;
    spyOn(subscription, 'unsubscribe').and.callThrough();

    fixture.destroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
    expect((component as any).refresh).toBeNull();
  });
});
