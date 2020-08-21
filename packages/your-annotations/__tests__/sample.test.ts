import { yourAnnotations } from '../src/lib/sample';

describe('yourAnnotations', () => {
    test('yourAnnotations is function', () => {
        expect(typeof yourAnnotations).toBe('function');
    });
});
