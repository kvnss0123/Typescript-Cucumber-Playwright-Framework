import { faker, Sex } from '@faker-js/faker';

export class FakerHelper {
    static getBusinessName() {
        return {
            companyName: faker.company.name()
        };
    }

    static getAddress() {
        return {
            addressLine1: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode()
        };
    }

    static getPerson() {
        const sex = faker.person.sexType();
        const firstName = faker.person.firstName(sex);
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const dateOfBirth = faker.date.birthdate();
        const phoneNumber = faker.phone.number();

        return {
            sex,
            firstName,
            lastName,
            email,
            dateOfBirth,
            phoneNumber
        }
    }

    static getVIN() {
        return faker.vehicle.vin();
    }

    static getVehicle() {
        const vin = faker.vehicle.vin();
        const make = faker.vehicle.manufacturer();
        const model = faker.vehicle.model();
        const year = faker.date.past({ years: 10 }).getFullYear().toString();
        const costNew = faker.number.int({ min: 20000, max: 80000 }).toString();
        return {
            make,
            model,
            year,
            vin,
            costNew
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
