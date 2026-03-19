document.addEventListener('mousemove', (e) => {
  const container = document.querySelector('.glass-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  // コンテナ全体にマウス位置を渡す
  container.style.setProperty('--mouse-x', `${x}%`);
  container.style.setProperty('--mouse-y', `${y}%`);
});