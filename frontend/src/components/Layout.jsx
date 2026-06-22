import Navbar from './Navbar'

// Shared chrome for authenticated pages.
export default function Layout({ children }) {
  return (
    <div className="min-h-full bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
