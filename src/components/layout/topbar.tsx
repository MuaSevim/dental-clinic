"use client"
import { useState, useRef, useEffect } from "react"
import { Search, Plus, User, Check, ChevronDown } from "lucide-react"
import { useStore } from "@/store/use-store"
import { Role } from "@/types"

export function Topbar() {
  const { role, setRole } = useStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Menü dışına tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const accounts: { role: Role; name: string; title: string }[] = [
    { role: 'admin', name: 'Dr. Mehmet Kaya', title: 'Klinik Sahibi & Baş Hekim' },
    { role: 'staff', name: 'Cansu Koç', title: 'Vezne & Hasta Kabul' },
    { role: 'audit', name: 'Denetim Hesabı', title: 'Resmi Denetim / Mali İnceleme' },
  ]

  const activeAccount = accounts.find((a) => a.role === role) || accounts[0]

  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8 ml-64 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          KLİNİK AÇIK - 4 ÜNİTE AKTİF
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Hasta adı, TC kimlik..." 
            className="pl-9 pr-4 py-2 w-72 bg-gray-50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <button className="flex items-center gap-2 bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          İşlem Yap
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Gerçekçi Hesap Değiştirici */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-border"
          >
            <div className="w-9 h-9 rounded-full bg-foreground text-white flex items-center justify-center font-semibold text-xs">
              {role === 'admin' ? 'MK' : role === 'staff' ? 'CK' : 'DH'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-foreground leading-none">{activeAccount.name}</p>
              <p className="text-[10px] text-muted leading-tight mt-0.5">{activeAccount.title}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-border p-1.5 z-50">
              <div className="px-3 py-2 border-b border-border/60">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Aktif Oturum Değiştir</p>
              </div>
              <div className="py-1">
                {accounts.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => {
                      setRole(acc.role)
                      setDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                      role === acc.role ? 'bg-gray-100 font-semibold text-foreground' : 'text-muted hover:bg-gray-50 hover:text-foreground'
                    }`}
                  >
                    <div>
                      <p>{acc.name}</p>
                      <p className="text-[10px] text-muted">{acc.title}</p>
                    </div>
                    {role === acc.role && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
