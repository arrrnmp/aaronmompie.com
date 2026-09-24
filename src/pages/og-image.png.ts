import sharp from "sharp";
import { SITE_ROLE } from "../consts";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#2B3BFF"/>

  <!-- Name split across two lines -->
  <text x="80" y="255" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="148" fill="#FFFFFF" letter-spacing="-5">AARON</text>
  <text x="80" y="415" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="148" fill="#FFFFFF" letter-spacing="-5">MOMPIÉ</text>

  <!-- Tagline -->
  <text x="82" y="490" font-family="Arial, sans-serif" font-weight="400" font-size="22" fill="#DFE2FF" letter-spacing="4">${SITE_ROLE.toUpperCase()} · MADRID</text>

  <!-- URL bottom -->
  <text x="82" y="576" font-family="Arial, sans-serif" font-weight="400" font-size="20" fill="#C9CEFF">aaronmompie.com</text>
</svg>
`;

export async function GET() {
	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
