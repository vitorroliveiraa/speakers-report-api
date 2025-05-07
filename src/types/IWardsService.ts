import { Wards } from "@database/models/wards.ts";

export interface WardsResponse
  extends Omit<Wards, "id" | "created_at" | "updated_at"> {}

export interface IWardsService {
  validateUnitNumber(unitNumber: string): Promise<WardsResponse>;
}
