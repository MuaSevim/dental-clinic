import { Doctor, Patient, Procedure, Appointment } from '@/types'

export const seedDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Mehmet Kaya', title: 'Kurucu & Baş Hekim', commissionRate: 0, isOwner: true },
  { id: 'd2', name: 'Dr. Elif Vural', title: 'Endodonti Uzmanı', commissionRate: 0.30, isOwner: false },
]

export const seedPatients: Patient[] = [
  { id: 'p1', name: 'Canan Demir', tc: '28492019482', phone: '0532 492 88 12', age: 34, notes: 'Düzenli 6 ay kontrol hastası.' },
  { id: 'p2', name: 'Murat Tezel', tc: '19482019583', phone: '0544 382 11 00', age: 42, notes: 'Lokal anesteziye hassasiyeti var.' },
  { id: 'p3', name: 'Gizem Şen', tc: '38192049182', phone: '0530 192 48 55', age: 28, notes: 'Hassas diş eti.' },
  { id: 'p4', name: 'Burak Sönmez', tc: '48291049281', phone: '0535 992 10 29', age: 45, notes: 'İmplant 1. aşama planlandı.' },
  { id: 'p5', name: 'Ayşe Yılmaz', tc: '58291049182', phone: '0555 123 45 67', age: 39, notes: 'Kanal tedavisi devam ediyor.' },
]

// Bugün için oluşturulan sabit saatli randevular (Figma tasarımındaki akış)
export const seedAppointments: Appointment[] = [
  { id: 'a1', time: '09:30', patientName: 'Canan Demir', doctorName: 'Dr. Elif Vural', treatment: 'Diş Taşı Temizliği (Detertraj)', unit: 'Ünite 2', status: 'Tamamlandı', price: 2500 },
  { id: 'a2', time: '10:30', patientName: 'Murat Tezel', doctorName: 'Dr. Mehmet Kaya', treatment: 'Kompozit Dolgu (2 Diş)', unit: 'Ünite 1', status: 'Tamamlandı', price: 4800 },
  { id: 'a3', time: '11:00', patientName: 'Burak Sönmez', doctorName: 'Dr. Mehmet Kaya', treatment: 'İmplant Konsültasyonu', unit: 'Ünite 1', status: 'Klinikte / Ünitede', price: 34500 },
  { id: 'a4', time: '13:30', patientName: 'Gizem Şen', doctorName: 'Dr. Mehmet Kaya', treatment: 'Acil Ağrı Tedavisi', unit: 'Ünite 1', status: 'Tamamlandı', price: 1800 },
  { id: 'a5', time: '14:30', patientName: 'Ayşe Yılmaz', doctorName: 'Dr. Mehmet Kaya', treatment: 'Kanal Tedavisi & Kuron', unit: 'Ünite 1', status: 'Onay Bekliyor', price: 12500 },
  { id: 'a6', time: '16:00', patientName: 'Mert Erdem', doctorName: 'Dr. Mehmet Kaya', treatment: 'İmplant Kontrol & Dikiş Alımı', unit: 'Ünite 1', status: 'Onaylandı', price: 750 },
  { id: 'a7', time: '17:15', patientName: 'Seda Akın', doctorName: 'Dr. Elif Vural', treatment: 'Ofis Tipi Beyazlatma', unit: 'Ünite 2', status: 'Onaylandı', price: 6500 },
]

// Tamamlanmış örnek işlemler
export const seedProcedures: Procedure[] = [
  {
    id: 'pr-101',
    patientId: 'p1',
    patientName: 'Canan Demir',
    doctorId: 'd2',
    doctorName: 'Dr. Elif Vural',
    type: 'Diş Taşı Temizliği (Detertraj)',
    basePrice: 2500,
    discount: 0,
    finalPrice: 2500,
    paymentMethod: 'Kredi Kartı',
    cashierName: 'Cansu K.',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 saat önce
    visible: true,
  },
  {
    id: 'pr-102',
    patientId: 'p2',
    patientName: 'Murat Tezel',
    doctorId: 'd1',
    doctorName: 'Dr. Mehmet Kaya',
    type: 'Kompozit Dolgu (2 Diş)',
    basePrice: 4800,
    discount: 0,
    finalPrice: 4800,
    paymentMethod: 'Nakit',
    cashierName: 'Ahmet B.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 saat önce
    visible: true,
  },
  {
    id: 'pr-103',
    patientId: 'p3',
    patientName: 'Gizem Şen',
    doctorId: 'd1',
    doctorName: 'Dr. Mehmet Kaya',
    type: 'Acil Ağrı Tedavisi & Pansuman',
    basePrice: 2000,
    discount: 200,
    finalPrice: 1800,
    paymentMethod: 'Havale',
    cashierName: 'Cansu K.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 dk önce
    visible: false, // Varsayılan gizli işlem örneği
  },
]
