/**IP rotation util - modified from ytdl-core**/

/**
 * Gets random IPv6 Address from a block
 * @param {string} ip the IPv6 block in CIDR-Notation
 * @returns {string}
 */
const getRandomIPv6 = ip => {
  // Start with a fast Regex-Check
  if (!isIPv6(ip)) throw Error("Invalid IPv6 format");
  
  // Split and normalize addr and mask
  const [rawAddr, rawMask] = ip.split("/");
  let base10Mask = parseInt(rawMask);
  if (!base10Mask || base10Mask > 128 || base10Mask < 24) throw Error("Invalid IPv6 subnet");
  
  const base10addr = normalizeIP(rawAddr);
  // Get random addr to pad with
  const randomAddr = new Array(8).fill(1).map(() => Math.floor(Math.random() * 0xffff));

  // Merge base10addr with randomAddr
  const mergedAddr = randomAddr.map((randomItem, idx) => {
    // Calculate the amount of static bits
    const staticBits = Math.min(base10Mask, 16);
    // Adjust the bitmask with the staticBits
    base10Mask -= staticBits;
    // Calculate the bitmask
    const mask = 0xffff - (2 ** (16 - staticBits) - 1);
    // Combine base10addr and random
    return (base10addr[idx] & mask) + (randomItem & (mask ^ 0xffff));
  });

  // Convert to proper IPv6 format with padding
  return mergedAddr.map(x => x.toString(16).padStart(4, '0')).join(":");
};

// IPv6 CIDR regex - allows for compressed notation
const IPV6_REGEX = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))\/(1[0-1]\d|12[0-8]|\d{1,2})$/;

/**
 * Quick check for a valid IPv6
 * @param {string} ip the IPv6 block in CIDR-Notation to test
 * @returns {boolean} true if valid
 */
const isIPv6 = ip => IPV6_REGEX.test(ip);

/**
 * Normalise an IP Address
 * @param {string} ip the IPv6 Addr
 * @returns {number[]} the 8 parts of the IPv6 as Integers
 */
const normalizeIP = ip => {
  // Handle compressed notation
  const expanded = ip.includes('::') 
    ? expandIPv6(ip)
    : ip;
    
  // Split and convert to integers
  const parts = expanded.split(':');
  return parts.map(part => parseInt(part, 16) || 0);
};

/**
 * Expands compressed IPv6 notation
 * @param {string} ip the IPv6 address with possible compression
 * @returns {string} fully expanded IPv6 address
 */
const expandIPv6 = ip => {
  const [left, right] = ip.split('::').map(part => part.split(':'));
  const missing = 8 - (left.length + right.length);
  const middle = Array(missing).fill('0');
  const parts = [...left, ...middle, ...right];
  return parts.map(part => part || '0').join(':');
};

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
    "Client-IP": getRandomIPv6("2001:2::/48"),
  };
}
console.log(getHeaders())

export default getHeaders;