module.exports.getTSConfig = () => `{
  "extends": "../../config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "exclude": ["dist/**/*"]
}
`;
