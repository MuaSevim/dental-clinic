"use client"
import { useState } from "react"
import { 
  Search, 
  UserPlus, 
  User, 
  Phone, 
  FileText, 
  Clock, 
  CreditCard, 
  AlertCircle, 
  Check, 
  X,
  Eye,
  EyeOff
} from "lucide-react"
import { useStore, selectProceduresForRole } from "@/store/use-store"
import { Patient } from "@/types"

export default function HastalarPage() {
  const store = useStore()
  const { patients, role, addPatient, toggleVisibility } = store
  
  const visibleProcedures = selectProceduresForRole(store)

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)

  // Yeni Hasta Form State'i
  const [newName, setNewName] = useState('')
  const [newTc, setNewTc] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAge, setNewAge] = useState(30)
  const [newNotes, setNewNotes] = useState('')

  // Arama Filtresi
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tc.includes(searchTerm) ||
    p.phone.includes(searchTerm)
  )

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0]

  // Seçili hastanın role göre filtrelenmiş işlem geçmişi
  const patientProcedures = visibleProcedures.filter(p => p.patientId === selectedPatient?.id)
  const totalPatientSpend = patientProcedures.reduce((acc, p) => acc + p.finalPrice, 0)

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount)

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newTc) return

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      name: newName,
      tc: newTc,
      phone: newPhone || '05XX XXX XX XX',
      age: Number(newAge),
      notes: newNotes || 'Özel bir sağlık uyarısı belirtilmedi.',
    }

    addPatient(newPatient)
    setSelectedPatientId(newPatient.id)
    setIsNewPatientModalOpen(false)
    setNewName('')
    setNewTc('')
    setNewPhone('')
    setNewNotes('')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Üst Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Hasta Veritabanı</h1>
          <p className="text-xs text-muted mt-0.5">Klinik hasta kayıtları, anamnez notları ve tedavi geçmişi</p>
        </div>
        <button 
          onClick={() => setIsNewPatientModalOpen(true)}
          className="flex items-center gap-2 bg-foreground text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-foreground/90 transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Yeni Hasta Kaydı
        </button>
      </div>

      {/* İki Kolonlu Master-Detail Görünüm */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* SOL: Hasta Listesi ve Arama (5 Kolon) */}
        <div className="col-span-5 bg-white rounded-2xl border border-border shadow-sm p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="İsim, TC kimlik veya telefon ile ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredPatients.map(patient => {
              const isSelected = patient.id === selectedPatient?.id
              return (
                <div 
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-foreground bg-gray-50/80 shadow-xs' 
                      : 'border-border hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-foreground text-sm">{patient.name}</p>
                    <span className="text-[10px] text-muted bg-gray-100 px-2 py-0.5 rounded-md font-semibold">
                      {patient.age} Yaş
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                    <span>TC: {patient.tc}</span>
                    <span>•</span>
                    <span>{patient.phone}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SAĞ: Seçili Hasta Detay Kartı ve İşlem Geçmişi (7 Kolon) */}
        {selectedPatient && (
          <div className="col-span-7 space-y-6">
            {/* Hasta Profil Özeti */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-white flex items-center justify-center font-bold text-lg">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-foreground">{selectedPatient.name}</h2>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold rounded-full">
                        Kayıtlı Protokol
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted mt-1">
                      <span>TC: <strong>{selectedPatient.tc}</strong></span>
                      <span>•</span>
                      <span>Tel: <strong>{selectedPatient.phone}</strong></span>
                      <span>•</span>
                      <span>Yaş: <strong>{selectedPatient.age}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted uppercase">Toplam Harcama</p>
                  <p className="text-xl font-black text-foreground">{formatMoney(totalPatientSpend)}</p>
                </div>
              </div>

              {/* Sağlık Notu / Anamnez Uyarısı */}
              <div className="mt-4 p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">Klinik ve Tıbbi Uyarı Notu</p>
                  <p className="text-amber-800 mt-0.5">{selectedPatient.notes}</p>
                </div>
              </div>
            </div>

            {/* Hastanın Tedavi Geçmişi Tablosu */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted" />
                  <h3 className="text-sm font-bold text-foreground">Tedavi ve İşlem Geçmişi</h3>
                </div>
                <span className="text-xs text-muted">
                  {patientProcedures.length} İşlem Kaydı
                </span>
              </div>

              {patientProcedures.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted">
                  {role === 'admin' 
                    ? 'Bu hastaya ait henüz kaydedilmiş bir işlem bulunmuyor.' 
                    : 'Görüntüleme yetkiniz dahilinde onaylanmış bir işlem kaydı bulunmuyor.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted uppercase font-bold tracking-wider text-[10px]">
                        <th className="pb-2.5">Tarih</th>
                        <th className="pb-2.5">Uygulanan Tedavi</th>
                        <th className="pb-2.5">Hekim</th>
                        <th className="pb-2.5">Ödeme</th>
                        <th className="pb-2.5">Tutar</th>
                        {role === 'admin' && <th className="pb-2.5 text-right">Durum</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {patientProcedures.map(proc => {
                        const dateStr = new Date(proc.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
                        return (
                          <tr key={proc.id} className="hover:bg-gray-50/50">
                            <td className="py-3 font-semibold text-muted">{dateStr}</td>
                            <td className="py-3 font-bold text-foreground">{proc.type}</td>
                            <td className="py-3 text-muted">{proc.doctorName}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium text-foreground">
                                {proc.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 font-extrabold text-foreground">{formatMoney(proc.finalPrice)}</td>
                            {role === 'admin' && (
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => toggleVisibility(proc.id)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                    proc.visible 
                                      ? 'bg-green-50 text-green-700 border border-green-200' 
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {proc.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                  {proc.visible ? 'Görünür' : 'Gizli'}
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Yeni Hasta Ekle Modal */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Hızlı Hasta Kayıt Formu</h3>
              <button 
                onClick={() => setIsNewPatientModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-muted uppercase block mb-1">Ad Soyad *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Örn: Zeynep Kaya" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted uppercase block mb-1">TC Kimlik No *</label>
                  <input 
                    type="text" 
                    required
                    maxLength={11}
                    placeholder="11 haneli TC No" 
                    value={newTc}
                    onChange={(e) => setNewTc(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-muted uppercase block mb-1">Yaş</label>
                  <input 
                    type="number" 
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-muted uppercase block mb-1">Telefon</label>
                <input 
                  type="text" 
                  placeholder="05XX XXX XX XX" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-muted uppercase block mb-1">Tıbbi Uyarı / Alerji Notu</label>
                <textarea 
                  rows={2}
                  placeholder="Örn: Kalp kapakçığı ameliyatı, penisilin alerjisi..." 
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold text-muted hover:bg-gray-50 cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-foreground text-white rounded-xl font-bold hover:bg-foreground/90 cursor-pointer"
                >
                  Hastayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
