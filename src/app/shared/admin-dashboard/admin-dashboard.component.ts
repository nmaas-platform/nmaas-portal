import { Component, OnDestroy, OnInit } from '@angular/core';
import {DashboardService} from '../../service/dashboard.service';
import {UserDataService} from '../../service/userdata.service';
import {AppImagesService, AppsService} from '../../service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css',
    standalone: false
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  popularAppsChartData: any;

  basicOptions: any;
  adminData: any;
  domainAdminData: any;
  operatorData: any;
  instanceCountInPeriodDetails: any[] = [];
  applicationUpgradeStatus: any[] = [];
  domainId;
  public appId: number;
  rangeDates: Date[] = [];

  startDate;
  endDate;

  private refresh : any;

  constructor(protected dashboardService: DashboardService,
              private userDataService: UserDataService,
              public appImagesService: AppImagesService,
              private route: ActivatedRoute,
              private appsService: AppsService,
              public authService: AuthService) {
  }


  public ngOnInit() {
    this.setDefaultDate();
    this.getAdmin();
    if (this.authService.hasRole('ROLE_OPERATOR')) {
      this.getOperator();
    }
    this.refresh = this.userDataService.selectedDomainId.subscribe((domainId) => {
          this.domainId = domainId
          this.getDomainAdmin()
    });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-0');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-0');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            callback: function(value) {
              return Number(value).toFixed(0);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  public ngOnDestroy(): void {
    this.refresh.unsubscribe();
    this.refresh = null;
  }

  chartData() {
    const entries = Object.entries(this.adminData.popularApps);
    const sortedEntries = entries.sort((a, b) =>  Number(b[1]) -  Number(a[1]));
    const topEntries = sortedEntries.slice(0, 10);
    const appNames = topEntries.map(e => e[0]);
    const appValues = topEntries.map(e => e[1]);

    this.popularAppsChartData = {
      labels: appNames,
      datasets: [
        {
          label: 'Count of deployments',
          data: appValues,
          borderColor: '#42A5F5',
          backgroundColor: ['rgba(210, 230, 247, 1)', 'rgba(252, 219, 220, 1)', 'rgba(154, 146, 209, 1)', 'rgba(252, 208, 165, 1)', 'rgba(171, 208, 147, 1)'],
          fill: true
        }
      ]
    };
  }
  formatDate(date: any): string {
    return new Date(date).toLocaleString();
  }
  getOperator() {
    this.dashboardService.getOperator().subscribe(
        res => {
          this.operatorData = res;
        }
    )
  }
  getAdmin() {
    this.appsService.getAllApplicationBase().subscribe(apps => {
      const appNameToAppIdMap: { [name: string]: number } = {};
      apps.forEach(app => {
        appNameToAppIdMap[app.name] = app.id;
      });
      this.dashboardService.getAdmin(this.startDate, this.endDate).subscribe(
          (response) => {
            this.adminData = response;
            this.instanceCountInPeriodDetails = this.adminData.instanceCountInPeriodDetails.map(instance => ({
              ...instance,
              appId: appNameToAppIdMap[instance.applicationName] || null
            }));
            this.chartData();
          }
      );
    });
  }
  getDomainAdmin() {
    this.appsService.getAllApplicationBase().subscribe(apps => {
      const appNameToAppIdMap: { [name: string]: number } = {};
      apps.forEach(app => {
        appNameToAppIdMap[app.name] = app.id;
      });
      this.dashboardService.getDomainAdmin(this.domainId).subscribe(
          (response) => {
            this.domainAdminData = response;
            this.applicationUpgradeStatus = this.domainAdminData.applicationUpgradeStatus.map(inst => ({
              ...inst,
              logoId: appNameToAppIdMap[inst.appName] || null
            }));
          }
      )
    })
  }
  onDateChange(dates: Date[] | null) {
    if (!dates || dates.length === 0 ) {
      this.setDefaultDate();
    } else {
      this.rangeDates = dates;
      this.startDate = dates[0].toISOString();
      this.endDate = dates[1].toISOString();
    }
    this.getAdmin()
  }
  setDefaultDate() {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    this.startDate = start.toISOString();
    this.endDate = end.toISOString();
    this.rangeDates = [start, end]
  }
  public userHasGuestRoleInCurrentDomain(): boolean {
    return this.authService.hasDomainRole(this.domainId, 'ROLE_GUEST');
  }
}
