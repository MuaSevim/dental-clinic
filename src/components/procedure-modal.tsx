"use client"
import { useState } from "react"
import { X, Check, ShieldAlert } from "lucide-react"
import { useStore } from "@/store/use-store"
import { PaymentMethod, Procedure } from "@/types"

const STANDARD_PROCEDURES = [
  { name: 'Kanal Tedavisi (Tek Kanal)', price: 8000 },
  { name: 'İmplant Tedavisi (Straumann)', price: 22000 },
  { name: 'Kompozit Dolgu (3M Filtek)', price: 4500 },
  { name: 'Zirkonyum Kuron', price: 12000 },
  { name: 'Detertraj & Polisaj', price: 2500 },
  { name: 'Ofis Tipi Beyazlatma (Zoom)', price: 7500 },
]

export function ProcedureModal() {
  const { isModalOpen, setModalOpen, patients, doctors, role, addProcedure } = useStore()

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '')
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '')
  const [selectedProc, setSelectedProc] = useState(STANDARD_PROCEDURES[0])
  const [hasDiscount, setHasDiscount] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Nakit')

  if (!isModalOpen) return null

  const selectedPatient = patients.find(p => p.id === selectedPatientId)
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId)

  // Fiyat ve Prim Hesapları
  const basePrice = selectedProc.price
  const discountAmount = hasDiscount ? basePrice * 0.10 : 0
  const finalPrice = basePrice - discountAmount

  // Çalışan hekim (%30 prim) hesabı
  const doctorCommission = selectedDoctor && selectedDoctor.commissionRate > 0 
    ? finalPrice * selectedDoctor.commissionRate 
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !selectedDoctor) return

    const newProc: Procedure = {
      id: `pr-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      type: selectedProc.name,
      basePrice,
      discount: discountAmount,
      finalPrice,
      paymentMethod,
      cashierName: role === 'admin' ? 'Dr. Mehmet (Sahip)' : 'Cansu K. (Vezne)',
      createdAt: new Date().toISOString(),
      // Sahip girerse varsayılan görünür; çalışan girerse gizli (onay bekler)
      visible: role === 'admin',
    }

    addProcedure(newProc)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <h2 className="text-lg font-bold text-foreground">Yeni İşlem ve Tahsilat Kaydı</h2>
            </div>
            <p className="text-xs text-muted mt-0.5">Hasta seçimi, hekim hakedişi ve anlık vezne tahsilatı</p>
          </div>
          <button 
            onClick={() => setModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. Hasta Seçimi */}
          <div>
            <label className="font-bold text-muted uppercase tracking-wider block mb-2">1. Hasta Seçimi</label>
            <select 
              value={selectedPatientId} 
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:border-primary"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (TC: {p.tc}) - {p.phone}</option>
              ))}
            </select>
          </div>

          {/* 2. Uygulayan Hekim & Prim Önizlemesi */}
          <div>
            <label className="font-bold text-muted uppercase tracking-wider block mb-2">2. Hekim ve Klinik Ünitesi</label>
            <div className="grid grid-cols-2 gap-4">
              {doctors.map(d => (
                <div 
                  key={d.id}
                  onClick={() => setSelectedDoctorId(d.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedDoctorId === d.id 
                      ? 'border-foreground bg-gray-50/80 shadow-xs' 
                      : 'border-border hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground text-sm">{d.name}</p>
                      <p className="text-muted text-[11px]">{d.title}</p>
                    </div>
                    {selectedDoctorId === d.id && <Check className="w-4 h-4 text-foreground" />}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-muted">Hakediş Modeli:</span>
                    <span className="font-bold text-foreground">
                      {d.commissionRate > 0 ? `%${d.commissionRate * 100} İşlem Primi` : 'Klinik Payı (%100)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Tedavi Prosedürü Seçimi */}
          <div>
            <label className="font-bold text-muted uppercase tracking-wider block mb-2">3. Uygulanan Tedavi</label>
            <div className="grid grid-cols-3 gap-3">
              {STANDARD_PROCEDURES.map(proc => (
                <div 
                  key={proc.name}
                  onClick={() => setSelectedProc(proc)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedProc.name === proc.name 
                      ? 'border-primary bg-green-50/30' 
                      : 'border-border hover:border-gray-300'
                  }`}
                >
                  <p className="font-bold text-foreground text-xs leading-snug">{proc.name}</p>
                  <p className="text-primary font-black text-sm mt-1">{proc.price.toLocaleString('tr-TR')} ₺</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. İskonto & Hakediş Matrisi */}
          <div className="bg-gray-50 p-4 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground">
                <input 
                  type="checkbox" 
                  checked={hasDiscount} 
                  onChange={(e) => setHasDiscount(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                Özel Kurucu İskontosu Uygula (%10)
              </label>
              {hasDiscount && (
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  -{discountAmount.toLocaleString('tr-TR')} ₺ İndirim
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs">
              <span className="text-muted">Hekime Yansıyacak Net Hakediş:</span>
              <span className="font-bold text-foreground">
                {doctorCommission > 0 ? `${doctorCommission.toLocaleString('tr-TR')} ₺ (%30)` : 'Maaş / Kurucu Payı'}
              </span>
            </div>
          </div>

          {/* 5. Ödeme Yöntemi */}
          <div>
            <label className="font-bold text-muted uppercase tracking-wider block mb-2">5. Tahsilat Yöntemi</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Nakit', 'Kredi Kartı', 'Havale'] as PaymentMethod[]).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-2.5 rounded-xl border font-bold text-xs transition-all ${
                    paymentMethod === method ? 'bg-foreground text-white border-foreground' : 'border-border hover:bg-gray-50 text-foreground'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Görünürlük Uyarısı */}
          {role !== 'admin' && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Personel Kaydı:</strong> Bu işlem sisteme kaydedilecek fakat Klinik Sahibi (Dr. Mehmet) onaylayıp görünür yapana kadar çalışan ve denetim listesinde yer almayacaktır.
              </span>
            </div>
          )}

          {/* Modal Footer / Submit */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-muted text-[10px] uppercase font-bold">Nihai Tahsil Edilecek Tutar</p>
              <p className="text-2xl font-black text-foreground">{finalPrice.toLocaleString('tr-TR')} ₺</p>
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-gray-50 text-muted"
              >
                Vazgeç
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-foreground hover:bg-foreground/90 text-white rounded-xl font-bold shadow-md transition-all"
              >
                İşlemi ve Tahsilatı Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
