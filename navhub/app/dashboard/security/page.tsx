'use client'
import DashboardLayout from '@/components/dashboard-layout'
export default function SecurityPage() {
  return <DashboardLayout><div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-12"><h1 className="text-2xl font-semibold text-[#d9d9d9]">Application Security</h1><p className="text-[#8a8a8a] text-sm">WAF, DDoS protection and bot management.</p></div></DashboardLayout>
}
