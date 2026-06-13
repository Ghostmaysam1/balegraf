<header>

<div align="center">
<img src="docs/assets/logo.svg" alt="logo" height="90" align="center">
<h1 align="center">balegraf.js</h1>

<p>Modern Bale Bot API framework for Node.js</p>

<a href="https://github.com/Ghostmaysam1/balegraf">
	<img src="https://img.shields.io/github/package-json/v/Ghostmaysam1/balegraf
  " alt="Version" />
</a>
<a href="https://packagephobia.com/result?p=@balegraf/balegraf@0.9.2">
	<img src="https://flat.badgen.net/packagephobia/install/@balegraf/balegraf@0.9.2" alt="install size" />
</a>
<a href="https://github.com/telegraf/telegraf">
	<img src="https://img.shields.io/github/languages/top/Ghostmaysam1/balegraf?style=flat-square&logo=github" alt="GitHub top language" />
</a>
</div>

</header>

## Features

- Telegraf-style API
- Middleware system (`bot.use`)
- Command handlers (`bot.command`)
- Text matching (`bot.hears`)
- Callback query handlers (`bot.action`)
- Event handlers (`bot.on`)
- Inline keyboards
- Reply keyboards
- Keyboard removal
- Callback query support
- Message editing support
- Message deletion support
- Photo sending support
- File upload support
- TypeScript support
- Long polling updates
- Lightweight core

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
    Markup.inlineKeyboard([[Markup.button.callback("Click Me", "click_me")]]),
  );
});

bot.action("click_me", async (ctx) => {
  await ctx.answerCallbackQuery();

  await ctx.reply("Button clicked!");
});

bot.launch();
```

---

## Editing Inline Messages

```ts
bot.action("edit", async (ctx) => {
  await ctx.editMessageText(
    "Message updated",
    Markup.inlineKeyboard([[Markup.button.callback("Done", "done")]]),
  );

  await ctx.answerCallbackQuery();
});
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
  await ctx.answerCallbackQuery("You clicked the button!", true);
  await ctx.reply(JSON.stringify(ctx.callbackQuery));
});
```

> `bot.on('callback_query', ...)` now receives a `CallbackQueryContext`, so `ctx.answerCallbackQuery()` is available directly.

---

## Inline Keyboard

```ts
import { Markup } from "@balegraf/balegraf";

await ctx.reply(
  "Choose an option",
  Markup.inlineKeyboard([
    [Markup.button.callback("Click Me", "click_me")],
    [Markup.button.text("Just a Button")],
  ]),
);
```

> `Markup.inlineKeyboard` now accepts plain text buttons via `Markup.button.text()`.

---

## Reply Keyboard

```ts
await ctx.reply(
  "Choose an option",
  Markup.keyboard([["Profile", "Settings"], ["Help"]]),
);
```

> `Markup.keyboard` accepts string buttons directly and converts them to keyboard buttons.

---

## Remove Keyboard

```ts
await ctx.reply("Keyboard removed", Markup.removeKeyboard());
```

---

## Sending Photos

Using a local file:

```ts
import { InputFile } from "@balegraf/balegraf";

await ctx.replyWithPhoto(InputFile.fromPath("./photo.jpg"));
```

With caption:

```ts
await ctx.replyWithPhoto(InputFile.fromPath("./photo.jpg"), {
  caption: "Example photo",
});
```

With inline keyboard:

```ts
await ctx.replyWithPhoto(InputFile.fromPath("./photo.jpg"), {
  caption: "Choose an option",
  replyMarkup: Markup.inlineKeyboard([
    [Markup.button.callback("Like", "like")],
  ]),
});
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
InputFile.fromUrl("https://example.com/photo.jpg");
```

### Buffer

```ts
InputFile.fromBuffer(buffer, "photo.jpg");
```

### Stream

```ts
InputFile.fromStream(fs.createReadStream("./photo.jpg"), "photo.jpg");
```

---

## Editing Messages

### Edit Text

```ts
await ctx.editMessageText("Updated text");
```

With inline keyboard:

```ts
await ctx.editMessageText(
  "Updated text",
  Markup.inlineKeyboard([[Markup.button.callback("Refresh", "refresh")]]),
);
```

### Edit Caption

```ts
await ctx.editMessageCaption(
  "Updated caption",
  ctx.callbackQuery.message.reply_markup,
);
```

### Edit Reply Markup

```ts
await ctx.editMessageReplyMarkup(
  Markup.inlineKeyboard([[Markup.button.callback("New Button", "new_button")]]),
);
```

---

## Deleting Messages

```ts
await ctx.deleteMessage();
```

---

## Context

### Properties

```ts
ctx.update;
ctx.updateType;

ctx.message;
ctx.callbackQuery;

ctx.callbackData;

ctx.user;
ctx.chat;
```

### Methods

```ts
ctx.reply(...)
ctx.replyWithPhoto(...)

ctx.answerCallbackQuery(...)

ctx.editMessageText(...)
ctx.editMessageCaption(...)
ctx.editMessageReplyMarkup(...)

ctx.deleteMessage()
```

---

## Update Types

Supported update types:

```ts
message;
edited_message;
callback_query;
pre_checkout_query;
```

---

> Note:
> `editMessageText`, `editMessageCaption`,
> `editMessageReplyMarkup`, and `deleteMessage`
> operate on the current message associated with the
> incoming update, similar to Telegraf.

## Requirements

- Node.js 20+

---

## License

MIT
