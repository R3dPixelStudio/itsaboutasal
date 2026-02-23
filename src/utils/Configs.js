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
        coverMap: '/textures/Books/book1/1k/book1-cover-glass-text.png',
        firstPageMap: '/textures/Books/book1/1k/book1-line-art.png',
        firstPageMapFlipped: '/textures/Books/book1/1k/book1-line-art.png', 
        backMap: '/textures/Books/book1/1k/book1-back.jpg',
        spineMap: '/textures/Books/book1/1k/SpineBook1.jpg',
        pages: Array.from({ length: 6 }, (_, i) => ({
          pageMap: `/textures/Books/book1/1k/book1-page${i + 1}.jpg`,
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
        coverMap: '/textures/Books/book2/1k/book2-cover.png',// frist page in pages array  does not work!(off by one )
        firstPageMap: '/textures/Books/book2/1k/book2-glass.png',
        firstPageMapFlipped: '/textures/Books/book2/1k/book2-glass.png', 
        coverTrickMap: '/textures/Books/book2/1k/book2-cover.png',
        backMap: '/textures/Books/book2/1k/book2-back.jpg',
        spineMap: '/textures/Books/book2/1k/Spine Book 2.jpg',
        pages: Array.from({ length: 7 }, (_, i) => ({
          pageMap: `/textures/Books/book2/1k/book2-page${i + 1}.jpg`,
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
        coverMap: '/textures/Books/book3/1k/book3-cover.png',  
        firstPageMap: '/textures/Books/book3/1k/book3-lineart.png',
        firstPageMapFlipped: '/textures/Books/book3/1k/book3-lineart.png', 
        coverTrickMap: '/textures/Books/book3/1k/book3-cover.png',
        backMap: '/textures/Books/book3/1k/book3-back.jpg',
        spineMap: '/textures/Books/book3/1k/Spine Book 3.jpg',
        pages: Array.from({ length: 16 }, (_, i) => ({
          pageMap: `/textures/Books/book3/1k/book3-page${i + 1}.jpg`,
        })),
        color: "#ffffff", 
        position: [1.4,0.6, 0],
        rotation: [0, HALF_PI - 0.7, 0],
        motion: { 
          pullZ: 0.8, // Pull out further
          flyRotation: [0, HALF_PI, 0] // Straighten while flying
        },
        gsapConfig: { duration: 1.0, ease: "power1.inOut" }},
      {  id: "book4",
        title: "The Architect's House",
        description: "Guduuuuuuuuuuuuu.",
        uiColor: "#3B82F6",
        spineSize:[0.20,1.7467,0.02],
        spinePosition:[0.454,0,0.64],
        coverOffset:{
          front:[-0.65,0,0.07],
          back:[0,0,-0.07]},
        coverMap: '/textures/Books/book4/1k/book4-cover.png',
        firstPageMap: '/textures/Books/book4/1k/book4-lineart.png', 
        firstPageMapFlipped: '/textures/Books/book4/1k/book4-lineart.png',
        backMap: '/textures/Books/book4/1k/book4-back.jpg',
        spineMap: '/textures/Books/book4/1k/Spine Book 4.jpg',
        pages: Array.from({ length: 7 }, (_, i) => ({
          pageMap: `/textures/Books/book4/1k/book4-page${i + 1}.jpg`,
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
      description: "niga narenjiyarooo",
      uiColor: "#010ed9",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.395,0,0.665],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: '/textures/Books/book1/1k/book1-cover-glass-text.png',
      firstPageMap: '/textures/Books/book1/1k/book1-line-art.png',
      firstPageMapFlipped: '/textures/Books/book1/1k/book1-line-art.png', 
      backMap: '/textures/Books/book1/1k/book1-back.jpg',
      spineMap: '/textures/Books/book1/1k/SpineBook1.jpg',
      pages: Array.from({ length: 6 }, (_, i) => ({
        pageMap: `/textures/Books/book1/1k/book1-page${i + 1}.jpg`,
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
      coverMap: '/textures/Books/book2/1k/book2-cover.png',// frist page in pages array  does not work!(off by one )
      firstPageMap: '/textures/Books/book2/1k/book2-glass.png',
      firstPageMapFlipped: '/textures/Books/book2/1k/book2-glass.png', 
      coverTrickMap: '/textures/Books/book2/1k/book2-cover.png',
      backMap: '/textures/Books/book2/1k/book2-back.jpg',
      spineMap: '/textures/Books/book2/1k/Spine Book 2.jpg',
      pages: Array.from({ length: 7 }, (_, i) => ({
        pageMap: `/textures/Books/book2/1k/book2-page${i + 1}.jpg`,
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
      coverMap: '/textures/Books/book3/1k/book3-cover.png',  
      firstPageMap: '/textures/Books/book3/1k/book3-lineart.png',
      firstPageMapFlipped: '/textures/Books/book3/1k/book3-lineart.png', 
      coverTrickMap: '/textures/Books/book3/1k/book3-cover.png',
      backMap: '/textures/Books/book3/1k/book3-back.jpg',
      spineMap: '/textures/Books/book3/1k/Spine Book 3.jpg',
      pages: Array.from({ length: 8 }, (_, i) => ({
        pageMap: `/textures/Books/book3/1k/book3-page${i + 1}.jpg`,
      })),
      color: "#ffffff", 
      position: [1.4,0.6, 0],
      rotation: [0, HALF_PI - 0.7, 0],
      motion: { 
        pullZ: 0.8, // Pull out further
        flyRotation: [0, HALF_PI, 0] // Straighten while flying
      },
      gsapConfig: { duration: 1.0, ease: "power1.inOut" }},
    {  id: "book4",
      title: "The Architect's House",
      description: "Guduuuuuuuuuuuuu.",
      uiColor: "#3B82F6",
      spineSize:[0.20,1.7467,0.02],
      spinePosition:[0.454,0,0.64],
      coverOffset:{
        front:[-0.65,0,0.07],
        back:[0,0,-0.07]},
      coverMap: '/textures/Books/book4/1k/book4-cover.png',
      firstPageMap: '/textures/Books/book4/1k/book4-lineart.png', 
      firstPageMapFlipped: '/textures/Books/book4/1k/book4-lineart.png',
      backMap: '/textures/Books/book4/1k/book4-back.jpg',
      spineMap: '/textures/Books/book4/1k/Spine Book 4.jpg',
      pages: Array.from({ length: 7 }, (_, i) => ({
        pageMap: `/textures/Books/book4/1k/book4-page${i + 1}.jpg`,
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
  tablet: { position: [0, -1.2, 0], scale: [1, 1, 1] },
  desktop: { position: [1.85, -0.5, 0.2], scale: [0.5, 0.52, 0.5] },
};

export const SVG_DRAW_BG_IMAGES = [
  { 
    url: '/textures/boardOnHover/azadi.png', 
    layouts: {
      mobile: { position: [0.77, 1.3, 0.1], scale: [0.5, 0.35, .6] },
      tablet: { position: [0, 1.8, 0], scale: [1.1, 1.1, 1] },
      desktop: { position: [1.71, 1.48, 0], scale: [1, 0.69, 1.19] },
  }
  },
  { 
    url: '/textures/boardOnHover/turbine.png', 
    layouts: {
      mobile: { position: [ 0.05, 0.63, 0.1], scale: [0.6, 0.3, 1] },
      tablet: { position: [0, 1.8, -0.5], scale: [1.1, 1.1, 1] },
      desktop: { position: [0.11, 0.48, 0], scale: [1, 0.5, 0.5] },
  }
  },
];

export const SVG_DRAW_GROUPS = [
  { parts: ['/svg/azadi main line.svg', '/svg/azadi details.svg'] },
  { parts: ['/svg/Turbine main line.svg', '/svg/turbineMove.svg'] },
  { parts: ['/svg/earth main.svg', '/svg/earth details.svg', '/svg/plane.svg'] },
  { parts: ['/svg/asal main line.svg'] },
  {
    isPuppet: true,
    parts: ['/svg/AsalFigure.svg'],
    //  The Lottie file for the "Hover" phase
    lottieUrl: '/main-asal-walk.lottie' 
  },
];

export const HTML_PUPPET_LAYOUTS = {
  mobile: {
    width: '190px',
    scale: 1.2,    // ...and shrink it down in 3D to match the SVG size. (Adjust this!)
    offsetY: -0.1,     // Nudge it Up/Down in 3D space (e.g., 0.1 or -0.1)
    offsetX: 0      // Nudge it Left/Right in 3D space
  },
  tablet: {
    width: '300px',
    scale: 0.35,    
    offsetY: 0,     
    offsetX: 0     
  },
  desktop: {
    width: '780px',
    scale: 0.35,   
    offsetY: 0,     
    offsetX: 0      
  }
};

export const SECTION_3_ASSETS = {
  indesignLayoutSvg: '/svg/Asset 2cv.svg',
  
};

export const SVG_DRAW_LAYOUTS = {

  mobile: [
    { baseScaleFactor: 0.004, parts: [{ position: [0, 1.2, 0], scale: 0.55 }, { position: [0.8, 1.2, 0], scale: 0.55 }] },
    { baseScaleFactor: 0.004, parts: [{ position: [0, 0.5, 0], scale: 0.55 }, { position: [0.038, 0.6 , 0], scale: 0.7 , hoverAnimation: "turbine" }] },
    { baseScaleFactor: 0.004, parts: [{ position: [0, -0.3, 0], scale: 0.67 }, { position: [-0.605, -0.3, 0], scale: 0.63 }, { position: [-0.65, -0.25, 0], scale: 0.35, hoverAnimation: "earthOrbit" }] },
    { baseScaleFactor: 0.004, parts: [{ position: [0, -1.15  , 0], scale: 0.55 }] },
    {
      // PUPPET (Mobile)
      baseScaleFactor: 0.0025,
      position: [0, -0.98, 0],
      scale: 0.17,
      
    }
  ],
  tablet: [
    { baseScaleFactor: 0.006, parts: [{ position: [0, 1.8, 0], scale: 1.1 }, { position: [2.381, 1.8, 0], scale: 1.1 }] },
    { baseScaleFactor: 0.006, parts: [{ position: [0, 0.7, 0], scale: 1.1 }, { position: [0.15, 1, 0], scale: 1.1 }] },
    { baseScaleFactor: 0.006, parts: [{ position: [0, -0.25, 0], scale: 1.1}, { position: [-1.99, -0.65, 0], scale: 1.1 }] },
    { baseScaleFactor: 0.006, parts: [{ position: [0, -1.46, 0], scale: 1.1 }] },
    {
      // PUPPET (Tablet)
      baseScaleFactor: 0.0025,
      position: [0, -1.45, 0],
      scale: 0.6,
    }
  ],
  desktop: [
    {
      baseScaleFactor: 0.004, // Restored larger scale for this group
      parts: [
        { position: [0, 1.2, 0], scale: 1.2 },
        { position: [1.73, 1.2, 0], scale: 1.2},
      ]
    },
    {
      baseScaleFactor: 0.004, // Restored larger scale for this group
      parts: [
        { position: [0, 0.3, 0], scale: 1.2 },
        { position: [0.08, 0.5, 0], scale: 1.2, hoverAnimation: "turbine" },// Assigned "turbine" animation
      ]
    },
    {
      baseScaleFactor: 0.004, // Restored larger scale for this group
      parts: [
        { position: [0, -0.6, 0], scale: 1.47 },
        { position: [-1.32, -0.6, 0], scale: 1.47 },
        { position: [-1.7, -0.3, 0], scale: 0.6, hoverAnimation: "earthOrbit"}//plane
      ]
    },
    {
      baseScaleFactor: 0.004, // Restored larger scale for this group
      parts: [
        { position: [0, -1.7, 0], scale: 1.2 },
      ]
    },
    {
      // PUPPET (Desktop)
      baseScaleFactor: 0.003, // Kept smaller scale specifically for the puppet
      position: [-0.04, -1.4, 0],
      scale: 0.26, // Reduced puppet's overall size on screen
    }
  ],
};

// Background configuration per device (customize as needed)
export const BG_LAYOUTS = {
  mobile: { position: [0, 0, 0], scale: [5, 5, 1], map: '/textures/bg/1k/painted_plaster_wall_diff_1k.jpg', normalMap: '/textures/bg/1k/painted_plaster_wall_nor_gl_1k.jpg', roughnessMap: '/textures/bg/1k/painted_plaster_wall_rough_1k.jpg' },
  tablet: { position: [0, 0, 0], scale: [15, 15, 1], map: '/textures/bg/1k/painted_plaster_wall_diff_1k.jpg', normalMap: '/textures/bg/1k/painted_plaster_wall_nor_gl_1k.jpg', roughnessMap: '/textures/bg/1k/painted_plaster_wall_rough_1k.jpg' },
  desktop: { position: [0,0, -1.4], scale: [20, 20,1], map: '/textures/bg/painted_plaster_wall_diff_2k.jpg', normalMap: '/textures/bg/1k/painted_plaster_wall_nor_gl_1k.jpg', roughnessMap: '/textures/bg/painted_plaster_wall_rough_2k.png' },
};

// --- Device-specific targets for open book animation ---
export const BOOK_TARGETS = {
mobile: { position: [0.6, 0.45, 1.2], rotation: [0, 0, 0] },
tablet: { position: [0, 0, 3], rotation: [0, 0, 0] },
desktop: { position: [1.85, 0.15, 2.1], rotation: [0, 0, 0] },
};

// --- Device-specific layouts for the interactive UI ---
export const UI_LAYOUTS = {
mobile: { position: [0, -1.2, 0.1], scale: 0.8 },
tablet: { position: [0, -1.5, 0.1], scale: 0.9 },////kossher not working delete later
desktop: { position: [0, -0.9, 0.1], scale: 1.0 },
};
//white board section1
export const BOARD_LAYOUTS = {
  // FIX: Z was -1, moved to 0.05 to sit IN FRONT of the wall (which is at 0)
  mobile: { position: [0, 0.05, 0.05], scale: [2.25,3.5,1] },
  tablet: { position: [0, 0, 3], scale: 1 },
  desktop: { position: [0, -0.1, -1], scale:[6,4.2,1] },
};

export const LAMP_LAYOUTS = {
  // FIX: Z changed from -0.01 to 0.15 to be in front of the new whiteboard position
  mobile: { position: [0, 0, 0.15], scale: [1, 0.5, 0.4] }, 
  
  tablet: { position: [0, 0, 3], scale: 1 },
  desktop: { position: [0, 1.8, -0.01], scale:[2.8,1.8,0.8] },
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
  signatureCombined: '/svg/Signature-Combined.svg',
  emailIcon: '/svg/Email.svg', // Add paths for your icons
  linkedinIcon: '/svg/LinkedIn.svg',
  instagramIcon: '/svg/Instagram.svg',
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
//  We define the full Tailwind strings here.
// 'svh' guarantees the section fits within the "small" viewport (ignoring address bar).
const commonScrollConfig = {
  pages: 4,
  sections: [
    { topClass: 'top-0' },            // Section 1
    { topClass: 'top-[100svh]' },     // Section 2
    { topClass: 'top-[200svh]' },     // Section 3
    { topClass: 'top-[300svh]' }      // Section 4
  ],
};

export const SCROLL_CONFIG = {
  desktop: commonScrollConfig,
  tablet: commonScrollConfig,
  mobile: commonScrollConfig,
};