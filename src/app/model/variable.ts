export class Variable {

    public id: number = undefined;
    public name: string = undefined;
    public value: string = undefined;
    public type: VariableType = undefined;
    public scope: VariableScope = undefined;
    public domainId: number = undefined;

}

export enum VariableType {
    STANDARD = 'STANDARD',
    SECRET = 'SECRET'
}

export enum VariableScope {
    GLOBAL = 'GLOBAL',
    DOMAIN = 'DOMAIN'
}
