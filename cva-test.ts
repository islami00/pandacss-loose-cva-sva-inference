import { RecipeCreatorFn } from './cva';
import { cva } from './styled-system/css';
import { SystemStyleObject } from './styled-system/types';

// Case 1
const shared: SystemStyleObject = {};
const newCva = cva as RecipeCreatorFn;
export const maxSerializationDepthExampleFixed = newCva({
  base: {},
  variants: {
    size: {
      sm: {
        ...shared
      },
      md: {
        ...shared
      },
      lg: {
        ...shared
      }
    }
  },
  defaultVariants: {}
});
export const maxSerializationDepthExample = cva({
  variants: {
    size: {
      sm: {
        ...shared
      },
      md: {
        ...shared
      },
      lg: {
        ...shared
      }
      // Uncomment this and notice
      // The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.ts(7056)
      // ,xl: {
      //   ...shared
      // }
    }
  }
});
maxSerializationDepthExampleFixed({
  // Inferred correctly.
  size: 'sm'
});

//  Case 2: Incorrect properties
newCva({
  variants: {
    size: {
      sm: {
        // @ts-expect-error
        thisIsNotAValidCSSProperty: 'hello'
      },
      md: {}
    }
  }
});
cva({
  variants: {
    size: {
      sm: {
        thisIsNotAValidCSSProperty: 'hello'
      },
      md: {}
    }
  }
});
//  Case 3: Type errors only occur at the cva call site, making it hard to debug
newCva({
  variants: {
    size: {
      sm: {
        // The error is much closer to the source of the problem, making it easier to debug.
        // @ts-expect-error
        fontSize: 'a'
      },
      md: {}
    }
  }
});

cva({
  // I made a mistake at size.sm.fontSize, but the error only shows up here. This is much harder to find in large recipes.
  // @ts-expect-error
  variants: {
    size: {
      sm: {
        fontSize: 'a'
      },
      md: {}
    }
  }
});
