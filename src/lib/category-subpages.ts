import { Product } from '@/types';
import { CATEGORY_DROPDOWN_DATA, CategoryDropdownItem } from '@/data/navigation-categories';

/**
 * Returns the default (first) subpage item for a given category.
 * E.g., for 'cameras', returns the 'photography' item.
 */
export function getDefaultSubpage(categorySlug: string): CategoryDropdownItem | undefined {
  const data = CATEGORY_DROPDOWN_DATA[categorySlug];
  return data?.items[0];
}

/**
 * Finds a subpage item by id for a given category, falling back to the first subpage.
 */
export function getSubpage(categorySlug: string, subId?: string): CategoryDropdownItem | undefined {
  const data = CATEGORY_DROPDOWN_DATA[categorySlug];
  if (!data || data.items.length === 0) return undefined;

  if (subId) {
    const found = data.items.find(item => item.id.toLowerCase() === subId.toLowerCase());
    if (found) return found;
  }

  // Default to first subpage
  return data.items[0];
}

/**
 * Matches a product to a specific subpage DOM route.
 */
export function matchProductToSubpage(subId: string, product: Product): boolean {
  if (!subId) return true;

  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  const brand = (product.brand?.name || product.brand?.slug || '').toLowerCase();
  const text = `${name} ${desc} ${sku} ${brand}`;

  switch (subId.toLowerCase()) {
    // ==========================================
    // CAMERAS & LENSES
    // ==========================================
    case 'photography':
      // Mirrorless bodies, DSLRs, photography cameras, speedlights
      return (
        (text.includes('mirrorless') ||
          text.includes('dslr') ||
          text.includes('photo') ||
          text.includes('x-t5') ||
          text.includes('speedlight') ||
          text.includes('shutter')) &&
        !text.includes('cinema') &&
        !text.includes('fx3') &&
        !text.includes('komodo') &&
        !text.includes('bmpcc') &&
        !text.includes('lens') &&
        !text.includes('rf 24-70') &&
        !text.includes('dg dn') &&
        !text.includes('di iii')
      );

    case 'videography':
      // Cinema line cameras, video production bodies, cine rigs
      return (
        text.includes('cinema') ||
        text.includes('fx3') ||
        text.includes('komodo') ||
        text.includes('pocket cinema') ||
        text.includes('bmpcc') ||
        text.includes('video camera') ||
        text.includes('camcorder')
      );

    case 'lenses':
      // Lenses, glass, optics, focal lengths
      return (
        text.includes('lens') ||
        text.includes('zoom') ||
        text.includes('focal') ||
        text.includes('f/2.8') ||
        text.includes('f/1.4') ||
        text.includes('f/1.8') ||
        text.includes('optics') ||
        text.includes('art lens')
      );

    case 'accessories': // Under cameras
      return (
        (text.includes('tripod') ||
          text.includes('cage') ||
          text.includes('strap') ||
          text.includes('shutter release') ||
          text.includes('lens cap') ||
          text.includes('camera bag')) &&
        !text.includes('camera body') &&
        !text.includes('lens')
      );

    // ==========================================
    // AUDIO EQUIPMENT
    // ==========================================
    case 'wireless':
      // Wireless mic systems & lavaliers
      return (
        text.includes('wireless') ||
        text.includes('lark max') ||
        text.includes('wireless pro') ||
        (text.includes('lavalier') && text.includes('dual-channel'))
      );

    case 'microphones':
      // Dedicated shotgun, studio condenser, podcast & dynamic mics
      return (
        (text.includes('microphone') ||
          text.includes('mic') ||
          text.includes('shotgun') ||
          text.includes('sm7b') ||
          text.includes('mkh 416') ||
          text.includes('by-m1')) &&
        !text.includes('wireless pro') &&
        !text.includes('lark max')
      );

    case 'recorders':
      // Dedicated audio recorders, 32-bit float mixers, audio interfaces
      return (
        (text.includes('field recorder') ||
          text.includes('audio recorder') ||
          text.includes('sound mixer') ||
          text.includes('audio interface') ||
          text.includes('zoom h') ||
          text.includes('tascam') ||
          text.includes('sound devices')) &&
        !text.includes('wireless pro')
      );

    case 'monitoring':
      // Studio headphones, boom poles, blimps
      return (
        text.includes('headphone') ||
        text.includes('earphone') ||
        text.includes('boom pole') ||
        text.includes('blimp') ||
        text.includes('windshield') ||
        text.includes('deadcat')
      );

    // ==========================================
    // LIGHTING & STUDIO
    // ==========================================
    case 'continuous':
      // Continuous point-source Bowens COB LEDs, spotlights, tube lights
      return (
        text.includes('600d') ||
        text.includes('500b') ||
        text.includes('continuous') ||
        text.includes('cob') ||
        text.includes('spotlight') ||
        text.includes('bi-color led') ||
        text.includes('daylight led') ||
        text.includes('panel light') ||
        text.includes('tube light')
      );

    case 'strobes':
      // Monolights, photo strobes, battery flashes, triggers
      return (
        text.includes('strobe') ||
        text.includes('flash') ||
        text.includes('ad200') ||
        text.includes('speedlite') ||
        text.includes('monolight')
      );

    case 'softboxes':
      // Parabolic softboxes, modifiers, lantern diffusers
      return (
        (text.includes('softbox') ||
          text.includes('lantern diffuser') ||
          text.includes('beauty dish') ||
          text.includes('light modifier') ||
          text.includes('parabolic dome')) &&
        !text.includes('600d') &&
        !text.includes('500b')
      );

    case 'grip':
      // C-Stands, heavy duty stands, boom arms, clamps
      return (
        (text.includes('c-stand') ||
          text.includes('light stand') ||
          text.includes('boom arm') ||
          text.includes('super clamp') ||
          text.includes('grip head') ||
          text.includes('sandbag')) &&
        !text.includes('600d') &&
        !text.includes('500b')
      );

    // ==========================================
    // STUDIO SETS & VIDEO PRODUCTION
    // ==========================================
    case 'gimbals':
      // Handheld 3-axis motorized stabilizers, sliders, cranes
      return (
        text.includes('gimbal') ||
        text.includes('stabilizer') ||
        text.includes('rs 3') ||
        text.includes('rs 4') ||
        text.includes('weebill') ||
        text.includes('slider') ||
        text.includes('crane')
      );

    case 'cages':
      // Armor cages, top handles, baseplates, 15mm rods
      return (
        text.includes('cage') ||
        text.includes('black mamba') ||
        text.includes('armor') ||
        text.includes('top handle') ||
        text.includes('baseplate')
      );

    case 'monitors':
      // Field monitors, high-bright displays, wireless transmitters
      return (
        text.includes('monitor') ||
        text.includes('lut7') ||
        text.includes('feelworld') ||
        text.includes('atomos') ||
        text.includes('ninja') ||
        text.includes('wireless video') ||
        text.includes('mars 400')
      );

    case 'lens-control':
      // Matte boxes, follow focus, wireless focus motors
      return (
        text.includes('matte box') ||
        text.includes('mirage') ||
        text.includes('follow focus') ||
        text.includes('focus motor') ||
        text.includes('teleprompter')
      );

    // ==========================================
    // STREAMING & CONTENT CREATION
    // ==========================================
    case 'controllers':
      // Stream controllers, macro decks, studio audio consoles
      return (
        text.includes('stream deck') ||
        text.includes('deck') ||
        text.includes('switcher') ||
        text.includes('macro') ||
        text.includes('controller')
      );

    case 'capture':
      // 4K capture cards, cam links, HDMI interfaces
      return (
        text.includes('capture') ||
        text.includes('cam link') ||
        text.includes('pcie') ||
        text.includes('hd60')
      );

    case 'mics': // Streaming creator mics
      return (
        text.includes('usb mic') ||
        text.includes('podcast mic') ||
        text.includes('creator mic') ||
        text.includes('wave:3') ||
        text.includes('yeti')
      );

    case 'lighting': // Streaming lights & backdrops
      return (
        text.includes('key light') ||
        text.includes('desktop panel') ||
        text.includes('ring light') ||
        text.includes('green screen') ||
        text.includes('backdrop')
      );

    // ==========================================
    // ACCESSORIES
    // ==========================================
    case 'storage':
      // CFexpress Type A/B, SD cards, card readers
      return (
        text.includes('cfexpress') ||
        text.includes('sd card') ||
        text.includes('memory card') ||
        text.includes('sandisk') ||
        text.includes('cfast') ||
        text.includes('card reader')
      );

    case 'filters':
      // ND filters, circular polarizers, UV glass
      return (
        text.includes('filter') ||
        text.includes('polarizer') ||
        text.includes('nd2') ||
        text.includes('variable nd') ||
        text.includes('nano-x') ||
        text.includes('circular polarizer')
      );

    case 'power':
      // V-Mount batteries, multi-bay chargers, D-Tap cables
      return (
        text.includes('battery') ||
        text.includes('v-mount') ||
        text.includes('charger') ||
        text.includes('power bank') ||
        text.includes('d-tap') ||
        text.includes('dummy battery')
      );

    case 'cases':
      // Waterproof hard flight cases, Pelican luggage
      return (
        text.includes('case') ||
        text.includes('pelican') ||
        text.includes('flight case') ||
        text.includes('hard shell') ||
        text.includes('foam divider')
      );

    default:
      return true;
  }
}
