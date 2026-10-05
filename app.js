const API_BASE = window.CALCULATOR_API_BASE || 'http://127.0.0.1:8000/api';
const expressionInput = document.querySelector('#expression');
const resultOutput = document.querySelector('#result');
const errorOutput = document.querySelector('#error');
const historyList = document.querySelector('#historyList');
const historySearch = document.querySelector('#historySearch');
const connectionStatus = document.querySelector('#connectionStatus');
const statusDot = document.querySelector('.status-dot');
let history = [];

function setError(message = '') { errorOutput.textContent = message; }
function setConnection(online) { statusDot.classList.toggle('online', online); connectionStatus.textContent = online ? '后端已连接 · SQLite 持久化' : '后端不可用 · 请检查服务'; }
function renderHistory() {
  const query = historySearch.value.trim().toLowerCase();
  const visible = history.filter(item => item.expression.toLowerCase().includes(query));
  if (!visible.length) { historyList.innerHTML = `<div class="empty">${query ? '没有匹配的记录' : '暂无计算记录'}</div>`; return; }
  historyList.innerHTML = visible.map(item => `<div class="history-item"><div class="history-expression">${escapeHtml(item.expression)}</div><div class="history-result">= ${escapeHtml(String(item.result))}</div><div class="history-time">${formatTime(item.createdAt)}</div><button class="delete" data-id="${item.id}" aria-label="删除这条记录">×</button></div>`).join('');
  historyList.querySelectorAll('.delete').forEach(button => button.addEventListener('click', () => deleteHistory(button.dataset.id)));
}
function escapeHtml(value) { return value.replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[character])); }
function formatTime(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }); }
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await response.json().catch(() => ({ success:false, message:'后端返回了无效响应' }));
  if (!response.ok || data.success === false) throw new Error(data.message || `请求失败 (${response.status})`);
  return data;
}
async function loadHistory() {
  try { const data = await request('/history'); history = data.items || []; setConnection(true); renderHistory(); }
  catch (error) { setConnection(false); historyList.innerHTML = '<div class="empty">无法读取历史，请启动后端服务</div>'; }
}
async function calculate() {
  const expression = expressionInput.value.trim();
  if (!expression) { setError('请输入表达式'); expressionInput.focus(); return; }
  setError(''); resultOutput.textContent = '计算中…'; resultOutput.classList.add('pending');
  try { const data = await request('/calculate', { method:'POST', body: JSON.stringify({ expression }) }); resultOutput.textContent = String(data.result); resultOutput.classList.remove('pending'); setConnection(true); await loadHistory(); }
  catch (error) {
    resultOutput.textContent = '计算失败';
    resultOutput.classList.add('pending');
    setError(error.message);
    setConnection(!(error instanceof TypeError));
  }
}
async function deleteHistory(id) { try { await request(`/history/${id}`, { method:'DELETE' }); await loadHistory(); } catch (error) { setError(error.message); } }
document.querySelectorAll('.key').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.value) { expressionInput.value += button.dataset.value; expressionInput.focus(); }
  if (button.dataset.action === 'clear') { expressionInput.value = ''; resultOutput.textContent = '等待计算'; resultOutput.classList.add('pending'); setError(''); }
  if (button.dataset.action === 'backspace') { expressionInput.value = expressionInput.value.slice(0, -1); expressionInput.focus(); }
  if (button.dataset.action === 'calculate') calculate();
}));
expressionInput.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); calculate(); } if (event.key === 'Escape') expressionInput.value = ''; });
historySearch.addEventListener('input', renderHistory);
document.querySelector('#clearHistory').addEventListener('click', async () => { if (!history.length) return; try { await request('/history', { method:'DELETE' }); await loadHistory(); } catch (error) { setError(error.message); } });
document.querySelector('#themeToggle').addEventListener('click', () => document.body.classList.toggle('dark'));
loadHistory();
