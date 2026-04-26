import { render, act } from '@testing-library/react';
import { useResizeObserver } from './useResizeObserver';

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let triggerCallback: (entries: Partial<ResizeObserverEntry>[]) => void;

vi.stubGlobal(
  'ResizeObserver',
  vi.fn((cb: (entries: Partial<ResizeObserverEntry>[]) => void) => {
    triggerCallback = cb;
    return { observe: mockObserve, disconnect: mockDisconnect };
  }),
);

function TestComponent({ onSize }: { onSize: (s: { width: number; height: number }) => void }) {
  const [ref, size] = useResizeObserver();
  onSize(size);
  return <div ref={ref as React.RefObject<HTMLDivElement>} />;
}

describe('useResizeObserver', () => {
  afterEach(() => vi.clearAllMocks());

  it('starts with zero size', () => {
    const onSize = vi.fn();
    render(<TestComponent onSize={onSize} />);
    expect(onSize).toHaveBeenCalledWith({ width: 0, height: 0 });
  });

  it('updates size when the observer fires', () => {
    const onSize = vi.fn();
    render(<TestComponent onSize={onSize} />);

    act(() => {
      triggerCallback([{ contentRect: { width: 300, height: 150 } } as ResizeObserverEntry]);
    });

    expect(onSize).toHaveBeenLastCalledWith({ width: 300, height: 150 });
  });

  it('disconnects when the component unmounts', () => {
    const { unmount } = render(<TestComponent onSize={vi.fn()} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
