import { Country, LittleCountry } from "src/app/admin/shared/modules/country/interfaces/country.interface";

export interface User {
  _id:            string;
  email:          string;
  name:           string;
  password:       string;
  role:           Role;
  avatar:         string;
  isActive:       boolean;
  createdAt:      string;
  updatedAt:      string;
  country?:       LittleCountry;
  last_login?:    string;
}


export enum Role {
  Admin = "admin",
  SuperAdmin = "super_admin",
  User = "user",
}
