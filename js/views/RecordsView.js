window.FENW = window.FENW || {};

FENW.RecordsView = class {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.$status = $('#scoresStatus');
    this.$wrapper = $('#scoresWrapper');
    this.$body = $('#scoresBody');
    this.$button = $('#loadScoresBtn');
  }

  init() {
    this.$button.on('click', () => this.loadScores());
  }

  async loadScores() {
    this.setLoading(true);
    this.showStatus('Cargando records...', false);

    try {
      const scores = await this.apiClient.getScores();
      this.render(scores);
      this.showStatus('Se han cargado ' + scores.length + ' records.', false);
    } catch (error) {
      this.$wrapper.addClass('d-none');
      this.showStatus(error.message, true);
    } finally {
      this.setLoading(false);
    }
  }

  render(scores) {
    this.$body.empty();

    scores.forEach((record, index) => {
      this.$body.append(this.buildRow(record, index));
    });

    this.$wrapper.removeClass('d-none');
  }

  buildRow(record, index) {
    return $('<tr>')
      .append($('<td>').append($('<span>').addClass('rank-badge').text(index + 1)))
      .append($('<td>').text(record.username))
      .append($('<td>').addClass('record-score').text(record.score))
      .append($('<td>').text(record.attempts))
      .append($('<td>').text(record.disposedTime + ' s'))
      .append($('<td>').text(this.formatDate(record.recordDate)));
  }

  formatDate(milliseconds) {
    const date = new Date(milliseconds);

    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  setLoading(isLoading) {
    this.$button.prop('disabled', isLoading);
  }

  showStatus(text, isError) {
    this.$status
      .text(text)
      .toggleClass('records-status--error', Boolean(isError));
  }
};
