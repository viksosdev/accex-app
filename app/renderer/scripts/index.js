document.getElementById('create-account').addEventListener('click', () => {
  window.appNavigate.go('load-register-page');
  console.log('create-account');
});
document.getElementById('login').addEventListener('click', () => {
  window.appNavigate.go('load-dashboard-page');
});
