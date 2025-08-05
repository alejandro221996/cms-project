'use client'

import { DynamicNavbar } from '@/components/layout/DynamicNavbar'
import { DynamicFooter } from '@/components/layout/DynamicFooter'
import { useLayoutConfig } from '@/hooks/useLayoutConfig'

export default function LayoutPreviewPage() {
  const { layoutConfig, isLoading } = useLayoutConfig()

  return (
    <div className="min-h-screen flex flex-col">
      <DynamicNavbar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Vista Previa del Layout</h1>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p>Cargando configuración...</p>
            </div>
          ) : layoutConfig ? (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Configuración Actual</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(layoutConfig, null, 2)}
                </pre>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Ve a <code className="bg-gray-100 px-2 py-1 rounded">/admin/settings/layout</code></li>
                  <li>Configura el navbar, footer y header según tus preferencias</li>
                  <li>Guarda los cambios</li>
                  <li>Regresa a esta página para ver los cambios aplicados</li>
                </ol>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Características del Layout</h2>
                <ul className="space-y-2">
                  <li>✅ <strong>Navbar dinámico</strong> con colores, logo y menú personalizables</li>
                  <li>✅ <strong>Footer configurable</strong> con enlaces y redes sociales</li>
                  <li>✅ <strong>Header personalizable</strong> con título y descripción</li>
                  <li>✅ <strong>Cambios en tiempo real</strong> sin necesidad de reiniciar</li>
                  <li>✅ <strong>Configuración persistente</strong> en la base de datos</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-red-600">Error al cargar la configuración</p>
            </div>
          )}
        </div>
      </main>
      
      <DynamicFooter />
    </div>
  )
} 