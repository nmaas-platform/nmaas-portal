import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigTemplateService {

  private readonly updatableContainerKeys: string[] = ['additionalParameters', 'mandatoryParameters', 'accessCredentials'];

  public configTemplate: any;

  public configUpdateTemplate: any;

  public defaultElement: any;

  public basicAuth: any;

  public termsAcceptance: any;

  constructor(public http: HttpClient) { }

  public loadConfigTemplate() {
    this.http.get('/assets/formio/config-template.json')
       .subscribe(configTemplate => {
       this.configTemplate = configTemplate;
    });

    this.http.get('/assets/formio/config-update-template.json')
        .subscribe(configUpdateTemplate => {
          this.configUpdateTemplate = configUpdateTemplate;
    });

    this.http.get('/assets/formio/defaultElement.json')
        .subscribe(configUpdateTemplate => {
          this.defaultElement = configUpdateTemplate;
        });

    this.http.get('/assets/formio/basicAuth.json')
        .subscribe(auth => this.basicAuth = auth);

    this.http.get('/assets/formio/termsAcceptance.json')
        .subscribe(data => this.termsAcceptance = data);
  }

  public getConfigTemplate(): any {
    return this.configTemplate;
  }

  public getConfigUpdateTemplate(): any {
    return this.configUpdateTemplate;
  }

  public generateConfigUpdateTemplate(configWizardTemplate: any): any {
    const containers: any[] = [];
    this.collectUpdatableContainers(configWizardTemplate?.components, containers);
    if (containers.length === 0) {
      return this.getConfigUpdateTemplate();
    }
    return { components: [...containers, this.getApplyConfigurationButton()] };
  }

  private getApplyConfigurationButton(): any {
    return {
      type: 'button',
      label: 'Apply configuration',
      key: 'submit',
      action: 'submit',
      disableOnInvalid: true,
      theme: 'primary',
      input: false,
      tableView: true
    };
  }

  private collectUpdatableContainers(components: any[], collected: any[]): void {
    (components || []).forEach(component => {
      if (component?.type === 'container' && this.updatableContainerKeys.includes(component.key)) {
        collected.push(JSON.parse(JSON.stringify(component)));
        return;
      }
      this.collectUpdatableContainers(component?.components, collected);
      (component?.columns || []).forEach(column => this.collectUpdatableContainers(column?.components, collected));
    });
  }

  public isTemplateEmpty(template: any): boolean {
    return template == null || !this.hasInputFields(template.components);
  }

  public hasInputFields(components: any[]): boolean {
    for (const component of components || []) {
      if (component?.input === true && component.type !== 'container' && component.type !== 'button') {
        return true;
      }
      if (component?.components && this.hasInputFields(component.components)) {
        return true;
      }
      for (const column of component?.columns || []) {
        if (column?.components && this.hasInputFields(column.components)) {
          return true;
        }
      }
    }
    return false;
  }

  public getDefaultElement(): any {
    return this.defaultElement;
  }

  public getTermsAcceptance(termsContent: string): any {
    let temp = JSON.stringify(this.termsAcceptance);
    temp = temp.replace(/"@TERMS_CONTENT"/g, JSON.stringify(termsContent))
    console.log(JSON.parse(temp))
    return JSON.parse(temp)
  }

  public getBasicAuth(appName: string): any {
    let temp = JSON.stringify(this.basicAuth);
    temp = temp.replace(/@APP_NAME/g, appName);
    return JSON.parse(temp);
  }
}
