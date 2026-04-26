# hooksmith

React hooks I built for my own projects — properly typed, tested, and ready to drop in.
No dependencies beyond React itself.

![npm](https://img.shields.io/npm/v/@hooksmith/hooks)
![CI](https://img.shields.io/github/actions/workflow/status/your-username/hooksmith/ci.yml)
![coverage](https://img.shields.io/codecov/c/github/your-username/hooksmith)

## Install

```bash
npm install @hooksmith/hooks
# or
pnpm add @hooksmith/hooks
```

Requires React 18+.

---

## What's inside

| Hook | What it does |
|---|---|
| `useToggle` | boolean state with a flip function |
| `usePrevious` | value from the previous render |
| `useDebounce` | delays a value until the user stops changing it |
| `useThrottle` | limits how often a value can update |
| `useLocalStorage` | state that survives page refresh |
| `useSessionStorage` | state that survives navigation within a tab |
| `useEventListener` | attach/cleanup event listeners the right way |
| `useClickOutside` | detect clicks outside a ref |
| `useFetch` | fetch with loading/error states and abort on unmount |
| `useWebSocket` | WebSocket connection with auto-reconnect |
| `useIntersectionObserver` | know when an element enters the viewport |
| `useResizeObserver` | track element size changes |
| `useUndo` | state with undo/redo history |

---

## Usage

### useToggle

```tsx
const [isOpen, toggle, setIsOpen] = useToggle(false);

<button onClick={toggle}>open</button>
<button onClick={() => setIsOpen(false)}>close</button>
```

### usePrevious

```tsx
const prevCount = usePrevious(count);
// on render where count = 5, prevCount = 4
```

### useDebounce

```tsx
const debouncedQuery = useDebounce(searchQuery, 300);

// only fires after the user stops typing for 300ms
useEffect(() => {
  search(debouncedQuery);
}, [debouncedQuery]);
```

### useThrottle

```tsx
const throttledY = useThrottle(scrollY, 200);
// scrollY can change every 5ms, throttledY updates at most every 200ms
```

### useLocalStorage

```tsx
const [theme, setTheme, clearTheme] = useLocalStorage('theme', 'light');

setTheme('dark');  // persisted to localStorage
clearTheme();      // removed, resets to 'light'
```

### useSessionStorage

Same API as `useLocalStorage`, but clears when the tab closes.

```tsx
const [step, setStep] = useSessionStorage('checkout-step', 1);
```

### useEventListener

```tsx
useEventListener(window, 'resize', () => console.log(window.innerWidth));

// works with refs too
const ref = useRef<HTMLDivElement>(null);
useEventListener(ref, 'click', (e) => console.log(e.target));
```

### useClickOutside

```tsx
const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
return <div ref={ref}>...</div>;
```

### useFetch

```tsx
const { status, data, error, refetch } = useFetch<User[]>('/api/users');

if (status === 'loading') return <Spinner />;
if (status === 'error') return <p>{error.message}</p>;
```

Pass `null` as the URL to skip fetching conditionally.

### useWebSocket

```tsx
const { status, lastMessage, send } = useWebSocket<ChatMessage>('wss://...');

send({ text: 'hello' });
// reconnects automatically if the connection drops
```

### useIntersectionObserver

```tsx
const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
const isVisible = entry?.isIntersecting ?? false;

return <img ref={ref} src={isVisible ? realSrc : placeholder} />;
```

### useResizeObserver

```tsx
const [ref, { width, height }] = useResizeObserver();
return <canvas ref={ref} width={width} height={height} />;
```

### useUndo

```tsx
const { value, set, undo, redo, canUndo } = useUndo('hello');

set('world');  // value → 'world'
undo();        // value → 'hello'
redo();        // value → 'world'
```

---

## License

MIT
