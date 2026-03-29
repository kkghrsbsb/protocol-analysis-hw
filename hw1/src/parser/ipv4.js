import { toHex, toBin, toUint, toHexStr } from './utils.js';

const PROTOCOL_NAMES = {
  1:  'ICMP',
  2:  'IGMP',
  6:  'TCP',
  17: 'UDP',
  47: 'GRE',
  89: 'OSPF',
};

function ipStr(bytes) {
  return Array.from(bytes).join('.');
}

/**
 * 解析 IPv4 头部（最小 20 字节，IHL 决定实际长度）
 * @param {Uint8Array} buf  从 IP 头开始的字节
 * @returns {{ fields: Field[], payload: Uint8Array, protocol: number }}
 */
export function parseIPv4(buf) {
  if (buf.length < 20) {
    throw new Error(`IPv4 头部不完整：需要至少 20 字节，实际 ${buf.length} 字节`);
  }

  const versionIHL = buf[0];
  const version    = (versionIHL >> 4) & 0xF;
  const ihl        = versionIHL & 0xF;
  const headerLen  = ihl * 4;

  if (version !== 4) {
    throw new Error(`不是 IPv4 报文（Version 字段 = ${version}）`);
  }
  if (ihl < 5) {
    throw new Error(`IHL 值非法：${ihl}（最小为 5）`);
  }
  if (buf.length < headerLen) {
    throw new Error(`IPv4 头部不完整：IHL 指示 ${headerLen} 字节，实际仅 ${buf.length} 字节`);
  }

  const dscpEcn  = buf[1];
  const dscp     = (dscpEcn >> 2) & 0x3F;
  const ecn      = dscpEcn & 0x3;

  const totalLen = toUint(buf.slice(2, 4));
  const id       = toUint(buf.slice(4, 6));

  const flagsFrag   = toUint(buf.slice(6, 8));
  const flagReserved = (flagsFrag >> 15) & 1;
  const flagDF       = (flagsFrag >> 14) & 1;
  const flagMF       = (flagsFrag >> 13) & 1;
  const fragOffset   = flagsFrag & 0x1FFF;

  const ttl       = buf[8];
  const protocol  = buf[9];
  const checksum  = toUint(buf.slice(10, 12));

  const fields = [
    {
      name:  'Version + IHL',
      hex:   toHex(buf.slice(0, 1)),
      bin:   toBin(buf.slice(0, 1)),
      value: `Version = ${version},  IHL = ${ihl}（头部长度 ${headerLen} 字节）`,
    },
    {
      name:  'DSCP + ECN',
      hex:   toHex(buf.slice(1, 2)),
      bin:   toBin(buf.slice(1, 2)),
      value: `DSCP = ${dscp},  ECN = ${ecn}`,
    },
    {
      name:  '总长度 (Total Length)',
      hex:   toHex(buf.slice(2, 4)),
      bin:   toBin(buf.slice(2, 4)),
      value: `${totalLen} 字节`,
    },
    {
      name:  '标识 (Identification)',
      hex:   toHex(buf.slice(4, 6)),
      bin:   toBin(buf.slice(4, 6)),
      value: toHexStr(id, 4),
    },
    {
      name:  '标志 + 片偏移 (Flags + Fragment Offset)',
      hex:   toHex(buf.slice(6, 8)),
      bin:   toBin(buf.slice(6, 8)),
      value: `Reserved = ${flagReserved},  DF = ${flagDF},  MF = ${flagMF},  片偏移 = ${fragOffset}`,
    },
    {
      name:  'TTL',
      hex:   toHex(buf.slice(8, 9)),
      bin:   toBin(buf.slice(8, 9)),
      value: `${ttl}`,
    },
    {
      name:  '协议 (Protocol)',
      hex:   toHex(buf.slice(9, 10)),
      bin:   toBin(buf.slice(9, 10)),
      value: `${protocol}  (${PROTOCOL_NAMES[protocol] ?? '未知'})`,
    },
    {
      name:  '头部校验和 (Header Checksum)',
      hex:   toHex(buf.slice(10, 12)),
      bin:   toBin(buf.slice(10, 12)),
      value: toHexStr(checksum, 4),
    },
    {
      name:  '源 IP 地址',
      hex:   toHex(buf.slice(12, 16)),
      bin:   toBin(buf.slice(12, 16)),
      value: ipStr(buf.slice(12, 16)),
    },
    {
      name:  '目的 IP 地址',
      hex:   toHex(buf.slice(16, 20)),
      bin:   toBin(buf.slice(16, 20)),
      value: ipStr(buf.slice(16, 20)),
    },
  ];

  // Options（IHL > 5 时存在）
  if (ihl > 5) {
    const opts = buf.slice(20, headerLen);
    fields.push({
      name:  'Options（跳过详细解析）',
      hex:   toHex(opts),
      bin:   toBin(opts),
      value: `${opts.length} 字节`,
    });
  }

  return { fields, payload: buf.slice(headerLen), protocol };
}
