export type Role = 'admin' | 'staff' | 'audit'

export type PaymentMethod = 'Nakit' | 'Kredi Kartı' | 'Havale'

export interface Doctor {
  id: string
  name: string
  title: string
  commissionRate: number // Çalışan için 0.30, Sahip için 0
  isOwner: boolean
}

export interface Patient {
  id: string
  name: string
  tc: string
  phone: string
  age: number
  notes: string
}

export interface Procedure {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  type: string
  toothNumber?: number
  basePrice: number
  discount: number
  finalPrice: number
  paymentMethod: PaymentMethod
  cashierName: string
  createdAt: string // ISO string
  visible: boolean  // Kritik anahtar
}

export interface Appointment {
  id: string
  time: string
  patientName: string
  doctorName: string
  treatment: string
  unit: string
  status: 'Tamamlandı' | 'Klinikte / Ünitede' | 'Onaylandı' | 'Onay Bekliyor'
  price: number
}
