module.exports = {
  extends: ["next", "next/core-web-vitals"],
  rules: {
    // Possible Errors
    "no-console": "warn", // Disallow console.log statements
    "no-debugger": "warn", // Disallow debugger statements

    // Best Practices
    eqeqeq: ["error", "always"], // Require the use of === and !==
    curly: ["error", "all"], // Require consistent use of curly braces for all control statements

    // Variables
    "no-unused-vars": "warn", // Disallow unused variables
    "no-var": "error", // Require let or const instead of var
    "prefer-const": "warn", // Suggest using const if variable is never reassigned

    // Stylistic Issues
    // semi: ["error", "always"], // Require semicolons
    // indent: ["error", 2], // Enforce consistent indentation of 2 spaces
    // "brace-style": ["error", "1tbs"], // Enforce one true brace style
    // "comma-dangle": ["error", "always-multiline"], // Enforce consistent use of trailing commas

    // ECMAScript 6
    "arrow-spacing": ["error", { before: true, after: true }], // Enforce consistent spacing before and after arrow functions
    "no-duplicate-imports": "error", // Disallow duplicate imports
    "no-useless-constructor": "error", // Disallow unnecessary constructors

    // React and JSX
    "react/prop-types": "off", // Disable prop-types as we use TypeScript for type checking
    "react/react-in-jsx-scope": "off", // Not necessary to import React when using Next.js
    "react/jsx-uses-react": "off", // Not necessary to import React when using Next.js
    "react/jsx-uses-vars": "error", // Prevent variables used in JSX from being incorrectly marked as unused

    // JSX Accessibility
    "jsx-a11y/anchor-is-valid": "off", // Disable anchor validity checks as we use Next.js Link component
  },
};
