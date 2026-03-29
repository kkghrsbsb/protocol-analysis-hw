import './style.css';
import { parseHexDump } from './parser/hexdump.js';
import { parseEthernet } from './parser/ethernet.js';
import { parseIPv4 }    from './parser/ipv4.js';
import { parseTCP }     from './parser/tcp.js';
import { parseICMP }    from './parser/icmp.js';
import { renderLayers } from './render/table.js';

const inputEl  = document.getElementById('input');
const outputEl = document.getElementById('output');
const errorEl  = document.getElementById('error');
const btnEl    = document.getElementById('parse-btn');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.add('visible');
}

function clearError() {
  errorEl.textContent = '';
  errorEl.classList.remove('visible');
}

function parse() {
  outputEl.innerHTML = '';
  clearError();

  let buf;
  try {
    buf = parseHexDump(inputEl.value);
  } catch (e) {
    showError(`输入解析失败：${e.message}`);
    return;
  }

  const layers = [];
  let warning  = '';

  try {
    // ── Ethernet II ──
    const eth = parseEthernet(buf);
    layers.push({ title: 'Ethernet II', fields: eth.fields });

    if (eth.etherType !== 0x0800) {
      warning = `EtherType = 0x${eth.etherType.toString(16).toUpperCase().padStart(4,'0')}，当前仅支持解析 IPv4（0x0800），已展示以太层字段。`;
      outputEl.innerHTML = renderLayers(layers);
      showError(warning);
      return;
    }

    // ── IPv4 ──
    const ip = parseIPv4(eth.payload);
    layers.push({ title: 'IPv4', fields: ip.fields });

    // ── 传输层 ──
    if (ip.protocol === 6) {
      const tcp = parseTCP(ip.payload);
      layers.push({ title: 'TCP', fields: tcp.fields });
    } else if (ip.protocol === 1) {
      const icmp = parseICMP(ip.payload);
      layers.push({ title: 'ICMP', fields: icmp.fields });
    } else {
      warning = `IP Protocol = ${ip.protocol}，当前仅支持解析 TCP（6）和 ICMP（1），已展示 IP 层字段。`;
    }
  } catch (e) {
    showError(`协议解析出错：${e.message}`);
    // 已解析的层仍然展示
  }

  outputEl.innerHTML = renderLayers(layers);
  if (warning) showError(warning);
}

btnEl.addEventListener('click', parse);

// Ctrl+Enter 快捷键
inputEl.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') parse();
});
