import * as Discord from "discord.js";
import * as fs from "fs";

const client = new Discord.Client();

client.on("ready", () => {});

client.on("raw" as any, async (packet) => {
  try {
    if (
      !(
        packet.t === "MESSAGE_REACTION_ADD" ||
        packet.t === "MESSAGE_REACTION_REMOVE"
      )
    ) {
      return;
    }

    const data: {
      channel_id: string;
      message_id: string;
      emoji: {
        name: string;
      };
      user_id: string;
    } = packet.d;

    if (!(data.emoji.name === "pin" || data.emoji.name === "unpin")) {
      return;
    }

    const channel = await client.channels.fetch(data.channel_id, true);

    if (!(channel instanceof Discord.TextChannel)) {
      return;
    }

    const message = await channel.messages.fetch(data.message_id);

    const unpinReaction = message.reactions.cache
      .array()
      .find((reaction) => reaction.emoji.name === "unpin");

    const unpin =
      unpinReaction !== undefined &&
      (await unpinReaction.fetch()).users.resolveID(message.author) !== null;

    if (data.emoji.name === "pin" && !unpin && !message.pinned) {
      await message.pin();
      return;
    }

    if (unpin && message.pinned) {
      await message.unpin();
      return;
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(
  JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" })).token
);
