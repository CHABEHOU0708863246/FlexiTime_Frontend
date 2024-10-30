export class User {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  isEnabled: boolean = true;
  roles: string[] = [];
  workingHours: number = 0;
  isPartTime: boolean = false;
  hireDate: Date = new Date();
  password: string = '';
  confirmPassword: string = '';

  constructor(data?: Partial<User>) {
    if (data) {
      this.id = data.id || this.id;
      this.firstName = data.firstName || this.firstName;
      this.lastName = data.lastName || this.lastName;
      this.email = data.email || this.email;
      this.phoneNumber = data.phoneNumber || this.phoneNumber;
      this.isEnabled = data.isEnabled ?? this.isEnabled;
      this.roles = data.roles || this.roles;
      this.workingHours = data.workingHours ?? this.workingHours;
      this.isPartTime = data.isPartTime ?? this.isPartTime;
      this.hireDate = data.hireDate || this.hireDate;
      this.password = data.password || this.password;
      this.confirmPassword = data.confirmPassword || this.confirmPassword;
    }
  }
}
