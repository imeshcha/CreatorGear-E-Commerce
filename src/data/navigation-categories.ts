export interface CategoryDropdownItem {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface NavigationCategory {
  id: string;
  label: string;
  href: string;
  viewAllLabel: string;
  items: CategoryDropdownItem[];
}

export const CATEGORY_DROPDOWN_DATA: Record<string, NavigationCategory> = {
  cameras: {
    id: 'cameras',
    label: 'Cameras',
    href: '/category/cameras',
    viewAllLabel: 'All Cameras & Lenses',
    items: [
      {
        title: 'Photography',
        description: 'Mirrorless bodies, DSLRs & flash speedlights',
        icon: 'Camera',
        href: '/category/cameras?search=photo',
      },
      {
        title: 'Videography',
        description: 'Cinema line cameras, 4K/8K bodies & video rigs',
        icon: 'Video',
        href: '/category/cameras?search=cinema',
      },
      {
        title: 'Lenses & Optics',
        description: 'Prime lenses, zooms, cine glass & filters',
        icon: 'Eye',
        href: '/category/cameras?search=lens',
      },
      {
        title: 'Accessories & Gimbals',
        description: 'Gimbals, cages, tripods & memory media',
        icon: 'Sliders',
        href: '/category/studio-sets',
      },
    ],
  },

  audio: {
    id: 'audio',
    label: 'Audio',
    href: '/category/audio',
    viewAllLabel: 'All Audio Equipment',
    items: [
      {
        title: 'Wireless Systems',
        description: 'Dual-channel wireless lavaliers & clip-on mics',
        icon: 'Radio',
        href: '/category/audio?search=wireless',
      },
      {
        title: 'Microphones',
        description: 'Directional shotguns, podcast & condenser mics',
        icon: 'Mic',
        href: '/category/audio?search=mic',
      },
      {
        title: 'Recorders & Mixers',
        description: '32-bit float field recorders & audio interfaces',
        icon: 'SlidersHorizontal',
        href: '/category/audio?search=recorder',
      },
      {
        title: 'Monitoring & Sound Grip',
        description: 'Studio reference headphones, booms & wind blimps',
        icon: 'Headphones',
        href: '/category/audio?search=headphones',
      },
    ],
  },

  lighting: {
    id: 'lighting',
    label: 'Lighting',
    href: '/category/lighting',
    viewAllLabel: 'All Lighting & Studio',
    items: [
      {
        title: 'Continuous Video Lighting',
        description: 'Point-source Bowens COBs, tube lights & panels',
        icon: 'Sun',
        href: '/category/lighting?search=cob',
      },
      {
        title: 'Photo Strobes & Flash',
        description: 'Studio monolights, location flashes & triggers',
        icon: 'Zap',
        href: '/category/lighting?search=strobe',
      },
      {
        title: 'Softboxes & Modifiers',
        description: 'Parabolic softboxes, lantern diffusers & beauty dishes',
        icon: 'CircleDot',
        href: '/category/lighting?search=softbox',
      },
      {
        title: 'C-Stands, Arms & Grip',
        description: 'Heavy-duty steel stands, boom arms & clamps',
        icon: 'Layers',
        href: '/category/lighting?search=stand',
      },
    ],
  },

  'studio-sets': {
    id: 'studio-sets',
    label: 'Studio Sets',
    href: '/category/studio-sets',
    viewAllLabel: 'All Studio Sets & Rigging',
    items: [
      {
        title: 'Gimbals & Camera Motion',
        description: '3-axis motorized stabilizers, sliders & cranes',
        icon: 'Compass',
        href: '/category/studio-sets?search=gimbal',
      },
      {
        title: 'Cages & Mechanics',
        description: 'Form-fitting armor cages, top handles & rods',
        icon: 'Box',
        href: '/category/studio-sets?search=cage',
      },
      {
        title: 'Monitors & Wireless Video',
        description: 'High-bright field displays & zero-latency links',
        icon: 'Monitor',
        href: '/category/studio-sets?search=monitor',
      },
      {
        title: 'Lens Control & Rigging',
        description: 'Wireless follow focus motors & teleprompters',
        icon: 'Sliders',
        href: '/category/studio-sets?search=matte',
      },
    ],
  },

  streaming: {
    id: 'streaming',
    label: 'Streaming',
    href: '/category/streaming',
    viewAllLabel: 'All Streaming & Content Gear',
    items: [
      {
        title: 'Stream Controllers',
        description: 'Macro switchers, studio decks & audio dials',
        icon: 'Sliders',
        href: '/category/streaming?search=deck',
      },
      {
        title: 'Capture Cards & Video Links',
        description: 'Low-latency 4K PCIe & USB capture interfaces',
        icon: 'Monitor',
        href: '/category/streaming?search=capture',
      },
      {
        title: 'Creator Microphones',
        description: 'USB podcast mics, dynamic capsules & boom arms',
        icon: 'Mic',
        href: '/category/audio?search=mic',
      },
      {
        title: 'Lighting & Backdrops',
        description: 'Key lights, desktop panels & collapsible chroma screens',
        icon: 'Sun',
        href: '/category/lighting?search=led',
      },
    ],
  },

  accessories: {
    id: 'accessories',
    label: 'Accessories',
    href: '/category/accessories',
    viewAllLabel: 'All Gear Accessories',
    items: [
      {
        title: 'Memory Cards & Media',
        description: 'CFexpress Type A/B, V90 SD cards & high-speed readers',
        icon: 'Box',
        href: '/category/accessories?search=card',
      },
      {
        title: 'Lens Filters & Polarizers',
        description: 'Variable ND filters, circular polarizers & UV glass',
        icon: 'Eye',
        href: '/category/accessories?search=filter',
      },
      {
        title: 'Batteries & Power Systems',
        description: 'High-capacity V-Mount batteries & multi-bay chargers',
        icon: 'Zap',
        href: '/category/accessories?search=battery',
      },
      {
        title: 'Flight Cases & Hard Shells',
        description: 'Waterproof Pelican-style flight cases & foam dividers',
        icon: 'Layers',
        href: '/category/accessories?search=case',
      },
    ],
  },
};

// Aliases for route slugs
CATEGORY_DROPDOWN_DATA['cameras-and-lenses'] = CATEGORY_DROPDOWN_DATA.cameras;
CATEGORY_DROPDOWN_DATA['audio-equipment'] = CATEGORY_DROPDOWN_DATA.audio;
CATEGORY_DROPDOWN_DATA['lighting-and-studio'] = CATEGORY_DROPDOWN_DATA.lighting;
CATEGORY_DROPDOWN_DATA['video-production'] = CATEGORY_DROPDOWN_DATA['studio-sets'];
CATEGORY_DROPDOWN_DATA['streaming-and-content'] = CATEGORY_DROPDOWN_DATA.streaming;
