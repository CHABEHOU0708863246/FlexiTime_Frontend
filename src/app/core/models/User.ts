export class User {
  id: string = '';
  firstName: string | null = null;
  lastName: string | null = null;
  email: string | null = null;
  phoneNumber: string | null = null;
  isEnabled: boolean = true;
  roles: string[] = [];
  workingHours: number = 0;
  isPartTime: boolean = false;
  hireDate: Date = new Date();
  gender: string | null = null;
  contractType: string | null = null;
  numberOfChildren: number | null = null;
  maritalStatus: string | null = null;
  residence: string | null = null;
  postalAddress: string | null = null;

  // Optionnel : mots de passe pour des opérations spécifiques comme la création/modification utilisateur.
  password?: string;
  confirmPassword?: string;

  constructor(data?: Partial<User>) {
    if (data) {
      this.id = data.id || this.id;
      this.firstName = data.firstName ?? this.firstName;
      this.lastName = data.lastName ?? this.lastName;
      this.email = data.email ?? this.email;
      this.phoneNumber = data.phoneNumber ?? this.phoneNumber;
      this.isEnabled = data.isEnabled ?? this.isEnabled;
      this.roles = data.roles || this.roles;
      this.workingHours = data.workingHours ?? this.workingHours;
      this.isPartTime = data.isPartTime ?? this.isPartTime;
      this.hireDate = data.hireDate ? new Date(data.hireDate) : this.hireDate;
      this.gender = data.gender ?? this.gender;
      this.contractType = data.contractType ?? this.contractType;
      this.numberOfChildren = data.numberOfChildren ?? this.numberOfChildren;
      this.maritalStatus = data.maritalStatus ?? this.maritalStatus;
      this.residence = data.residence ?? this.residence;
      this.postalAddress = data.postalAddress ?? this.postalAddress;
      this.password = data.password;
      this.confirmPassword = data.confirmPassword;
    }
  }
}
