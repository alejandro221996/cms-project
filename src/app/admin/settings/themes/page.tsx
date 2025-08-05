'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Globe, Image, Settings, Download, Upload } from 'lucide-react'
import { useThemeStore, type Theme, type SiteSettings } from '@/store/useThemeStore'
import { ColorPicker } from '@/components/themes/ColorPicker'
import { showNotification } from '@/components/notifications/ToastContainer'

export default function ThemeSettingsPage() {
  const { currentTheme, siteSettings, availableThemes, setTheme, updateSiteSettings, resetToDefault } = useThemeStore()
  const [activeTab, setActiveTab] = useState('general')
  const [previewTheme, setPreviewTheme] = useState<Theme>(currentTheme)

  const handleThemeChange = (theme: Theme) => {
    setPreviewTheme(theme)
    setTheme(theme)
    showNotification(
      'Theme Updated',
      `Theme "${theme.name}" has been applied successfully.`,
      'success'
    )
  }

  const handleSiteSettingChange = (key: keyof SiteSettings, value: string | boolean | object) => {
    updateSiteSettings({ [key]: value })
  }

  const handleColorChange = (colorKey: keyof Theme['colors'], value: string) => {
    const updatedTheme = {
      ...previewTheme,
      colors: {
        ...previewTheme.colors,
        [colorKey]: value,
      },
    }
    setPreviewTheme(updatedTheme)
    setTheme(updatedTheme)
  }

  const handleSaveSettings = () => {
    showNotification(
      'Settings Saved',
      'Your site settings have been updated successfully.',
      'success'
    )
  }

  const handleExportTheme = () => {
    const themeData = JSON.stringify(currentTheme, null, 2)
    const blob = new Blob([themeData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentTheme.name}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const theme = JSON.parse(e.target?.result as string)
          setTheme(theme)
          showNotification(
            'Theme Imported',
            `Theme "${theme.name}" has been imported successfully.`,
            'success'
          )
        } catch {
          showNotification(
            'Import Error',
            'Failed to import theme. Please check the file format.',
            'error'
          )
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Theme & Customization</h1>
        <p className="mt-2 text-gray-600">
          Customize your site&apos;s appearance and branding
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={siteSettings.siteName}
                    onChange={(e) => handleSiteSettingChange('siteName', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    value={siteSettings.siteDescription}
                    onChange={(e) => handleSiteSettingChange('siteDescription', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={siteSettings.contact.email}
                    onChange={(e) => handleSiteSettingChange('contact', {
                      ...siteSettings.contact,
                      email: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={siteSettings.contact.phone}
                    onChange={(e) => handleSiteSettingChange('contact', {
                      ...siteSettings.contact,
                      phone: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    value={siteSettings.seo.metaTitle}
                    onChange={(e) => handleSiteSettingChange('seo', {
                      ...siteSettings.seo,
                      metaTitle: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={siteSettings.seo.metaDescription}
                    onChange={(e) => handleSiteSettingChange('seo', {
                      ...siteSettings.seo,
                      metaDescription: e.target.value
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="meta-keywords">Meta Keywords</Label>
                  <Input
                    id="meta-keywords"
                    value={siteSettings.seo.metaKeywords}
                    onChange={(e) => handleSiteSettingChange('seo', {
                      ...siteSettings.seo,
                      metaKeywords: e.target.value
                    })}
                    className="mt-1"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="themes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        currentTheme.id === theme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleThemeChange(theme)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{theme.name}</h3>
                          <p className="text-sm text-gray-500">Theme ID: {theme.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                                                         <div
                               className="w-4 h-4 rounded-full border"
                               style={{ backgroundColor: theme.colors.primary }}
                               role="img"
                               aria-label="Primary color"
                             />
                                                         <div
                               className="w-4 h-4 rounded-full border"
                               style={{ backgroundColor: theme.colors.secondary }}
                               role="img"
                               aria-label="Secondary color"
                             />
                                                         <div
                               className="w-4 h-4 rounded-full border"
                               style={{ backgroundColor: theme.colors.accent }}
                               role="img"
                               aria-label="Accent color"
                             />
                          </div>
                          {currentTheme.id === theme.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customize Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Primary Color"
                  value={previewTheme.colors.primary}
                  onChange={(value) => handleColorChange('primary', value)}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={previewTheme.colors.secondary}
                  onChange={(value) => handleColorChange('secondary', value)}
                />
                <ColorPicker
                  label="Accent Color"
                  value={previewTheme.colors.accent}
                  onChange={(value) => handleColorChange('accent', value)}
                />
                <ColorPicker
                  label="Background Color"
                  value={previewTheme.colors.background}
                  onChange={(value) => handleColorChange('background', value)}
                />
                <ColorPicker
                  label="Surface Color"
                  value={previewTheme.colors.surface}
                  onChange={(value) => handleColorChange('surface', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={previewTheme.colors.text}
                  onChange={(value) => handleColorChange('text', value)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={siteSettings.logo}
                    onChange={(e) => handleSiteSettingChange('logo', e.target.value)}
                    className="mt-1"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="favicon-url">Favicon URL</Label>
                  <Input
                    id="favicon-url"
                    value={siteSettings.favicon}
                    onChange={(e) => handleSiteSettingChange('favicon', e.target.value)}
                    className="mt-1"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>

                <div>
                  <Label htmlFor="og-image">Open Graph Image</Label>
                  <Input
                    id="og-image"
                    value={siteSettings.seo.ogImage}
                    onChange={(e) => handleSiteSettingChange('seo', {
                      ...siteSettings.seo,
                      ogImage: e.target.value
                    })}
                    className="mt-1"
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={siteSettings.social.facebook}
                    onChange={(e) => handleSiteSettingChange('social', {
                      ...siteSettings.social,
                      facebook: e.target.value
                    })}
                    className="mt-1"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={siteSettings.social.twitter}
                    onChange={(e) => handleSiteSettingChange('social', {
                      ...siteSettings.social,
                      twitter: e.target.value
                    })}
                    className="mt-1"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={siteSettings.social.instagram}
                    onChange={(e) => handleSiteSettingChange('social', {
                      ...siteSettings.social,
                      instagram: e.target.value
                    })}
                    className="mt-1"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={siteSettings.social.linkedin}
                    onChange={(e) => handleSiteSettingChange('social', {
                      ...siteSettings.social,
                      linkedin: e.target.value
                    })}
                    className="mt-1"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleExportTheme} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Theme
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 relative">
                    <Upload className="h-4 w-4" />
                    Import Theme
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportTheme}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Import theme file"
                    />
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={resetToDefault}
                    className="text-red-600 hover:text-red-700"
                  >
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: previewTheme.colors.background,
                    color: previewTheme.colors.text,
                    borderColor: previewTheme.colors.border,
                  }}
                >
                  <h3 className="font-medium mb-2">Theme Preview</h3>
                  <p className="text-sm" style={{ color: previewTheme.colors.textSecondary }}>
                    This is how your theme will look with the current settings.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      style={{ backgroundColor: previewTheme.colors.primary }}
                    >
                      Primary Button
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ borderColor: previewTheme.colors.border }}
                    >
                      Secondary Button
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetToDefault}>
          Reset All
        </Button>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  )
} 