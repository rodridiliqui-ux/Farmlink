import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  ExternalLink
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'geral' | 'compras' | 'vendas' | 'entrega' | 'pagamentos';
}

const faqs: FAQItem[] = [
  {
    category: 'geral',
    question: 'O que é o FarmLink Angola?',
    answer: 'O FarmLink Angola é uma plataforma agritech que liga diretamente produtores agrícolas locais a consumidores e empresas, eliminando intermediários desnecessários e garantindo produtos mais frescos a preços justos.'
  },
  {
    category: 'compras',
    question: 'Como posso comprar produtos?',
    answer: 'Basta navegar pelo nosso Mercado, adicionar os produtos desejados ao carrinho e finalizar a compra. Pode escolher entre entrega ao domicílio ou pontos de recolha parceiros.'
  },
  {
    category: 'vendas',
    question: 'Sou produtor, como posso vender os meus produtos?',
    answer: 'Deve registar-se na plataforma e, no seu Painel (Dashboard), mudar o seu perfil para "Produtor". Após uma breve verificação da nossa equipa, poderá começar a listar os seus produtos com fotos e preços.'
  },
  {
    category: 'entrega',
    question: 'Como funciona a logística de entrega?',
    answer: 'Trabalhamos com uma rede de transportadores independentes verificados. Quando faz uma compra, o sistema atribui um transportador disponível na sua zona para recolher o produto na fazenda e entregar no seu endereço.'
  },
  {
    category: 'pagamentos',
    question: 'Quais são os métodos de pagamento aceites?',
    answer: 'Aceitamos pagamentos via Referência Multicaixa, Transferência Bancária (com envio de comprovativo) e, em breve, pagamentos diretos via cartão de débito através do gateway local.'
  },
  {
    category: 'geral',
    question: 'A plataforma é segura?',
    answer: 'Sim. Todos os produtores e transportadores passam por um processo de verificação de identidade. Além disso, os pagamentos só são libertados para o vendedor após a confirmação da entrega.'
  },
  {
    category: 'entrega',
    question: 'Qual é o prazo médio de entrega?',
    answer: 'O prazo varia dependendo da localização da fazenda e do destino, mas a maioria das entregas em Luanda e arredores é feita em 24 a 48 horas para garantir a frescura dos produtos.'
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: HelpCircle },
  { id: 'geral', name: 'Geral', icon: ShieldCheck },
  { id: 'compras', name: 'Compras', icon: ShoppingBag },
  { id: 'vendas', name: 'Vendas', icon: CreditCard },
  { id: 'entrega', name: 'Entrega', icon: Truck },
];

export const Support: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-bold mb-4"
        >
          <HelpCircle className="w-4 h-4" /> Centro de Ajuda
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
        >
          Como podemos <span className="text-green-600">ajudar?</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Encontre respostas rápidas para as suas dúvidas ou entre em contacto direto com a nossa equipa de suporte.
        </motion.p>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative max-w-2xl mx-auto mb-12"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por palavras-chave (ex: entrega, pagamento...)"
          className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm text-gray-900 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-4">Categorias</h3>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                  : 'text-gray-600 hover:bg-white hover:text-green-600'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.name}
            </button>
          ))}

          {/* Contact Card */}
          <div className="mt-12 p-6 bg-green-900 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-800 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-xl font-black mb-2 relative z-10">Ainda com dúvidas?</h4>
            <p className="text-green-100 text-sm mb-6 relative z-10">A nossa equipa está disponível de Segunda a Sábado, das 8h às 18h.</p>
            <div className="space-y-3 relative z-10">
              <a href="mailto:suporte@farmlink.ao" className="flex items-center gap-3 text-sm font-bold hover:text-green-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                suporte@farmlink.ao
              </a>
              <a href="tel:+244900000000" className="flex items-center gap-3 text-sm font-bold hover:text-green-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                +244 900 000 000
              </a>
              <a href="https://wa.me/244900000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold hover:text-green-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                WhatsApp Suporte
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-green-100 transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-lg font-bold text-gray-900 pr-8">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-500">Tente pesquisar por outros termos ou explore as categorias.</p>
              </div>
            )}
          </AnimatePresence>

          {/* External Links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="#" className="p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-green-500 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
              </div>
              <h4 className="font-black text-gray-900">Termos de Uso</h4>
              <p className="text-sm text-gray-500">Leia as nossas regras e diretrizes.</p>
            </a>
            <a href="#" className="p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-green-500 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
              </div>
              <h4 className="font-black text-gray-900">Privacidade</h4>
              <p className="text-sm text-gray-500">Como protegemos os seus dados.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
