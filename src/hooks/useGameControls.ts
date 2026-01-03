import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';

export const useGameControls = () => {
    const {
        appState,
        setKeyPressed,
        clearKeys,
        toggleMenu,
        isAmplified,
        setAmplified,
        setProfileActive,
        isMenuOpen,
        setActiveExhibit
    } = useStore();

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Don't process if menu is open
        if (isMenuOpen && event.code !== 'Escape' && event.code !== 'KeyM') return;

        // Prevent default for game keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Escape'].includes(event.code)) {
            event.preventDefault();
        }

        // Movement keys - continuous press tracking
        // Only close magnification if not actively in a circle (let circle logic handle it)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
            setKeyPressed(event.code, true);
        }

        // Escape - Exit amplified view or close menu
        if (event.code === 'Escape') {
            if (isAmplified) {
                setAmplified(false);
                setProfileActive(false);
                setActiveExhibit(null);
            } else if (isMenuOpen) {
                toggleMenu();
            }
        }

        // M - Toggle menu (only when not amplified)
        if (event.code === 'KeyM' && !isAmplified) {
            if (!isMenuOpen) {
                clearKeys();
            }
            toggleMenu();
        }
    }, [appState, clearKeys, isAmplified, isMenuOpen, setKeyPressed, setAmplified, setProfileActive, toggleMenu, setActiveExhibit]);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        // Release movement keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
            setKeyPressed(event.code, false);
        }
    }, [setKeyPressed]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);
};
