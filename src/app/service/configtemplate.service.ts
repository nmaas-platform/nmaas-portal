import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigTemplateService {

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
