export class RoleRequest {
  code: string;
  roleName: string;

  constructor(code: string, roleName: string) {
    this.code = code;
    this.roleName = roleName;
  }
}
