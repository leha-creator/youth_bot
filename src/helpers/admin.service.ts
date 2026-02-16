import * as fs from 'fs';
import { logger } from './logger';

export class AdminService {
    private static instance: AdminService;
    private admins: number[] = [];
    private path = 'admin.json';

    private constructor() {
        try {
            const adminsFile = fs.readFileSync(this.path, 'utf8');
            this.admins = JSON.parse(adminsFile);
            logger.info({ path: this.path, count: this.admins.length }, 'AdminService loaded');
        } catch (e) {
            logger.warn({ path: this.path, error: e }, 'AdminService: could not load admin file, using empty list');
            this.admins = [];
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
