import { BaleBot } from '../framework'

async function main() {
    const bot = new BaleBot()

    bot.use(async (ctx, next) => {
        console.log('middleware 1 - update:', ctx.update)
        await next()
    })

    bot.on('message', ctx => {
        console.log('on message handler:', ctx.update)
    })

    // simulate an incoming update
    await bot.handleUpdate({ message: { text: 'سلام' } })
}

main().catch(err => console.error(err))
