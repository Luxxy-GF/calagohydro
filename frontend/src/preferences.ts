import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'com.luxxy.hydrodactyl.sidebarMinimized';
const CHANGE_EVENT = 'hydrodactyl:sidebar-change';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function useSidebarPreference(): [boolean, (value: boolean) => void] {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    const update = () => setCollapsed(readCollapsed());
    window.addEventListener('storage', update);
    window.addEventListener(CHANGE_EVENT, update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener(CHANGE_EVENT, update);
    };
  }, []);

  return [
    collapsed,
    (value) => {
      setCollapsed(value);
      try {
        localStorage.setItem(STORAGE_KEY, String(value));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {
        // Private browsing may deny storage. Navigation still works in memory.
      }
    },
  ];
}

const VIEW_KEY = 'com.luxxy.hydrodactyl.serverView';
const VIEW_EVENT = 'hydrodactyl:view-change';
export type ServerView = 'list' | 'grid';

function readView(): ServerView {
  try {
    return localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'list';
  } catch {
    return 'list';
  }
}

export function useServerView(): [ServerView, (value: ServerView) => void] {
  const [view, setView] = useState(readView);
  useEffect(() => {
    const update = (event: Event) =>
      setView(
        event instanceof CustomEvent && (event.detail === 'list' || event.detail === 'grid')
          ? event.detail
          : readView(),
      );
    window.addEventListener('storage', update);
    window.addEventListener(VIEW_EVENT, update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener(VIEW_EVENT, update);
    };
  }, []);
  const updateView = useCallback((value: ServerView) => {
    setView(value);
    try {
      localStorage.setItem(VIEW_KEY, value);
    } catch {
      // Continue with the in-memory preference when storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent(VIEW_EVENT, { detail: value }));
  }, []);
  return [view, updateView];
}
