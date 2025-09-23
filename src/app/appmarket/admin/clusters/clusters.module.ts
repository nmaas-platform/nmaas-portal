import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AuthModule} from "../../../auth/auth.module";
import {PipesModule} from "../../../pipe/pipes.module";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {ClusterDetailsComponent} from "./details/clusterdetails.component";
import {ClusterService} from "../../../service/cluster.service";
import { ClusterManagerDetailsComponent } from "../../../shared/admin/clusters/managerdetails/managerdetails.component";
import { ClusterManagerComponent } from "../../../shared/admin/clusters/manager/manager.component";
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from 'primeng/tooltip';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {Menu} from 'primeng/menu';



@NgModule({
    declarations: [
        ClusterDetailsComponent,
        ClusterManagerDetailsComponent,
        ClusterManagerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        PipesModule,
        TableModule,
        FileUploadModule,
        TranslateModule.forChild(),
        TooltipModule,
        IconField,
        InputIcon,
        InputTextModule,
        Menu
    ],
    exports: [
        ClusterDetailsComponent,
        ClusterManagerDetailsComponent,
        ClusterManagerComponent

    ],
    providers: [
        ClusterService,
    ]

})
export class ClustersModule {}
