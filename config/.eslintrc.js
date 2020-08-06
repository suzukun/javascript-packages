module.exports = {
    extends: ["airbnb-base", "plugin:prettier/recommended"],
    plugins: ["@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    rules: {
        "arrow-parens": [2, "as-needed"],
        "consistent-return": 0,
        curly: [1, "all"],
        "@typescript-eslint/explicit-member-accessibility": 2,
        "@typescript-eslint/no-unnecessary-type-assertion": 2,
        "@typescript-eslint/no-explicit-any": 2,
        "@typescript-eslint/no-unused-vars": 2,
        "import/extensions": 0,
        "import/prefer-default-export": 1,
        "import/no-duplicates": 0,
        "import/no-unresolved": 0,
        "import/no-extraneous-dependencies": 1,
        "import/no-default-export": 2,
        "import/no-extraneous-dependencies": 0,
        "import/order": [
            "error",
            {
                alphabetize: {
                    order: "asc",
                    caseInsensitive: false,
                },
                groups: ["builtin", "external", "internal", "index"],
                pathGroupsExcludedImportTypes: ["builtin", "external"],
                pathGroups: [],
            },
        ],
        "import/prefer-default-export": 0,
        "no-console": 1,
        "no-debugger": 1,
        "no-underscore-dangle": [
            "error",
            {
                allowAfterThis: true,
            },
        ],
        "prefer-arrow/prefer-arrow-functions": 0,
        "prettier/prettier": [
            2,
            {
                printWidth: 100,
                semi: true,
                singleQuote: true,
                trailingComma: "es5",
            },
        ],
    },
};
