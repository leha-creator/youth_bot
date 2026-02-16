import * as fs from "fs";
import path from "path";
import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommands } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { logger } from "./helpers/logger";
import { AdminService } from "./helpers/admin.service";
import { MessageCommands } from "./commands/message.command";
import { ListCommands } from "./commands/list.command";
import { ModCommands } from "./commands/mod.command";
import { UnmodCommands } from "./commands/unmod.command";

const dataDir = process.env.DATA_DIR || '.';

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];
    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));
        this.bot.use(
            new LocalSession({ database: path.join(dataDir, 'sessions.json') }).middleware()
        );
    }

    init() {
        this.commands = [
            new StartCommands(this.bot, adminService),
            new ListCommands(this.bot, adminService),
            new ModCommands(this.bot, adminService),
            new UnmodCommands(this.bot, adminService),
            new MessageCommands(this.bot, adminService),
        ];
        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }
}

const configService = new ConfigService();
const bot = new Bot(configService);
const adminService = AdminService.getInstance();

const start = async () => {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
    } catch {
        // Directory may already exist
    }
    bot.init();
    logger.info('app started');
};

start();