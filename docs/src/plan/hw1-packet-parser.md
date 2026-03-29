# 方案：hw1 Wireshark Hex Dump 协议解析器

## 功能目标

用户将 Wireshark 复制的 hex dump 文本粘贴到输入框，工具自动解析并以分层表格展示 Ethernet II / IPv4 / TCP / ICMP 各层字段，每个字段包含：

| 列 | 说明 |
|----|------|
| 字段名 | 协议规范中的标准名称 |
| 原始 Hex | 从报文中提取的十六进制字节 |
| 二进制 | 对应的二进制表示 |
| 十进制 / 含义 | 数值或枚举含义（如协议类型、标志位等） |

---

## 输入格式

Wireshark "Copy as Hex Dump" 的标准格式：

```
0000   14 30 04 7d 8b 3c 50 eb ...  .0.}.<P.
0010   00 00 00 00 00 00 00 00 ...
```

- 每行以偏移量（4位十六进制）开头，后跟若干空格分隔的字节，末尾有可读字符区（可忽略）。
- 解析时只取字节部分，忽略偏移和可读字符区，拼接为连续字节序列。

---

## 协议解析范围

### Ethernet II（14 字节）

| 字段 | 偏移 | 长度 |
|------|------|------|
| 目的 MAC | 0 | 6 |
| 源 MAC | 6 | 6 |
| EtherType | 12 | 2 |

EtherType 决定上层协议：`0x0800` → IPv4，`0x0806` → ARP（本期不解析 ARP，仅标注）。

### IPv4（最小 20 字节，IHL 决定实际长度）

| 字段 | 偏移 | 长度 |
|------|------|------|
| Version + IHL | 0 | 1 |
| DSCP + ECN | 1 | 1 |
| Total Length | 2 | 2 |
| Identification | 4 | 2 |
| Flags + Fragment Offset | 6 | 2 |
| TTL | 8 | 1 |
| Protocol | 9 | 1 |
| Header Checksum | 10 | 2 |
| Source IP | 12 | 4 |
| Destination IP | 16 | 4 |

Protocol 字段决定上层：`6` → TCP，`1` → ICMP，`17` → UDP（本期不解析 UDP，仅标注）。

### TCP（最小 20 字节，Data Offset 决定实际长度）

| 字段 | 偏移 | 长度 |
|------|------|------|
| Source Port | 0 | 2 |
| Destination Port | 2 | 2 |
| Sequence Number | 4 | 4 |
| Acknowledgment Number | 8 | 4 |
| Data Offset + Reserved + Flags | 12 | 2 |
| Window Size | 14 | 2 |
| Checksum | 16 | 2 |
| Urgent Pointer | 18 | 2 |

Flags 位（NS/CWR/ECE/URG/ACK/PSH/RST/SYN/FIN）单独展示含义。

### ICMP（基础 8 字节）

| 字段 | 偏移 | 长度 |
|------|------|------|
| Type | 0 | 1 |
| Code | 1 | 1 |
| Checksum | 2 | 2 |
| Identifier | 4 | 2 |
| Sequence Number | 6 | 2 |

Type / Code 显示含义（如 `8/0` = Echo Request，`0/0` = Echo Reply）。

---

## 技术方案

### 项目结构

```
hw1/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js           # 入口，UI 事件绑定
    ├── parser/
    │   ├── hexdump.js    # hex dump 文本 → Uint8Array
    │   ├── ethernet.js   # Ethernet II 解析
    │   ├── ipv4.js       # IPv4 解析
    │   ├── tcp.js        # TCP 解析
    │   └── icmp.js       # ICMP 解析
    └── render/
        └── table.js      # 字段数组 → HTML 表格
```

### 数据流

```
用户粘贴文本
  → hexdump.js: 提取字节 → Uint8Array
  → ethernet.js: 解析以太帧头，返回字段数组 + 剩余载荷 + EtherType
  → (EtherType === 0x0800) ipv4.js: 解析 IP 头，返回字段数组 + 剩余载荷 + Protocol
  → (Protocol === 6) tcp.js / (Protocol === 1) icmp.js: 解析传输层
  → table.js: 每层字段数组渲染为独立的 <table>，插入页面
```

### 字段数据结构

```js
// 每个字段用统一结构描述
{
  name: "Source IP",       // 字段名
  hex: "c0 a8 01 01",      // 原始 hex（空格分隔）
  bin: "11000000 10101000 00000001 00000001",  // 二进制
  value: "192.168.1.1",    // 十进制或含义
}
```

### Vite 构建配置

使用 `vite-plugin-singlefile` 将 JS / CSS 内联进 HTML，满足 `npm run build:html` 产出单文件的要求。

---

## UI 设计

- 顶部：`<textarea>` 输入框 + "解析" 按钮
- 成功解析后：每层协议渲染为一个带标题的卡片 + 字段表格
- 错误情况：显示红色提示（输入为空、格式无法识别、非 IPv4 等）
- 样式：纯 CSS，无外部 UI 框架依赖，保持简洁

---

## 风险与边界情况

| 情况 | 处理方式 |
|------|----------|
| 输入为空或格式错误 | 显示错误提示，不崩溃 |
| EtherType 非 IPv4 | 展示以太帧层，提示"暂不支持解析该 EtherType" |
| Protocol 非 TCP/ICMP | 展示 IP 层，提示"暂不支持解析该传输层协议" |
| 报文截断（字节不足） | 各解析函数检查长度，不足时提示并展示已解析部分 |
| IPv4 Options 字段 | IHL > 5 时标注 Options 存在，跳过不展开解析 |
| TCP Options 字段 | Data Offset > 5 时标注 Options 存在，跳过不展开解析 |

---

## 实施步骤

1. 初始化 `hw1/` 项目：`package.json`、`vite.config.js`、`index.html`
2. 实现 `hexdump.js`（输入解析）
3. 实现各层协议解析模块（ethernet → ipv4 → tcp / icmp）
4. 实现 `table.js` 渲染
5. 实现 `main.js` UI 逻辑（事件绑定、错误处理）
6. 调整样式
7. 验证 `npm run build:html` 产物可双击打开
