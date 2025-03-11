// File: src/utils/FakerHelper.ts
import { faker } from '@faker-js/faker';

export class FakerHelper {
    static getBusinessName() {
        return faker.company.name();
    }

    static getAddress() {
        return {
            addressLine1: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode()
        };
    }

    static getPersonName() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName()
        };
    }
    static getPhoneNumber() {
        return faker.phone.number();
    }

    static getEmail(firstName?: string, lastName?: string) {
        if (firstName && lastName) {
            return faker.internet.email({ firstName, lastName }).toLowerCase();
        }
        return faker.internet.email().toLowerCase();
    }

    static getVIN() {
        return faker.vehicle.vin();
    }

    static getVehicleDetails() {
        return {
            make: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            year: faker.date.past({ years: 10 }).getFullYear().toString(),
            vin: faker.vehicle.vin(),
            costNew: faker.number.int({ min: 20000, max: 80000 }).toString()
        };
    }

    static getRandomDate(startYear: number, endYear: number, format: string = 'MM/dd/yyyy') {
        const start = new Date(startYear, 0, 1);
        const end = new Date(endYear, 11, 31);
        const randomDate = faker.date.between({ from: start, to: end });

        // Format the date
        const month = (randomDate.getMonth() + 1).toString().padStart(2, '0');
        const day = randomDate.getDate().toString().padStart(2, '0');
        const year = randomDate.getFullYear();

        return format
            .replace('MM', month)
            .replace('dd', day)
            .replace('yyyy', year.toString());
    }
}
