import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Role, Procedure, Patient, Doctor, Appointment } from '@/types'
import { seedProcedures, seedPatients, seedDoctors, seedAppointments } from '@/data/seed'

interface AppState {
  role: Role
  setRole: (role: Role) => void
  procedures: Procedure[]
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void

  toggleVisibility: (id: string) => void
  addProcedure: (procedure: Procedure) => void
  addPatient: (patient: Patient) => void
  resetDemo: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'admin',
      setRole: (role) => set({ role }),
      procedures: seedProcedures,
      patients: seedPatients,
      doctors: seedDoctors,
      appointments: seedAppointments,
      isModalOpen: false,
      setModalOpen: (open) => set({ isModalOpen: open }),

      toggleVisibility: (id) =>
        set((state) => ({
          procedures: state.procedures.map((p) =>
            p.id === id ? { ...p, visible: !p.visible } : p
          ),
        })),

      addProcedure: (procedure) =>
        set((state) => ({
          procedures: [procedure, ...state.procedures],
          isModalOpen: false,
        })),

      addPatient: (patient) =>
        set((state) => ({
          patients: [patient, ...state.patients],
        })),

      resetDemo: () =>
        set({
          role: 'admin',
          procedures: seedProcedures,
          patients: seedPatients,
          doctors: seedDoctors,
          appointments: seedAppointments,
          isModalOpen: false,
        }),
    }),
    {
      name: 'arven-storage',
    }
  )
)

// --- MERKEZİ HESAPLAMA VE VERİ ERİŞİM KATMANI ---

export const selectProceduresForRole = (state: AppState): Procedure[] => {
  if (state.role === 'admin') return state.procedures
  return state.procedures.filter((p) => p.visible)
}

export const selectTodayStatsForRole = (state: AppState) => {
  const visible = selectProceduresForRole(state)
  const totalIncome = visible.reduce((acc, p) => acc + p.finalPrice, 0)
  
  const dailyTarget = 45000
  const targetPercentage = Math.min(Math.round((totalIncome / dailyTarget) * 100), 100)

  const totalCapacity = 16
  const occupancyRate = Math.round((state.appointments.length / totalCapacity) * 100)

  const completedAppointments = state.appointments.filter(a => a.status === 'Tamamlandı').length
  const inUnitAppointments = state.appointments.filter(a => a.status === 'Klinikte / Ünitede').length
  const remainingAppointments = state.appointments.length - completedAppointments

  return {
    totalIncome,
    dailyTarget,
    targetPercentage,
    occupancyRate,
    totalAppointments: state.appointments.length,
    completedAppointments,
    inUnitAppointments,
    remainingAppointments,
    completedProceduresCount: visible.length,
  }
}
