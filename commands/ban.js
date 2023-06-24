const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { db } = require("../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from using the modmail system.")
    .addUserOption((o) =>
      o.setName("user").setDescription("The user to ban.").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("The reason of the ban.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user", true);

    const reason =
      interaction.options.getString("reason") || "No reason was provided";

    if (db.has(user.id)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`That user is already banned.`)
            .setColor("Red"),
        ],
        ephemeral: true,
      });

      return;
    }

    db.set(user.id, reason);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `That user has been successfully banned.\n> ${correctReason}`
          )
          .setColor("Green"),
      ],
      ephemeral: true,
    });
  },
};
