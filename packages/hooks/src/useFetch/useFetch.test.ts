import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useFetch(null));
    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
  });

  it('goes through loading then success', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ name: 'Alice' }), { status: 200 }),
    );

    const { result } = renderHook(() => useFetch<{ name: string }>('/api/user'));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.data).toEqual({ name: 'Alice' });
  });

  it('goes into error state on failed request', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404, statusText: 'Not Found' }));

    const { result } = renderHook(() => useFetch('/api/missing'));

    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.error?.message).toContain('404');
  });

  it('goes into error state when fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFetch('/api/broken'));

    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.error?.message).toBe('Network error');
  });

  it('skips fetching when url is null', () => {
    const { result } = renderHook(() => useFetch(null));
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.status).toBe('idle');
  });
});
