window.FENW = window.FENW || {};

$(function () {
  const apiClient = new FENW.ApiClient();
  const recordsView = new FENW.RecordsView(apiClient);

  recordsView.init();
});
