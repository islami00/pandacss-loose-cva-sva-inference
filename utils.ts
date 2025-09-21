import { StringToBoolean } from "./styled-system/types";

/**
 * Thanks: https://stackoverflow.com/a/66418421
 */
export type ForceIndexVariants<T, V> = {
  [P in keyof T]: {
    [K in keyof T[P]]: V;
  };
};export type RecipeSelection<T> = keyof any extends keyof T ? {} : {
  [K in keyof T]?: StringToBoolean<keyof T[K]> | undefined;
};
export type RecipeVariantMap<T> = {
  [K in keyof T]: Array<keyof T[K]>;
};

