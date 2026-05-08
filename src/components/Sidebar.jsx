import { navItems } from '../data/course'
import { Icon } from './Icon'

export function Sidebar({ currentPageId, onNavigate, onDownloadPdf }) {
  return (
    <aside className="no-print fixed left-0 hidden w-64 flex-col border-r border-outline-variant bg-surface-container-low lg:flex">
      <nav className="course-sidebar-nav flex flex-1 flex-col overflow-y-auto px-3">
        {navItems.map((item) => {
          const active = currentPageId === item.id

          return (
            <button
              key={item.id}
              className={`flex items-center gap-3 border-l-4 px-4 py-3 text-left font-label-md text-label-md ${
                active
                  ? 'border-secondary bg-white font-bold text-primary'
                  : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:bg-white/60 hover:text-primary'
              }`}
              type="button"
              onClick={() => onNavigate(item.id)}
            >
              <Icon filled={active}>{item.icon}</Icon>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-outline-variant px-4 py-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-label-md text-label-md text-on-primary"
          type="button"
          onClick={onDownloadPdf}
        >
          <Icon>download</Icon>
          Télécharger
        </button>
      </div>
    </aside>
  )
}
