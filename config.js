// Local development uses the local backend; public pages use Railway.
window.CALCULATOR_API_BASE = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
  ? 'http://127.0.0.1:8000/api'
  : 'https://calculatorbackend-production-1bcb.up.railway.app/api';
