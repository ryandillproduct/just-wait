import { fetchParkRides } from '@/lib/queueTimes';

const mockResponse = {
  lands: [
    {
      name: 'Fantasyland',
      rides: [
        { id: 1, name: 'Seven Dwarfs Mine Train', is_open: true, wait_time: 60, last_updated: '2026-06-18T14:00:00Z' },
        { id: 2, name: "Peter Pan's Flight", is_open: false, wait_time: 0, last_updated: '2026-06-18T14:00:00Z' },
      ],
    },
    {
      name: 'Tomorrowland',
      rides: [
        { id: 3, name: 'Space Mountain', is_open: true, wait_time: 45, last_updated: '2026-06-18T14:00:00Z' },
      ],
    },
  ],
};

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => mockResponse,
} as unknown as Response);

describe('fetchParkRides', () => {
  beforeEach(() => jest.clearAllMocks());

  it('flattens all rides from all lands', async () => {
    const rides = await fetchParkRides(6);
    expect(rides).toHaveLength(3);
  });

  it('calls the correct queue-times URL', async () => {
    await fetchParkRides(6);
    expect(fetch).toHaveBeenCalledWith('https://queue-times.com/parks/6/queue_times.json');
  });

  it('throws on non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchParkRides(6)).rejects.toThrow('Failed to fetch park 6');
  });
});
