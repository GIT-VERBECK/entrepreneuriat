import { useEffect, useRef, useState } from 'react'
import { navItems } from '../data/course'
import { Icon } from './Icon'

export function Header({
  currentPageId,
  query,
  setQuery,
  results,
  onNavigate,
  onDownloadPdf,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [hiddenOnMobile, setHiddenOnMobile] = useState(false)
  const lastScrollY = useRef(0)
  const showResults = query.trim().length >= 2

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setHiddenOnMobile(false)
        return
      }

      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (Math.abs(delta) > 8) {
        setHiddenOnMobile(delta > 0 && currentY > 120)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goTo = (pageId, sectionId) => {
    onNavigate(pageId, sectionId)
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
  }

  const renderSearchResults = () =>
    showResults ? (
      <div className="absolute left-0 right-0 mt-3 overflow-hidden rounded-xl border border-outline-variant bg-white shadow-2xl md:left-auto md:w-[460px]">
        <div className="border-b border-outline-variant px-4 py-3 font-label-md text-label-md text-on-surface-variant">
          {results.length ? `${results.length} résultat(s)` : 'Aucun résultat'}
        </div>
        <div className="max-h-96 overflow-auto">
          {results.map((result) => (
            <button
              key={`${result.pageId}-${result.sectionId}`}
              className="block w-full border-b border-outline-variant px-4 py-3 text-left transition-colors hover:bg-surface-container-low"
              type="button"
              onClick={() => {
                goTo(result.pageId, result.sectionId)
                setQuery('')
              }}
            >
              <span className="block font-label-md text-label-md font-bold text-primary">
                {result.title}
              </span>
              <span className="mt-1 block font-caption text-caption text-on-surface-variant">
                {result.pageTitle}
              </span>
            </button>
          ))}
        </div>
      </div>
    ) : null

  const renderSearchInput = (autoFocus = false) => (
    <div className="relative">
      <div className="flex items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-2">
        <Icon className="mr-2 text-on-surface-variant">search</Icon>
        <input
          autoFocus={autoFocus}
          className="w-full border-none bg-transparent p-0 font-label-md text-label-md outline-none focus:ring-0"
          placeholder="Rechercher dans le cours..."
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && results[0]) {
              goTo(results[0].pageId, results[0].sectionId)
              setQuery('')
            }

            if (event.key === 'Escape') {
              setMobileSearchOpen(false)
            }
          }}
        />
        <button
          className="ml-2 md:hidden"
          type="button"
          onClick={() => {
            setMobileSearchOpen(false)
            setQuery('')
          }}
        >
          <Icon className="text-on-surface-variant">close</Icon>
        </button>
      </div>
      {renderSearchResults()}
    </div>
  )

  return (
    <header
      className={`no-print fixed top-0 z-50 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-outline-variant bg-surface px-gutter py-3 transition-transform duration-300 md:grid-cols-[auto_minmax(220px,340px)_auto] md:translate-y-0 ${
        hiddenOnMobile && !mobileMenuOpen && !mobileSearchOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <button
        className="min-w-0 text-left font-headline-md text-[22px] font-bold leading-tight text-primary sm:text-headline-md"
        type="button"
        onClick={() => goTo('accueil')}
      >
        Entrepreneuriat
      </button>

      <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-base md:col-start-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary md:hidden"
          type="button"
          aria-label="Ouvrir la recherche"
          onClick={() => {
            setMobileSearchOpen((value) => !value)
            setMobileMenuOpen(false)
          }}
        >
          <Icon>search</Icon>
        </button>

        <button
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-label-md text-label-md text-on-primary transition-transform active:scale-95"
          type="button"
          onClick={onDownloadPdf}
        >
          <Icon>download</Icon>
          <span className="hidden sm:inline">PDF</span>
        </button>

        <Icon className="hidden cursor-pointer p-2 text-primary sm:inline-block">account_circle</Icon>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary md:hidden"
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => {
            setMobileMenuOpen((value) => !value)
            setMobileSearchOpen(false)
          }}
        >
          <Icon>{mobileMenuOpen ? 'close' : 'menu'}</Icon>
        </button>
      </div>

      <div className="col-start-2 row-start-1 hidden w-full md:block">
        {renderSearchInput()}
      </div>

      {mobileSearchOpen && (
        <div className="col-span-2 row-start-2 w-full md:hidden">
          {renderSearchInput(true)}
        </div>
      )}

      {mobileMenuOpen && (
        <>
          <button
            aria-label="Fermer le menu"
            className="fixed inset-0 z-[55] bg-primary/40 md:hidden"
            type="button"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed left-0 top-0 z-[60] flex h-[100dvh] w-[78vw] max-w-sm flex-col border-r border-outline-variant bg-white p-4 shadow-2xl md:hidden">
            <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
              <span className="font-headline-sm text-headline-sm text-primary">Menu</span>
              <button
                aria-label="Fermer le menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon>close</Icon>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = currentPageId === item.id

                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-center gap-3 border-l-4 px-4 py-4 text-left font-label-md text-label-md ${
                      active
                        ? 'border-secondary bg-surface-container-low font-bold text-primary'
                        : 'border-transparent text-on-surface-variant'
                    }`}
                    type="button"
                    onClick={() => goTo(item.id)}
                  >
                    <Icon filled={active}>{item.icon}</Icon>
                    {item.label}
                  </button>
                )
              })}
            </div>
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-label-md text-label-md text-on-primary"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onDownloadPdf()
              }}
            >
              <Icon>download</Icon>
              Télécharger
            </button>
          </nav>
        </>
      )}
    </header>
  )
}
