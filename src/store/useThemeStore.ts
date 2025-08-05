import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  theme: Theme
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogImage: string
  }
  social: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
}

interface ThemeStore {
  currentTheme: Theme
  siteSettings: SiteSettings
  availableThemes: Theme[]
  setTheme: (theme: Theme) => void
  updateSiteSettings: (settings: Partial<SiteSettings>) => void
  resetToDefault: () => void
}

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  colors: {
    primary: '#60A5FA',
    secondary: '#9CA3AF',
    accent: '#34D399',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

const defaultSiteSettings: SiteSettings = {
  siteName: 'My CMS',
  siteDescription: 'A modern content management system',
  logo: '',
  favicon: '',
  theme: defaultTheme,
  seo: {
    metaTitle: 'My CMS - Modern Content Management',
    metaDescription: 'A powerful and modern content management system',
    metaKeywords: 'cms, content management, blog, website',
    ogImage: '',
  },
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
  },
  contact: {
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
  },
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: defaultTheme,
      siteSettings: defaultSiteSettings,
      availableThemes: [defaultTheme, darkTheme],

      setTheme: (theme) => {
        set((state) => ({
          currentTheme: theme,
          siteSettings: {
            ...state.siteSettings,
            theme,
          },
        }))
      },

      updateSiteSettings: (settings) => {
        set((state) => ({
          siteSettings: {
            ...state.siteSettings,
            ...settings,
          },
        }))
      },

      resetToDefault: () => {
        set({
          currentTheme: defaultTheme,
          siteSettings: defaultSiteSettings,
        })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
) 