module.exports.getSampleTestCode = (name) => `import { ${name} } from '../src/libs/${name}';

describe('${name}', () => {
    test('${name} is function', () => {
        expect(typeof ${name}).toBe('function');
    });
});
`;
