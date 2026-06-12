import {
  MapPin,
  Calendar,
  Banknote,
  Phone,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";

/**
 * Footer - Pied de page minimal
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-900 text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-8 border-b border-zinc-700 mb-8">
          
          <div>
            <h3 className="text-2xl font-black mb-4">TOP FOOT</h3>
            <p className="text-zinc-400">
              Le championnat de football le plus attendu de l'année.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Infos Rapides</h4>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Terrain Maya Kopé</span>
              </li>

              <li className="flex items-center gap-2">
                <Calendar size={16} />
                <span>05 Juillet 2026</span>
              </li>

              <li className="flex items-center gap-2">
                <Banknote size={16} />
                <span>25 000 F CFA par équipe</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+228 71 61 40 52</span>
              </li>

              <li className="flex items-center gap-2">
                <MessageCircle size={16} />
                <span>@TopFootOfficial</span>
              </li>

              <li className="flex items-center gap-2">
                <LinkIcon size={16} />
                <span>WhatsApp Group</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-zinc-400 text-sm">
          <p>&copy; {currentYear} TOP FOOT Championship. Tous droits réservés.</p>
          <p>Crafted with passion for football</p>
        </div>
      </div>
    </footer>
  );
};