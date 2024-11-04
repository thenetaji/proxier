function generateIp(version = 4, count = 1) {
    /**
     * Generate random IP addresses.
     * 
     * @param {number} version - IP version (4 or 6). Defaults to 4.
     * @param {number} count - Number of IPs to generate. Defaults to 1.
     * @returns {string | string[]} - Generated IP address(es)
     */
    if (![4, 6].includes(version)) {
        throw new Error("IP version must be 4 or 6");
    }

    if (count < 1) {
        throw new Error("Count must be at least 1");
    }

    const ips = [];

    for (let i = 0; i < count; i++) {
        let ip;
        
        if (version === 4) {
            // Generate 4 octets for IPv4
            ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");
        } else {
            // Generate 8 groups of 4 hexadecimal digits for IPv6
            const hexDigits = "0123456789abcdef";
            ip = Array.from({ length: 8 }, () => 
                Array.from({ length: 4 }, () => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join("")
            ).join(":");
        }

        ips.push(ip);
    }

    return count > 1 ? ips : ips[0];
}

// Example usage:
// Generate one IPv4 address
console.log("Random IPv4:", generateIp());

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

function getHeaders() {
  return {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    Connection: "keep-alive",
    "User-Agent": getRandomUserAgent(),
    "Client-IP": generateIp()
  };
}

export default getHeaders;