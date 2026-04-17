import { useState, ReactNode } from 'react';
import { User, ClipboardList, Info, Pill, BookOpen, Clock, Activity } from 'lucide-react';
import { Section, DataField, InputField, SelectField, TextAreaField } from './ui';

export default function OpportunityPipeline() {
  const [activeTab, setActiveTab] = useState('negocio');

  const tabs = [
    { id: 'negocio', label: 'Dados do Negócio' },
    { id: 'gerais1', label: 'Detalhes (1)' },
    { id: 'gerais2', label: 'Detalhes (2)' },
    { id: 'itens', label: 'Itens da Proposta' },
    { id: 'reservas', label: 'Recursos Vinculados' },
    { id: 'reacoes', label: 'Riscos' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm">
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Oportunidade</p>
          <p className="font-bold">OP-2200000005</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Data/Hora da Proposta</p>
          <p className="font-bold">28/09/2022 08:00</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Status do Cliente</p>
          <p className="font-bold text-blue-600">01 - Prospect</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Prioridade</p>
          <p className="font-bold text-red-600">03 - Urgência</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Situação</p>
          <p className="font-bold text-orange-500 uppercase">Em Negociação</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border ${
              activeTab === tab.id
                ? 'bg-[#1E3A5A] text-white border-[#1E3A5A] shadow-md scale-[1.02]'
                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Oportunidade / Gerais Area */}
        {activeTab === 'negocio' && (
          <Section title="Dados do Negócio" icon={<Activity className="h-4 w-4" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <DataField label="Cliente" value="4.114.557 - JOAO DA SILVA" />
                <InputField label="Código do Cliente" value="1234" />
                <InputField label="Código da Oportunidade" placeholder="-" />
                <SelectField label="Região" options={['1 - Sudeste', '2 - Nordeste']} selected="1 - Sudeste" />
                <SelectField label="Segmento" options={['Saúde', 'Tecnologia']} selected="Saúde" />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Tipo de Cliente" options={['O - Corporativo', 'A - Pequena Empresa', 'B - Startup']} selected="O - Corporativo" />
                  <InputField label="Prioridade" value="Alta" disabled />
                </div>
                <InputField label="Data do Contato" value="31/03/2021 08:21:00" />
                <SelectField label="Fonte da Oportunidade" options={['Marketing', 'Indicação', 'Prospecção']} selected="Marketing" />
                <InputField label="Equipe" value="04" />
                <InputField label="Status Interno" placeholder="-" />
              </div>

              <div className="space-y-4">
                <SelectField label="Cliente Novo" options={['Não', 'Sim']} selected="Não" />
                <SelectField label="Empresa" options={['1 - SBS CONSULTORES']} selected="1 - SBS CONSULTORES" />
                <SelectField label="Tipo de Atendimento" options={['Presencial', 'Remoto']} selected="Presencial" />
                <InputField label="Segmento de Mercado" value="03" />
                <InputField label="Aprovação" placeholder="-" />
              </div>
            </div>
          </Section>
        )}

        {/* Dados do Cliente - Alert Info */}
        <Section title="Dados do Cliente (Importante)" icon={<Info className="h-4 w-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h3 className="text-red-700 font-bold text-sm uppercase tracking-tight mb-2">Características do Cliente</h3>
                <p className="text-red-600 font-medium">Oportunidade com alta complexidade de atendimento</p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="text-blue-700 font-bold text-sm uppercase tracking-tight mb-2">Segmentação</h3>
                <p className="text-blue-600 font-mono text-sm">Enterprise / Priority</p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <h3 className="text-amber-700 font-bold text-sm uppercase tracking-tight mb-2">Riscos Identificados</h3>
                <p className="text-amber-600 font-medium italic">Alto churn potencial, prazo reduzido</p>
              </div>
            </div>

            <div className="space-y-6">
              <TextAreaField label="Notas da Oportunidade" value="Cliente exige contato direto mensal" />
              
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <h3 className="text-gray-700 font-bold text-sm uppercase tracking-tight mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Recursos Reservados
                </h3>
                <p className="text-gray-500 text-sm italic">Nenhum recurso especial alocado ainda</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          Cancelar
        </button>
        <button className="px-6 py-2.5 bg-[#1E3A5A] text-white font-semibold rounded-lg hover:bg-[#152D47] transition-colors shadow-lg flex items-center gap-2">
          Atualizar Oportunidade
        </button>
      </div>
    </div>
  );
}

// Components REUSED from CollectionMaintenance for brevity, but they should be extracted to common dir
function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <div className="bg-white p-1.5 rounded-md border border-gray-200 shadow-sm">
          {icon}
        </div>
        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="font-bold text-[#1E3A5A] text-lg leading-tight">{value}</p>
    </div>
  );
}

function InputField({ label, value, placeholder, disabled = false }: { label: string; value?: string; placeholder?: string; disabled?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">{label}</label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg text-sm transition-all outline-none ${
          disabled 
            ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed font-medium' 
            : 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        }`}
      />
    </div>
  );
}

function SelectField({ label, options, selected }: { label: string; options: string[]; selected?: string }) {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">{label}</label>
      <div className="relative">
        <select
          id={fieldId}
          defaultValue={selected}
          className="w-full appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

