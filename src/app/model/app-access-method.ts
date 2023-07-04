import {ServiceAccessMethodType} from './service-access-method';

export enum ConditionType {
    NONE = 'NONE',
    DEPLOYMENT_PARAMETER = 'DEPLOYMENT_PARAMETER'
}

export class AppAccessMethod {
    public id: number;
    public type: ServiceAccessMethodType;
    public name: string;
    public tag: string;
    public deployParameters: object = {}; // this should be Map<string, string> but JS cannot stringify object of this type
    public conditionType: ConditionType = ConditionType.NONE;
    public condition: string;
}
