import { useState, useRef } from 'react';
import {
  useToggle,
  usePrevious,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useSessionStorage,
  useEventListener,
  useClickOutside,
  useFetch,
  useIntersectionObserver,
  useResizeObserver,
  useUndo,
} from 'hookforge-react';

// ─── useToggle ───────────────────────────────────────────────────────────────

function ToggleDemo() {
  const [isOn, toggle, setIsOn] = useToggle(false);

  return (
    <div className="card">
      <h2>useToggle</h2>
      <p>Boolean state with flip and explicit set.</p>
      <div className="value">
        {isOn ? 'true' : 'false'}
        <span className={`badge ${isOn ? 'open' : 'closed'}`}>{isOn ? 'ON' : 'OFF'}</span>
      </div>
      <button onClick={toggle}>toggle()</button>
      <button onClick={() => setIsOn(true)}>set(true)</button>
      <button onClick={() => setIsOn(false)}>set(false)</button>
    </div>
  );
}

// ─── usePrevious ─────────────────────────────────────────────────────────────

function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <div className="card">
      <h2>usePrevious</h2>
      <p>Returns the value from the previous render.</p>
      <div className="value">current: {count} / prev: {prev ?? 'undefined'}</div>
      <button onClick={() => setCount(c => c + 1)}>increment</button>
      <button onClick={() => setCount(c => c - 1)}>decrement</button>
    </div>
  );
}

// ─── useDebounce ─────────────────────────────────────────────────────────────

function DebounceDemo() {
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 500);

  return (
    <div className="card">
      <h2>useDebounce (500ms)</h2>
      <p>Debounced value updates 500ms after you stop typing.</p>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="type something..."
      />
      <div className="value">debounced: "{debounced}"</div>
    </div>
  );
}

// ─── useThrottle ─────────────────────────────────────────────────────────────

function ThrottleDemo() {
  const [count, setCount] = useState(0);
  const throttled = useThrottle(count, 1000);

  return (
    <div className="card">
      <h2>useThrottle (1000ms)</h2>
      <p>Throttled value updates at most once per second.</p>
      <div className="value">raw: {count} / throttled: {throttled}</div>
      <button onClick={() => setCount(c => c + 1)}>spam click me</button>
    </div>
  );
}

// ─── useLocalStorage ─────────────────────────────────────────────────────────

function LocalStorageDemo() {
  const [name, setName, clear] = useLocalStorage('demo-name', '');

  return (
    <div className="card">
      <h2>useLocalStorage</h2>
      <p>Persists in localStorage — survives refresh.</p>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="enter your name..."
      />
      <div className="value">saved: "{name}"</div>
      <button onClick={clear}>clear</button>
    </div>
  );
}

// ─── useSessionStorage ───────────────────────────────────────────────────────

function SessionStorageDemo() {
  const [step, setStep, clear] = useSessionStorage('demo-step', 1);

  return (
    <div className="card">
      <h2>useSessionStorage</h2>
      <p>Persists in sessionStorage — clears on tab close.</p>
      <div className="value">step: {step}</div>
      <button onClick={() => setStep(s => s + 1)}>next step</button>
      <button onClick={clear}>reset</button>
    </div>
  );
}

// ─── useEventListener ────────────────────────────────────────────────────────

function EventListenerDemo() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEventListener(window, 'mousemove', e => {
    setPos({ x: e.clientX, y: e.clientY });
  });

  return (
    <div className="card">
      <h2>useEventListener</h2>
      <p>Listening to window mousemove.</p>
      <div className="value">x: {pos.x} / y: {pos.y}</div>
    </div>
  );
}

// ─── useClickOutside ─────────────────────────────────────────────────────────

function ClickOutsideDemo() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="card">
      <h2>useClickOutside</h2>
      <p>Click outside the box to close it.</p>
      <button onClick={() => setOpen(true)}>open</button>
      {open && (
        <div ref={ref} className="box">
          I'm open — click outside to close me
        </div>
      )}
    </div>
  );
}

// ─── useFetch ────────────────────────────────────────────────────────────────

type Post = { id: number; title: string };

function FetchDemo() {
  const { status, data, error, refetch } = useFetch<Post>(
    'https://jsonplaceholder.typicode.com/posts/1',
  );

  return (
    <div className="card">
      <h2>useFetch</h2>
      <p>Fetches a post from JSONPlaceholder.</p>
      <div className="value">
        status: {status}
        <span className={`badge ${status}`}>{status}</span>
      </div>
      {status === 'success' && <div className="box">{data.title}</div>}
      {status === 'error'   && <div className="box">{error.message}</div>}
      <button onClick={() => void refetch()}>refetch</button>
    </div>
  );
}

// ─── useIntersectionObserver ─────────────────────────────────────────────────

function IntersectionDemo() {
  const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
  const visible = entry?.isIntersecting ?? false;

  return (
    <div className="card">
      <h2>useIntersectionObserver</h2>
      <p>Scroll down inside this box to trigger visibility.</p>
      <div className="box tall" style={{ overflowY: 'scroll' }}>
        <div style={{ height: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ color: visible ? '#86efac' : '#64748b' }}
          >
            {visible ? '✓ visible' : '↓ scroll to me'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── useResizeObserver ───────────────────────────────────────────────────────

function ResizeDemo() {
  const [ref, { width, height }] = useResizeObserver();

  return (
    <div className="card">
      <h2>useResizeObserver</h2>
      <p>Resize your browser window to see values change.</p>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="box"
      >
        {Math.round(width)} × {Math.round(height)} px
      </div>
    </div>
  );
}

// ─── useUndo ─────────────────────────────────────────────────────────────────

function UndoDemo() {
  const { value, set, undo, redo, canUndo, canRedo, history } = useUndo('hello');
  const [input, setInput] = useState('');

  return (
    <div className="card">
      <h2>useUndo</h2>
      <p>State with undo/redo history.</p>
      <div className="value">"{value}"</div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="new value..."
      />
      <button onClick={() => { set(input); setInput(''); }}>set</button>
      <button onClick={undo} disabled={!canUndo}>undo</button>
      <button onClick={redo} disabled={!canRedo}>redo</button>
      <div className="history">history: [{history.map(v => `"${v}"`).join(', ')}]</div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <h1>hooksmith — demo</h1>
      <div className="grid">
        <ToggleDemo />
        <PreviousDemo />
        <DebounceDemo />
        <ThrottleDemo />
        <LocalStorageDemo />
        <SessionStorageDemo />
        <EventListenerDemo />
        <ClickOutsideDemo />
        <FetchDemo />
        <IntersectionDemo />
        <ResizeDemo />
        <UndoDemo />
      </div>
    </>
  );
}
