import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { AdminService } from "../helpers/admin.service";
import { logger } from "../helpers/logger";

export class MessageCommnds extends Command {
    constructor(bot: Telegraf<IBotContext>, public adminService: AdminService) {
        super(bot);
    }

    handle(): void {
        this.bot.on('message', (ctx) => {
            this.forwardToAdmin(ctx);
        });
    }

    forwardToAdmin(ctx: IBotContext) {
        const admins = this.adminService.getAdmins();
        console.log(ctx);
        admins.forEach(id => {
            ctx.telegram.sendMessage(id, 'Новый вопрос:');
            ctx.telegram.copyMessage(id, ctx.message.from.id, ctx.message.message_id);
        });
    };
}