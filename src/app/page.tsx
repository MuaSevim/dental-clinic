"use client"
import { 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  Plus, 
  UserPlus, 
  Clock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ChevronRight,
  TrendingUp,
  RotateCw
} from "lucide-react"
import { useStore, selectProceduresForRole, selectTodayStatsForRole } from "@/store/use-store"
import { ProcedureModal } from "@/components/procedure-modal"

export default function Home() {
  const store = useStore()
  const { role, appointments, doctors, toggleVisibility, setModalOpen } = store

  const visibleProcedures = selectProceduresForRole(store)
  const stats = selectTodayStatsForRole(store)

  const activeTitle = role === 'admin' ? 'DR. MEHMET' : role === 'staff' ? 'CANSU HANIM' : 'DENETÇİ'

  // Bugünün dinamik Türkçe tarihi
  const currentDateFormatted = new Intl.DateTimeFormat('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    weekday: 'long' 
  }).format(new Date())

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount)

  return (
    <>
      <ProcedureModal />
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Üst Başlık & Dinamik Durum */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Klinik Durum Özeti • Canlı Akış
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              GÜNAYDIN, {activeTitle}
            </h1>
            <p className="text-sm text-muted mt-1">
              Bugün {stats.totalAppointments} randevu planlandı. Klinik kapasitesi <strong className="text-foreground">%{stats.occupancyRate} dolulukta</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-medium text-muted shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-foreground" />
              {currentDateFormatted}
            </div>
            <button 
              onClick={() => store.resetDemo()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-border rounded-xl text-xs font-medium text-muted hover:text-foreground transition-colors shadow-sm cursor-pointer"
              title="Tüm verileri varsayılana döndür"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Demoyu Sıfırla
            </button>
          </div>
        </div>

        {/* Canlı Reaktif Metrik Kartları */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Bugünkü İşlem</span>
              <CheckCircle2 className="w-4 h-4 text-muted" />
            </div>
            <div className="my-4">
              <div className="text-4xl font-extrabold text-foreground">{stats.completedProceduresCount}</div>
              <p className="text-xs text-muted mt-1">tamamlanan işlem</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
              <span className="text-muted">Planlanan: <strong>{stats.totalAppointments} randevu</strong></span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 font-medium text-foreground">
                %{Math.round((stats.completedAppointments / stats.totalAppointments) * 100)} Tamamlandı
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Beklenen Randevu</span>
              <Calendar className="w-4 h-4 text-muted" />
            </div>
            <div className="my-4">
              <div className="text-4xl font-extrabold text-foreground">{stats.totalAppointments}</div>
              <p className="text-xs text-muted mt-1">toplam seans</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
              <span className="text-muted">{stats.completedAppointments} tamamlandı, {stats.remainingAppointments} kalan</span>
              <span className="flex items-center gap-1 font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {stats.inUnitAppointments} Ünitede
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Bugünkü Tahsilat</span>
              <CreditCard className="w-4 h-4 text-muted" />
            </div>
            <div className="my-4">
              <div className="text-4xl font-black text-foreground tracking-tight">
                {formatMoney(stats.totalIncome)}
              </div>
              <p className="text-xs text-muted mt-1">
                {role === 'admin' ? 'Tüm işlemler dahil' : 'Resmi / Görünür kayıtlar'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
              <span className="text-muted">Hedef: {formatMoney(stats.dailyTarget)}</span>
              <span className="font-semibold text-primary flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> %{stats.targetPercentage} Hedefte
              </span>
            </div>
          </div>
        </div>

        {/* Kısayol Modülleri */}
        <div className="grid grid-cols-4 gap-4">
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-border shadow-sm group transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">+ İşlem Yap</p>
                <p className="text-[11px] text-muted">Hemen işlem kaydı</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
          </button>

          <button className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-border shadow-sm group transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-foreground flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">+ Yeni Hasta</p>
                <p className="text-[11px] text-muted">Hızlı kayıt kartı</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
          </button>

          <button className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-border shadow-sm group transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-foreground flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">+ Randevu Ekle</p>
                <p className="text-[11px] text-muted">Takvim planı yap</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
          </button>

          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-border shadow-sm group transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-foreground flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">+ Ödeme Al</p>
                <p className="text-[11px] text-muted">Nakit veya kart tahsilat</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
          </button>
        </div>

        {/* İki Kolonlu Canlı Akış */}
        <div className="grid grid-cols-3 gap-8">
          {/* Sol Kolon: Bugünkü Randevu Akışı */}
          <div className="col-span-2 bg-white rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                <h2 className="text-base font-bold text-foreground">Bugünkü Randevu Akışı</h2>
              </div>
              <span className="text-xs font-medium text-muted bg-gray-100 px-2.5 py-1 rounded-full">
                Tümü ({appointments.length})
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-gray-300 transition-all bg-gray-50/40 hover:bg-white"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-foreground bg-white border border-border px-2 py-1 rounded-md">
                      {apt.time}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{apt.patientName}</p>
                      <p className="text-xs text-muted">
                        {apt.treatment} • <span className="text-foreground/80 font-medium">{apt.doctorName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      apt.status === 'Tamamlandı' ? 'bg-green-50 text-green-700 border-green-200' :
                      apt.status === 'Klinikte / Ünitede' ? 'bg-black text-white border-black' :
                      apt.status === 'Onay Bekliyor' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: Aktif Kadro */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
                <h2 className="text-base font-bold text-foreground">Bugün Aktif Kadro</h2>
                <span className="text-[11px] font-semibold text-primary bg-green-50 px-2 py-0.5 rounded-full">
                  4 Ünite
                </span>
              </div>

              <div className="space-y-4">
                {doctors.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-foreground text-white flex items-center justify-center font-bold text-xs">
                        {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{doc.name}</p>
                        <p className="text-[10px] text-muted">{doc.title}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-muted bg-gray-50 border border-border px-2 py-1 rounded-md">
                      {doc.isOwner ? 'Ünite 1' : 'Ünite 2'}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 text-foreground flex items-center justify-center font-bold text-xs border">
                      BK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Cansu K. & Ahmet B.</p>
                      <p className="text-[10px] text-muted">Banko / Vezne & Kabul</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-primary" title="Aktif"></span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Sterilizasyon Odası</span>
                <span className="font-bold text-primary flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Döngü #4 Tamamlandı
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Bugün Tamamlanan İşlemler Tablosu */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">Bugün Tamamlanan İşlemler</h2>
              <p className="text-xs text-muted mt-0.5">
                {role === 'admin' 
                  ? 'Tüm işlemler listeleniyor. Görünürlük anahtarıyla çalışan/denetim erişimini belirleyebilirsiniz.'
                  : 'Yalnızca yetkilendirilmiş ve onaylanmış işlemler listelenmektedir.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted">Toplam Tahsilat:</span>
              <div className="text-lg font-extrabold text-foreground">{formatMoney(stats.totalIncome)}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted uppercase font-bold tracking-wider text-[10px]">
                  <th className="pb-3">Saat</th>
                  <th className="pb-3">Hasta Adı</th>
                  <th className="pb-3">Uygulanan Tedavi</th>
                  <th className="pb-3">Hekim</th>
                  <th className="pb-3">Ödeme Şekli</th>
                  <th className="pb-3">Tutar</th>
                  {role === 'admin' && (
                    <th className="pb-3 text-right">Görünürlük (Denetim & Personel)</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visibleProcedures.map((proc) => {
                  const timeStr = new Date(proc.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <tr key={proc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-semibold text-muted">{timeStr}</td>
                      <td className="py-4 font-bold text-foreground">{proc.patientName}</td>
                      <td className="py-4 font-medium text-foreground">{proc.type}</td>
                      <td className="py-4 text-muted">{proc.doctorName}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-gray-100 text-foreground font-medium rounded-md">
                          {proc.paymentMethod} ({proc.cashierName})
                        </span>
                      </td>
                      <td className="py-4 font-extrabold text-foreground">
                        {formatMoney(proc.finalPrice)}
                      </td>
                      
                      {role === 'admin' && (
                        <td className="py-4 text-right">
                          <button
                            onClick={() => toggleVisibility(proc.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              proc.visible 
                                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Görünürlüğü değiştirmek için tıklayın"
                          >
                            {proc.visible ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                Görünür (Onaylı)
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                Gizli (Sadece Sahip)
                              </>
                            )}
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
