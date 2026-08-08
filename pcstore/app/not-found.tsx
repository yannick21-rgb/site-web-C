import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-[6%] text-center py-20">
        <div>
          <div className="mono text-cyan text-4xl font-bold mb-4">404</div>
          <h1 className="text-[1.6rem] mb-3">Page introuvable</h1>
          <p className="text-muted mb-6">Ce produit ou cette page n&apos;existe pas (ou plus).</p>
          <Link href="/catalogue" className="btn-primary">
            Voir le catalogue
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
