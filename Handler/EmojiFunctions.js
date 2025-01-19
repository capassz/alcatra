const fs = require("fs");
const path = require("path");
let emojiCache = {};

function carregarCache(userid) {
    const filePath = path.join(__dirname, `../DataBaseJson/${userid}/emojis.json`);
    const defaultEmojis = {
        "1": "⚙️",
        "2": "🛒",
        "3": "💳",
        "4": "💰",
        "5": "🏆",
        "6": "🎉",
        "7": "🔍",
        "8": "✅",
        "9": "➡️",
        "10": "🔄",
        "11": "🔑",
        "12": "📦",
        "13": "👥",
        "14": "💸",
        "15": "🤝",
        "16": "🎁",
        "17": "📅",
        "18": "🔗",
        "19": "📰",
        "20": "🔒",
        "21": "❗",
        "22": "❌",
        "23": "💫",
        "24": "⚡",
        "25": "💎",
        "26": "👑",
        "27": "🔔",
        "28": "🪐",
        "29": "📣",
        "30": "🚨",
        "31": "🚪",
        "32": "🆔",
        "33": "✨"
    };

    try {
        const data = fs.readFileSync(filePath, "utf8");
        emojiCache = JSON.parse(data);
    } catch (error) {
        emojiCache = defaultEmojis;
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(defaultEmojis, null, 2), "utf8");
    }
}

// Função para salvar o cache de emojis no arquivo
function salvarCache(userid) {
    const filePath = path.join(__dirname, `../DataBaseJson/${userid}/emojis.json`);
    const data = JSON.stringify(emojiCache, null, 2);
    fs.writeFileSync(filePath, data, "utf8");
}

// Função para encontrar o próximo número disponível no cache
function encontrarProximoNumero() {
    let proximoNumero = 1;
    while (emojiCache[proximoNumero]) {
        proximoNumero++;
    }
    return proximoNumero;
}

async function deletePastEmojis(userid) {
    const filePath = path.join(__dirname, `../DataBaseJson/${userid}/emojis.json`);
    await fs.unlinkSync(filePath);

    // criar agora um novo arquivo com os emojis padrões
    carregarCache(userid);
}

// Função para adicionar emojis ao cache
function adicionarEmoji(emoji, userid) {
    const proximoNumero = encontrarProximoNumero();
    emojiCache[proximoNumero] = emoji;
    salvarCache(userid);
}

function editarEmoji(numero, novoEmoji, userid) {
    if (numero in emojiCache) {
        emojiCache[numero] = novoEmoji;
        salvarCache(userid);
    }
}

function obterEmoji(numero) {
    return emojiCache[numero] || null;
}

function obterTodosEmojis() {
    return Object.entries(emojiCache).map(([numero, emoji]) => `${numero} - ${emoji}`);
}

function verificarEmoji(numero) {
    return numero in emojiCache;
}

module.exports = { obterEmoji, editarEmoji, adicionarEmoji, carregarCache, obterTodosEmojis, verificarEmoji, deletePastEmojis };
