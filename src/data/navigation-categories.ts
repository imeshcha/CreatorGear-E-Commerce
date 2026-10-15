export interface CategoryDropdownItem {
  id: string;
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
        id: 'photography',
        title: 'Photography',
        description: 'Mirrorless bodies, DSLRs & flash speedlights',
        icon: 'Camera',
        href: '/category/cameras?sub=photography',
      },
      {
        id: 'videography',
        title: 'Videography',
        description: 'Cinema line cameras, 4K/8K bodies & video rigs',
        icon: 'Video',
        href: '/category/cameras?sub=videography',
      },
      {
        id: 'lenses',
        title: 'Lenses & Optics',
        description: 'Prime lenses, zooms, cine glass & filters',
        icon: 'Eye',
        href: '/category/cameras?sub=lenses',
      },
      {
        id: 'accessories',
        title: 'Accessories & Gimbals',
        description: 'Gimbals, cages, tripods & memory media',
        icon: 'Sliders',
        href: '/category/cameras?sub=accessories',
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
        id: 'wireless',
        title: 'Wireless Systems',
        description: 'Dual-channel wireless lavaliers & clip-on mics',
        icon: 'Radio',
        href: '/category/audio?sub=wireless',
      },
      {
        id: 'microphones',
        title: 'Microphones',
        description: 'Directional shotguns, podcast & condenser mics',
        icon: 'Mic',
        href: '/category/audio?sub=microphones',
      },
      {
        id: 'recorders',
        title: 'Recorders & Mixers',
        description: '32-bit float field recorders & audio interfaces',
        icon: 'SlidersHorizontal',
        href: '/category/audio?sub=recorders',
      },
      {
        id: 'monitoring',
        title: 'Monitoring & Sound Grip',
        description: 'Studio reference headphones, booms & wind blimps',
        icon: 'Headphones',
        href: '/category/audio?sub=monitoring',
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
        id: 'continuous',
        title: 'Continuous Video Lighting',
        description: 'Point-source Bowens COBs, tube lights & panels',
        icon: 'Sun',
        href: '/category/lighting?sub=continuous',
      },
      {
        id: 'strobes',
        title: 'Photo Strobes & Flash',
        description: 'Studio monolights, location flashes & triggers',
        icon: 'Zap',
        href: '/category/lighting?sub=strobes',
      },
      {
        id: 'softboxes',
        title: 'Softboxes & Modifiers',
        description: 'Parabolic softboxes, lantern diffusers & beauty dishes',
        icon: 'CircleDot',
        href: '/category/lighting?sub=softboxes',
      },
      {
        id: 'grip',
        title: 'C-Stands, Arms & Grip',
        description: 'Heavy-duty steel stands, boom arms & clamps',
        icon: 'Layers',
        href: '/category/lighting?sub=grip',
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
        id: 'gimbals',
        title: 'Gimbals & Camera Motion',
        description: '3-axis motorized stabilizers, sliders & cranes',
        icon: 'Compass',
        href: '/category/studio-sets?sub=gimbals',
      },
      {
        id: 'cages',
        title: 'Cages & Mechanics',
        description: 'Form-fitting armor cages, top handles & rods',
        icon: 'Box',
        href: '/category/studio-sets?sub=cages',
      },
      {
        id: 'monitors',
        title: 'Monitors & Wireless Video',
        description: 'High-bright field displays & zero-latency links',
        icon: 'Monitor',
        href: '/category/studio-sets?sub=monitors',
      },
      {
        id: 'lens-control',
        title: 'Lens Control & Rigging',
        description: 'Wireless follow focus motors & teleprompters',
        icon: 'Sliders',
        href: '/category/studio-sets?sub=lens-control',
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
        id: 'controllers',
        title: 'Stream Controllers',
        description: 'Macro switchers, studio decks & audio dials',
        icon: 'Sliders',
        href: '/category/streaming?sub=controllers',
      },
      {
        id: 'capture',
        title: 'Capture Cards & Video Links',
        description: 'Low-latency 4K PCIe & USB capture interfaces',
        icon: 'Monitor',
        href: '/category/streaming?sub=capture',
      },
      {
        id: 'mics',
        title: 'Creator Microphones',
        description: 'USB podcast mics, dynamic capsules & boom arms',
        icon: 'Mic',
        href: '/category/streaming?sub=mics',
      },
      {
        id: 'lighting',
        title: 'Lighting & Backdrops',
        description: 'Key lights, desktop panels & collapsible chroma screens',
        icon: 'Sun',
        href: '/category/streaming?sub=lighting',
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
        id: 'storage',
        title: 'Memory Cards & Media',
        description: 'CFexpress Type A/B, V90 SD cards & high-speed readers',
        icon: 'Box',
        href: '/category/accessories?sub=storage',
      },
      {
        id: 'filters',
        title: 'Lens Filters & Polarizers',
        description: 'Variable ND filters, circular polarizers & UV glass',
        icon: 'Eye',
        href: '/category/accessories?sub=filters',
      },
      {
        id: 'power',
        title: 'Batteries & Power Systems',
        description: 'High-capacity V-Mount batteries & multi-bay chargers',
        icon: 'Zap',
        href: '/category/accessories?sub=power',
      },
      {
        id: 'cases',
        title: 'Flight Cases & Hard Shells',
        description: 'Waterproof Pelican-style flight cases & foam dividers',
        icon: 'Layers',
        href: '/category/accessories?sub=cases',
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
