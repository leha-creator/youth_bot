import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { AdminService } from "../helpers/admin.service";
import { logger } from "../helpers/logger";

export class MessageCommands extends Command {
    constructor(bot: Telegraf<IBotContext>, public adminService: AdminService) {
        super(bot);
    }

    handle(): void {
        this.bot.on('text', (ctx) => {
            if (ctx.message.text.startsWith('/')) {
                logger.debug({ text: ctx.message.text }, 'Skipping command message');
                return;
            }
            this.forwardToAdmin(ctx);
            ctx.reply('Получили вопрос, скоро ответим!');
        });
    }

    forwardToAdmin(ctx: IBotContext): void {
        const admins = this.adminService.getAdmins();
        const chatId = ctx.chat?.id;
        const messageId = ctx.message && 'message_id' in ctx.message ? ctx.message.message_id : undefined;
        if (!chatId || messageId === undefined) {
            logger.warn({ chatId, messageId }, 'Cannot forward: missing chat or message id');
            return;
        }
        admins.forEach((adminId) => {
            logger.info({ adminId, chatId }, 'Forwarding message to admin');
            ctx.telegram.copyMessage(adminId, chatId, messageId).catch((err) => {
                logger.error({ err, adminId }, 'Failed to forward message to admin');
            });
        });
    }
}