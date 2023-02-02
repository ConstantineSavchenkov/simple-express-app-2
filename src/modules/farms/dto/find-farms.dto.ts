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
  @Max(12) // small limit because of distancematrix provides only 20 free destantion
          // and we need some buffer elements to increase precision
  @IsOptional()
  public limit?: number;

  @Min(0)
  @IsOptional()
  public offset?: number;
}
