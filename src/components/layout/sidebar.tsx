"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Activity, Stethoscope, Settings, LucideIcon } from "lucide-react"
import { useStore } from "@/store/use-store"

export function Sidebar() {
  const role = useStore((state) => state.role)
  const pathname = usePathname()

  const profileInfo = {
    admin: { initials: 'MK', name: 'Dr. Mehmet Kaya', title: 'Kurucu & Baş Hekim' },
    staff: { initials: 'CK', name: 'Cansu Koç', title: 'Vezne & Hasta Kabul' },
    audit: { initials: 'DH', name: 'Denetim Hesabı', title: 'Resmi İnceleme' },
  }[role]

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">Arven Klinik</h1>
        <p className="text-xs text-white/50 tracking-widest mt-1">DENTAL PRACTICE</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <NavItem href="/" icon={LayoutDashboard} label="Ana Sayfa" currentPath={pathname} />
        <NavItem href="/hastalar" icon={Users} label="Hastalar" currentPath={pathname} />
        <NavItem href="/islemler" icon={Activity} label="İşlemler" currentPath={pathname} />
        <NavItem href="/hekimler" icon={Stethoscope} label="Hekimler" currentPath={pathname} />
        <NavItem href="/ayarlar" icon={Settings} label="Ayarlar" currentPath={pathname} />
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
            {profileInfo.initials}
          </div>
          <div>
            <p className="text-sm font-medium">{profileInfo.name}</p>
            <p className="text-xs text-white/50">{profileInfo.title}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ href, icon: Icon, label, currentPath }: { href: string; icon: LucideIcon; label: string; currentPath: string }) {
  const isActive = currentPath === href
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  )
}
