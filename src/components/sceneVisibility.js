import { createContext, useContext } from 'react';

export const VisibleContext = createContext(true);

// True while the surrounding <SceneCanvas> is actually on screen. Scenes use it
// to start entrance animations and video playback only when someone can see them.
export const useSceneVisible = () => useContext(VisibleContext);
