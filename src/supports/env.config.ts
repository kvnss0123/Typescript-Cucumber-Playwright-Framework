import * as dotenv from 'dotenv';
import * as path from 'path';

export class EnvConfig {
    private static instance: EnvConfig;
    private config!: dotenv.DotenvConfigOutput;

    private constructor() {
        // Load environment variables from multiple files
        const envFiles = [
            '.env',
            `.env.${process.env.NODE_ENV || 'development'}`
        ];

        for (const file of envFiles) {
            this.config = dotenv.config({
                path: path.resolve(process.cwd(), file)
            });
        }
    }

    public static getInstance(): EnvConfig {
        if (!this.instance) {
            this.instance = new EnvConfig();
        }
        return this.instance;
    }

    public get(key: string, defaultValue?: string): string {
        const value = process.env[key] || this.config.parsed?.[key] || defaultValue;

        if (value === undefined) {
            throw new Error(`Environment variable ${key} is not defined`);
        }

        return value;
    }

    public getRequired(key: string): string {
        const value = this.get(key);
        if (!value) {
            throw new Error(`Required environment variable ${key} is missing`);
        }
        return value;
    }
}
