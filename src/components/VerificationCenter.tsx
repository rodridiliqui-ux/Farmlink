import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../AuthContext';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { motion } from 'motion/react';
import { Shield, Upload, CheckCircle, AlertCircle, FileText, Camera, CreditCard, Home, Truck, User } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export const VerificationCenter: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [formData, setFormData] = useState({
    nif: '',
    bankAccount: '',
    documentType: 'BI',
  });

  if (!user || !profile) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setFiles(prev => ({ ...prev, [key]: compressedFile }));
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, `verifications/${user.uid}/${path}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (file) {
          const url = await uploadFile(file, key);
          return { [key]: url };
        }
        return null;
      });

      const uploadedUrls = (await Promise.all(uploadPromises))
        .filter(Boolean)
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const verificationRequest = {
        userId: user.uid,
        role: profile.role,
        status: 'pending',
        data: {
          ...formData,
          ...uploadedUrls,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'verification_requests', user.uid), verificationRequest);
      
      // Also update user status to pending
      await setDoc(doc(db, 'users', user.uid), {
        verificationStatus: 'pending'
      }, { merge: true });

      setStep(3); // Success step
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `verification_requests/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const renderVerificationForm = () => {
    switch (profile.role) {
      case 'farmer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIF (Número de Identificação Fiscal)</label>
              <input
                type="text"
                value={formData.nif}
                onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: 5000123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IBAN para Recebimento</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="AO06 0000 0000 ..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="Documento de Identidade (Frente)"
                onChange={(e) => handleFileChange(e, 'documentFront')}
                file={files['documentFront']}
                icon={<CreditCard className="w-5 h-5" />}
              />
              <FileUploadField
                label="Comprovativo de Endereço"
                onChange={(e) => handleFileChange(e, 'addressProof')}
                file={files['addressProof']}
                icon={<Home className="w-5 h-5" />}
              />
              <FileUploadField
                label="Registo Comercial / Alvará"
                onChange={(e) => handleFileChange(e, 'commercialRegistry')}
                file={files['commercialRegistry']}
                icon={<FileText className="w-5 h-5" />}
              />
              <FileUploadField
                label="Selfie de Verificação"
                onChange={(e) => handleFileChange(e, 'selfie')}
                file={files['selfie']}
                icon={<Camera className="w-5 h-5" />}
              />
            </div>
          </div>
        );
      case 'transporter':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="Carta de Condução"
                onChange={(e) => handleFileChange(e, 'license')}
                file={files['license']}
                icon={<User className="w-5 h-5" />}
              />
              <FileUploadField
                label="Documentos do Veículo (Livrete)"
                onChange={(e) => handleFileChange(e, 'vehicleDocs')}
                file={files['vehicleDocs']}
                icon={<Truck className="w-5 h-5" />}
              />
              <FileUploadField
                label="Seguro do Veículo"
                onChange={(e) => handleFileChange(e, 'insurance')}
                file={files['insurance']}
                icon={<Shield className="w-5 h-5" />}
              />
              <FileUploadField
                label="Selfie de Verificação"
                onChange={(e) => handleFileChange(e, 'selfie')}
                file={files['selfie']}
                icon={<Camera className="w-5 h-5" />}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <FileUploadField
              label="Documento de Identidade"
              onChange={(e) => handleFileChange(e, 'documentFront')}
              file={files['documentFront']}
              icon={<CreditCard className="w-5 h-5" />}
            />
            <FileUploadField
              label="Selfie de Verificação"
              onChange={(e) => handleFileChange(e, 'selfie')}
              file={files['selfie']}
              icon={<Camera className="w-5 h-5" />}
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-green-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Centro de Verificação</h1>
              <p className="text-green-100">Garanta a segurança e confiança na plataforma</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  step >= s ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          {profile.verificationStatus === 'pending' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação em Processamento</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                A nossa equipa está a analisar os seus documentos. Este processo pode levar até 48 horas úteis.
              </p>
            </div>
          ) : profile.verificationStatus === 'verified' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Verificada!</h2>
              <p className="text-gray-600">
                O seu perfil possui o selo de confiança FarmLink.
              </p>
            </div>
          ) : step === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <VerificationCard
                  icon={<Shield className="text-blue-600" />}
                  title="Segurança"
                  desc="Protegemos os seus dados com encriptação de ponta."
                />
                <VerificationCard
                  icon={<CheckCircle className="text-green-600" />}
                  title="Confiança"
                  desc="Utilizadores verificados têm prioridade e maior taxa de conversão."
                />
                <VerificationCard
                  icon={<AlertCircle className="text-orange-600" />}
                  title="Rastreabilidade"
                  desc="Garantimos a origem e o destino de cada transação."
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Porquê verificar?
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Para {profile.role === 'farmer' ? 'vender' : profile.role === 'transporter' ? 'transportar' : 'comprar'} com segurança, 
                  precisamos de validar a sua identidade. Isso evita fraudes e garante que todos na plataforma são reais e confiáveis.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Começar Verificação <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-xl font-bold text-gray-900">Envio de Documentação</h2>
              {renderVerificationForm()}
              
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-4 px-6 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submeter para Análise'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Submetido!</h2>
              <p className="text-gray-600 mb-8">
                Recebemos os seus documentos. Iremos analisá-los e notificá-lo em breve.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-900 text-white py-3 px-8 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileUploadField: React.FC<{
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  icon: React.ReactNode;
}> = ({ label, onChange, file, icon }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className={`border-2 border-dashed rounded-2xl p-4 transition-all ${
      file ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400'
    }`}>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${file ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {file ? <CheckCircle className="w-5 h-5" /> : icon}
        </div>
        <div className="flex-1 truncate">
          <p className={`text-sm font-medium ${file ? 'text-green-700' : 'text-gray-600'}`}>
            {file ? file.name : 'Clique para carregar'}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG até 1MB</p>
        </div>
        {!file && <Upload className="w-4 h-4 text-gray-400" />}
      </div>
    </div>
  </div>
);

const VerificationCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
    <div className="mb-3">{icon}</div>
    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const Info: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Loader2: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
