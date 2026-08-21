'use client'
import DashboardLayout from '@/components/dashboard-layout'
export default function ComputePage() {
  return <DashboardLayout><div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-12"><h1 className="text-2xl font-semibold text-[#d9d9d9]">Compute</h1><p className="text-[#8a8a8a] text-sm">Manage Workers, Pages and Functions.</p></div></DashboardLayout>
}
