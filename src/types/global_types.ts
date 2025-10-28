export interface Memotype {
  content: string;
  createdDt: string;
  updatedDt: string;
  id: number;
  title: string;
}

export interface UserInfoType {
  id: number;
  username: string;
  password: string;
  createdDt: string;
  updatedDt: string;
  realName: string;
  profileUrl: string;
  uidVarchar: string;
  emailVarchar: string;
  displayName: string;
  providerId: string;
  metadata: string;
  token: string;
}
