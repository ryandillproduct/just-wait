import { Ride } from '@/types';

interface ThemeParksLiveEntry {
  id: string;
  name: string;
  entityType: string;
  status: string;
  queue?: {
    STANDBY?: { waitTime: number | null };
  };
  lastUpdated: string;
}

interface ThemeParksLiveResponse {
  liveData: ThemeParksLiveEntry[];
}

export async function fetchParkRides(themeParksId: string): Promise<Ride[]> {
  const res = await fetch(`https://api.themeparks.wiki/v1/entity/${themeParksId}/live`);
  if (!res.ok) throw new Error(`Failed to fetch park ${themeParksId}: ${res.status}`);
  const data: ThemeParksLiveResponse = await res.json();
  return data.liveData
    .filter((e) => e.entityType === 'ATTRACTION' || e.entityType === 'SHOW')
    .map((e) => ({
      id: e.id,
      name: e.name,
      is_open: e.status === 'OPERATING',
      wait_time: e.queue?.STANDBY?.waitTime ?? 0,
      last_updated: e.lastUpdated ?? '',
    }));
}
