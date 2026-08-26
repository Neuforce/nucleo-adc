import type { LucideIcon } from 'lucide-react'

export interface App {
  id: string
  nombre: string
  Icono: LucideIcon
  badge?: number
  urgente?: boolean
}

export interface MenuItem {
  id: string
  etiqueta: string
  href?: string
  badge?: number
  subitems?: MenuItem[]
}

export interface MenuGrupo {
  rotulo?: string
  items: MenuItem[]
}
