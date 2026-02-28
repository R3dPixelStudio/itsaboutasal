const BASE = import.meta.env.BASE_URL;
const HALF_PI = Math.PI / 2;

// MASTER CONTROLLER: Move everything together!
// This controls the position of the ENTIRE shelf + books unit.
export const SHELF_GROUP_LAYOUTS = {
  mobile:  { position: [0, -2.5, -2], scale: 0.5 },
  tablet:  { position: [0, -1.2, 0], scale: 1 },
  desktop: { position: [-2, -5, -0.5], scale: 1.2 }, 
};

// --- 1. DEVICE ASSETS (Mobile Showcase vs Desktop Library) ---
export const booksConfigMap = {
  // --- MOBILE CONFIGURATION ---
  // This has been updated to show only a single, showcase book for performance.
  tablet: [
    { id: "book1",
      title: "Earth Experimental Museum",
      description: "niga narenjiyarooo",
      uiColor: "#010ed9",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.395,0,0.665],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
        coverMap: `${BASE}textures/Books/book1/2k/book1-cover-glass-text.png`,
        firstPageMap: `${BASE}textures/Books/book1/2k/book1-line-art.png`,
      firstPageMapFlipped: `${BASE}textures/Books/book1/2k/book1-line-art.png`, 
      backMap: `${BASE}textures/Books/book1/2k/book1-back.jpg`,
      spineMap: `${BASE}textures/Books/book1/2k/SpineBook1.jpg`,
      pages: Array.from({ length: 6 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book1/2k/book1-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [0.4,0.6, 0],
      rotation: [0, HALF_PI - 0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.2, ease: "power2.inOut" }
    },
    { id: "book2",
      title: "The Jaryan Residential Complex",
      description: "how is this as a love",
      uiColor: "#9ddbda",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book2/2k/book2-cover.png`,
      firstPageMap: `${BASE}textures/Books/book2/2k/book2-glass.png`,
      firstPageMapFlipped: `${BASE}textures/Books/book2/2k/book2-glass.png`, 
      coverTrickMap: `${BASE}textures/Books/book2/2k/book2-cover.png`,
      backMap: `${BASE}textures/Books/book2/2k/book2-back.jpg`,
      spineMap: `${BASE}textures/Books/book2/2k/Spine Book 2.jpg`,
      pages: Array.from({ length: 7 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book2/2k/book2-page${i + 1}.jpg`,
      })),
      color: "#ffffff",
      position: [0.9,0.6, 0],
      rotation: [0, HALF_PI -0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.4, ease: "power3.inOut" }
    },
    { id: "book3",
      title: "The Hormozan Hospital",
      description: "Guduuu",
      uiColor: "#99c704",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book3/2k/book3-cover.png`,  
      firstPageMap: `${BASE}textures/Books/book3/2k/book3-lineart.png`,
      firstPageMapFlipped: `${BASE}textures/Books/book3/2k/book3-lineart.png`, 
      coverTrickMap: `${BASE}textures/Books/book3/2k/book3-cover.png`,
      backMap: `${BASE}textures/Books/book3/2k/book3-back.jpg`,
      spineMap: `${BASE}textures/Books/book3/2k/Spine Book 3.jpg`,
      pages: Array.from({ length: 8 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book3/2k/book3-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [1.4,0.6, 0],
      rotation: [0, HALF_PI - 0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.0, ease: "power1.inOut" }},
    { id: "book4",
      title: "The Architect's House",
      description: "Guduuuuuuuuuuuuu.",
      uiColor: "#3B82F6",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book4/2k/book4-cover.png`,
      firstPageMap: `${BASE}textures/Books/book4/2k/book4-lineart.png`, 
      firstPageMapFlipped: `${BASE}textures/Books/book4/2k/book4-lineart.png`,
      backMap: `${BASE}textures/Books/book4/2k/book4-back.jpg`,
      spineMap: `${BASE}textures/Books/book4/2k/Spine Book 4.jpg`,
      pages: Array.from({ length: 5 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book4/2k/book4-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [1.9,0.6, 0],
      rotation: [0, HALF_PI - 0.75, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.6, ease: "power4.inOut" }},
  ],
  desktop: [
    { id: "book1",
      title: "Earth Experimental Museum",
      description: "Instead of standing tall over Tehran, this museum dives deep into it. It doesn't try to catch your eye from a distance; it waits for you to find it. As you walk down into the earth, the air changes and the outside world fades away. It’s a space carved out of silence and time, built to make you feel the weight of our planet. It’s not just a gallery; it’s a physical descent that asks us to stop looking up and start looking at the ground we share.",
      uiColor: "#010ed9",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.395,0,0.665],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book1/2k/book1-cover-glass-text.png`,
      firstPageMap: `${BASE}textures/Books/book1/2k/book1-line-art.png`,
      firstPageMapFlipped: `${BASE}textures/Books/book1/2k/book1-line-art.png`, 
      backMap: `${BASE}textures/Books/book1/2k/book1-back.jpg`,
      spineMap: `${BASE}textures/Books/book1/2k/SpineBook1.jpg`,
      pages: Array.from({ length: 6 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book1/2k/book1-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [0.4,0.6, 0],
      rotation: [0, HALF_PI - 0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.2, ease: "power2.inOut" }
    },
    { id: "book2",
      title: "The Jaryan Residential Complex",
      description: "Jaryan isn't just a place to sleep—it’s a neighborhood that breathes. Inspired by the natural curves of a seashell and the flowing shapes of Gaudi’s imagination, it feels more like an ecosystem than a building. Imagine a place where you grow your own food in shared gardens, meet neighbors in sun-drenched plazas, and move through spaces that feel alive. It’s a living map for a future where city life actually feels human again.",
      uiColor: "#9ddbda",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book2/2k/book2-cover.png`,
      firstPageMap: `${BASE}textures/Books/book2/2k/book2-glass.png`,
      firstPageMapFlipped: `${BASE}textures/Books/book2/2k/book2-glass.png`, 
      coverTrickMap: `${BASE}textures/Books/book2/2k/book2-cover.png`,
      backMap: `${BASE}textures/Books/book2/2k/book2-back.jpg`,
      spineMap: `${BASE}textures/Books/book2/2k/Spine Book 2.jpg`,
      pages: Array.from({ length: 7 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book2/2k/book2-page${i + 1}.jpg`,
      })),
      color: "#ffffff",
      position: [0.9,0.6, 0],
      rotation: [0, HALF_PI -0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.4, ease: "power3.inOut" }
    },
    { id: "book3",
      title: "The Hormozan Hospital",
      description: "Hospitals are usually cold and clinical, but Hormozan was built to feel like a deep breath. Tucked into North Tehran, this four-story space was designed around the idea that sunlight and greenery are just as important as medicine. It’s a place where the hallways lead toward gardens and the windows are placed specifically to catch the sun. It’s designed to be a quiet, natural sanctuary for people when they are at their most vulnerable.",
      uiColor: "#99c704",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book3/2k/book3-cover.png`,  
      firstPageMap: `${BASE}textures/Books/book3/2k/book3-lineart.png`,
      firstPageMapFlipped: `${BASE}textures/Books/book3/2k/book3-lineart.png`, 
      coverTrickMap: `${BASE}textures/Books/book3/2k/book3-cover.png`,
      backMap: `${BASE}textures/Books/book3/2k/book3-back.jpg`,
      spineMap: `${BASE}textures/Books/book3/2k/Spine Book 3.jpg`,
      pages: Array.from({ length: 8 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book3/2k/book3-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [1.4,0.6, 0],
      rotation: [0, HALF_PI - 0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.0, ease: "power1.inOut" }},
    { id: "book4",
      title: "The Architect's House",
      description: "This is a building that talks back. We usually think of architects as the masters of a space, but this house flips the script. It’s built like a giant, multi-level puzzle—a maze that challenges you to find your way through. It asks a simple, slightly uncomfortable question: \"Do you really understand the spaces you live in?\" It’s an invitation to get a little lost, to wonder, and to see architecture not as a set of blueprints, but as a mystery to be solved.",
      uiColor: "#3B82F6",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: `${BASE}textures/Books/book4/2k/book4-cover.png`,
      firstPageMap: `${BASE}textures/Books/book4/2k/book4-lineart.png`, 
      firstPageMapFlipped: `${BASE}textures/Books/book4/2k/book4-lineart.png`,
      backMap: `${BASE}textures/Books/book4/2k/book4-back.jpg`,
      spineMap: `${BASE}textures/Books/book4/2k/Spine Book 4.jpg`,
      pages: Array.from({ length: 5 }, (_, i) => ({
        pageMap: `${BASE}textures/Books/book4/2k/book4-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [1.9,0.6, 0],
      rotation: [0, HALF_PI - 0.75, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.6, ease: "power4.inOut" }},
  ],
};

export const SHELF_LAYOUTS = {
  mobile: { position: [0, 0, -2], scale: [0.5, 0.5, 0.5] },
  tablet: { position: [1.85, -0.5, 0.2], scale: [0.5, 0.52, 0.5] },
  desktop: { position: [1.85, -0.5, 0.2], scale: [0.5, 0.52, 0.5] },
};

export const SVG_DRAW_BG_IMAGES = [
  { 
    url: `${BASE}textures/boardOnHover/azadi.png`, 
    layouts: {
      mobile: { position: [0.77, 1.3, 0.1], scale: [0.5, 0.35, .6] },
      tablet: { position: [1.71, 1.48, 0], scale: [1, 0.69, 1.19] },
      desktop: { position: [1.71, 1.48, 0], scale: [1, 0.69, 1.19] },
  }
  },
  { 
    url: `${BASE}textures/boardOnHover/turbine.png`, 
    layouts: {
      mobile: { position: [ 0.05, 0.63, 0.1], scale: [0.6, 0.3, 1] },
      tablet: { position: [0, 1.8, -0.5], scale: [1.1, 1.1, 1] },
      desktop: { position: [0.11, 0.48, 0], scale: [1, 0.5, 0.5] },
  }
  },
];

export const SVG_DRAW_GROUPS = [
  { parts: [`${BASE}svg/azadi main line.svg`, `${BASE}svg/azadi details.svg`] },
  { parts: [`${BASE}svg/Turbine main line.svg`, `${BASE}svg/turbineMove.svg`] },
  { parts: [`${BASE}svg/earth main.svg`, `${BASE}svg/earth details.svg`, `${BASE}svg/plane.svg`] },
  { parts: [`${BASE}svg/asal main line.svg`] },
  {
    isPuppet: true,
    parts: [`${BASE}svg/AsalFigure.svg`],
    //  The Lottie file for the "Hover" phase
    lottieUrl: `${BASE}main-asal-walk.lottie` 
  },
];

export const HTML_PUPPET_LAYOUTS = {
  mobile: {
    
    scale: 0.11,
    offsetY: 0,
    offsetX: 0
  },
  tablet: {
    
    scale: 0.08,   
    offsetY: -0.1,     
    offsetX: 0      
  },
  desktop: {
    
    scale: 0.08,   
    offsetY: -0.1,     
    offsetX: 0      
  }
};

export const SECTION_3_ASSETS = {
  indesignLayoutSvg: `${BASE}svg/Asset 2cv.svg`,
};

export const SVG_DRAW_LAYOUTS = {
  mobile: [
    { baseScaleFactor: 0.004, parts: [{ position: [0, 1.2, 0], scale: 0.55 }, { position: [0.8, 1.2, 0], scale: 0.55 }] },
    { baseScaleFactor: 0.004, parts: [{ position: [0, 0.5, 0], scale: 0.55 }, { position: [0.038, 0.6 , 0], scale: 0.7 , hoverAnimation: "turbine" }] },
    { baseScaleFactor: 0.004, parts: [{ position: [0, -0.3, 0], scale: 0.67 }, { position: [-0.605, -0.3, 0], scale: 0.63 }, { position: [-0.65, -0.25, 0], scale: 0.35, hoverAnimation: "earthOrbit" }] },
    { baseScaleFactor: 0.004, parts: [{ position: [0, -1.15  , 0], scale: 0.55 }] },
    {
      baseScaleFactor: 0.0025,
      position: [0, -0.98, 0],
      scale: 0.17,
    }
  ],
  tablet: [
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, 1.2, 0], scale: 1.2 },
        { position: [1.73, 1.2, 0], scale: 1.2},
      ]
    },
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, 0.3, 0], scale: 1.2 },
        { position: [0.08, 0.5, 0], scale: 1.2, hoverAnimation: "turbine" },
      ]
    },
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, -0.6, 0], scale: 1.47 },
        { position: [-1.32, -0.6, 0], scale: 1.47 },
        { position: [-1.7, -0.3, 0], scale: 0.6, hoverAnimation: "earthOrbit"}
      ]
    },
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, -1.7, 0], scale: 1.2 },
      ]
    },
    {
      baseScaleFactor: 0.003, 
      position: [-0.04, -1.4, 0],
      scale: 0.26, 
    }
  ],
  desktop: [
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, 1.2, 0], scale: 1.2 },
        { position: [1.73, 1.2, 0], scale: 1.2},
      ]
    },
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, 0.3, 0], scale: 1.2 },
        { position: [0.08, 0.5, 0], scale: 1.2, hoverAnimation: "turbine" },
      ]
    },
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, -0.6, 0], scale: 1.47 },
        { position: [-1.32, -0.6, 0], scale: 1.47 },
        { position: [-1.7, -0.3, 0], scale: 0.6, hoverAnimation: "earthOrbit"}
      ]
    },
    {
      baseScaleFactor: 0.004, 
      parts: [
        { position: [0, -1.7, 0], scale: 1.2 },
      ]
    },
    {
      baseScaleFactor: 0.003, 
      position: [-0.04, -1.4, 0],
      scale: 0.26, 
    }
  ],
};

// Background configuration per device (customize as needed)
export const BG_LAYOUTS = {
  mobile: { position: [0, 0, 0], scale: [5, 5, 1], map: `${BASE}textures/bg/1k/painted_plaster_wall_diff_1k.jpg`, normalMap: `${BASE}textures/bg/1k/painted_plaster_wall_nor_gl_1k.jpg`, roughnessMap: `${BASE}textures/bg/1k/painted_plaster_wall_rough_1k.jpg` },
  tablet: { position: [0,0, -1.4], scale: [20, 20,1], map: `${BASE}textures/bg/painted_plaster_wall_diff_2k.jpg`, normalMap: `${BASE}textures/bg/1k/painted_plaster_wall_nor_gl_1k.jpg`, roughnessMap: `${BASE}textures/bg/painted_plaster_wall_rough_2k.png` },
  desktop: { position: [0,0, -1.4], scale: [20, 20,1], map: `${BASE}textures/bg/painted_plaster_wall_diff_2k.jpg`, normalMap: `${BASE}textures/bg/1k/painted_plaster_wall_nor_gl_1k.jpg`, roughnessMap: `${BASE}textures/bg/painted_plaster_wall_rough_2k.png` },
};

// --- Device-specific targets for open book animation ---
export const BOOK_TARGETS = {
mobile: { position: [0.6, 0.45, 1.2], rotation: [0, 0, 0] },
tablet: { position: [1.85, 0.15, 2.1], rotation: [0, 0, 0] },
desktop: { position: [1.85, 0.15, 2.1], rotation: [0, 0, 0] },
};

// --- Device-specific layouts for the interactive UI ---
export const UI_LAYOUTS = {
mobile: { position: [0, -1.2, 0.1], scale: 0.8 },
tablet: { position: [0, -0.9, 0.1], scale: 1.0 },
desktop: { position: [0, -0.9, 0.1], scale: 1.0 },
};

//white board section1
export const BOARD_LAYOUTS = {
  mobile: { position: [0, 0.05, 0.05], scale: [2.25,3.5,1] },
  tablet:{ position: [0, -0.1, -1], scale:[6,4.2,1] },
  desktop: { position: [0, -0.1, -1], scale:[6,4.2,1] },
};

export const LAMP_LAYOUTS = {
  mobile: { position: [0, 0, 0.15], scale: [1, 0.5, 0.4] }, 
  tablet: { position: [0, 0, 3], scale: 1 },
  desktop: { position: [0, 1.8, -0.06], scale:[2.8,1.8,0.8] },
};

export const UI_STYLES = {
desktop: {
  containerScale: 1,
  paginationPosition: { bottom: '3rem' },
  closeButtonPosition: { top: '1.5rem', right: '1.5rem' },
},
tablet: {
  containerScale: 0.9,
  paginationPosition: { bottom: '2.5rem' },
  closeButtonPosition: { top: '1rem', right: '1rem' },
},
mobile: {
  containerScale: 0.8,
  paginationPosition: { bottom: '2rem' },
  closeButtonPosition: { top: '1rem', right: '1rem' },
},
};

export const SECTION_4_ASSETS = {
  signatureCombined: `${BASE}svg/Signature-Combined.svg`,
  emailIcon: `${BASE}svg/Email.svg`, 
  linkedinIcon: `${BASE}svg/LinkedIn.svg`,
  instagramIcon: `${BASE}svg/Instagram.svg`,
};

export const UI_LAYOUT_CLASSES = {
desktop: {
  section2: 'w-full h-full flex ',
  section3: 'w-full h-full p-16 text-black ',
},
tablet: {
  section2: 'w-full h-full flex ',
  section3: 'w-full h-full p-12 text-black',
},
mobile: {
  section2: 'w-full h-full flex ',
  section3: 'w-full h-full p-8 text-black',
},
};

// --- SCROLL CONFIG ---
const commonScrollConfig = {
  pages: 4,
  sections: [
    { topClass: 'top-0' },            
    { topClass: 'top-[100svh]' },     
    { topClass: 'top-[200svh]' },     
    { topClass: 'top-[300svh]' }      
  ],
};

export const SCROLL_CONFIG = {
  desktop: commonScrollConfig,
  tablet: commonScrollConfig,
  mobile: commonScrollConfig,
};