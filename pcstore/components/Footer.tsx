export default function Footer() {
  return (
    <footer className="px-[6%] py-11 border-t border-line flex justify-between text-muted text-sm flex-wrap gap-3">
      <div>© {new Date().getFullYear()} PCStore — Cotonou, Bénin</div>
      <div>Catalogue · Réservations · Contact</div>
    </footer>
  );
}
