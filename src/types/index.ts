// Core Types for the 3D Portfolio Application

export type AchievementType = 'major' | 'minor' | 'project' | 'certification';
export type SceneType = 'entry' | 'corridor' | 'heroRoom' | 'sideWing' | 'projectsWing';
export type ThemeColor = 'gold' | 'purple' | 'blue' | 'green' | 'orange' | 'neutral';

export interface Achievement {
  id: string;
  type: AchievementType;
  levelIndex: number;
  title: string;
  shortLabel: string;
  narrative: string;
  year: string;
  assets: string[];
  themeColor: ThemeColor;
  sceneType: SceneType;
  prev: string | null;
  next: string | null;
  position: {
    x: number;
    z: number;
  };
}

export interface Project {
  id: string;
  title: string;
  problem: string;
  thinking: string;
  execution: string;
  outcome: string;
  themeColor: ThemeColor;
  githubUrl?: string;
  demoUrl?: string;
  assets: string[];
}

export interface Identity {
  name: string;
  tagline: string;
  whoIAm: string;
  whatIBuild: string;
  whatIOptimizeFor: string;
  avatarModel?: string;
}

export type AppState = 
  | 'LOADING'
  | 'ENTRY'
  | 'GALLERY'
  | 'HERO_ROOM'
  | 'SIDE_GALLERY'
  | 'PROJECTS_WING'
  | 'IDENTITY_OVERLAY'
  | 'MENU';

export interface CameraTarget {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
}

export interface NavigationState {
  currentAchievementIndex: number;
  currentSceneType: SceneType;
  previousPosition: { x: number; z: number } | null;
  isTransitioning: boolean;
}
