export enum Role {
  ROLE_SYSTEM_ADMIN,
  ROLE_DOMAIN_ADMIN,
  ROLE_OPERATOR,
  ROLE_TOOL_MANAGER,
  ROLE_USER,
  ROLE_GUEST,
  ROLE_INCOMPLETE,
  ROLE_NOT_ACCEPTED,
  ROLE_VL_MANAGER,
  ROLE_VL_DOMAIN_ADMIN
}

export function RoleAware(constructor: Function) {
    constructor.prototype.Role = Role;
}

export class UserRole {
  public domainId: number = undefined;

  public role: Role  = undefined;

  constructor(domainId?: number, role?: Role) {
    this.domainId = domainId;
    this.role = role;
  }
}
