/**
 * 解析 Wireshark "Copy as Hex Dump" 格式的文本，提取字节序列。
 *
 * 支持格式：
 *   0000   14 30 04 7d 8b 3c 50 eb f8 4a a8 62 08 00 45 00  .0.}.<P..J.b..E.
 *
 * 策略：每行去掉行首的偏移量前缀（4~8位十六进制+空白），
 * 然后从剩余内容里提取所有恰好 2 个十六进制字符的 token。
 * ASCII 可读字符区因为不全符合 /^[0-9a-f]{2}$/ 会被自然过滤。
 *
 * @param {string} text
 * @returns {Uint8Array}
 * @throws {Error} 当输入为空或无法解析任何字节时
 */
export function parseHexDump(text) {
  if (!text || !text.trim()) {
    throw new Error('输入为空，请粘贴 Wireshark Hex Dump 内容');
  }

  const bytes = [];

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    // 去掉行首偏移量（形如 "0000   " 或 "00000000  "）
    const withoutOffset = line.replace(/^[0-9a-f]{1,8}\s+/i, '');

    for (const token of withoutOffset.split(/\s+/)) {
      if (/^[0-9a-f]{2}$/i.test(token)) {
        bytes.push(parseInt(token, 16));
      }
    }
  }

  if (bytes.length === 0) {
    throw new Error('未能从输入中解析出任何字节，请确认格式为 Wireshark Hex Dump');
  }

  return new Uint8Array(bytes);
}
