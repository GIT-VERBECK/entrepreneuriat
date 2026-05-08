import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export function CourseLayout({
  currentPageId,
  query,
  setQuery,
  results,
  onNavigate,
  onDownloadPdf,
  children,
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md text-body-md">
      <Header
        currentPageId={currentPageId}
        query={query}
        results={results}
        setQuery={setQuery}
        onDownloadPdf={onDownloadPdf}
        onNavigate={onNavigate}
      />
      <Sidebar
        currentPageId={currentPageId}
        onDownloadPdf={onDownloadPdf}
        onNavigate={onNavigate}
      />
      <main className="print-area min-h-screen pt-24 lg:ml-64">{children}</main>
      <Footer />
    </div>
  )
}
