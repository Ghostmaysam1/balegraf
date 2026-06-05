import { BaleBot } from '../framework'

async function main() {
    const bot = new BaleBot()

    bot.use(async (ctx, next) => {
        console.log('middleware 1 - update:', ctx.update)
        await next()
    })

    bot.command('start', async (ctx) => {
        await ctx.reply('سلام! این یک تست محلی است.')
    })

    bot.hears('سلام', async (ctx) => {
        await ctx.reply('سلام بر شما!')
    })

    bot.on('message', ctx => {
        console.log('on message handler:', ctx.update)
    })

    // simulate an incoming update
    await bot.handleUpdate({ message: { text: 'سلام' } })
    await bot.handleUpdate({ message: { text: '/start' } })
}

main().catch(err => console.error(err))
