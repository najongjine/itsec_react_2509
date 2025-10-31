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
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  metadata: string;
  token: string;
}

export interface BoardType {
  board_id: number;
  user_id: number;
  board_created_dt: string;
  board_updated_dt: string;
  title: string;
  content: string;
  uid: string;
  profile_url: string;
  email: string;
  user_display_name: string;
}
