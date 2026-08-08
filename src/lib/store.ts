import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Announcement } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  announcements: Announcement[];
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  selectProject: (projectId: string) => void;
  addAnnouncement: (announcement: Announcement) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      announcements: [],

      login: (email: string, password: string) => {
        if (email === 'admin@xrlab.com' && password === 'admin123') {
          set({
            user: {
              id: '1',
              name: 'Admin User',
              email: 'admin@xrlab.com',
              role: 'admin',
              joinedAt: new Date().toISOString(),
            },
            isAuthenticated: true,
          });
        } else if (email === 'student@xrlab.com' && password === 'student123') {
          set({
            user: {
              id: '2',
              name: 'Student User',
              email: 'student@xrlab.com',
              role: 'student',
              studentId: 'STU-2024-001',
              joinedAt: new Date().toISOString(),
            },
            isAuthenticated: true,
          });
        }
      },

      register: (name: string, email: string, _password: string, role: UserRole) => {
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          role,
          joinedAt: new Date().toISOString(),
        };
        set({
          user: newUser,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      selectProject: (projectId: string) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, selectedProjectId: projectId }
            : null,
        }));
      },

      addAnnouncement: (announcement: Announcement) => {
        set((state) => ({
          announcements: [announcement, ...state.announcements],
        }));
      },
    }),
    {
      name: 'xr-aquarium-store',
    }
  )
);
