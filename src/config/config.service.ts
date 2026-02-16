import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;

    constructor() {
        const { error, parsed } = config();
        if (error) {
            // В Docker .env не копируется в образ, переменные приходят через env_file в process.env
            this.config = {};
        } else if (!parsed) {
            this.config = {};
        } else {
            this.config = parsed;
        }
    }

    get(key: string): string {
        const res = this.config[key] ?? process.env[key];
        if (!res) {
            throw new Error(`Нет такого ключа: ${key}`);
        }
        return res;
    }

    getOptional(key: string, defaultValue: string): string {
        const res = this.config[key] ?? process.env[key];
        return res ?? defaultValue;
    }
}
