import * as Discord from "discord.js";
import * as fs from "fs";

const client = new Discord.Client();

client.on("ready", () => {});

client.on("messageReactionAdd", async (msgReaction) => {
  try {
    const unpinReaction = msgReaction.message.reactions.cache
      .array()
      .find((reaction) => reaction.emoji.name === "unpin");

    const unpin =
      ((await unpinReaction?.fetch())?.users.resolve(
        msgReaction.message.author
      ) ?? null) !== null;

    if (
      msgReaction.emoji.name === "pin" &&
      !unpin &&
      !msgReaction.message.pinned
    ) {
      await msgReaction.message.pin();
      return;
    }

    if (unpin && msgReaction.message.pinned) {
      await msgReaction.message.unpin();

      return;
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(
  JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" })).token
);
