# balegraf

Telegraf-like minimal framework scaffold for Bale messenger.

## Features

- Middleware pipeline با `bot.use`
- هندلر `command(name, handler)` برای دستورها
- هندلر `hears(pattern, handler)` برای تشخیص متن یا Regex
- هندلر عمومی `on('message', handler)` و `on('callback_query', handler)`
- اجرای polling ساده با `bot.launch()`
- ارسال پیام از طریق `ctx.reply(text)`

## نصب

```bash
npm install
```


## نمونه کد

```js
const { Balegraf, Markup } = require("@balegraf/balegraf");

const bot = new Balegraf(process.env.BALE_TOKEN);

bot.use(async (ctx, next) => {
    console.log("update", ctx.update);
    await next();
});

bot.command("start", async (ctx) => {
    await ctx.reply("سلام!", Markup.inlineKeyboard(
        [
            [Markup.button.callback("دکمه 1", "button1")],
            [Markup.button.callback("دکمه 2", "button2")]
        ]
    ));
});

bot.on("callback_query", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(`شما دکمه ${ctx.callbackData} را زدید!`);
})

bot.hears(/سلام|hello/i, async (ctx) => {
    await ctx.reply("سلام!");
});

bot.launch();
```

## نیازمندی

- Node.js 18 یا بالاتر

## توضیحات

- `bot.launch()` polling بله را شروع می‌کند.