import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorDetailsComponent } from './details/monitor-details.component';
import { MonitorListComponent } from './list/monitor-list.component';
import {RouterModule} from "@angular/router";
import {MonitorService} from "../../../service/monitor.service";
import {AuthModule} from "../../../auth/auth.module";
import {PipesModule} from "../../../pipe/pipes.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared";
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from '@openng/optimus-ui/inputtext';
import {SelectModule} from '@openng/optimus-ui/select';
import {MenuModule} from '@openng/optimus-ui/menu';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AuthModule,
        PipesModule,
        FormsModule,
        SharedModule,
        TranslateModule.forChild(),
        InputTextModule,
        SelectModule,
        MenuModule
    ],
    providers: [
        MonitorService
    ],

    declarations: [MonitorDetailsComponent, MonitorListComponent]
})
export class MonitorModule { }
