export class RandomGenerator {
    /**
     * Generate a random string
     * @param length - Length of the string
     * @param type - Type of string (alpha, numeric, alphanumeric)
     * @returns Random generated string
     */
    static generateString(length: number, type: 'alpha' | 'numeric' | 'alphanumeric' = 'alphanumeric'): string {
        let characters = '';

        if (type === 'alpha' || type === 'alphanumeric') {
            characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        }

        if (type === 'numeric' || type === 'alphanumeric') {
            characters += '0123456789';
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    /**
     * Generate a random email
     * @param domain - Optional custom domain
     * @returns Randomly generated email
     */
    static generateEmail(domain: string = 'example.com'): string {
        const username = this.generateString(8, 'alphanumeric');
        return `${username}@${domain}`;
    }

    /**
     * Generate a random phone number
     * @param format - Phone number format (US by default)
     * @returns Randomly generated phone number
     */
    static generatePhoneNumber(format: 'US' | 'international' = 'US'): string {
        if (format === 'US') {
            const areaCode = Math.floor(Math.random() * 900) + 100;
            const prefix = Math.floor(Math.random() * 900) + 100;
            const lineNumber = Math.floor(Math.random() * 9000) + 1000;
            return `(${areaCode}) ${prefix}-${lineNumber}`;
        }

        // Basic international format
        return `+${Math.floor(Math.random() * 100)}${this.generateString(10, 'numeric')}`;
    }

    /**
     * Generate a random VIN number
     * @returns Randomly generated VIN
     */
    static generateVIN(): string {
        const manufacturers = ['1G', '1H', '1J', '1N', '5L'];
        const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
        const rest = this.generateString(11, 'alphanumeric').toUpperCase();
        return `${manufacturer}${rest}`;
    }
}
