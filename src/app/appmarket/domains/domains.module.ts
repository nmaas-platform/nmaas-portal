import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
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
import {InputTextModule} from '@openng/optimus-ui/inputtext';
import {SearchDomainPipe} from './domain-search.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {TableModule} from '@openng/optimus-ui/table';
import {CheckboxModule} from '@openng/optimus-ui/checkbox';
import {DomainGroupsComponent} from './domain-groups/domain-groups.component';
import {DomainGroupViewComponent} from './domain-group-view/domain-group-view.component';
import {MultiSelectModule} from '@openng/optimus-ui/multiselect';
import {RemovalConfirmationModalComponent} from './modals/removal-confirmation-modal/removal-confirmation-modal.component';
import {SearchDomainGroupPipe} from './domain-group-search.pipe';
import { DomainAnnotationsComponent } from './domain-annotations/domain-annotations.component';
import {IconFieldModule} from '@openng/optimus-ui/iconfield';
import {InputIconModule} from '@openng/optimus-ui/inputicon';
import {MenuModule} from '@openng/optimus-ui/menu';
import {GlobalSettingsComponent} from './global-settings/global-settings.component';
import {TabsModule} from '@openng/optimus-ui/tabs';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from '@openng/optimus-ui/accordion';
import {ProgressBarModule} from '@openng/optimus-ui/progressbar';


@NgModule({
  declarations: [
    DomainsListComponent,
    DomainComponent,
      SearchDomainPipe,
    DomainGroupsComponent,
    DomainGroupViewComponent,
    RemovalConfirmationModalComponent,
      SearchDomainGroupPipe,
      GlobalSettingsComponent,
      DomainAnnotationsComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        PipesModule,
        TranslateModule,
        InputTextModule,
        NgxPaginationModule,
        TableModule,
        CheckboxModule,
        MultiSelectModule,
        IconFieldModule,
        InputIconModule,
        MenuModule,
        TabsModule,
        Accordion,
        AccordionPanel,
        AccordionHeader,
        AccordionContent,
        ProgressBarModule
    ],
    exports: [
        DomainsListComponent,
        SearchDomainPipe,
        SearchDomainGroupPipe,
        RemovalConfirmationModalComponent,
        DomainAnnotationsComponent
    ],
  providers: [
    DomainService,
  ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class DomainsModule {}
