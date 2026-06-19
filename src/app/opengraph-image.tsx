import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#FDF8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 100px',
          position: 'relative',
        }}
      >
        {/* Gold top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 10,
            backgroundColor: '#F5C842',
          }}
        />

        {/* Logo mark + app name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* Logo mark */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              backgroundColor: '#F5C842',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 60,
                fontWeight: 700,
                color: '#1C1008',
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              ?
            </span>
          </div>

          {/* App name */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 96,
              fontWeight: 700,
              color: '#1C1008',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}
          >
            WhichPark?
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            fontWeight: 400,
            color: '#8B7355',
            marginTop: 32,
          }}
        >
          The question isn't if. It's where.
        </div>

        {/* Description */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 26,
            fontWeight: 400,
            color: '#B5A898',
            marginTop: 20,
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Real-time park recommendations for Disney World locals and Annual Passholders.
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            right: 100,
            fontFamily: 'sans-serif',
            fontSize: 20,
            color: '#C4B49A',
            letterSpacing: '3px',
          }}
        >
          WHICHPARK.COM
        </div>
      </div>
    ),
    { ...size }
  );
}
