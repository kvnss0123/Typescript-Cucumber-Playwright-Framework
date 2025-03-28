export class DateHelper {
    /**
     * Get current date in specific format
     * @param format - Date format string (default: YYYY-MM-DD)
     * @returns Formatted date string
     */
    static getCurrentDate(format: string = 'YYYY-MM-DD'): string {
        const date = new Date();

        switch (format) {
            case 'YYYY-MM-DD':
                return date.toISOString().split('T')[0];
            case 'MM/DD/YYYY':
                return date.toLocaleDateString('en-US');
            case 'DD-MM-YYYY':
                return date.toLocaleDateString('en-GB').replace(/\//g, '-');
            default:
                return date.toISOString();
        }
    }

    /**
     * Calculate age based on birthdate
     * @param birthDate - Birth date string
     * @returns Age in years
     */
    static calculateAge(birthDate: string): number {
        const today = new Date();
        const birth = new Date(birthDate);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    /**
     * Add days to a given date
     * @param date - Base date
     * @param days - Number of days to add
     * @returns New date after adding days
     */
    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}
