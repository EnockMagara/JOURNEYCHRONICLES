import globals from "globals"; // Importing globals from the "globals" package
import pluginJs from "@eslint/js"; // Importing pluginJs from the "@eslint/js" package

export default [
  // Exporting an array with configuration objects
  {
    languageOptions: {
      globals: { 
        ...globals.browser, // Spreading browser globals
        ...globals.node // Spreading node globals
      }
    },
    rules: {
      'semi': ['error', 'always'], // Enforce semicolons
      'no-var': ['error'], // Disallow var declarations
      'prefer-const': ['error', { 'destructuring': 'any', 'ignoreReadBeforeAssign': false }], // Prefer const over let
      'curly': ['error'], // Enforce consistent brace style for all control statements
      'eqeqeq': ['error'], // Require the use of === and !==
      'no-multi-spaces': ['error'], // Disallow multiple spaces
      'no-lone-blocks': ['error'], // Disallow unnecessary nested blocks
      'no-self-compare': ['error'], // Disallow comparisons where both sides are exactly the same
      'no-unused-expressions': ['error'], // Disallow unused expressions
      'no-useless-call': ['error'], // Disallow unnecessary calls to .call() and .apply()
      'no-use-before-define': ['error'], // Disallow the use of variables before they are defined
      'camelcase': ['error', { properties: 'never' }], // Enforce camelcase naming convention
      'func-call-spacing': ['error'], // Disallow spacing between function identifiers and their invocations
      'no-lonely-if': ['error'], // Disallow if statements as the only statement in else blocks
      'array-bracket-spacing': ['error'], // Enforce consistent spacing inside array brackets
      'no-console': ['off'] // Allow the use of console
    }
  },
  pluginJs.configs.recommended, // Including recommended configurations from pluginJs
];