import {Component, OnInit, ViewChild} from '@angular/core';
import {MonitorService} from '../../../../service/monitor.service';
import {MonitorEntry, ServiceType, TimeFormat} from '../../../../model/monitorentry';
import {TranslateService} from '@ngx-translate/core';
import {Webhook} from '../../../../model/webhook';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@Component({
    selector: 'app-montiorlist',
    templateUrl: './monitor-list.component.html',
    styleUrls: ['./monitor-list.component.css'],
    standalone: false
})
export class MonitorListComponent implements OnInit {

  @ViewChild('rowMenu') rowMenu!: Menu;
  rowMenuItems: MenuItem[] = [];

  public monitorEntries: MonitorEntry[] = [];

  public services: typeof ServiceType = ServiceType;

  constructor(private monitorService: MonitorService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.update();
  }

  private update() {
      this.monitorService.getAllMonitorEntries().subscribe(entries => this.monitorEntries = entries);
  }

  public executeJob(serviceName: string) {
    this.monitorService.executeJob(serviceName).subscribe(val => this.update());
  }

  public changeJobState(monitorEntry: MonitorEntry) {
    if (monitorEntry.active) {
      this.monitorService.pauseJob(monitorEntry.serviceName).subscribe(() => monitorEntry.active = false);
    } else {
      this.monitorService.resumeJob(monitorEntry.serviceName).subscribe(() => monitorEntry.active = true);
    }
  }

  public getCorrectStateLabel(active: boolean): string {
    if (active) {
      return this.translate.instant('MONITOR.DEACTIVATE_BUTTON');
    }
    return this.translate.instant('MONITOR.ACTIVATE_BUTTON');
  }

  public getIntervalCheck(checkInterval: number, timeFormat: TimeFormat): string {
    if (checkInterval === 1 && timeFormat.toString() === TimeFormat[TimeFormat.MIN]) {
      return '1 minute';
    } else if (checkInterval === 1 && timeFormat.toString() === TimeFormat[TimeFormat.H]) {
      return '1 hour';
    }
    return timeFormat.toString() === TimeFormat[TimeFormat.MIN] ? checkInterval + ' minutes' : checkInterval + ' hours';
  }

  openRowMenu(event: Event, entry: MonitorEntry) {

    this.rowMenuItems = [
      {
        label: 'MONITOR.CHECK_NOW_BUTTON',
        command: (event) => {
          this.executeJob(entry.serviceName.toString());
          event.originalEvent?.stopPropagation();
        }
      },
      {
        label: 'MONITOR.EDIT_SETTINGS_BUTTON',
        routerLink: ['edit', entry.serviceName.toString()]
      },
      {
        label: this.getCorrectStateLabel(entry.active),
        command: (event) => {
          this.changeJobState(entry);
          event.originalEvent?.stopPropagation();
        }
      }
    ];

    this.rowMenu.toggle(event);
  }

}
