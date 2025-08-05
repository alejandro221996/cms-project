import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc'
import { db } from '../db'

// Schema para configuraciones del layout
const layoutSettingsSchema = z.object({
  navbar: z.object({
    logo: z.string().optional(),
    backgroundColor: z.string().default('#ffffff'),
    textColor: z.string().default('#000000'),
    position: z.enum(['top', 'bottom']).default('top'),
    showSearch: z.boolean().default(true),
    menuItems: z.array(z.object({
      label: z.string(),
      url: z.string(),
      external: z.boolean().default(false)
    })).default([])
  }),
  footer: z.object({
    backgroundColor: z.string().default('#f8f9fa'),
    textColor: z.string().default('#6c757d'),
    copyright: z.string().default('© 2024 CMS Admin. All rights reserved.'),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
      external: z.boolean().default(false)
    })).default([]),
    socialMedia: z.array(z.object({
      platform: z.string(),
      url: z.string(),
      icon: z.string()
    })).default([])
  }),
  header: z.object({
    title: z.string().default('CMS Admin'),
    description: z.string().optional(),
    showBreadcrumbs: z.boolean().default(true)
  })
})

export const settingsRouter = createTRPCRouter({
  // Obtener todas las configuraciones
  getAll: publicProcedure
    .query(async () => {
      const settings = await db.siteSettings.findMany()
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, string>)
      
      return settingsMap
    }),

  // Obtener configuración específica
  get: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const setting = await db.siteSettings.findUnique({
        where: { key: input }
      })
      return setting?.value || null
    }),

  // Guardar configuración
  set: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
      description: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const setting = await db.siteSettings.upsert({
        where: { key: input.key },
        update: {
          value: input.value,
          description: input.description,
          updatedAt: new Date()
        },
        create: {
          key: input.key,
          value: input.value,
          description: input.description
        }
      })
      return setting
    }),

  // Guardar configuración de layout
  setLayout: adminProcedure
    .input(layoutSettingsSchema)
    .mutation(async ({ input }) => {
      const layoutConfig = JSON.stringify(input)
      
      const setting = await db.siteSettings.upsert({
        where: { key: 'layout_config' },
        update: {
          value: layoutConfig,
          description: 'Layout configuration for navbar, footer, and header',
          updatedAt: new Date()
        },
        create: {
          key: 'layout_config',
          value: layoutConfig,
          description: 'Layout configuration for navbar, footer, and header'
        }
      })
      
      return setting
    }),

  // Obtener configuración de layout
  getLayout: publicProcedure
    .query(async () => {
      const setting = await db.siteSettings.findUnique({
        where: { key: 'layout_config' }
      })
      
      if (!setting) {
        // Retornar configuración por defecto
        return {
          navbar: {
            logo: '',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            position: 'top' as const,
            showSearch: true,
            menuItems: []
          },
          footer: {
            backgroundColor: '#f8f9fa',
            textColor: '#6c757d',
            copyright: '© 2024 CMS Admin. All rights reserved.',
            links: [],
            socialMedia: []
          },
          header: {
            title: 'CMS Admin',
            description: '',
            showBreadcrumbs: true
          }
        }
      }
      
      try {
        return JSON.parse(setting.value)
      } catch {
        // Si hay error al parsear, retornar configuración por defecto
        return {
          navbar: {
            logo: '',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            position: 'top' as const,
            showSearch: true,
            menuItems: []
          },
          footer: {
            backgroundColor: '#f8f9fa',
            textColor: '#6c757d',
            copyright: '© 2024 CMS Admin. All rights reserved.',
            links: [],
            socialMedia: []
          },
          header: {
            title: 'CMS Admin',
            description: '',
            showBreadcrumbs: true
          }
        }
      }
    }),

  // Eliminar configuración
  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.siteSettings.delete({
        where: { key: input }
      })
      return { success: true }
    })
}) 