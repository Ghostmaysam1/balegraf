# Balegraf

A lightweight Telegraf-inspired framework for building Bale Messenger bots with Node.js and TypeScript.

## Features

* Telegraf-style API
* Middleware system (`bot.use`)
* Command handlers (`bot.command`)
* Text matching (`bot.hears`)
* Callback query handlers (`bot.action`)
* Event handlers (`bot.on`)
* Inline keyboards
* Reply keyboards
* Keyboard removal
* Callback query support
* Context-based API
* Photo sending support
* File upload support
* TypeScript support
* Long polling updates
* Lightweight and dependency-free core

---

## Installation

```bash
npm install @balegraf/balegraf
```

---

## Quick Start

```ts
import { Balegraf, Markup } from "@balegraf/balegraf";

const bot = new Balegraf(process.env.BALE_TOKEN!);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Choose an option",
    Markup.inlineKeyboard([
      [Markup.button.callback("Click Me", "click_me")]
    ])
  );
});

bot.action("click_me", async (ctx) => {
  await ctx.answerCallbackQuery();

  await ctx.reply("Button clicked!");
});

bot.launch();
```

---

## Middleware

```ts
bot.use(async (ctx, next) => {
  console.log(ctx.update);

  await next();
});
```

---

## Commands

```ts
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome!");
});
```

Multiple commands:

```ts
bot.command(["start", "help"], async (ctx) => {
  await ctx.reply("Available commands...");
});
```

---

## Text Matching

String matching:

```ts
bot.hears("hello", async (ctx) => {
  await ctx.reply("Hi!");
});
```

Regex matching:

```ts
bot.hears(/hello|سلام/i, async (ctx) => {
  await ctx.reply("Hi!");
});
```

---

## Actions

Handle callback queries from inline keyboards.

```ts
bot.action("like", async (ctx) => {
  await ctx.answerCallbackQuery("Liked!");
});

bot.action("delete", async (ctx) => {
  await ctx.answerCallbackQuery("Deleted!");
});
```

Regex actions:

```ts
bot.action(/^user:\d+$/, async (ctx) => {
  console.log(ctx.callbackData);
});
```

---

## Event Handlers

```ts
bot.on("message", async (ctx) => {
  console.log(ctx.message);
});
```

```ts
bot.on("callback_query", async (ctx) => {
  console.log(ctx.callbackQuery);
});
```

---

## Inline Keyboard

```ts
import { Markup } from "@balegraf/balegraf";

await ctx.reply(
  "Choose an option",
  Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "Click Me",
        "click_me"
      )
    ]
  ])
);
```

---

## Reply Keyboard

```ts
await ctx.reply(
  "Choose an option",
  Markup.keyboard([
    ["Profile"],
    ["Settings"]
  ])
);
```

---

## Remove Keyboard

```ts
await ctx.reply(
  "Keyboard removed",
  Markup.removeKeyboard()
);
```

---

## Sending Photos

Using a local file:

```ts
import { InputFile } from "@balegraf/balegraf";

await ctx.replyWithPhoto(
  InputFile.fromPath("./photo.jpg")
);
```

With caption:

```ts
await ctx.replyWithPhoto(
  InputFile.fromPath("./photo.jpg"),
  {
    caption: "Example photo"
  }
);
```

With inline keyboard:

```ts
await ctx.replyWithPhoto(
  InputFile.fromPath("./photo.jpg"),
  {
    caption: "Choose an option",
    replyMarkup: Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Like",
          "like"
        )
      ]
    ])
  }
);
```

---

## InputFile

Create files from different sources.

### Local File

```ts
InputFile.fromPath("./photo.jpg");
```

### File ID

```ts
InputFile.fromFileId(fileId);
```

### URL

```ts
InputFile.fromUrl(
  "https://example.com/photo.jpg"
);
```

### Buffer

```ts
InputFile.fromBuffer(
  buffer,
  "photo.jpg"
);
```

### Stream

```ts
InputFile.fromStream(
  stream,
  "photo.jpg"
);
```

---

## Context

### Properties

```ts
ctx.update
ctx.updateType

ctx.message
ctx.callbackQuery

ctx.callbackData

ctx.user
ctx.chat
```

### Methods

```ts
ctx.reply(...)
ctx.replyWithPhoto(...)
ctx.answerCallbackQuery(...)
```

---

## Update Types

Supported update types:

```ts
message
edited_message
callback_query
pre_checkout_query
```

---

## Requirements

* Node.js 20+

---

## License

MIT
