import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/badges/[username]
 * Genera una imagen SVG dinámica con los pins del usuario
 * Esta URL se puede usar en GitHub README
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Buscar usuario por username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        pins: {
          include: {
            pin: true,
          },
          orderBy: {
            earnedAt: 'desc',
          },
        },
        role: true,
      },
    });

    if (!user) {
      return new NextResponse('Usuario no encontrado', { status: 404 });
    }

    // Configuración de la imagen - Dimensiones fijas con imagen de fondo
    const svgWidth = 1680;
    const svgHeight = 600;
    
    // Badges más grandes
    const pinSize = user.pins.length === 1 ? 300 : user.pins.length <= 2 ? 180 : user.pins.length <= 4 ? 160 : 140;
    const pinSpacing = 30;
    const padding = 50;
    const pinsPerRow = user.pins.length === 1 ? 1 : user.pins.length <= 2 ? 2 : user.pins.length <= 4 ? 2 : Math.min(user.pins.length, 6);
    const rows = Math.ceil((user.pins.length || 1) / pinsPerRow);
    
    // Calcular dimensiones del contenido
    const contentWidth = padding * 2 + (pinSize + pinSpacing) * pinsPerRow - pinSpacing;
    const contentHeight = padding * 2 + (pinSize + pinSpacing) * rows - pinSpacing;
    
    // Calcular offset para centrar el contenido
    const offsetX = (svgWidth - contentWidth) / 2;
    const offsetY = (svgHeight - contentHeight) / 2;

    // Si no tiene pins, mostrar mensaje
    if (user.pins.length === 0) {
      // Obtener imagen de fondo y logo, convertir a base64
      const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
      const protocol = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol || 'https');
      const baseUrl = host ? `${protocol}://${host}` : req.nextUrl.origin;
      const wallpaperUrl = `${baseUrl}/assets/images/pins/pin-wallpaper.png`;
      const logoUrl = `${baseUrl}/assets/images/logo.png`;
      const logoClubUrl = `${baseUrl}/assets/images/logo-club.png`;
      const flagUrl = `${baseUrl}/assets/images/argentina-flag.webp`;
      
      let wallpaperDataUrl = '';
      let logoDataUrl = '';
      let logoClubDataUrl = '';
      let flagDataUrl = '';
      
      try {
        // Cargar imagen de fondo
        const wallpaperResponse = await fetch(wallpaperUrl);
        if (wallpaperResponse.ok) {
          const wallpaperBuffer = await wallpaperResponse.arrayBuffer();
          const wallpaperBase64 = Buffer.from(wallpaperBuffer).toString('base64');
          const wallpaperMimeType = wallpaperResponse.headers.get('content-type') || 'image/png';
          wallpaperDataUrl = `data:${wallpaperMimeType};base64,${wallpaperBase64}`;
        }
        
        // Cargar logo
        const logoResponse = await fetch(logoUrl);
        if (logoResponse.ok) {
          const logoBuffer = await logoResponse.arrayBuffer();
          const logoBase64 = Buffer.from(logoBuffer).toString('base64');
          const logoMimeType = logoResponse.headers.get('content-type') || 'image/png';
          logoDataUrl = `data:${logoMimeType};base64,${logoBase64}`;
        }
        
        // Cargar logo del club
        const logoClubResponse = await fetch(logoClubUrl);
        if (logoClubResponse.ok) {
          const logoClubBuffer = await logoClubResponse.arrayBuffer();
          const logoClubBase64 = Buffer.from(logoClubBuffer).toString('base64');
          const logoClubMimeType = logoClubResponse.headers.get('content-type') || 'image/png';
          logoClubDataUrl = `data:${logoClubMimeType};base64,${logoClubBase64}`;
        }
        
        // Cargar bandera de Argentina
        const flagResponse = await fetch(flagUrl);
        if (flagResponse.ok) {
          const flagBuffer = await flagResponse.arrayBuffer();
          const flagBase64 = Buffer.from(flagBuffer).toString('base64');
          const flagMimeType = flagResponse.headers.get('content-type') || 'image/webp';
          flagDataUrl = `data:${flagMimeType};base64,${flagBase64}`;
        }
      } catch (error) {
        console.error('Error cargando imágenes:', error);
      }

      // Texto del mensaje
      const subscriptionText = 'Apoyo a la comunidad de Programadores Argentina';

      const svg = `
        <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#D0FF71" />
            <stop offset="50%" style="stop-color:#a8d65a" />
            <stop offset="100%" style="stop-color:#D0FF71" />
          </linearGradient>
          <filter id="svg-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${svgWidth}" height="${svgHeight}" fill="#252a32" rx="12" ry="12" filter="url(#svg-shadow)"/>
        <rect x="1" y="1" width="${svgWidth - 2}" height="${svgHeight - 2}" fill="none" stroke="url(#border)" stroke-width="2" rx="12" ry="12"/>
          <text x="${svgWidth/2}" y="${svgHeight/2}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#a0a0a0" text-anchor="middle">
            Sin badges aún
          </text>
          
          <!-- Branding del club en esquina superior izquierda -->
          <g transform="translate(20, 20)">
            <!-- Fondo del label del club -->
            <rect 
              x="0" 
              y="0" 
              width="380" 
              height="40" 
              rx="8" 
              ry="8" 
              fill="#2a2a2a" 
              stroke="#3a3a3a" 
              stroke-width="1"
            />
            ${logoClubDataUrl ? `
            <image 
              href="${logoClubDataUrl}" 
              x="8" 
              y="8" 
              width="24" 
              height="24"
            />
            ` : `
            <rect 
              x="8" 
              y="8" 
              width="24" 
              height="24" 
              fill="#D0FF71" 
              rx="4"
            />
            `}
            <text 
              x="40" 
              y="26" 
              font-family="'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" 
              font-size="12" 
              font-weight="600" 
              fill="#D0FF71"
            >
              ${subscriptionText}
            </text>
          </g>
          
          <!-- Bandera de Argentina en esquina superior derecha -->
          ${flagDataUrl ? `
          <g transform="translate(${svgWidth - 80}, 20)">
            <image 
              href="${flagDataUrl}" 
              x="0" 
              y="0" 
              width="60" 
              height="40"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
          ` : ''}
          
          <!-- Branding en esquina inferior derecha -->
          <g transform="translate(${svgWidth - 450}, ${svgHeight - 60})">
            <!-- Fondo del label -->
            <rect 
              x="0" 
              y="0" 
              width="430" 
              height="50" 
              rx="8" 
              ry="8" 
              fill="#2a2a2a" 
              stroke="#3a3a3a" 
              stroke-width="1"
            />
            <text 
              x="12" 
              y="28" 
              font-family="'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" 
              font-size="14" 
              font-weight="600" 
              fill="#D0FF71"
            >
              Consigue tus pines en programadoresargentina/pines
            </text>
          </g>
        </svg>
      `;
      
      return new NextResponse(svg.trim(), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=0, must-revalidate', // Sin cache
        },
      });
    }

    // Generar SVG con los pins
    let pinElements = '';
    
    for (let i = 0; i < user.pins.length; i++) {
      const userPin = user.pins[i];
      const row = Math.floor(i / pinsPerRow);
      const col = i % pinsPerRow;
      
      const x = offsetX + padding + col * (pinSize + pinSpacing);
      const y = offsetY + padding + row * (pinSize + pinSpacing);
      const centerX = x + pinSize / 2;
      const centerY = y + pinSize / 2;
      const radius = pinSize / 2;

      // Convertir imagen a base64 para que funcione en GitHub
      try {
        const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
        const protocol = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol || 'https');
        const baseUrl = host ? `${protocol}://${host}` : req.nextUrl.origin;
        
        const imageUrl = userPin.pin.imageUrl.startsWith('http') 
          ? userPin.pin.imageUrl 
          : `${baseUrl}${userPin.pin.imageUrl}`;

        // Obtener la imagen y convertir a base64
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString('base64');
          const mimeType = imageResponse.headers.get('content-type') || 'image/webp';
          const dataUrl = `data:${mimeType};base64,${base64}`;

          pinElements += `
            <g>
              <defs>
                <filter id="shadow-${i}" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                  <feOffset dx="0" dy="6" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <clipPath id="pin-clip-${i}">
                  <rect x="${x}" y="${y}" width="${pinSize}" height="${pinSize}" rx="12" ry="12"/>
                </clipPath>
              </defs>
              <!-- Sombra del pin -->
              <rect 
                x="${x + 2}" 
                y="${y + 6}" 
                width="${pinSize}" 
                height="${pinSize}" 
                rx="12" 
                ry="12" 
                fill="#000000" 
                opacity="0.3"
              />
              <!-- Imagen del pin con bordes redondeados -->
              <image 
                href="${dataUrl}" 
                x="${x}" 
                y="${y}" 
                width="${pinSize}" 
                height="${pinSize}"
                clip-path="url(#pin-clip-${i})"
              />
              <!-- Borde del pin -->
              <rect 
                x="${x}" 
                y="${y}" 
                width="${pinSize}" 
                height="${pinSize}" 
                rx="12" 
                ry="12" 
                fill="none" 
                stroke="#D0FF71" 
                stroke-width="2"
              />
            </g>
          `;
        } else {
          // Fallback si no se puede cargar la imagen
          pinElements += `
            <g>
              <!-- Sombra del pin -->
              <rect 
                x="${x + 2}" 
                y="${y + 6}" 
                width="${pinSize}" 
                height="${pinSize}" 
                rx="12" 
                ry="12" 
                fill="#000000" 
                opacity="0.3"
              />
              <rect 
                x="${x}" 
                y="${y}" 
                width="${pinSize}" 
                height="${pinSize}" 
                rx="12"
                ry="12"
                fill="#3a3b3f" 
                stroke="#D0FF71" 
                stroke-width="2"
              />
              <text 
                x="${x + pinSize/2}" 
                y="${y + pinSize/2 + 5}" 
                font-family="Arial, sans-serif" 
                font-size="12" 
                fill="#D0FF71" 
                text-anchor="middle"
              >
                ${userPin.pin.name.substring(0, 8)}
              </text>
            </g>
          `;
        }
      } catch (error) {
        console.error(`Error cargando imagen para pin ${i}:`, error);
        // Fallback si hay error
        pinElements += `
          <g>
            <!-- Sombra del pin -->
            <rect 
              x="${x + 2}" 
              y="${y + 6}" 
              width="${pinSize}" 
              height="${pinSize}" 
              rx="12" 
              ry="12" 
              fill="#000000" 
              opacity="0.3"
            />
            <rect 
              x="${x}" 
              y="${y}" 
              width="${pinSize}" 
              height="${pinSize}" 
              rx="12"
              ry="12"
              fill="#3a3b3f" 
              stroke="#D0FF71" 
              stroke-width="2"
            />
            <text 
              x="${x + pinSize/2}" 
              y="${y + pinSize/2 + 5}" 
              font-family="Arial, sans-serif" 
              font-size="12" 
              fill="#D0FF71" 
              text-anchor="middle"
            >
              ${userPin.pin.name.substring(0, 8)}
            </text>
          </g>
        `;
      }
    }

    // Obtener imagen de fondo y logo, convertir a base64
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
    const protocol = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol || 'https');
    const baseUrl = host ? `${protocol}://${host}` : req.nextUrl.origin;
    const wallpaperUrl = `${baseUrl}/assets/images/pins/pin-wallpaper.png`;
    const logoUrl = `${baseUrl}/assets/images/logo.png`;
    const logoClubUrl = `${baseUrl}/assets/images/logo-club.png`;
    
    let wallpaperDataUrl = '';
    let logoDataUrl = '';
    let logoClubDataUrl = '';
    
    try {
      // Cargar imagen de fondo
      const wallpaperResponse = await fetch(wallpaperUrl);
      if (wallpaperResponse.ok) {
        const wallpaperBuffer = await wallpaperResponse.arrayBuffer();
        const wallpaperBase64 = Buffer.from(wallpaperBuffer).toString('base64');
        const wallpaperMimeType = wallpaperResponse.headers.get('content-type') || 'image/png';
        wallpaperDataUrl = `data:${wallpaperMimeType};base64,${wallpaperBase64}`;
      }
      
      // Cargar logo
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoBase64 = Buffer.from(logoBuffer).toString('base64');
        const logoMimeType = logoResponse.headers.get('content-type') || 'image/png';
        logoDataUrl = `data:${logoMimeType};base64,${logoBase64}`;
      }
      
      // Cargar logo del club
      const logoClubResponse = await fetch(logoClubUrl);
      if (logoClubResponse.ok) {
        const logoClubBuffer = await logoClubResponse.arrayBuffer();
        const logoClubBase64 = Buffer.from(logoClubBuffer).toString('base64');
        const logoClubMimeType = logoClubResponse.headers.get('content-type') || 'image/png';
        logoClubDataUrl = `data:${logoClubMimeType};base64,${logoClubBase64}`;
      }
      
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    }

    // Texto del mensaje
    const subscriptionText = 'Apoyo a la comunidad de Programadores Argentina';

    const svg = `
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#D0FF71" />
            <stop offset="50%" style="stop-color:#a8d65a" />
            <stop offset="100%" style="stop-color:#D0FF71" />
          </linearGradient>
          <filter id="svg-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${svgWidth}" height="${svgHeight}" fill="#252a32" rx="12" ry="12" filter="url(#svg-shadow)"/>
        <rect x="1" y="1" width="${svgWidth - 2}" height="${svgHeight - 2}" fill="none" stroke="url(#border)" stroke-width="2" rx="12" ry="12"/>
        ${pinElements}
        
        <!-- Branding del club en esquina superior izquierda -->
        <g transform="translate(20, 20)">
          <!-- Fondo del label del club -->
          <rect 
            x="0" 
            y="0" 
            width="380" 
            height="40" 
            rx="8" 
            ry="8" 
            fill="#2a2a2a" 
            stroke="#3a3a3a" 
            stroke-width="1"
          />
          ${logoClubDataUrl ? `
          <image 
            href="${logoClubDataUrl}" 
            x="8" 
            y="8" 
            width="24" 
            height="24"
          />
          ` : `
          <rect 
            x="8" 
            y="8" 
            width="24" 
            height="24" 
            fill="#D0FF71" 
            rx="4"
          />
          `}
          <text 
            x="40" 
            y="24" 
            font-family="'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" 
            font-size="13" 
            font-weight="600" 
            fill="#D0FF71"
          >
            ${subscriptionText}
          </text>
        </g>
        
        
        <!-- Branding en esquina inferior derecha -->
        <g transform="translate(${svgWidth - 450}, ${svgHeight - 60})">
          <!-- Fondo del label -->
          <rect 
            x="0" 
            y="0" 
            width="430" 
            height="50" 
            rx="8" 
            ry="8" 
            fill="#2a2a2a" 
            stroke="#3a3a3a" 
            stroke-width="1"
          />
          <text 
            x="12" 
            y="28" 
            font-family="'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" 
            font-size="15" 
            font-weight="600" 
            fill="#D0FF71"
          >
            Consigue tus pines en programadoresargentina/pines
          </text>
        </g>
      </svg>
    `;

    return new NextResponse(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=0, must-revalidate', // Sin cache para que se actualice siempre
      },
    });
  } catch (error) {
    console.error('Error al generar imagen de badges:', error);
    return new NextResponse('Error al generar imagen', { status: 500 });
  }
}
