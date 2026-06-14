import { useEffect, useState } from 'react';
import GameCanvas, { DEFAULT_TUNING } from './GameCanvas.jsx';

const STORAGE_KEY = 'rcb-brake-admin-tuning-v1';
const difficulties = ['练习', '挑战', '极限'];

function loadTuning() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TUNING;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_TUNING, ...parsed };
  } catch {
    return DEFAULT_TUNING;
  }
}

function NumberField({ label, value, min, max, step, onChange }) {
  return (
    <label className="setting-field">
      <span>{label}</span>
      <div className="setting-inputs">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </label>
  );
}

export default function App() {
  const [difficulty, setDifficulty] = useState('挑战');
  const [snapshot, setSnapshot] = useState({
    state: '待机',
    brake: 0,
    tests: 0,
    bestReaction: null,
    bestScore: 0,
    streak: 0,
  });
  const [demoTick, setDemoTick] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const [tuning, setTuning] = useState(loadTuning);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tuning));
  }, [tuning]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        setAdminOpen((value) => !value);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function updateField(key, value) {
    setTuning((current) => ({ ...current, [key]: value }));
  }

  const showStatus = snapshot.state !== '待机';

  return (
    <main className="app-shell">
      <section className="game-frame" aria-label="RCB 制动反应训练游戏">
        <GameCanvas
          difficulty={difficulty}
          demoTick={demoTick}
          tuning={tuning}
          onSnapshot={setSnapshot}
        />

        <aside className="hud-panel top-left">
          <img src="rcb-logo-word.png" alt="RCB" className="wordmark" />
          <span>CYBER BRAKE LAB</span>
        </aside>

        {showStatus && (
          <aside className="hud-panel status-strip">
            <b>{snapshot.state}</b>
            <span>制动力 {Math.round(snapshot.brake * 100)}%</span>
            <span>最高分 {snapshot.bestScore}</span>
          </aside>
        )}

        <div className="top-controls">
          <nav className="control-dock" aria-label="游戏控制">
            <button type="button" className="ghost-button" onClick={() => setDemoTick((v) => v + 1)}>
              演示
            </button>
            <div className="segmented">
              {difficulties.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={item === difficulty ? 'active' : ''}
                  onClick={() => setDifficulty(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>

          <button
            type="button"
            className={`admin-toggle ${adminOpen ? 'active' : ''}`}
            onClick={() => setAdminOpen((value) => !value)}
          >
            后台
          </button>
        </div>

        {adminOpen && (
          <aside className="admin-drawer" aria-label="参数后台">
            <div className="admin-header">
              <strong>参数后台</strong>
              <button type="button" className="ghost-button slim" onClick={() => setTuning(DEFAULT_TUNING)}>
                重置
              </button>
            </div>

            <div className="admin-section">
              <h3>制动区间</h3>
              <NumberField
                label="最小起点 %"
                value={tuning.targetStartMinPct}
                min={30}
                max={80}
                step={1}
                onChange={(value) => updateField('targetStartMinPct', value)}
              />
              <NumberField
                label="最大起点 %"
                value={tuning.targetStartMaxPct}
                min={45}
                max={92}
                step={1}
                onChange={(value) => updateField('targetStartMaxPct', value)}
              />
            </div>

            <div className="admin-section">
              <h3>预备阶段</h3>
              <NumberField
                label="最短等待 s"
                value={tuning.stagingMinSec}
                min={0.8}
                max={3}
                step={0.1}
                onChange={(value) => updateField('stagingMinSec', value)}
              />
              <NumberField
                label="最长等待 s"
                value={tuning.stagingMaxSec}
                min={1.5}
                max={5.5}
                step={0.1}
                onChange={(value) => updateField('stagingMaxSec', value)}
              />
            </div>

            <div className="admin-section">
              <h3>难度参数</h3>
              <NumberField
                label="练习区间宽度 %"
                value={tuning.practiceWidth}
                min={18}
                max={40}
                step={1}
                onChange={(value) => updateField('practiceWidth', value)}
              />
              <NumberField
                label="挑战区间宽度 %"
                value={tuning.challengeWidth}
                min={10}
                max={30}
                step={1}
                onChange={(value) => updateField('challengeWidth', value)}
              />
              <NumberField
                label="极限区间宽度 %"
                value={tuning.extremeWidth}
                min={6}
                max={20}
                step={1}
                onChange={(value) => updateField('extremeWidth', value)}
              />
              <NumberField
                label="练习保持 ms"
                value={tuning.practiceHoldMs}
                min={800}
                max={2600}
                step={50}
                onChange={(value) => updateField('practiceHoldMs', value)}
              />
              <NumberField
                label="挑战保持 ms"
                value={tuning.challengeHoldMs}
                min={1000}
                max={3200}
                step={50}
                onChange={(value) => updateField('challengeHoldMs', value)}
              />
              <NumberField
                label="极限保持 ms"
                value={tuning.extremeHoldMs}
                min={1200}
                max={3600}
                step={50}
                onChange={(value) => updateField('extremeHoldMs', value)}
              />
              <NumberField
                label="挑战时限 s"
                value={tuning.challengeTimeLimit}
                min={4}
                max={12}
                step={0.1}
                onChange={(value) => updateField('challengeTimeLimit', value)}
              />
              <NumberField
                label="极限时限 s"
                value={tuning.extremeTimeLimit}
                min={4}
                max={10}
                step={0.1}
                onChange={(value) => updateField('extremeTimeLimit', value)}
              />
            </div>
          </aside>
        )}

        <footer className="key-hints">
          <span><kbd>SPACE</kbd> 制动</span>
          <span><kbd>ENTER</kbd> 发车</span>
          <span><kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>A</kbd> 后台</span>
          <span><kbd>ESC</kbd> 返回</span>
        </footer>
      </section>
    </main>
  );
}
