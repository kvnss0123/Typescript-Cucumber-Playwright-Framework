import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { faker } from '@faker-js/faker';

export class DataManager {
    private cache: Map<string, any> = new Map();

    async getBaseConfig() {
        if (this.cache.has('baseConfig')) {
            return this.cache.get('baseConfig');
        }

        const configPath = path.resolve(process.cwd(), 'src/data/testdata.yaml');
        const fileContents = await fs.promises.readFile(configPath, 'utf8');
        const config = yaml.load(fileContents);

        this.cache.set('baseConfig', config);
        return config;
    }

    async getTestData(businessLine: string, testCase: string) {
        const cacheKey = `${businessLine}-${testCase}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const filePath = path.resolve(process.cwd(), `src/data/${businessLine}/${testCase}.yaml`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Test data file not found: ${filePath}`);
        }

        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        const data = yaml.load(fileContents);

        // Process any template variables like {{faker.name.firstName}}
        const processedData = this.processTemplateVariables(data);

        this.cache.set(cacheKey, processedData);
        return processedData;
    }

    private processTemplateVariables(data: any): any {
        if (typeof data === 'string') {
            return this.processFakerVariables(data);
        } else if (Array.isArray(data)) {
            return data.map(item => this.processTemplateVariables(item));
        } else if (data !== null && typeof data === 'object') {
            const result: any = {};
            for (const key in data) {
                result[key] = this.processTemplateVariables(data[key]);
            }
            return result;
        }
        return data;
    }

    private processFakerVariables(str: string): string {
        const regex = /{{faker\.([^}]+)}}/g;
        return str.replace(regex, (match, p1) => {
            const fakerPath = p1.split('.');
            let fakerValue: any = faker;

            for (const segment of fakerPath) {
                if (fakerValue[segment]) {
                    if (typeof fakerValue[segment] === 'function') {
                        fakerValue = fakerValue[segment]();
                    } else {
                        fakerValue = fakerValue[segment];
                    }
                } else {
                    return match; // Return original if path is invalid
                }
            }

            return String(fakerValue);
        });
    }
}
