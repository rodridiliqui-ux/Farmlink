import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Mail, Phone, MapPin, Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white group-hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                <Tractor className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">FarmLink <span className="text-green-600">Angola</span></span>
            </Link>
            <p className="text-gray-500 leading-relaxed font-medium">
              A maior plataforma agritech de Angola. Conectando a terra ao seu prato com tecnologia e transparência.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-gray-900 mb-6">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link to="/marketplace" className="text-gray-500 hover:text-green-600 font-bold transition-colors">Mercado</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-green-600 font-bold transition-colors">Painel de Controlo</Link></li>
              <li><Link to="/support" className="text-gray-500 hover:text-green-600 font-bold transition-colors">Centro de Ajuda</Link></li>
              <li><Link to="/support" className="text-gray-500 hover:text-green-600 font-bold transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-black text-gray-900 mb-6">Suporte</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-500 font-bold">
                <Mail className="w-5 h-5 text-green-600" />
                suporte@farmlink.ao
              </li>
              <li className="flex items-center gap-3 text-gray-500 font-bold">
                <Phone className="w-5 h-5 text-green-600" />
                +244 900 000 000
              </li>
              <li className="flex items-center gap-3 text-gray-500 font-bold">
                <MapPin className="w-5 h-5 text-green-600" />
                Luanda, Angola
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
            <ShieldCheck className="w-10 h-10 text-green-600 mb-4" />
            <h4 className="text-lg font-black text-gray-900 mb-2">Compra Segura</h4>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Todos os nossos produtores são verificados para garantir a máxima qualidade e segurança.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400 font-bold">
            © 2026 FarmLink Angola. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/support" className="text-xs text-gray-400 hover:text-green-600 font-bold transition-colors uppercase tracking-widest">Termos</Link>
            <Link to="/support" className="text-xs text-gray-400 hover:text-green-600 font-bold transition-colors uppercase tracking-widest">Privacidade</Link>
            <Link to="/support" className="text-xs text-gray-400 hover:text-green-600 font-bold transition-colors uppercase tracking-widest">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
