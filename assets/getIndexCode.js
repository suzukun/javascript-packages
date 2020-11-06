const { toCamelCase } = require("./utils/toCamelCase");

module.exports.getIndexCode = (name) => `import { ${toCamelCase(name)} } from './src/libs/${toCamelCase(name)}';

${toCamelCase(name)}();
`;
