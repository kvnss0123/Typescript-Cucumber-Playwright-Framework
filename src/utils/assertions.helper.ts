import { expect } from 'chai';

export class AssertionHelper {
    /**
     * Assert that a value is truthy
     * @param value - Value to check
     * @param message - Optional custom error message
     */
    static assertTrue(value: any, message?: string): void {
        expect(value, message || 'Value should be true').to.be.true;
    }

    /**
     * Assert that a value is falsy
     * @param value - Value to check
     * @param message - Optional custom error message
     */
    static assertFalse(value: any, message?: string): void {
        expect(value, message || 'Value should be false').to.be.false;
    }

    /**
     * Assert equality
     * @param actual - Actual value
     * @param expected - Expected value
     * @param message - Optional custom error message
     */
    static assertEqual(actual: any, expected: any, message?: string): void {
        expect(actual, message || 'Values should be equal').to.equal(expected);
    }

    /**
     * Assert deep equality
     * @param actual - Actual object
     * @param expected - Expected object
     * @param message - Optional custom error message
     */
    static assertDeepEqual(actual: any, expected: any, message?: string): void {
        expect(actual, message || 'Objects should be deeply equal').to.deep.equal(expected);
    }

    /**
     * Assert that a value is within a range
     * @param value - Value to check
     * @param min - Minimum value
     * @param max - Maximum value
     * @param message - Optional custom error message
     */
    static assertWithinRange(value: number, min: number, max: number, message?: string): void {
        expect(value, message || `Value should be between ${min} and ${max}`).to.be.within(min, max);
    }

    /**
     * Assert that an array contains a specific item
     * @param array - Array to check
     * @param item - Item to look for
     * @param message - Optional custom error message
     */
    static assertArrayContains(array: any[], item: any, message?: string): void {
        expect(array, message || 'Array should contain the item').to.include(item);
    }
}
