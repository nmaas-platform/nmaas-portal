import {Route} from "@angular/router";
import {AuthGuard} from "../../../auth/auth.guard";
import {RoleGuard} from "../../../auth/role.guard";
import {ConfigurationDetailsComponent} from "./index";
import { WebhookListComponent } from "../webhook/webhook-list/webhook-list.component";
import { WebhookDetailsComponent } from "../webhook/webhook-details/webhook-details.component";

export const ConfigurationRoutes: Route[] = [
    {path: 'configuration', component: ConfigurationDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN']} },
    {path: 'webhooks', component: WebhookListComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_DOMAIN_ADMIN']} },
    {path: 'webhooks/:id', component: WebhookDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_DOMAIN_ADMIN']} }
];
