import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

function getDataDir(): string {
    return process.env.DATA_DIR || '.';
}

export class AdminService {
    private static instance: AdminService;
    private admins: number[] = [];
    private path: string;

    private constructor() {
        this.path = path.join(getDataDir(), 'admin.json');
        try {
            const adminsFile = fs.readFileSync(this.path, 'utf8');
            this.admins = JSON.parse(adminsFile);
            logger.info({ path: this.path, count: this.admins.length }, 'AdminService loaded');
        } catch (e) {
            logger.warn({ path: this.path, error: e }, 'AdminService: could not load admin file, using initial admins or empty list');
            const envIds = process.env.ADMIN_IDS;
            this.admins = envIds
                ? envIds.split(',').map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id))
                : [];
            if (this.admins.length > 0) {
                this.saveJson(JSON.stringify(this.admins));
                logger.info({ count: this.admins.length }, 'AdminService: created from ADMIN_IDS');
            }
        }
    }

    static getInstance(): AdminService {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new AdminService();
        return this.instance;
    }

    getAdmins(): number[] {
        return this.admins;
    }

    addAdmin(id: number): void {
        if (this.admins.includes(id)) return;

        this.admins.push(id);
        this.saveJson(JSON.stringify(this.admins));
        logger.info({ adminId: id, action: 'add' }, 'Admin updated');
    }

    deleteAdmin(id: number): void {
        const index = this.admins.indexOf(id);
        if (index !== -1) {
            this.admins.splice(index, 1);
        }

        this.saveJson(JSON.stringify(this.admins));
        logger.info({ adminId: id, action: 'delete' }, 'Admin updated');
    }

    isAdmin(id: number): boolean {
        return this.admins.includes(id);
    }

    private saveJson(json: string): void {
        try {
            fs.writeFileSync(this.path, json, 'utf8');
            logger.info({ path: this.path }, 'AdminService: file saved');
        } catch (err) {
            logger.error({ err, path: this.path }, 'AdminService: failed to save file');
        }
    }
}
