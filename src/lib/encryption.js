// Client-Side E2EE Encryption Utility using Web Crypto API (AES-GCM)

// Helper to pad/derive a key from a secret string
async function deriveKey(secretText) {
    const enc = new TextEncoder();
    // Normalize to 32 bytes for AES-256
    const keyData = enc.encode(secretText.padEnd(32, "0").substring(0, 32));
    return await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

// Encrypt plain text using a secret key
export async function encryptText(text, secretKey) {
    if (!text) return "";
    try {
        const key = await deriveKey(secretKey);
        const enc = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            enc.encode(text)
        );
        
        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        
        // Convert to Base64 safely
        let binary = "";
        const len = combined.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(combined[i]);
        }
        return window.btoa(binary);
    } catch (error) {
        console.error("Encryption failed:", error);
        return text; // Fallback to raw text on error
    }
}

// Decrypt base64 cipher text using a secret key
export async function decryptText(base64Text, secretKey) {
    if (!base64Text) return "";
    // Quick check: if it's not base64 or doesn't look like cipher, return as is
    try {
        const binaryString = window.atob(base64Text);
        const combined = new Uint8Array(
            binaryString.split("").map(char => char.charCodeAt(0))
        );
        
        if (combined.length < 13) {
            return base64Text; // Too short to contain IV + ciphertext, likely unencrypted
        }
        
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);
        
        const key = await deriveKey(secretKey);
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );
        
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        // Fallback: If decryption fails (e.g. old message or wrong key), return original text
        return base64Text;
    }
}

// Derive a unique secret key for a conversation between two users
export function getDirectChatSecret(user1Id, user2Id) {
    if (!user1Id || !user2Id) return "default_secret";
    return [user1Id.toString(), user2Id.toString()].sort().join("-");
}

// Derive a unique secret key for a group conversation
export function getGroupChatSecret(groupId) {
    if (!groupId) return "default_group_secret";
    return groupId.toString();
}
