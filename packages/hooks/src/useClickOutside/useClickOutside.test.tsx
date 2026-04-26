import { render, fireEvent } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

function TestComponent({ onOutside }: { onOutside: () => void }) {
  const ref = useClickOutside<HTMLDivElement>(onOutside);
  return (
    <div>
      <div ref={ref} data-testid="inside">inside</div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

describe('useClickOutside', () => {
  it('does not call handler when clicking inside', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent onOutside={handler} />);

    fireEvent.mouseDown(getByTestId('inside'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('calls handler when clicking outside', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent onOutside={handler} />);

    fireEvent.mouseDown(getByTestId('outside'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('calls handler when clicking on the document body', () => {
    const handler = vi.fn();
    render(<TestComponent onOutside={handler} />);

    fireEvent.mouseDown(document.body);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
