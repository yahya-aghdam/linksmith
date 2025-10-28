// eslint.config.cjs
module.exports = [
  // Ignore folders
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"]
  },

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      // NOTE: use require(...) to load the parser module (not require.resolve)
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        // enables type-aware rules (can be removed if you want faster linting)
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module"
      }
    },
    // plugins must be the plugin modules
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      import: require("eslint-plugin-import"),
      prettier: require("eslint-plugin-prettier")
    },
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "import/order": ["warn", { "newlines-between": "always" }]
    }
  },

  // JavaScript files
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];