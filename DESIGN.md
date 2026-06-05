# طراحی API برای فریم‌ورک شبیه Telegraf برای پیام‌رسان بله

هدف: یک API ساده و آشنا برای توسعه‌دهندگان Node.js/TypeScript که ساخت ربات برای پیام‌رسان بله را مشابه Telegraf آسان کند.

مفاهیم کلیدی:

- `BaleBot` : کلاس اصلی که ربات را نگهداری می‌کند.
- `Context` : شیء زمینه‌ای که اطلاعات پیام، کاربر و ابزارهای کمکی را در خود دارد.
- Middleware: تابع‌های async با امضای `(ctx, next) => Promise<void>` که درخواست‌ها را پردازش می‌کنند.

API پیشنهادی (مثال استفاده):

```ts
import { BaleBot } from "./src/framework";

const bot = new BaleBot({ token: process.env.BALE_TOKEN });

bot.use(async (ctx, next) => {
  console.log("incoming", ctx.update);
  await next();
});

bot.command("start", async (ctx) => {
  await ctx.reply("سلام!");
});

bot.hears(/hello/i, (ctx) => ctx.reply("Hello!"));

bot.on("message", (ctx) => console.log("message:", ctx.update));

bot.launch();
```

هستهٔ رفتارها:

- `use(mw)` : ثبت middleware عمومی
- `command(name, handler)` : ثبت هندلر برای دستورها
- `hears(pattern, handler)` : هندلرهایی که بر اساس regex یا متن اجرا می‌شوند
- `on(event, handler)` : هندلر برای نوع‌های مختلف آپدیت
- `launch()` : شروع دریافت آپدیت‌ها (polling یا webhook)

نوع‌ها (خلاصه):

- `Context` : `{ update: any, chat: any, from: any, reply(text) }`
- `Middleware` : `(ctx: Context, next: () => Promise<void>) => Promise<void>`

فاز بعدی: اسکافولد کردن ساختار پروژه و فایل‌های اولیه (TypeScript)، سپس پیاده‌سازی موتور middleware.
