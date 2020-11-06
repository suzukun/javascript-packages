module.exports.getIndexCode = (name) => `import { ${name} } from './src/libs/${name}';

${name}();
`;
