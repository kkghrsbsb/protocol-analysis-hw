import { toHex, toBin, toUint, toHexStr } from './utils.js';

// 标志位名称，从高位到低位（bit 8 → bit 0）
const FLAG_BITS = [
  { bit: 8, name: 'NS'  },
  { bit: 7, name: 'CWR' },
  { bit: 6, name: 'ECE' },
  { bit: 5, name: 'URG' },
  { bit: 4, name: 'ACK' },
  { bit: 3, name: 'PSH' },
  { bit: 2, name: 'RST' },
  { bit: 1, name: 'SYN' },
  { bit: 0, name: 'FIN' },
];

/**
 * 解析 TCP 头部（最小 20 字节，Data Offset 决定实际长度）
 * @param {Uint8Array} buf  从 TCP 头开始的字节
 * @returns {{ fields: Field[] }}
 */
export function parseTCP(buf) {
  if (buf.length < 20) {
    throw new Error(`TCP 头部不完整：需要至少 20 字节，实际 ${buf.length} 字节`);
  }

  const srcPort  = toUint(buf.slice(0, 2));
  const dstPort  = toUint(buf.slice(2, 4));
  const seq      = toUint(buf.slice(4, 8));
  const ack      = toUint(buf.slice(8, 12));

  const dataOffsetByte = buf[12];
  const dataOffset     = (dataOffsetByte >> 4) & 0xF;
  const tcpHeaderLen   = dataOffset * 4;

  const flagsRaw  = toUint(buf.slice(12, 14));
  const flagsBits = flagsRaw & 0x1FF;
  const activeFlags = FLAG_BITS
    .filter(f => (flagsBits >> f.bit) & 1)
    .map(f => f.name);

  const windowSize = toUint(buf.slice(14, 16));
  const checksum   = toUint(buf.slice(16, 18));
  const urgPtr     = toUint(buf.slice(18, 20));

  const fields = [
    {
      name:  '源端口 (Source Port)',
      hex:   toHex(buf.slice(0, 2)),
      bin:   toBin(buf.slice(0, 2)),
      value: `${srcPort}`,
    },
    {
      name:  '目的端口 (Destination Port)',
      hex:   toHex(buf.slice(2, 4)),
      bin:   toBin(buf.slice(2, 4)),
      value: `${dstPort}`,
    },
    {
      name:  '序列号 (Sequence Number)',
      hex:   toHex(buf.slice(4, 8)),
      bin:   toBin(buf.slice(4, 8)),
      value: `${seq}`,
    },
    {
      name:  '确认号 (Acknowledgment Number)',
      hex:   toHex(buf.slice(8, 12)),
      bin:   toBin(buf.slice(8, 12)),
      value: `${ack}`,
    },
    {
      name:  'Data Offset + Reserved + Flags',
      hex:   toHex(buf.slice(12, 14)),
      bin:   toBin(buf.slice(12, 14)),
      value: `Data Offset = ${dataOffset}（头部 ${tcpHeaderLen} 字节），Flags: ${activeFlags.length ? activeFlags.join(' | ') : '（无）'}`,
    },
    {
      name:  '窗口大小 (Window Size)',
      hex:   toHex(buf.slice(14, 16)),
      bin:   toBin(buf.slice(14, 16)),
      value: `${windowSize}`,
    },
    {
      name:  '校验和 (Checksum)',
      hex:   toHex(buf.slice(16, 18)),
      bin:   toBin(buf.slice(16, 18)),
      value: toHexStr(checksum, 4),
    },
    {
      name:  '紧急指针 (Urgent Pointer)',
      hex:   toHex(buf.slice(18, 20)),
      bin:   toBin(buf.slice(18, 20)),
      value: `${urgPtr}`,
    },
  ];

  // Options（Data Offset > 5 时存在）
  if (dataOffset > 5 && buf.length >= tcpHeaderLen) {
    const opts = buf.slice(20, tcpHeaderLen);
    fields.push({
      name:  'Options（跳过详细解析）',
      hex:   toHex(opts),
      bin:   toBin(opts),
      value: `${opts.length} 字节`,
    });
  }

  return { fields };
}
