# Balegraf

A lightweight Telegraf-inspired framework for building Bale Messenger bots with Node.js and TypeScript.

## Features

- Middleware system (`bot.use`)
- Command handlers (`bot.command`)
- Text matching (`bot.hears`)
- Callback query handlers (`bot.action`)
- Event handlers (`bot.on`)
- Reply and inline keyboards
- Callback query support
- TypeScript support
- Long polling updates
- Familiar Telegraf-style API

## Installation

```bash
npm install @balegraf/balegraf
```

## Quick Start

```ts
import { Balegraf } from "@balegraf/balegraf";

const bot = new Balegraf(process.env.BALE_TOKEN!);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Choose an option",
    Markup.inlineKeyboard(
        [
            [Markup.button.callback("Click Me", "click_me")]
        ]
    ),
  );
});

bot.action("click_me", async (ctx) => {
  await ctx.answerCallbackQuery();

  await ctx.reply("Button clicked!");
});

bot.launch();
```

## Middleware

```ts
bot.use(async (ctx, next) => {
  console.log(ctx.update);
  await next();
});
```

## Commands

```ts
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome!");
});
```

## Text Matching

```ts
bot.hears(/hello|سلام/i, async (ctx) => {
  await ctx.reply("Hi!");
});
```

## Actions

Handle inline keyboard callbacks easily.

```ts
bot.action("like", async (ctx) => {
  await ctx.answerCallbackQuery("Liked!");
});

bot.action("delete", async (ctx) => {
  await ctx.answerCallbackQuery("Deleted!");
});
```

### Regex Actions

```ts
bot.action(/^user:\d+$/, async (ctx) => {
  console.log(ctx.callbackData);
});
```

## Inline Keyboard

```ts
import { Markup } from "@balegraf/balegraf";

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Choose an option",
    Markup.inlineKeyboard([[Markup.button.callback("Click Me", "click_me")]]),
  );
});
```

## Callback Queries

```ts
bot.on("callback_query", async (ctx) => {
  await ctx.answerCallbackQuery();

  await ctx.reply(`Clicked: ${ctx.callbackData}`);
});
```

## Reply Keyboard

```ts
await ctx.reply(
  "Select an option",
  Markup.keyboard([["Profile"], ["Settings"]]),
);
```

## Remove Keyboard

```ts
await ctx.reply("Keyboard removed", Markup.removeKeyboard());
```

## Context

Available properties:

```ts
ctx.update;
ctx.updateType;

ctx.message;
ctx.callbackQuery;

ctx.callbackData;

ctx.user;
ctx.chat;
```

Available methods:

```ts
ctx.reply(...)
ctx.answerCallbackQuery(...)
```

## Requirements

- Node.js 18+

## License

MIT
