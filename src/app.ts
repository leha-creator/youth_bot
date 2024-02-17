import { Telegraf } from "telegraf";
import { IConfigServise } from "./config/config.interface";
import { ConfigServise } from "./config/config.servise";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommnds } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { logger } from "./helpers/logger";
import { AdminService } from "./helpers/admin.service";
import { MessageCommnds } from "./commands/message.command";

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];
    constructor(private readonly configServise: IConfigServise) {
        this.bot = new Telegraf<IBotContext>(this.configServise.get('TOKEN'));
        this.bot.use(
            new LocalSession({ database: 'sessions.json' }).middleware()
        );
    }

    init() {
        this.commands = [new StartCommnds(this.bot, adminService), new MessageCommnds(this.bot, adminService)];
        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }
}

const configServise = new ConfigServise();
const bot = new Bot(configServise);
const adminService = AdminService.getInstance();

const start = async () => {
    bot.init();
    logger.info('app started');
};

start();