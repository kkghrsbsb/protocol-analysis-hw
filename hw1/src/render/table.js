/**
 * 将多层协议字段数组渲染为 HTML 字符串。
 *
 * @param {Array<{ title: string, fields: Field[] }>} layers
 * @returns {string}  HTML 片段（多个 <section class="layer"> 元素）
 */
export function renderLayers(layers) {
  return layers.map(layer => {
    const rows = layer.fields.map(f => `
        <tr>
          <td>${escHtml(f.name)}</td>
          <td class="mono">${escHtml(f.hex)}</td>
          <td class="mono bin">${escHtml(f.bin)}</td>
          <td>${escHtml(f.value)}</td>
        </tr>`).join('');

    return `
    <section class="layer">
      <h2>${escHtml(layer.title)}</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>字段名</th>
              <th>原始 Hex</th>
              <th>二进制</th>
              <th>十进制 / 含义</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>
    </section>`;
  }).join('\n');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
