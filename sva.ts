import { sva } from './styled-system/css';
import {
  DistributiveOmit,
  Pretty,
  RecipeCompoundSelection,
  SlotRecipeCompoundVariant,
  SlotRecord,
  SystemStyleObject
} from './styled-system/types';

import { RecipeSelection, ForceIndexVariants, RecipeVariantMap } from './utils';

export interface SlotRecipeDefinition<
  S extends string = string,
  // adding extends SlotRecipeVariantRecord isn't necessary here because:
  // 1. It breaks inference at T in SlotRecipeCreatorFn, making it default to SlotRecipeVariantRecord
  // 2. variants is type-safe, and the other operations don't need the constraint
  T = unknown
> {
  className?: string;
  deprecated?: boolean | string;
  slots: S[] | Readonly<S[]>;
  base?: SlotRecord<S, SystemStyleObject>;
  variants?: ForceIndexVariants<T, SlotRecord<S, SystemStyleObject>>; // This is the main Change that limits inference.
  defaultVariants?: RecipeSelection<T>;
  compoundVariants?: Pretty<SlotRecipeCompoundVariant<S, RecipeCompoundSelection<T>>>[];
}

export type SlotRecipeCreatorFn = <S extends string, T>(
  config: SlotRecipeDefinition<S, T>
) => SlotRecipeRuntimeFn<S, T>;

const newSva = sva as SlotRecipeCreatorFn;

const res = newSva({
  slots: ['test', 'root'],
  variants: {
    size: {
      sm: {
        test: {
          _rtl: {}
        }
      }
    }
  },
  defaultVariants: {
    size: 'sm'
  },
  compoundVariants: [
    {
      size: 'sm',
      css: {
        test: {}
      }
    }
  ]
});

const classes = res({ size: 'sm' });
// Extra
export type SlotRecipeVariantFn<S extends string, T> = (props?: RecipeSelection<T>) => SlotRecord<S, string>;

export interface SlotRecipeRuntimeFn<S extends string, T> extends SlotRecipeVariantFn<S, T> {
  raw: (props?: RecipeSelection<T>) => Record<S, SystemStyleObject>;
  variantKeys: (keyof T)[];
  variantMap: RecipeVariantMap<T>;
  splitVariantProps<Props extends RecipeSelection<T>>(
    props: Props
  ): [RecipeSelection<T>, Pretty<DistributiveOmit<Props, keyof T>>];
  getVariantProps: (props?: RecipeSelection<T>) => RecipeSelection<T>;
}
