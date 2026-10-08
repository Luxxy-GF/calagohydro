/* Calagopus adapter for Hydrodactyl contexts/HeaderContext's slotted app header. */
import type { ReactNode } from 'react';
import { create } from 'zustand';

export const useHeaderSlots = create<{
  owner: string | null;
  center: ReactNode;
  right: ReactNode;
  set: (owner: string, center: ReactNode, right: ReactNode) => void;
  clear: (owner: string) => void;
}>((set) => ({
  owner: null,
  center: null,
  right: null,
  set: (owner, center, right) => set({ owner, center, right }),
  clear: (owner) => set((state) => (state.owner === owner ? { owner: null, center: null, right: null } : state)),
}));
