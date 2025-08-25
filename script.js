<script>
  const cont  = document.querySelector('.Progress-Container');
  const total = Number(cont.dataset.total) || 1;
  const done  = Math.max(0, Number(cont.dataset.done) || 0);

  const pct = Math.min(100, Math.round((done / total) * 100));
  cont.querySelector('.Progress-Bar').style.width = pct + '%';
  document.getElementById('pct').textContent = pct + '%';
</script>
