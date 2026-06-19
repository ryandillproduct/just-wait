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
            width: 160,
            height: 160,
            borderRadius: 36,
            backgroundColor: '#F5C842',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 112,
              fontWeight: 700,
              color: '#1C1008',
              lineHeight: 1,
              marginTop: 12,
            }}
          >
            ?
          </span>
        </div>

        {/* App name */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 100,
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
            fontSize: 28,
            fontWeight: 400,
            color: '#8B7355',
            marginTop: 20,
            letterSpacing: '0.5px',
          }}
        >
          The question isn't if. It's where.
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 36,
            backgroundColor: '#F5C842',
            borderRadius: 50,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <span style={{ fontSize: 26 }}>🏆</span>
          <span
            style={{
              fontFamily: 'sans-serif',
              fontSize: 26,
              fontWeight: 700,
              color: '#1C1008',
              letterSpacing: '-0.3px',
            }}
          >
            Best Park to Visit Right Now
          </span>
        </div>

        {/* Sub-CTA */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 20,
            color: '#B5A898',
            marginTop: 16,
          }}
        >
          Tap to see the current recommendation
        </div>
      </div>
    ),
    { ...size }
  );
}
