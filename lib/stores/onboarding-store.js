import { create } from 'zustand';

export const useOnboardingStore = create((set) => ({
  teamName: '',
  timeZone: 'America/Los_Angeles',
  step: 1,
  setTeamName: (teamName) => set({ teamName }),
  setTimeZone: (timeZone) => set({ timeZone }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  reset: () => set({ teamName: '', timeZone: 'America/Los_Angeles', step: 1 })
}));
