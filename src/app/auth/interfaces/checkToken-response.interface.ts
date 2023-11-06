import { INavData } from "@coreui/angular";
import { User } from "./user.interface";

export interface CheckTokenResponse {
  user: User;
  token: string;
  menu: INavData[];
}
