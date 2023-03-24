import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppAccessMethod} from '../../../model/app-access-method';
import {parseServiceAccessMethodType, ServiceAccessMethodType} from '../../../model/service-access-method';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'app-access-method-edit',
  templateUrl: './app-access-method-edit.component.html',
  styleUrls: ['./app-access-method-edit.component.css']
})
export class AppAccessMethodEditComponent implements OnInit {

  public ServiceAccessMethodType = ServiceAccessMethodType;

  @Input()
  public id: number;

  @Input()
  public accessMethod: AppAccessMethod;

  @Input()
  public accessMethodTypes: string[];

  @Output()
  public output: EventEmitter<number> = new EventEmitter<number>();

  public newKey = '';
  public newValue = '';

  public keyValue = [];

  public allowedKeys = [
      'INGRESS_HOSTS',
    'INGRESS_TLS_ENABLED',
    'INGRESS_CLASS',
    'INGRESS_LETSENCRYPT',
    'INGRESS_WILDCARD_OR_ISSUER',
    'INGRESS_ENABLED',
    'INGRESS_TLS_HOSTS',
    'K8S_SERVICE_SUFFIX',
    'K8S_SERVICE_PORT']

  constructor() { }

  ngOnInit() {
    Object.keys(this.accessMethod.deployParameters).forEach( v => {
      const string = this.accessMethod.deployParameters[v] as String;
      if (string.includes(',')) {
          const values = this.accessMethod.deployParameters[v].split(',')
          for (const i in values) {
            this.keyValue.push({key: v, value: values[i]})
          }
      } else {
        this.keyValue.push({key: v, value: this.accessMethod.deployParameters[v]})
      }
    })
  }

  public isNewDeployParamValid(): boolean {
    if (!this.newKey || !this.newValue) {
      return false;
    }
    return (!!this.newKey && !!this.newValue);
  }

  public addNewDeployParam(): void {
    if (this.isNewDeployParamValid()) {
      this.keyValue.push({key: this.newKey, value: this.newValue})
      this.newKey = '';
      this.newValue = '';
      this.setKeyValueToDeployParam();
    }
  }

  public removeDeployParam(key: string): void {
    if (this.accessMethod.deployParameters.hasOwnProperty(key)) {
      delete this.accessMethod.deployParameters[key];
    }
  }

  public getDeploymentParamsKeys(): string[] {
    return this.keyValue.map(val => {
      return val.key
    })
  }

  public isDefault(): boolean {
    return ServiceAccessMethodType.DEFAULT === parseServiceAccessMethodType(this.accessMethod.type);
  }

  public remove(): void {
    this.output.emit(this.id);
  }

  public setKeyValueToDeployParam() {
    this.keyValue.forEach(val => {
      if (this.keyValue.filter(keyValue => keyValue.key === val.key).length > 1) {
        const params = this.keyValue.filter(keyValue => keyValue.key === val.key).map(param => {
          return param.value;
        });
        this.accessMethod.deployParameters[val.key] = params.join();
      } else {
        this.accessMethod.deployParameters[val.key] = val.value;
      }
    })
  }

}
