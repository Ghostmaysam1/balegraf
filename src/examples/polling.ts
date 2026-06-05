import { BaleBot } from '../framework'

async function main() {
    const token = process.env.BALE_TOKEN
    if (!token) {
        throw new Error('Set BALE_TOKEN environment variable before running')
    }

    const bot = new BaleBot({ token })

    bot.use(async (ctx, next) => {
        console.log('Incoming update:', ctx.update)
        await next()
    })

    bot.command('start', async (ctx) => {
        await ctx.reply('سلام! خوش آمدید.')
    })

    bot.hears(/سلام|hello/i, async (ctx) => {
        await ctx.reply('سلام! چطور می‌تونم کمکتون کنم؟')
    })

    bot.on('message', async (ctx) => {
        console.log('Message handler:', ctx.update.message.text)
    })

    console.log('Launching BaleBot polling...')
    await bot.launch({ polling: { intervalMs: 1000, timeout: 20 } })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
