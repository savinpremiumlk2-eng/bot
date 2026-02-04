const pn = require('awesome-phonenumber');

function normalizeNumber(number) {
    const raw = String(number || '').trim();
    const phone = pn(raw.startsWith('+') ? raw : ('+' + raw.replace(/[^0-9]/g, '')));
    if (!phone.isValid()) throw new Error('Invalid phone number');
    return phone.getNumber('e164').replace('+', '');
}

function formatPairingCode(code) {
    if (!code) return code;
    return String(code).match(/.{1,4}/g)?.join('-') || code;
}

async function requestPairingCode(sock, number) {
    const clean = normalizeNumber(number);
    const raw = await sock.requestPairingCode(clean);
    return formatPairingCode(raw);
}

module.exports = {
    normalizeNumber,
    formatPairingCode,
    requestPairingCode
};
