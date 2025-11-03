// Wait for ENV to load
setTimeout(() => {
  console.log("Referral Bonus:", window.ENV.REFERRAL_BONUS);

  // Toggle mode
  let darkMode = true;
  function toggleMode() {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? '#0b0b12' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }
  window.toggleMode = toggleMode;

  // 100 colorful task buttons
  const colors = ['#ff0077','#00ffe0','#ffae00','#00ff4c','#0088ff','#ff00d0','#ff3333','#33ffcc'];
  const tasks = document.getElementById('tasks');
  for (let i = 1; i <= 100; i++) {
    const btn = document.createElement('button');
    btn.className = 'task-btn';
    btn.textContent = `Task ${i}`;
    btn.style.background = colors[Math.floor(Math.random() * colors.length)];
    btn.onclick = () => {
      alert(`🎉 You watched an ad and earned ${window.ENV.REFERRAL_BONUS || 0.0005} USDT!`);
    };
    tasks.appendChild(btn);
  }

  // Buy section show/hide
  document.getElementById('buyBtn').addEventListener('click', () => {
    document.getElementById('buyDetails').classList.remove('hidden');
  });
  document.getElementById('closeDetails').addEventListener('click', () => {
    document.getElementById('buyDetails').classList.add('hidden');
  });

}, 1000);
