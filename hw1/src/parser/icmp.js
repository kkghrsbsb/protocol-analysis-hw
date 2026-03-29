import { toHex, toBin, toUint, toHexStr } from './utils.js';

const TYPE_NAMES = {
  0:  'Echo Reply（回显应答）',
  3:  'Destination Unreachable（目的不可达）',
  4:  'Source Quench（源抑制，已废弃）',
  5:  'Redirect（重定向）',
  8:  'Echo Request（回显请求）',
  9:  'Router Advertisement',
  10: 'Router Solicitation',
  11: 'Time Exceeded（超时）',
  12: 'Parameter Problem',
  13: 'Timestamp Request',
  14: 'Timestamp Reply',
};

// key 格式："type/code"
const CODE_NAMES = {
  '0/0':  'Echo Reply',
  '3/0':  '网络不可达',
  '3/1':  '主机不可达',
  '3/2':  '协议不可达',
  '3/3':  '端口不可达',
  '3/4':  '需要分片但设置了 DF',
  '3/5':  '源路由失败',
  '5/0':  '重定向数据报到网络',
  '5/1':  '重定向数据报到主机',
  '8/0':  'Echo Request',
  '11/0': 'TTL exceeded in transit',
  '11/1': 'Fragment reassembly time exceeded',
};

/**
 * 解析 ICMP 头部（基础 8 字节）
 * @param {Uint8Array} buf  从 ICMP 头开始的字节
 * @returns {{ fields: Field[] }}
 */
export function parseICMP(buf) {
  if (buf.length < 8) {
    throw new Error(`ICMP 头部不完整：需要至少 8 字节，实际 ${buf.length} 字节`);
  }

  const type     = buf[0];
  const code     = buf[1];
  const checksum = toUint(buf.slice(2, 4));
  const restWord1 = toUint(buf.slice(4, 6));
  const restWord2 = toUint(buf.slice(6, 8));

  const typeName = TYPE_NAMES[type] ?? '未知';
  const codeName = CODE_NAMES[`${type}/${code}`];

  // Rest of Header 的含义因 type 而异
  let restLabel1, restLabel2;
  if (type === 0 || type === 8) {
    restLabel1 = '标识符 (Identifier)';
    restLabel2 = '序列号 (Sequence Number)';
  } else if (type === 3 || type === 11 || type === 12) {
    restLabel1 = 'Unused (高 16 位)';
    restLabel2 = 'Unused (低 16 位)';
  } else {
    restLabel1 = 'Rest of Header (高 16 位)';
    restLabel2 = 'Rest of Header (低 16 位)';
  }

  const fields = [
    {
      name:  'Type',
      hex:   toHex(buf.slice(0, 1)),
      bin:   toBin(buf.slice(0, 1)),
      value: `${type}  (${typeName})`,
    },
    {
      name:  'Code',
      hex:   toHex(buf.slice(1, 2)),
      bin:   toBin(buf.slice(1, 2)),
      value: codeName ? `${code}  (${codeName})` : `${code}`,
    },
    {
      name:  '校验和 (Checksum)',
      hex:   toHex(buf.slice(2, 4)),
      bin:   toBin(buf.slice(2, 4)),
      value: toHexStr(checksum, 4),
    },
    {
      name:  restLabel1,
      hex:   toHex(buf.slice(4, 6)),
      bin:   toBin(buf.slice(4, 6)),
      value: `${restWord1}`,
    },
    {
      name:  restLabel2,
      hex:   toHex(buf.slice(6, 8)),
      bin:   toBin(buf.slice(6, 8)),
      value: `${restWord2}`,
    },
  ];

  return { fields };
}
