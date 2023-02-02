import { readdirSync } from "fs";
import path, { join } from "path";

const isStrNumber = (str: string) => {
  if (typeof str != "string") {
    return false;
  }

  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
};

/* 1. Please write a function to transform array to containing number and strings.

    - e.g `['super', '20.5', 'test', '23' ]` -> `['super', 20.5, 'test', 23 ]` */

export function Solution1(arr: string[]): (string | number)[] {
  return arr.map(el => {
    if (isStrNumber(el)) {
      return Number(el);
    }

    return el;
  });
}

/* 2. Please write a function to return an array of all files with `csv` extension in folder `/files` */

export function Solution2(): string[] {
  const files = readdirSync(join(__dirname, "..", "files"));
  return files.filter((fileName: string) => path.extname(fileName) === ".csv");
}

/* 3. Please write a function to return if a string contains a digit
    - e.g `'test-string'` -> `false`
    - e.g `'test-string23'` -> `true` */

export function Solution3(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (isStrNumber(str[i])) {
      return true;
    }
  }
  return false;
}
