# 变更说明：hw1 协议解析器初始实现

## 改动概述

在 `hw1/` 目录下从零创建了一个完整的 Vite 原生 JS 项目，实现 Wireshark Hex Dump 协议分层解析器。

---

## 新增文件清单

```
hw1/
├── index.html                   # 页面入口（含输入框和输出容器）
├── package.json                 # 项目依赖：vite + vite-plugin-singlefile
├── vite.config.js               # Vite 配置，启用 viteSingleFile 插件
└── src/
    ├── main.js                  # UI 事件绑定，串联各解析模块
    ├── style.css                # 全部样式（无外部框架）
    ├── parser/
    │   ├── hexdump.js           # Hex Dump 文本 → Uint8Array
    │   ├── utils.js             # toHex / toBin / toUint / toHexStr 工具函数
    │   ├── ethernet.js          # Ethernet II 解析（14 字节头）
    │   ├── ipv4.js              # IPv4 解析（最小 20 字节头，支持 Options 标注）
    │   ├── tcp.js               # TCP 解析（最小 20 字节头，支持 Options 标注）
    │   └── icmp.js              # ICMP 解析（8 字节基础头，Type/Code 含义映射）
    └── render/
        └── table.js             # 字段数组 → 分层 HTML 表格（含 XSS 转义）
```

---

## 核心设计

### 数据流

```
Hex Dump 文本
  → hexdump.js     提取字节，去掉偏移量和 ASCII 区
  → ethernet.js    解析以太帧头，返回 fields + payload + etherType
  → ipv4.js        解析 IP 头，返回 fields + payload + protocol
  → tcp.js / icmp.js  解析传输层，返回 fields
  → table.js       每层 fields 渲染为 <section><table>
```

### 字段统一结构

每个协议字段用 `{ name, hex, bin, value }` 四元组描述，与渲染层解耦，方便扩展。

### 输入解析策略（hexdump.js）

每行先用 `/^[0-9a-f]{1,8}\s+/i` 去掉偏移量前缀，再从剩余内容中提取所有恰好 2 个十六进制字符的 token，过滤掉 ASCII 可读字符区（其 token 长度 > 2 或含非十六进制字符，自然被排除）。

---

## 功能说明

| 功能 | 说明 |
|------|------|
| 输入 | Wireshark "Copy as Hex Dump" 格式 |
| 字段展示 | 字段名 / 原始 Hex / 二进制 / 十进制含义，四列 |
| 支持协议 | Ethernet II → IPv4 → TCP 或 ICMP |
| 降级处理 | 非 IPv4 / 非 TCP-ICMP 时展示已解析层并给出提示 |
| 截断处理 | 各解析器检查长度，不足时抛出具体错误，已解析的层仍展示 |
| 快捷键 | Ctrl+Enter 快速触发解析 |
| 构建 | `vite-plugin-singlefile` 内联所有 JS/CSS，产出单文件 `dist/index.html` |

---

## 风险与注意事项

- **vite-plugin-singlefile v2** 需要 vite v5+，首次使用需 `npm install`。
- ICMP "Rest of Header" 含义因 Type 而异，当前仅对 Echo Request/Reply 展示 Identifier / Sequence，其他 Type 标注为 Unused。
- IPv4 Options 和 TCP Options 只标注字节数，不展开解析（符合作业要求）。
- UDP 等其他传输层协议在 IP 层展示后会给出提示，不报错崩溃。
