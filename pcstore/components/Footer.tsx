import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white px-[6%] py-12 border-t border-white/10 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-sora font-extrabold text-[0.8rem]">
              CG
            </div>
            <div>
              <div className="font-sora font-extrabold text-[1.1rem]">CAPIE GROUP</div>
              <div className="text-[0.68rem] text-white/50 font-medium uppercase tracking-[1.5px]">« SOVECOM »</div>
            </div>
          </div>
          <p className="text-white/50 text-[0.85rem] leading-[1.6] max-w-[280px]">
            Vente de matériels informatiques, électricité, bâtiment, froid et climatisation & commerces général.
          </p>
        </div>

        <div>
          <h4 className="font-sora font-bold text-[0.72rem] text-white/40 uppercase tracking-[2px] mb-4">Navigation</h4>
          <div className="flex flex-col gap-2.5 text-[0.9rem] text-white/70">
            <Link href="/" className="hover:text-lime transition-colors">Accueil</Link>
            <Link href="/catalogue" className="hover:text-lime transition-colors">Catalogue</Link>
            <Link href="/questionnaire" className="hover:text-lime transition-colors">Trouver mon PC</Link>
            <Link href="/reserver" className="hover:text-lime transition-colors">Réserver</Link>
          </div>
        </div>

        <div>
          <h4 className="font-sora font-bold text-[0.72rem] text-white/40 uppercase tracking-[2px] mb-4">Contact</h4>
          <div className="flex flex-col gap-2.5 text-[0.85rem] text-white/70 leading-[1.6]">
            <div>
              <div className="text-white/40 text-[0.75rem] mb-1">Siège social</div>
              Carrefour Dedokpo, en face du Terrain Soweto<br />
              Bureau « Blanc Vert » — Cotonou
            </div>
            <div>
              <div className="text-white/40 text-[0.75rem] mb-1">Boutique</div>
              Carrefour Segbeya, boutique Blanc Vert<br />
              à côté de Canal Plus — Cotonou
            </div>
            <a href="tel:+2290160626130" className="font-semibold text-lime hover:text-white transition-colors">
              +229 01 60 62 61 30
            </a>
            <a href="tel:+2290166041402" className="font-semibold text-lime hover:text-white transition-colors">
              +229 01 66 04 14 02
            </a>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 text-white/40 text-[0.78rem] flex justify-between items-center flex-wrap gap-4">
        <span>© {new Date().getFullYear()} CAPIE GROUP « SOVECOM » — Tous droits réservés</span>
        <span className="text-[0.7rem]">Cotonou, Bénin</span>
      </div>
    </footer>
  );
}