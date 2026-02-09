export const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Converts a UUID to a shortened Base62 string.
 * This implementation treats the UUID as a 128-bit integer and encodes it to Base62.
 * Note: It assumes standard UUID format (with or without dashes).
 */
export function uuidToShort(uuid: string): string {
    if (!uuid) return '';

    // Remove dashes and validate hex
    const hex = uuid.replace(/-/g, '');
    if (!/^[0-9a-fA-F]{32}$/.test(hex)) {
        // If not a valid UUID hex, return original (fallback)
        console.warn('Invalid UUID provided to uuidToShort:', uuid);
        return uuid;
    }

    try {
        let bn = BigInt('0x' + hex);
        let short = '';
        const base = BigInt(62);

        if (bn === BigInt(0)) return '0';

        while (bn > 0) {
            const remainder = bn % base;
            short = BASE62[Number(remainder)] + short;
            bn = bn / base;
        }
        return short;
    } catch (e) {
        console.error('Error encoding UUID:', e);
        return uuid;
    }
}

/**
 * Converts a shortened Base62 string back to a UUID.
 * Returns the original string if it looks like a UUID already.
 */
export function shortToUuid(short: string): string {
    if (!short) return '';

    // If it's already a UUID (36 chars with dashes or 32 hex), return it
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(short)) {
        return short;
    }

    try {
        const base = BigInt(62);
        let bn = BigInt(0);

        for (let i = 0; i < short.length; i++) {
            const char = short[i];
            const index = BASE62.indexOf(char);
            if (index === -1) {
                // If invalid char found, return original (might be a slug or ID)
                return short;
            }
            bn = bn * base + BigInt(index);
        }

        // Convert to hex and pad to 32 chars
        let hex = bn.toString(16).padStart(32, '0');

        // Format as UUID: 8-4-4-4-12
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } catch (e) {
        console.error('Error decoding short UUID:', e);
        return short;
    }
}
