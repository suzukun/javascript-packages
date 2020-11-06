const { toCamelCase } = require("./utils/toCamelCase");

module.exports.getSampleTestCode = (name) => `import { ${toCamelCase(name)} } from '../src/libs/${toCamelCase(name)}';

describe('${toCamelCase(name)}', () => {
    test('${toCamelCase(name)} is function', () => {
        expect(typeof ${toCamelCase(name)}).toBe('function');
    });
});
`;
