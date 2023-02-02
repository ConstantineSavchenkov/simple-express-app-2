import { IsBooleanString, IsEnum, IsNumberString, IsOptional, Max, Min } from "class-validator";

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

  @Min(1)
  @Max(20) // small limit because of free 3 party api
  @IsOptional()
  public limit?: number;

  @Min(0)
  @IsOptional()
  public offset?: number;
}
