import { isNullOrUndefined } from "helpers/utils";
import { ValueTransformer } from "typeorm";

export class ColumnNumericTransformer implements ValueTransformer {
public to(value?: number | null): number | null {
  if (!isNullOrUndefined(value)) {
    return value;
  }
  return null;
}

public from(value?: string | null): number | null {
  if (!isNullOrUndefined(value)) {
    const res = parseFloat(value);
    if (isNaN(res)) {
      return null;
    } else {
      return res;
    }
  }
  return null;
}
}
