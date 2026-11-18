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
import { TableModule } from '@openng/optimus-ui/table';
import { FileUploadModule } from '@openng/optimus-ui/fileupload';
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import {IconFieldModule} from '@openng/optimus-ui/iconfield';
import { InputIconModule} from '@openng/optimus-ui/inputicon';
import {InputTextModule} from '@openng/optimus-ui/inputtext';
import { MenuModule} from '@openng/optimus-ui/menu';
import {Textarea} from "@openng/optimus-ui/textarea";



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
        TranslateModule,
        TooltipModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MenuModule,
        Textarea
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
