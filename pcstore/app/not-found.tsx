import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-[6%] text-center py-20">
        <div>
          <div className="font-sora font-extrabold text-[3.4rem] bg-[linear-gradient(135deg,#8b7cf6,#6a5cd8)] bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="font-sora font-bold text-[1.6rem] mb-3">Page introuvable</h1>
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