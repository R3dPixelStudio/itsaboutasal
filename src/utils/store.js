import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SCROLL_CONFIG } from './Configs.js';

export const useBookStore = create(subscribeWithSelector((set, get) => ({
  // --- STATE SLICES ---
  selectedBookId: null,
  currentPage: 0,
  pageCount: 0,
  currentSection: 0,
  scrollToSection: null,
  deviceType: 'desktop', 
  bookState: 'SHELF',    // 'SHELF' | 'OPENING' | 'INTERACTIVE' | 'PAGES_CLOSING' | 'CLOSING'
  sectionLayouts: SCROLL_CONFIG.desktop.sections,
  
  // Loading & Puppet State
  isLoadedAndStarted: false,
  isPuppetDrawn: false,
  isPuppetReady: false,
  
  
  // Logic State
  pendingBook: null,
  exitMode: false,
  isScrollDisabled: false,

  // --- ACTIONS ---
  setDeviceType: (device) => {
    if (get().deviceType === device) return;
    const newConfig = SCROLL_CONFIG[device] || SCROLL_CONFIG.desktop;
    set({ 
      deviceType: device,
      sectionLayouts: newConfig.sections 
    });
  },

  setCurrentSection: (index) => {
    if (get().currentSection !== index) set({ currentSection: index });
  },
  
  setScrollToSection: (index) => set({ scrollToSection: index }),
  
  setBookState: (state) => set({ bookState: state }),

  selectBook: (id, count) => {
    const { selectedBookId, bookState, closeBook } = get();
   
    // CASE A: Book already open (different one)
    if (selectedBookId && selectedBookId !== id && bookState !== 'SHELF') {
      set({ pendingBook: { id, count } });
      closeBook();
      return;
    }

    // CASE B: Same book clicked
    if (selectedBookId === id) return;

    // CASE C: Standard Open
    set({
      bookState: 'OPENING',
      selectedBookId: id,
      currentPage: 0,
      pageCount: count,
      pendingBook: null, 
    });
  },

  setBookInteractive: () => {
    if (get().bookState === 'OPENING') {
      set({ bookState: 'INTERACTIVE' });
    }
  },

  closeBook: () => {
    const { currentPage, bookState, setBookStateToClosing } = get();
    if (bookState !== 'INTERACTIVE') return;

    if (currentPage === 0) {
      setBookStateToClosing();
    } else {
      set({ bookState: 'PAGES_CLOSING', currentPage: 0 });
    }
  },

  setBookStateToClosing: () => {
    set({ bookState: 'CLOSING' });
  },

  resetBookSelection: () => {
    const { pendingBook } = get();
    if (pendingBook) {
      set({
        bookState: 'OPENING', 
        selectedBookId: pendingBook.id,
        currentPage: 0,
        pageCount: pendingBook.count,
        pendingBook: null, 
      });
    } else {
      set({
        bookState: 'SHELF',
        selectedBookId: null,
        currentPage: 0,
        pageCount: 0,
      });
    }
  },
   
  setPage: (page) => {
    const { currentPage, pageCount, closeBook } = get();
    if (page < 0 || page > pageCount) {
      closeBook(); 
      return; 
    }
    if (page !== currentPage) {
      set({ currentPage: page });
    }
  },

  setLoadedAndStarted: () => set({ isLoadedAndStarted: true }),
  setPuppetDrawn: (status) => set({ isPuppetDrawn: status }),
  setPuppetReady: (status) => set({ isPuppetReady: status }),
  setExitMode: (status) => set({ exitMode: status }),
  setScrollDisabled: (status) => set({ isScrollDisabled: status }), 
})));