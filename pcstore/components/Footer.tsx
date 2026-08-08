import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-[6%] py-12 border-t border-line bg-white/50 mt-4">
      <div className="flex justify-between items-start flex-wrap gap-6">
        <div>
          <div className="font-sora font-extrabold text-[1.15rem] mb-2">
            PC<span>Store</span>
          </div>
          <div className="text-muted text-[0.9rem]">Cotonou, Bénin</div>
        </div>
        <div className="flex gap-8 sm:gap-12 text-[0.9rem] text-muted">
          <div className="flex flex-col gap-2.5">
            <Link href="/catalogue" className="hover:text-ink transition-colors">Catalogue</Link>
            <Link href="/questionnaire" className="hover:text-ink transition-colors">Trouver mon PC</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/reserver" className="hover:text-ink transition-colors">Réserver</Link>
            <Link href="/admin/login" className="hover:text-ink transition-colors">Admin</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-5 border-t border-line text-muted text-[0.8rem]">
        © {new Date().getFullYear()} PCStore — Catalogue · Réservations · Cotonou
      </div>
    </footer>
  );
}