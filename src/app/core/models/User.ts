export class User {
  // Propriétés pour l'interface utilisateur (en camelCase)
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
  gender: string = '';
  contractType: string = '';
  numberOfChildren: number = 0;
  maritalStatus: string = '';
  residence: string = '';
  postalAddress: string = '';

  // Propriétés du serveur (en PascalCase)
  private _id?: { $oid: string };
  private FirstName?: string;
  private LastName?: string;
  private Email?: string;
  private PhoneNumber?: string;
  private IsEnabled?: boolean;
  private WorkingHours?: number;
  private IsPartTime?: boolean;
  private HireDate?: { $date: string };
  private Gender?: string;
  private ContractType?: string;
  private NumberOfChildren?: number;
  private MaritalStatus?: string;
  private Residence?: string;
  private PostalAddress?: string;

  // Optionnel pour les opérations de création/modification
  password?: string;
  confirmPassword?: string;

  constructor(data?: any) {
    if (data) {
      // Mapping des données du serveur vers les propriétés de l'interface
      this.id = data._id?.$oid || data.id || '';
      this.firstName = data.FirstName || data.firstName || '';
      this.lastName = data.LastName || data.lastName || '';
      this.email = data.Email || data.email || '';
      this.phoneNumber = data.PhoneNumber || data.phoneNumber || '';
      this.isEnabled = data.IsEnabled ?? data.isEnabled ?? true;
      this.workingHours = data.WorkingHours ?? data.workingHours ?? 0;
      this.isPartTime = data.IsPartTime ?? data.isPartTime ?? false;
      this.hireDate = data.HireDate?.$date ? new Date(data.HireDate.$date)
                   : data.hireDate ? new Date(data.hireDate)
                   : new Date();
      this.gender = data.Gender || data.gender || '';
      this.contractType = data.ContractType || data.contractType || '';
      this.numberOfChildren = data.NumberOfChildren ?? data.numberOfChildren ?? 0;
      this.maritalStatus = data.MaritalStatus || data.maritalStatus || '';
      this.residence = data.Residence || data.residence || '';
      this.postalAddress = data.PostalAddress || data.postalAddress || '';

      // Stockage des données originales du serveur
      this._id = data._id;
      this.FirstName = data.FirstName;
      this.LastName = data.LastName;
      this.Email = data.Email;
      this.PhoneNumber = data.PhoneNumber;
      this.IsEnabled = data.IsEnabled;
      this.WorkingHours = data.WorkingHours;
      this.IsPartTime = data.IsPartTime;
      this.HireDate = data.HireDate;
      this.Gender = data.Gender;
      this.ContractType = data.ContractType;
      this.NumberOfChildren = data.NumberOfChildren;
      this.MaritalStatus = data.MaritalStatus;
      this.Residence = data.Residence;
      this.PostalAddress = data.PostalAddress;
    }
  }

  // Méthode pour convertir l'objet en format serveur
  toServerFormat(): any {
    return {
      _id: this._id,
      FirstName: this.firstName,
      LastName: this.lastName,
      Email: this.email,
      PhoneNumber: this.phoneNumber,
      IsEnabled: this.isEnabled,
      WorkingHours: this.workingHours,
      IsPartTime: this.isPartTime,
      HireDate: this.HireDate || { $date: this.hireDate.toISOString() },
      Gender: this.gender,
      ContractType: this.contractType,
      NumberOfChildren: this.numberOfChildren,
      MaritalStatus: this.maritalStatus,
      Residence: this.residence,
      PostalAddress: this.postalAddress
    };
  }
}
