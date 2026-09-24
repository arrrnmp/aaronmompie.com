import sharp from "sharp";
import { SITE_ROLE } from "../consts";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0B0B0A"/>

  <!-- Name split across two lines, red period -->
  <text x="80" y="255" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="148" fill="#F6F4EF" letter-spacing="-5">Aaron</text>
  <text x="80" y="415" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="148" fill="#F6F4EF" letter-spacing="-5">Mompié<tspan fill="#E8351F">.</tspan></text>

  <!-- Tagline -->
  <text x="82" y="490" font-family="Arial, sans-serif" font-weight="400" font-size="22" fill="#4a4641" letter-spacing="4">${SITE_ROLE.toUpperCase()} · MADRID</text>

  <!-- URL bottom -->
  <text x="82" y="576" font-family="Arial, sans-serif" font-weight="400" font-size="20" fill="#2e2c29">aaronmompie.com</text>
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
