module.exports.getESLintRC = () => `module.exports = {
    extends: "../../config/.eslintrc.base.json",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
    },
};
`;
