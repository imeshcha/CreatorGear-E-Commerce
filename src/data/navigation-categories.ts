export interface SubcategoryLink {
  title: string;
  href: string;
  badge?: string;
}

export interface MegaMenuColumn {
  title: string;
  icon: string;
  items: SubcategoryLink[];
  viewAllHref: string;
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  href: string;
  tagline: string;
  columns: MegaMenuColumn[];
}

export const MEGA_MENU_DATA: Record<string, MegaMenuCategory> = {
  cameras: {
    id: 'cameras',
    label: 'Cameras',
    href: '/category/cameras',
    tagline: 'Cinema systems, full-frame mirrorless bodies, fast primes & anamorphic glass',
    columns: [
      {
        title: 'Photography',
        icon: 'Camera',
        viewAllHref: '/category/cameras?search=photo',
        items: [
          { title: 'Mirrorless Bodies', href: '/category/cameras?search=mirrorless', badge: 'Popular' },
          { title: 'Full-Frame DSLRs', href: '/category/cameras?search=dslr' },
          { title: 'Medium Format Systems', href: '/category/cameras?search=medium+format' },
          { title: 'Speedlights & Flashes', href: '/category/lighting?search=speedlight' },
          { title: 'Wireless Flash Triggers', href: '/category/lighting?search=trigger' },
        ],
      },
      {
        title: 'Videography',
        icon: 'Video',
        viewAllHref: '/category/cameras?search=cinema',
        items: [
          { title: 'Cinema Line Cameras', href: '/category/cameras?search=cinema', badge: 'Pro' },
          { title: 'Compact 4K/8K Video', href: '/category/cameras?search=fx3' },
          { title: 'Action & 360 Cams', href: '/category/cameras?search=action' },
          { title: 'On-Camera Field Monitors', href: '/category/studio-sets?search=monitor' },
          { title: 'Wireless Video Transmitters', href: '/category/studio-sets?search=wireless+video' },
        ],
      },
      {
        title: 'Lenses & Optics',
        icon: 'Eye',
        viewAllHref: '/category/cameras?search=lens',
        items: [
          { title: 'Prime Lenses (Fast Glass)', href: '/category/cameras?search=prime' },
          { title: 'Zoom Lenses (24-70, 70-200)', href: '/category/cameras?search=zoom' },
          { title: 'Cinema Primes & Anamorphic', href: '/category/cameras?search=cine', badge: 'Cinema' },
          { title: 'Variable ND & Mist Filters', href: '/category/cameras?search=filter' },
          { title: 'Lens Mount Adapters', href: '/category/cameras?search=adapter' },
        ],
      },
      {
        title: 'Accessories & Support',
        icon: 'Sliders',
        viewAllHref: '/category/studio-sets',
        items: [
          { title: 'Motorized Gimbals', href: '/category/studio-sets?search=gimbal', badge: 'Hot' },
          { title: 'Fluid Head Video Tripods', href: '/category/studio-sets?search=tripod' },
          { title: 'Camera Cages & Top Handles', href: '/category/studio-sets?search=cage' },
          { title: 'CFexpress & V90 SD Cards', href: '/category/accessories?search=memory' },
          { title: 'Hard Cases & Backpacks', href: '/category/accessories?search=case' },
        ],
      },
    ],
  },

  audio: {
    id: 'audio',
    label: 'Audio',
    href: '/category/audio',
    tagline: 'Wireless lavaliers, directional shotguns, 32-bit float recorders & studio monitors',
    columns: [
      {
        title: 'Wireless Systems',
        icon: 'Radio',
        viewAllHref: '/category/audio?search=wireless',
        items: [
          { title: 'Dual-Channel Wireless Lavs', href: '/category/audio?search=wireless', badge: 'Popular' },
          { title: 'Clip-On Micro Transmitters', href: '/category/audio?search=lavalier' },
          { title: 'Broadcast UHF Systems', href: '/category/audio?search=broadcast' },
          { title: 'Camera Shoe Receivers', href: '/category/audio?search=receiver' },
          { title: 'Wireless Charging Docks', href: '/category/audio?search=charging' },
        ],
      },
      {
        title: 'Microphones',
        icon: 'Mic',
        viewAllHref: '/category/audio?search=mic',
        items: [
          { title: 'Directional Shotgun Mics', href: '/category/audio?search=shotgun', badge: 'Pro' },
          { title: 'Podcast & Dynamic Mics', href: '/category/audio?search=dynamic' },
          { title: 'Studio Condenser Mics', href: '/category/audio?search=condenser' },
          { title: 'Voiceover & Vocal Mics', href: '/category/audio?search=vocal' },
          { title: 'USB Creator Microphones', href: '/category/audio?search=usb' },
        ],
      },
      {
        title: 'Recorders & Consoles',
        icon: 'SlidersHorizontal',
        viewAllHref: '/category/audio?search=recorder',
        items: [
          { title: '32-Bit Float Field Recorders', href: '/category/audio?search=recorder', badge: '32-Bit' },
          { title: 'Touchscreen Podcast Consoles', href: '/category/audio?search=console' },
          { title: 'USB Audio Interfaces', href: '/category/audio?search=interface' },
          { title: 'Clean Mic Preamps & Mixers', href: '/category/audio?search=mixer' },
          { title: 'Handheld Field Recorders', href: '/category/audio?search=handheld' },
        ],
      },
      {
        title: 'Monitoring & Sound Grip',
        icon: 'Headphones',
        viewAllHref: '/category/audio?search=monitor',
        items: [
          { title: 'Studio Reference Headphones', href: '/category/audio?search=headphones' },
          { title: 'In-Ear Monitors (IEMs)', href: '/category/audio?search=iem' },
          { title: 'Carbon Fiber Boom Poles', href: '/category/audio?search=boom' },
          { title: 'Wind Blimps & Deadcats', href: '/category/audio?search=wind' },
          { title: 'Shockmounts & XLR Cables', href: '/category/audio?search=cable' },
        ],
      },
    ],
  },

  lighting: {
    id: 'lighting',
    label: 'Lighting',
    href: '/category/lighting',
    tagline: 'High-output Bowens COBs, creative tube lights, softboxes & heavy-duty C-stands',
    columns: [
      {
        title: 'Video Continuous',
        icon: 'Sun',
        viewAllHref: '/category/lighting?search=led',
        items: [
          { title: 'Point-Source Bowens COBs', href: '/category/lighting?search=cob', badge: 'Best Seller' },
          { title: 'Bi-Color & Daylight Heads', href: '/category/lighting?search=bicolor' },
          { title: 'RGBWW Pixel Tube Lights', href: '/category/lighting?search=tube', badge: 'Creative' },
          { title: 'Flexible Rollable LED Mats', href: '/category/lighting?search=mat' },
          { title: 'Pocket & On-Camera Lights', href: '/category/lighting?search=pocket' },
        ],
      },
      {
        title: 'Photo Strobes & Flash',
        icon: 'Zap',
        viewAllHref: '/category/lighting?search=strobe',
        items: [
          { title: 'Studio Monolights & Strobes', href: '/category/lighting?search=strobe' },
          { title: 'Battery Location Strobes', href: '/category/lighting?search=battery+strobe' },
          { title: 'Hotshoe Camera Speedlights', href: '/category/lighting?search=speedlight' },
          { title: 'Wireless TTL Flash Triggers', href: '/category/lighting?search=trigger' },
          { title: 'Flash Modeling Bulbs & Kits', href: '/category/lighting?search=flash' },
        ],
      },
      {
        title: 'Softboxes & Modifiers',
        icon: 'CircleDot',
        viewAllHref: '/category/lighting?search=softbox',
        items: [
          { title: 'Parabolic Deep Softboxes', href: '/category/lighting?search=softbox' },
          { title: '360° Lantern Diffusers', href: '/category/lighting?search=lantern', badge: 'Room Light' },
          { title: 'Beauty Dishes & Grids', href: '/category/lighting?search=beauty+dish' },
          { title: 'Optical Spotlights & Gobos', href: '/category/lighting?search=spotlight' },
          { title: 'Fresnels & Barn Doors', href: '/category/lighting?search=fresnel' },
        ],
      },
      {
        title: 'C-Stands, Arms & Grip',
        icon: 'Layers',
        viewAllHref: '/category/lighting?search=stand',
        items: [
          { title: 'Steel Turtle-Base C-Stands', href: '/category/lighting?search=c-stand', badge: 'Essential' },
          { title: 'Boom Arms & Overhead Mounts', href: '/category/lighting?search=boom' },
          { title: 'Sandbags & Safety Weights', href: '/category/lighting?search=sandbag' },
          { title: 'Super Clamps & Grip Heads', href: '/category/lighting?search=clamp' },
          { title: 'Wireless DMX & Mesh Bridges', href: '/category/lighting?search=dmx' },
        ],
      },
    ],
  },

  'studio-sets': {
    id: 'studio-sets',
    label: 'Studio Sets',
    href: '/category/studio-sets',
    tagline: 'Camera stabilizers, mechanical cages, director monitors & precision follow focus',
    columns: [
      {
        title: 'Gimbals & Motion',
        icon: 'Compass',
        viewAllHref: '/category/studio-sets?search=gimbal',
        items: [
          { title: '3-Axis Motorized Gimbals', href: '/category/studio-sets?search=gimbal', badge: 'Stabilized' },
          { title: 'Fluid Head Video Tripods', href: '/category/studio-sets?search=tripod' },
          { title: 'Motorized Tracking Sliders', href: '/category/studio-sets?search=slider' },
          { title: 'Compact Jibs & Cranes', href: '/category/studio-sets?search=jib' },
          { title: 'Dolly Wheels & Track Kits', href: '/category/studio-sets?search=dolly' },
        ],
      },
      {
        title: 'Cages & Mechanics',
        icon: 'Box',
        viewAllHref: '/category/studio-sets?search=cage',
        items: [
          { title: 'Modular Armor Cages', href: '/category/studio-sets?search=cage', badge: 'Rigging' },
          { title: 'Quick-Release Top Handles', href: '/category/studio-sets?search=handle' },
          { title: '15mm / 19mm Rod Systems', href: '/category/studio-sets?search=rod' },
          { title: 'Mini Matte Boxes & Flags', href: '/category/studio-sets?search=matte' },
          { title: 'Arca & Manfrotto Baseplates', href: '/category/studio-sets?search=baseplate' },
        ],
      },
      {
        title: 'Monitors & Video Links',
        icon: 'Monitor',
        viewAllHref: '/category/studio-sets?search=monitor',
        items: [
          { title: 'High-Bright Field Displays', href: '/category/studio-sets?search=monitor', badge: 'Daylight' },
          { title: 'HDR Monitor-Recorders', href: '/category/studio-sets?search=recorder' },
          { title: 'Zero-Latency Wireless Video', href: '/category/studio-sets?search=wireless+video' },
          { title: 'Director Monitor Cages', href: '/category/studio-sets?search=director' },
          { title: 'HDMI / SDI Bi-Direction Units', href: '/category/studio-sets?search=sdi' },
        ],
      },
      {
        title: 'Lens Control & Setups',
        icon: 'Sliders',
        viewAllHref: '/category/studio-sets?search=focus',
        items: [
          { title: 'Wireless Follow Focus Motors', href: '/category/studio-sets?search=follow+focus', badge: 'Wireless' },
          { title: 'Wireless Focus Handwheels', href: '/category/studio-sets?search=handwheel' },
          { title: 'Glass Studio Teleprompters', href: '/category/studio-sets?search=prompter' },
          { title: 'Backdrop Support Rigs', href: '/category/studio-sets?search=backdrop' },
          { title: 'Gear Belts & Lens Gears', href: '/category/studio-sets?search=gear' },
        ],
      },
    ],
  },
};
