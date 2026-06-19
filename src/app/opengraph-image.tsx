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
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 14,
            backgroundColor: '#F5C842',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 32,
            backgroundColor: '#F5C842',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 36,
          }}
        >
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 100,
              fontWeight: 700,
              color: '#1C1008',
              lineHeight: 1,
              marginTop: 10,
            }}
          >
            ?
          </span>
        </div>

        {/* App name */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 110,
            fontWeight: 700,
            color: '#1C1008',
            lineHeight: 1,
            letterSpacing: '-3px',
          }}
        >
          WhichPark?
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            fontWeight: 400,
            color: '#8B7355',
            marginTop: 24,
            letterSpacing: '0.5px',
          }}
        >
          The question isn't if. It's where.
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            right: 80,
            fontFamily: 'sans-serif',
            fontSize: 18,
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
