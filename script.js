const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = '☰';
}));

const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.product-card')];
const searchInput = document.querySelector('#productSearch');
let activeFilter = 'all';
function updateProducts() {
  const q = (searchInput?.value || '').trim().toLowerCase();
  cards.forEach(card => {
    const matchesType = activeFilter === 'all' || card.dataset.type === activeFilter;
    const haystack = `${card.dataset.search || ''} ${card.textContent}`.toLowerCase();
    card.classList.toggle('hidden', !(matchesType && haystack.includes(q)));
  });
}
filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filters.forEach(f => f.classList.toggle('active', f === button));
  updateProducts();
}));
searchInput?.addEventListener('input', updateProducts);

const quoteProduct = document.querySelector('#quoteProduct');
document.querySelectorAll('.quote-product').forEach(button => button.addEventListener('click', () => {
  if (quoteProduct) quoteProduct.value = button.dataset.product;
  document.querySelector('#quote')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.querySelector('[name="spec"]')?.focus({ preventScroll: true }), 500);
}));

const form = document.querySelector('#quoteForm');
const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
}
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const summary = [
    '[PVC 이음관 견적 문의]',
    `회사명/성함: ${data.customer || '-'}`,
    `연락처: ${data.phone || '-'}`,
    `이메일: ${data.email || '-'}`,
    `관심 제품: ${data.product || '-'}`,
    `호칭·규격: ${data.spec || '-'}`,
    `예상 수량: ${data.quantity || '-'}`,
    `납품 지역: ${data.region || '-'}`,
    `문의 내용: ${data.message || '-'}`
  ].join('\n');
  const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PVC_이음관_견적문의.txt';
  a.click();
  URL.revokeObjectURL(url);
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(summary).catch(() => {});
  showToast('문의 내용 파일을 저장했습니다. 실제 접수·발송 기능은 별도 연결이 필요합니다.');
});
document.querySelector('#year').textContent = new Date().getFullYear();
