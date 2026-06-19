import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: '#F5C842',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 120,
            fontWeight: 700,
            color: '#1C1008',
            lineHeight: 1,
            marginTop: 8,
          }}
        >
          ?
        </span>
      </div>
    ),
    { ...size }
  );
}
