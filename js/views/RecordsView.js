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

    if (scores.length === 0) {
      this.$wrapper.addClass('d-none');
      return;
    }

    scores.forEach((record, index) => {
      this.$body.append(this.buildRow(record, index));
    });

    this.$wrapper.removeClass('d-none');
  }

  buildRow(record, index) {
    const position = index + 1;
    const badge = $('<span>').addClass('rank-badge').text(position);

    if (position <= 3) {
      badge.addClass('rank-badge--top rank-badge--' + position);
    }

    return $('<tr>')
      .append($('<td>').append(badge))
      .append($('<td>').text(record.username))
      .append($('<td>').addClass('record-score').text(this.formatScore(record.score)))
      .append($('<td>').text(record.attempts))
      .append($('<td>').text(this.formatTime(record.disposedTime)))
      .append($('<td>').text(this.formatDate(record.recordDate)));
  }

  formatScore(score) {
    return Number(score).toLocaleString('es-ES');
  }

  formatTime(seconds) {
    if (seconds < 60) {
      return seconds + ' s';
    }

    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return minutes + ' min ' + rest + ' s';
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
