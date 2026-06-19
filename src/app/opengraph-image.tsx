import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const playfair = await fetch(
    'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xRbPQ.woff2'
  ).then((r) => r.arrayBuffer());

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
          padding: '80px 100px',
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
            height: 8,
            backgroundColor: '#F5C842',
          }}
        />

        {/* App name */}
        <div
          style={{
            fontFamily: 'Playfair Display',
            fontSize: 96,
            fontWeight: 700,
            color: '#1C1008',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          WhichPark?
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'Playfair Display',
            fontSize: 36,
            fontWeight: 400,
            color: '#8B7355',
            marginTop: 24,
            letterSpacing: '0px',
          }}
        >
          The question isn't if. It's where.
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 100,
            fontFamily: 'sans-serif',
            fontSize: 22,
            color: '#C4B49A',
            letterSpacing: '2px',
          }}
        >
          WHICHPARK.COM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfair,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Playfair Display',
          data: playfair,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
