// ---- University Credits Progress ----
// Assumptions:
// - TOTAL credits required defaults to 144 (override via data-total on .Progress-Container)
// - ETA assumes ~19 credits per term and ~2 terms/year (≈6 months/term)

(function(){
  const cont = document.querySelector('.Progress-Container');
  if (!cont) return; // nothing to do if container is missing

  const bar   = cont.querySelector('.Progress-Bar');
  const pctEl = document.getElementById('pct');

  const TOTAL = Number(cont.dataset.total || 144);
  const passedInput = document.getElementById('creditsPassed');
  const updateBtn   = document.getElementById('updateProgress');
  const info        = document.getElementById('progressInfo');

  // ETA model parameters
  const PER_TERM = 19; // average planned credits per term for estimate

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function formatMonthYear(date){
    try {
      return new Intl.DateTimeFormat('fa-IR', { month: 'long', year: 'numeric' }).format(date);
    } catch (e) {
      return date.toLocaleDateString();
    }
  }

  function estimateGraduation(remainingCredits){
    const termsNeeded = Math.max(0, Math.ceil(remainingCredits / PER_TERM));
    if (termsNeeded === 0) return { termsNeeded, etaText: 'فارغ‌التحصیل شدی!' };
    const now = new Date();
    const months = termsNeeded * 6; // ≈ 2 terms/year
    const eta = new Date(now.getFullYear(), now.getMonth() + months, 1);
    return { termsNeeded, etaText: `حدود ${termsNeeded} ترم دیگر — تقریباً تا ${formatMonthYear(eta)}` };
  }

  function paint(passed){
    const remain = Math.max(0, TOTAL - passed);
    const pct = Math.round((passed / TOTAL) * 100);
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    const { etaText } = estimateGraduation(remain);
    if (info) info.textContent = `پیشرفت: ${passed} از ${TOTAL} واحد (${pct}%). باقی‌مانده: ${remain} واحد. ${etaText}.`;
  }

  function update(){
    const raw = Number(passedInput && passedInput.value ? passedInput.value : 0);
    const passed = clamp(isFinite(raw) ? raw : 0, 0, TOTAL);
    // reflect clamped value back to input to avoid values > TOTAL
    if (passedInput) passedInput.value = String(passed);
    try { localStorage.setItem('creditsPassed', String(passed)); } catch(e){}
    paint(passed);
  }

  // Restore saved state
  let initialPassed = 0;
  try {
    const saved = localStorage.getItem('creditsPassed');
    if (saved !== null) initialPassed = clamp(Number(saved) || 0, 0, TOTAL);
  } catch(e){}
  if (passedInput) passedInput.value = String(initialPassed);

  // Wire events
  if (updateBtn) updateBtn.addEventListener('click', update);
  if (passedInput) passedInput.addEventListener('input', update);

  // Initial paint
  paint(initialPassed);
})();
