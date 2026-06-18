import { Ride, QueueTimesResponse } from '@/types';

export async function fetchParkRides(parkId: number): Promise<Ride[]> {
  const res = await fetch(`https://queue-times.com/parks/${parkId}/queue_times.json`);
  if (!res.ok) throw new Error(`Failed to fetch park ${parkId}: ${res.status}`);
  const data: QueueTimesResponse = await res.json();
  return data.lands.flatMap((land) => land.rides);
}
