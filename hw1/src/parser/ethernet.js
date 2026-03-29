import { toHex, toBin, toUint, toHexStr } from './utils.js';

const ETHERTYPE_NAMES = {
  0x0800: 'IPv4',
  0x0806: 'ARP',
  0x86DD: 'IPv6',
  0x8100: 'VLAN-tagged (802.1Q)',
  0x0842: 'Wake-on-LAN',
};

function macStr(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
}

/**
 * 解析 Ethernet II 帧头（14 字节）
 * @param {Uint8Array} buf  完整报文字节（从以太帧开始）
 * @returns {{ fields: Field[], payload: Uint8Array, etherType: number }}
 */
export function parseEthernet(buf) {
  if (buf.length < 14) {
    throw new Error(`Ethernet 帧不完整：需要至少 14 字节，实际 ${buf.length} 字节`);
  }

  const dstMac   = buf.slice(0, 6);
  const srcMac   = buf.slice(6, 12);
  const ethType  = buf.slice(12, 14);
  const typeVal  = toUint(ethType);

  const fields = [
    {
      name:  '目的 MAC 地址',
      hex:   toHex(dstMac),
      bin:   toBin(dstMac),
      value: macStr(dstMac),
    },
    {
      name:  '源 MAC 地址',
      hex:   toHex(srcMac),
      bin:   toBin(srcMac),
      value: macStr(srcMac),
    },
    {
      name:  'EtherType',
      hex:   toHex(ethType),
      bin:   toBin(ethType),
      value: `${toHexStr(typeVal, 4)}  (${ETHERTYPE_NAMES[typeVal] ?? '未知'})`,
    },
  ];

  return { fields, payload: buf.slice(14), etherType: typeVal };
}
