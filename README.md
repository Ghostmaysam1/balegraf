# balegraf

Telegraf-like minimal framework scaffold for Bale messenger.

## Features

- Middleware pipeline با `bot.use`
- هندلر `command(name, handler)` برای دستورها
- هندلر `hears(pattern, handler)` برای تشخیص متن یا Regex
- هندلر عمومی `on('message', handler)` و `on('update', handler)`
- اجرای polling ساده با `bot.launch()`
- ارسال پیام از طریق `ctx.reply(text)`

## نصب

```bash
npm install
```


## نمونه کد

```ts
import { Baler } from "baler";

const bot = new Baler(process.env.BALE_TOKEN);

bot.use(async (ctx, next) => {
  console.log("update", ctx.update);
  await next();
});

bot.command("start", async (ctx) => {
  await ctx.reply("سلام!");
});

bot.hears(/سلام|hello/i, async (ctx) => {
  await ctx.reply("سلام!");
});

bot.launch();
```

## نیازمندی

- Node.js 18 یا بالاتر

## توضیحات

- `bot.launch()` polling بله را شروع می‌کند.