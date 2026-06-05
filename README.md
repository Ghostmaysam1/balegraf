# mardomvasl-bale

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

## اجرای مثال ساده

```bash
npm run example
```

## اجرای polling واقعی

```bash
export BALE_TOKEN=your-token-here
npm run dev
```

## ساخت نهایی

```bash
npm run build
```

## نمونه کد

```ts
import { BaleBot } from "./src/framework";

const bot = new BaleBot({ token: process.env.BALE_TOKEN });

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

bot.on("message", async (ctx) => {
  console.log("received message");
});

bot.launch();
```

## نیازمندی

- Node.js 18 یا بالاتر

## توضیحات

- `bot.launch()` polling بله را شروع می‌کند.
- `ctx.reply(text)` به `sendMessage` بله ترجمه می‌شود.
- اگر بخواهید webhook اضافه کنیم، بعداً می‌توان `launch()` را توسعه داد.
