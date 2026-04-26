import { render, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let triggerCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn((cb: (entries: Partial<IntersectionObserverEntry>[]) => void) => {
    triggerCallback = cb;
    return { observe: mockObserve, disconnect: mockDisconnect };
  }),
);

function TestComponent({ onEntry }: { onEntry: (e: IntersectionObserverEntry | null) => void }) {
  const [ref, entry] = useIntersectionObserver();
  onEntry(entry);
  return <div ref={ref as React.RefObject<HTMLDivElement>} />;
}

describe('useIntersectionObserver', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns null entry initially', () => {
    const onEntry = vi.fn();
    render(<TestComponent onEntry={onEntry} />);
    expect(onEntry).toHaveBeenCalledWith(null);
  });

  it('updates entry when the observer fires', () => {
    const onEntry = vi.fn();
    render(<TestComponent onEntry={onEntry} />);

    act(() => {
      triggerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(onEntry).toHaveBeenLastCalledWith(expect.objectContaining({ isIntersecting: true }));
  });

  it('disconnects when the component unmounts', () => {
    const { unmount } = render(<TestComponent onEntry={vi.fn()} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
