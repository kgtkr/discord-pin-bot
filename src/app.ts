import * as Discord from "discord.js";
import * as fs from "fs";

const client = new Discord.Client();

client.on("ready", () => {});

client.on("raw" as any, async (packet) => {
  try {
    if (packet.t !== "MESSAGE_REACTION_ADD") {
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

    if (data.emoji.name !== "pin") {
      return;
    }

    const channel = await client.channels.fetch(data.channel_id, true);

    if (!(channel instanceof Discord.TextChannel)) {
      return;
    }

    const message = await channel.messages.fetch(data.message_id);

    const pinReaction = message.reactions.cache
      .array()
      .find((reaction) => reaction.emoji.name === "pin");

    if (pinReaction === undefined) {
      return;
    }

    if (
      pinReaction.count !== null &&
      pinReaction.count >= 3 &&
      !message.pinned
    ) {
      await message.pin();
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(
  JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" })).token
);
