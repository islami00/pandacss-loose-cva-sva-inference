import { ForceIndexVariants, RecipeSelection, RecipeVariantMap } from './utils';
import { cva } from './styled-system/css';
import {
  DistributiveOmit,
  Pretty,
  RecipeCompoundSelection,
  RecipeCompoundVariant,
  RecipeConfigMeta,
  SystemStyleObject
} from './styled-system/types';

export interface RecipeDefinition<T> {
  /**
   * The base styles of the recipe.
   */
  base?: SystemStyleObject;
  /**
   * Whether the recipe is deprecated.
   */
  deprecated?: boolean | string;
  /**
   * The multi-variant styles of the recipe.
   */
  variants?: ForceIndexVariants<T, SystemStyleObject>; // Core change.
  /**
   * The default variants of the recipe.
   */
  defaultVariants?: RecipeSelection<T>;
  /**
   * The styles to apply when a combination of variants is selected.
   */
  compoundVariants?: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<T>>>[];
}
// I removed this entirely to be consistent with sva. However, the extends work fine here. Just that Making this `Record<any, Record<any,SystemStyleObject>> will cause inference to fail at RecipeCreatorFn and default to RecipeVariantRecord
// export type RecipeVariantRecord = Record<any, Record<any, unknown>>;

type RecipeCreatorFn = <T>(config: RecipeDefinition<T>) => RecipeRuntimeFn<T>;

const newCva = cva as RecipeCreatorFn;
const s = newCva({
  base: {},
  variants: {
    size: {
      sm: {}
    }
  },
  defaultVariants: {}
});

// Supporting
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

s({
  size: 'sm'
});
