export function Footer() {
  return (
    <footer className="no-print flex flex-col items-center justify-between gap-5 bg-primary px-gutter py-8 text-on-primary md:flex-row">
      <div>
        <p className="font-label-md text-label-md font-bold">Institut Supérieur d'Entrepreneuriat</p>
        <p className="font-caption text-caption text-on-primary/80">
          © 2024 Institut Supérieur d'Entrepreneuriat. Tous droits réservés.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <a className="font-caption text-caption text-on-primary/80 hover:text-secondary-fixed" href="#">
          Mentions Légales
        </a>
        <a className="font-caption text-caption text-on-primary/80 hover:text-secondary-fixed" href="#">
          Politique de Confidentialité
        </a>
        <a className="font-caption text-caption text-on-primary/80 hover:text-secondary-fixed" href="#">
          Accessibilité
        </a>
      </div>
    </footer>
  )
}
