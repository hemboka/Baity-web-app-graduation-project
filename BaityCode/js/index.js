
    // عرض شاشة البداية ثم الانتقال تلقائياً بعد 3 ثواني
    setTimeout(() => {
      document.getElementById('loadingScreen').classList.remove('active');
      goToScreen(1);
    }, 3000);

    function goToScreen(number) {
      document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
      document.getElementById('screen' + number).classList.add('active');
    }
  