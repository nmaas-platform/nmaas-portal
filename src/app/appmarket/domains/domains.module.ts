import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PipesModule} from '../../pipe/pipes.module';

import {AuthModule} from '../../auth/auth.module';
import {SharedModule} from '../../shared/shared.module';

import {DomainsListComponent} from './list/domainslist.component';
import {DomainComponent} from './domain/domain.component';

import {DomainService} from '../../service/domain.service';
import {TranslateModule} from '@ngx-translate/core';
import { DomainGroupsComponent } from './domain-groups/domain-groups.component';
import { DomainGroupViewComponent } from './domain-group-view/domain-group-view.component';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import { RemovalConfirmationModalComponent } from './modals/removal-confirmation-modal/removal-confirmation-modal.component';



@NgModule({
  declarations: [
    DomainsListComponent,
    DomainComponent,
    DomainGroupsComponent,
    DomainGroupViewComponent,
    RemovalConfirmationModalComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        PipesModule,
        TranslateModule.forChild(),
        DropdownModule,
        MultiSelectModule
    ],
  exports: [
    DomainsListComponent
  ],
  providers: [
    DomainService,
  ]

})
export class DomainsModule {}
