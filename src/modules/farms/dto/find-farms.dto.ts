import { IsBooleanString, IsEnum, IsNumberString, IsOptional } from "class-validator";

export enum FarmSortingFields {
  NAME = "name",
  DATE = "date",
  DRIVING_DISTANCE = "drivingDistance",
}

export class FindFarmsDto {
  @IsEnum(FarmSortingFields, {
    message: `sort must be one of [${Object.values(FarmSortingFields)}]`,
  })
  @IsOptional()
  public sort?: FarmSortingFields;

  @IsBooleanString()
  @IsOptional()
  public outliers?: boolean;

  @IsNumberString()
  @IsOptional()
  public pageNumber?: number;

  @IsNumberString()
  @IsOptional()
  public pageSize?: number;
}
