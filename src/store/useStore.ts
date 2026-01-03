import { create } from 'zustand';

export type ExhibitData = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    year: string;
    type: 'milestone' | 'project' | 'certification' | 'achievement';
    color: string;
    position: { x: number; z: number };
    wall: 'left' | 'right' | 'center';
    logo?: string; // URL or path to organization logo
    documents?: {
        type: 'offer-letter' | 'certification' | 'repository' | 'other';
        name: string;
        url: string;
    }[];
    externalLinks?: {
        label: string;
        url: string;
    }[];
};

type AppState = 'LOADING' | 'MUSEUM';

type Store = {
    appState: AppState;
    setAppState: (state: AppState) => void;
    characterPosition: { x: number; z: number };
    setCharacterPosition: (pos: { x: number; z: number }) => void;
    characterRotation: number;
    setCharacterRotation: (rotation: number) => void;
    activeExhibit: ExhibitData | null;
    setActiveExhibit: (exhibit: ExhibitData | null) => void;
    isProfileActive: boolean;
    setProfileActive: (active: boolean) => void;
    isAmplified: boolean;
    setAmplified: (amplified: boolean) => void;
    keysPressed: Set<string>;
    setKeyPressed: (key: string, pressed: boolean) => void;
    clearKeys: () => void;
    isMenuOpen: boolean;
    toggleMenu: () => void;
};

export const useStore = create<Store>((set) => ({
    appState: 'LOADING',
    setAppState: (state) => set({ appState: state }),
    characterPosition: { x: 0, z: -4 },
    setCharacterPosition: (pos) => set({ characterPosition: pos }),
    characterRotation: 0,
    setCharacterRotation: (rotation) => set({ characterRotation: rotation }),
    activeExhibit: null,
    setActiveExhibit: (exhibit) => set({ activeExhibit: exhibit }),
    isProfileActive: false,
    setProfileActive: (active) => set({ isProfileActive: active }),
    isAmplified: false,
    setAmplified: (amplified) => set({ isAmplified: amplified }),
    keysPressed: new Set(),
    setKeyPressed: (key, pressed) =>
        set((state) => {
            const newKeys = new Set(state.keysPressed);
            if (pressed) {
                newKeys.add(key);
            } else {
                newKeys.delete(key);
            }
            return { keysPressed: newKeys };
        }),
    clearKeys: () => set({ keysPressed: new Set() }),
    isMenuOpen: false,
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
