// Layout para forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function MiCuentaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
