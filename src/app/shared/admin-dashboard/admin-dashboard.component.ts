import { Component } from '@angular/core';
import {DashboardService} from '../../service/dashboard.service';
import {UserDataService} from '../../service/userdata.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  popularAppsChartData: any;

  basicOptions: any;
  adminData: any;
  domainAdminData: any;
  instanceCountInPeriodDetails: any[] = [];
  applicationUpgradeStatus: any[] = [];
  domainId;

  constructor(protected dashboardService: DashboardService,
              private userDataService: UserDataService) {
  }


  ngOnInit() {
    this.userDataService.selectedDomainId.subscribe((domainId) => {
          this.domainId = domainId
          this.getDomainAdmin()
    });
    this.dashboardService.getAdmin().subscribe(
        (response) => {
          this.adminData = response;
          this.chartData();
          this.instanceCountInPeriodDetails = this.adminData.instanceCountInPeriodDetails;
        }
    )
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
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

  chartData() {
    const appNames = Object.keys(this.adminData.popularApps);
    const appValues = Object.values(this.adminData.popularApps);

    this.popularAppsChartData = {
      labels: appNames,
      datasets: [
        {
          label: 'Count of deployments',
          data: appValues,
          borderColor: '#42A5F5',
          backgroundColor: ['rgba(66, 165, 245, 0.2)', 'rgba(255, 208, 208, 0.7)', 'rgba(115, 104, 193, 0.7)', 'rgba(255, 193, 130, 0.7)', 'rgba(140, 193, 104, 0.7)'],
          fill: true
        }
      ]
    };
  }
  formatDate(date: any): string {
    return new Date(date).toLocaleString();
  }
  getDomainAdmin() {
    this.dashboardService.getDomainAdmin(this.domainId).subscribe(
        (response) => {
          this.domainAdminData = response;
          this.applicationUpgradeStatus  = this.domainAdminData.applicationUpgradeStatus;
        }
    )
  }
}
