/**
 * 将 Uint8Array 片段转为空格分隔的十六进制字符串，如 "c0 a8 01 01"
 */
export function toHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
}

/**
 * 将 Uint8Array 片段转为空格分隔的二进制字符串，如 "11000000 10101000"
 */
export function toBin(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

/**
 * 将 Uint8Array 片段（大端序）转为无符号整数
 * 支持最多 6 字节（48-bit）
 */
export function toUint(bytes) {
  let val = 0;
  for (const b of bytes) val = val * 256 + b;
  return val;
}

/**
 * 将整数格式化为带前缀的十六进制，如 toHexStr(256, 4) → "0x0100"
 */
export function toHexStr(val, digits = 4) {
  return '0x' + val.toString(16).toUpperCase().padStart(digits, '0');
}
