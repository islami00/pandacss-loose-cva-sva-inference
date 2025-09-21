import { ForceIndexVariants, RecipeSelection, RecipeVariantMap } from './utils';
import { css } from './styled-system/css';
import {
  DistributiveOmit,
  Pretty,
  RecipeCompoundSelection,
  RecipeCompoundVariant,
  RecipeConfigMeta,
  SystemStyleObject
} from './styled-system/types';
// Core
export interface RecipeDefinition<T> {
  base?: SystemStyleObject;
  deprecated?: boolean | string;
  variants?: ForceIndexVariants<T, SystemStyleObject>; // This is the main change that limits inference.
  defaultVariants?: RecipeSelection<T>;
  compoundVariants?: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<T>>>[];
}
// I removed this entirely to be consistent with sva. However, the "extends" works fine here. The only exception is that Making this `Record<any, Record<any,SystemStyleObject>> will cause inference to fail at RecipeCreatorFn and default to RecipeVariantRecord
// export type RecipeVariantRecord = Record<any, Record<any, unknown>>;

export type RecipeCreatorFn = <T>(config: RecipeDefinition<T>) => RecipeRuntimeFn<T>;

// Supporting (Only modified due to type errors in `extends`)
export interface RecipeRuntimeFn<T> extends RecipeVariantFn<T> {
  __type: RecipeSelection<T>;
  variantKeys: (keyof T)[];
  variantMap: RecipeVariantMap<T>;
  raw: (props?: RecipeSelection<T>) => SystemStyleObject;
  config: RecipeConfig<T>;
  splitVariantProps<Props extends RecipeSelection<T>>(
    props: Props
  ): [RecipeSelection<T>, Pretty<DistributiveOmit<Props, keyof T>>];
  getVariantProps: (props?: RecipeSelection<T>) => RecipeSelection<T>;
}

export type RecipeVariantFn<T> = (props?: RecipeSelection<T>) => string;

export interface RecipeConfig<T> extends RecipeDefinition<T>, RecipeConfigMeta {}
