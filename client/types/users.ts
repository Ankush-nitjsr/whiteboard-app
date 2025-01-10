// Define the type for users array
export interface UserWithDetails {
  id: number;
  name: string;
  userid: string;
  roomid: string;
  host: boolean;
  presenter: boolean;
}

export type Users = UserWithDetails[];
