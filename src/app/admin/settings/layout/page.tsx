'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Navigation, FileText, Plus, Trash2 } from 'lucide-react'
import { api } from '@/lib/trpc/client'

interface MenuItem {
  label: string
  url: string
  external: boolean
}

interface SocialMedia {
  platform: string
  url: string
  icon: string
}

interface LayoutConfig {
  navbar: {
    logo: string
    backgroundColor: string
    textColor: string
    position: 'top' | 'bottom'
    showSearch: boolean
    menuItems: MenuItem[]
  }
  footer: {
    backgroundColor: string
    textColor: string
    copyright: string
    links: MenuItem[]
    socialMedia: SocialMedia[]
  }
  header: {
    title: string
    description: string
    showBreadcrumbs: boolean
  }
}

export default function LayoutSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<LayoutConfig>({
    navbar: {
      logo: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      position: 'top',
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
  })

  const [newMenuItem, setNewMenuItem] = useState({ label: '', url: '', external: false })
  const [newSocialMedia, setNewSocialMedia] = useState({ platform: '', url: '', icon: '' })

  // Verificar autenticación
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  // Obtener configuración actual
  const { data: currentConfig, refetch } = api.settings.getLayout.useQuery()
  const setLayoutMutation = api.settings.setLayout.useMutation({
    onError: (error) => {
      console.error('Error saving layout:', error)
      // Show error notification
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          title: 'Error de Autenticación',
          message: 'Necesitas estar autenticado para guardar cambios.'
        }
      })
      window.dispatchEvent(event)
    }
  })

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig)
    }
  }, [currentConfig])

  const handleConfigChange = (section: keyof LayoutConfig, field: string, value: string | boolean | Array<{ label: string; url: string; external?: boolean }>) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addMenuItem = () => {
    if (newMenuItem.label && newMenuItem.url) {
      setConfig(prev => ({
        ...prev,
        navbar: {
          ...prev.navbar,
          menuItems: [...prev.navbar.menuItems, newMenuItem]
        }
      }))
      setNewMenuItem({ label: '', url: '', external: false })
    }
  }

  const removeMenuItem = (index: number) => {
    setConfig(prev => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        menuItems: prev.navbar.menuItems.filter((_, i) => i !== index)
      }
    }))
  }

  const addFooterLink = () => {
    if (newMenuItem.label && newMenuItem.url) {
      setConfig(prev => ({
        ...prev,
        footer: {
          ...prev.footer,
          links: [...prev.footer.links, newMenuItem]
        }
      }))
      setNewMenuItem({ label: '', url: '', external: false })
    }
  }

  const removeFooterLink = (index: number) => {
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: prev.footer.links.filter((_, i) => i !== index)
      }
    }))
  }

  const addSocialMedia = () => {
    if (newSocialMedia.platform && newSocialMedia.url) {
      setConfig(prev => ({
        ...prev,
        footer: {
          ...prev.footer,
          socialMedia: [...prev.footer.socialMedia, newSocialMedia]
        }
      }))
      setNewSocialMedia({ platform: '', url: '', icon: '' })
    }
  }

  const removeSocialMedia = (index: number) => {
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialMedia: prev.footer.socialMedia.filter((_, i) => i !== index)
      }
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // First, try to refresh the session
      try {
        await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch {
        console.log('Session refresh failed, continuing with save...')
      }

      await setLayoutMutation.mutateAsync(config)
      
      // Show success notification
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: 'Configuración guardada',
          message: 'Los cambios del layout se han guardado correctamente.'
        }
      })
      window.dispatchEvent(event)
      
      await refetch()
    } catch (error) {
      console.error('Error saving layout config:', error)
      // Show error notification
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          title: 'Error',
          message: 'No se pudieron guardar los cambios del layout.'
        }
      })
      window.dispatchEvent(event)
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading mientras verifica autenticación
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!session) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración de Layout</h1>
        <p className="text-gray-600">Personaliza la apariencia de tu sitio web</p>
        
        {/* Debug Info */}
        {session && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Información de Sesión:</h3>
            <p><strong>Usuario:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Rol:</strong> {session.user?.role}</p>
            <p><strong>ID:</strong> {session.user?.id}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="navbar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="navbar" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Navbar
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="header" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Header
          </TabsTrigger>
        </TabsList>

        {/* Navbar Configuration */}
        <TabsContent value="navbar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Configuración del Navbar
              </CardTitle>
              <CardDescription>
                Personaliza la barra de navegación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="navbarLogo">Logo URL</Label>
                  <Input
                    id="navbarLogo"
                    value={config.navbar.logo}
                    onChange={(e) => handleConfigChange('navbar', 'logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navbarPosition">Posición</Label>
                  <select
                    id="navbarPosition"
                    value={config.navbar.position}
                    onChange={(e) => handleConfigChange('navbar', 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Seleccionar posición del navbar"
                  >
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="navbarBgColor">Color de Fondo</Label>
                  <Input
                    id="navbarBgColor"
                    type="color"
                    value={config.navbar.backgroundColor}
                    onChange={(e) => handleConfigChange('navbar', 'backgroundColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navbarTextColor">Color de Texto</Label>
                  <Input
                    id="navbarTextColor"
                    type="color"
                    value={config.navbar.textColor}
                    onChange={(e) => handleConfigChange('navbar', 'textColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar Búsqueda</Label>
                  <p className="text-sm text-gray-500">
                    Mostrar barra de búsqueda en el navbar
                  </p>
                </div>
                <Switch
                  checked={config.navbar.showSearch}
                  onCheckedChange={(checked) => handleConfigChange('navbar', 'showSearch', checked)}
                />
              </div>

              <Separator />

              {/* Menu Items */}
              <div className="space-y-4">
                <div>
                  <Label>Elementos del Menú</Label>
                  <div className="mt-2 space-y-2">
                    {config.navbar.menuItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="flex-1">{item.label}</span>
                        <span className="text-sm text-gray-500">{item.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMenuItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Etiqueta"
                    value={newMenuItem.label}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, label: e.target.value }))}
                  />
                  <Input
                    placeholder="URL"
                    value={newMenuItem.url}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, url: e.target.value }))}
                  />
                  <Button onClick={addMenuItem} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Configuration */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configuración del Footer
              </CardTitle>
              <CardDescription>
                Personaliza el pie de página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="footerBgColor">Color de Fondo</Label>
                  <Input
                    id="footerBgColor"
                    type="color"
                    value={config.footer.backgroundColor}
                    onChange={(e) => handleConfigChange('footer', 'backgroundColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerTextColor">Color de Texto</Label>
                  <Input
                    id="footerTextColor"
                    type="color"
                    value={config.footer.textColor}
                    onChange={(e) => handleConfigChange('footer', 'textColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerCopyright">Copyright</Label>
                <Input
                  id="footerCopyright"
                  value={config.footer.copyright}
                  onChange={(e) => handleConfigChange('footer', 'copyright', e.target.value)}
                  placeholder="© 2024 Mi Sitio. Todos los derechos reservados."
                />
              </div>

              <Separator />

              {/* Footer Links */}
              <div className="space-y-4">
                <div>
                  <Label>Enlaces del Footer</Label>
                  <div className="mt-2 space-y-2">
                    {config.footer.links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="flex-1">{link.label}</span>
                        <span className="text-sm text-gray-500">{link.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFooterLink(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Etiqueta"
                    value={newMenuItem.label}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, label: e.target.value }))}
                  />
                  <Input
                    placeholder="URL"
                    value={newMenuItem.url}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, url: e.target.value }))}
                  />
                  <Button onClick={addFooterLink} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Social Media */}
              <div className="space-y-4">
                <div>
                  <Label>Redes Sociales</Label>
                  <div className="mt-2 space-y-2">
                    {config.footer.socialMedia.map((social, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="flex-1">{social.platform}</span>
                        <span className="text-sm text-gray-500">{social.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialMedia(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Plataforma"
                    value={newSocialMedia.platform}
                    onChange={(e) => setNewSocialMedia(prev => ({ ...prev, platform: e.target.value }))}
                  />
                  <Input
                    placeholder="URL"
                    value={newSocialMedia.url}
                    onChange={(e) => setNewSocialMedia(prev => ({ ...prev, url: e.target.value }))}
                  />
                  <Button onClick={addSocialMedia} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Header Configuration */}
        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración del Header
              </CardTitle>
              <CardDescription>
                Personaliza el encabezado de las páginas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerTitle">Título del Sitio</Label>
                <Input
                  id="headerTitle"
                  value={config.header.title}
                  onChange={(e) => handleConfigChange('header', 'title', e.target.value)}
                  placeholder="Mi Sitio Web"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headerDescription">Descripción</Label>
                <Textarea
                  id="headerDescription"
                  value={config.header.description}
                  onChange={(e) => handleConfigChange('header', 'description', e.target.value)}
                  placeholder="Descripción de tu sitio web"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar Breadcrumbs</Label>
                  <p className="text-sm text-gray-500">
                    Mostrar navegación de breadcrumbs en las páginas
                  </p>
                </div>
                <Switch
                  checked={config.header.showBreadcrumbs}
                  onCheckedChange={(checked) => handleConfigChange('header', 'showBreadcrumbs', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={async () => {
              try {
                // Clear any cached data first
                if (typeof window !== 'undefined') {
                  localStorage.clear()
                  sessionStorage.clear()
                }
                
                // Sign out and redirect to login
                await signOut({ 
                  callbackUrl: '/login',
                  redirect: true 
                })
              } catch (error) {
                console.error('Error during logout:', error)
                // Force redirect to login page
                window.location.href = '/login'
              }
            }}
          >
            Cerrar Sesión y Volver a Iniciar
          </Button>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  )
} 