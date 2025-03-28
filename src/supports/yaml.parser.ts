import * as fs from 'fs';
import yaml from 'yaml';
import * as path from 'path';

/**
 * Parser for YAML locator files.
 */
export class YamlParser {
    private static readonly logger = console;

    /**
     * Loads a YAML file and returns a map of locators for the elements.
     *
     * @param yamlFile Name of the YAML file to parse (without the `.yaml` extension).
     * @return A map of element names to their locators.
     * @throws Error If the YAML file is not found, invalid, or has missing/empty locators.
     */
    public static parseYamlFile(yamlFile: string): Map<string, string> {
        if (!yamlFile || yamlFile.trim().length === 0) {
            throw new Error("YAML file name cannot be null or empty.");
        }

        const resourcePath = path.join('src/data/locators', `${yamlFile}.yaml`);
        try {
            const fileContents = fs.readFileSync(resourcePath, 'utf8');
            if (!fileContents) {
                throw new Error(`YAML file not found or empty: ${resourcePath}`);
            }

            const data = yaml.parse(fileContents) as Record<string, Record<string, any>>;

            if (!data || Object.keys(data).length === 0) {
                throw new Error(`YAML file is empty or invalid: ${resourcePath}`);
            }

            const elements = this.getStringStringMap(data);

            return elements;
        } catch (e) {
            this.logger.error(`Failed to parse YAML file: ${resourcePath} - ${(e as Error).message}`);
            throw new Error(`Failed to parse YAML file: ${resourcePath}`);
        }
    }

    private static getStringStringMap(data: Record<string, Record<string, any>>): Map<string, string> {
        const elements = new Map<string, string>();

        for (const [elementName, elementData] of Object.entries(data)) {
            if (!elementData || !elementData.hasOwnProperty('locator')) {
                throw new Error(`Missing 'locator' field for element: ${elementName}`);
            }

            const locator = elementData['locator'] as string;
            if (!locator || locator.trim().length === 0) {
                throw new Error(`'locator' field is null or empty for element: ${elementName}`);
            }

            elements.set(elementName, locator);
        }

        return elements;
    }
}
