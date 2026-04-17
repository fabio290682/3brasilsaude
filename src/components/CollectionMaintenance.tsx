import { useState } from 'react';
import { CustomerData } from '../types';
import { User, Calendar, Clock, Droplets, FileText, Package } from 'lucide-react';
import { Section, DataField, InputField, SelectField, TextAreaField } from './ui';
import { submitCustomer } from '../api';

export default function CustomerManagement() {
  const mockCustomer: CustomerData = {
    name: 'MARCOS ALMEIDA',
    id: '367.108',
    birthDate: '06/05/1988',
    age: 34,
    sex: 'Masculino',
    donorClass: 'Cliente Premium',
    motherName: 'MAE CLIENTE',
    fatherName: 'PAI CLIENTE',
    bloodGroup: 'O',
    rhFactor: '-',
    pai: 'Pessoa física não possui',
    iai: 'Sim',
    phenotyping: '',
    ehResult: '',
    hbsResult: '',
  };

  const initialForm = {
    triagem: '3.842',
    coleta: 'B345922000108',
    date: '15/09/2022',
    option: 'Relacionamento Corporativo',
    type: 'Conta Empresarial',
    donor: mockCustomer,
    start: {
      phlebotomist: 'Equipe Comercial',
      targetQty: '450',
      bagType: 'Plano T',
    },
    end: {
      phlebotomist: 'Equipe de Sucesso',
      actualQty: '452',
      startTime: '08:10',
      endTime: '08:20',
      punctureSite: 'Digital',
      homogenizer: 'Portal CRM Avançado',
    },
    observations: {
      collection: 'Acompanhamento ativo para retenção',
      forCollection: 'Proposta de renovação',
      fractionation: 'Segmentação VIP',
    },
    supplies: {
      alcoholLot: 'Contrato 198',
      degermantLot: 'Plano de Atendimento Premium',
    },
  };

  type CustomerForm = typeof initialForm;

  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);

  function updateField(path: string, value: string) {
    setForm((current) => {
      const next = { ...current } as any;
      const keys = path.split('.');
      let pointer = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        pointer[keys[i]] = { ...pointer[keys[i]] };
        pointer = pointer[keys[i]];
      }

      pointer[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSave() {
    const nextErrors: Record<string, string> = {};
    if (!form.start.targetQty.trim()) nextErrors['start.targetQty'] = 'Obrigatório';
    if (!form.end.actualQty.trim()) nextErrors['end.actualQty'] = 'Obrigatório';
    if (!form.end.startTime.trim()) nextErrors['end.startTime'] = 'Obrigatório';
    if (!form.end.endTime.trim()) nextErrors['end.endTime'] = 'Obrigatório';
    if (!form.end.homogenizer.trim()) nextErrors['end.homogenizer'] = 'Obrigatório';
    if (!form.supplies.alcoholLot.trim()) nextErrors['supplies.alcoholLot'] = 'Obrigatório';
    if (!form.supplies.degermantLot.trim()) nextErrors['supplies.degermantLot'] = 'Obrigatório';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus(null);
      return;
    }

    try {
      await submitCustomer(form);
      setStatus('Cliente salvo com sucesso.');
      setErrors({});
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao salvar os dados.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm">
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Conta</p>
          <p className="font-bold">AC-3842</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Código Cliente</p>
          <p className="font-bold">B345922000108</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Data de Cadastro</p>
          <p className="font-bold">15/09/2022</p>
        </div>
        <div className="space-y-1 col-span-1 lg:col-span-2">
          <p className="text-gray-500 font-medium">Segmento</p>
          <p className="font-bold">Relacionamento Corporativo</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Plano</p>
          <p className="font-bold">Conta Empresarial</p>
        </div>
      </div>

      {/* Main Form Sections */}
      <div className="space-y-6">
        {/* Perfil do Cliente */}
        <Section title="Perfil do Cliente" icon={<User className="h-4 w-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col items-center">
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500 uppercase font-bold tracking-wider">Foto do Cliente</p>
            </div>
            
            <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <DataField label="ID do Cliente" value={mockDonor.id} />
              <DataField label="Nome" value={mockDonor.name} colSpan={2} />
              <DataField label="Data de Nascimento" value={mockDonor.birthDate} />
              <DataField label="Idade" value={`${mockDonor.age} anos`} />
              <DataField label="Sexo" value={mockDonor.sex} />
              <DataField label="Segmento" value={mockDonor.donorClass} />
              <DataField label="Contato Principal" value={mockDonor.motherName} />
              <DataField label="Contato Secundário" value={mockDonor.fatherName} />
              <DataField label="Grupo" value={mockDonor.bloodGroup} />
              <DataField label="Categoria" value={mockDonor.rhFactor} />
              <DataField label="Origem" value={mockDonor.pai} />
              <DataField label="SLA" value={mockDonor.iai} />
              <DataField label="Fenotipagem" value={mockDonor.phenotyping || "-"} />
              <DataField label="Resultado do EH" value={mockDonor.ehResult || "-"} />
              <DataField label="Resultado do Hb's" value={mockDonor.hbsResult || "-"} />
            </div>
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Planejamento de Receita */}
          <Section title="Planejamento de Receita" icon={<Calendar className="h-4 w-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Equipe Responsável" value={form.start.phlebotomist} disabled />
              <InputField
                label="Meta de Receita"
                placeholder="Ex: 450"
                value={form.start.targetQty}
                onChange={(event) => updateField('start.targetQty', event.target.value)}
              />
              {errors['start.targetQty'] && <p className="text-xs text-red-600">{errors['start.targetQty']}</p>}
              <InputField label="Plano de Conta" value={form.start.bagType} disabled />
            </div>
          </Section>

          {/* Término de Coleta */}
          <Section title="Entrega e SLA" icon={<Clock className="h-4 w-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Gerente de Conta" value={form.end.phlebotomist} disabled />
              <InputField
                label="Receita Realizada"
                placeholder="Ex: 452"
                value={form.end.actualQty}
                onChange={(event) => updateField('end.actualQty', event.target.value)}
              />
              {errors['end.actualQty'] && <p className="text-xs text-red-600">{errors['end.actualQty']}</p>}
              <InputField
                label="Início do Atendimento"
                placeholder="08:10"
                value={form.end.startTime}
                onChange={(event) => updateField('end.startTime', event.target.value)}
              />
              {errors['end.startTime'] && <p className="text-xs text-red-600">{errors['end.startTime']}</p>}
              <InputField
                label="Fim do Atendimento"
                placeholder="08:20"
                value={form.end.endTime}
                onChange={(event) => updateField('end.endTime', event.target.value)}
              />
              {errors['end.endTime'] && <p className="text-xs text-red-600">{errors['end.endTime']}</p>}
              <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                <SelectField
                  label="Canal de Contato"
                  name="end.punctureSite"
                  options={['D - Direito', 'E - Esquerdo']}
                  selected={form.end.punctureSite}
                  onChange={(event) => updateField('end.punctureSite', event.target.value)}
                />
                <SelectField
                  label="Ferramenta CRM"
                  name="end.homogenizer"
                  options={['Portal CRM Avançado']}
                  selected={form.end.homogenizer}
                  onChange={(event) => updateField('end.homogenizer', event.target.value)}
                />
              </div>
              {errors['end.homogenizer'] && <p className="text-xs text-red-600">{errors['end.homogenizer']}</p>}
            </div>
          </Section>
        </div>

        <Section title="Notas do Cliente" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TextAreaField label="Notas Internas" value={form.observations.collection} />
            <TextAreaField label="Proposta Comercial" value={form.observations.forCollection} />
            <TextAreaField label="Plano de Retenção" value={form.observations.fractionation} />
          </div>
        </Section>

        <Section title="Contratos e Registros" icon={<Package className="h-4 w-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Registro Interno"
              value={form.supplies.alcoholLot}
              onChange={(event) => updateField('supplies.alcoholLot', event.target.value)}
            />
            <InputField
              label="Plano de Atendimento"
              value={form.supplies.degermantLot}
              onChange={(event) => updateField('supplies.degermantLot', event.target.value)}
            />
          </div>
        </Section>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          Cancelar
        </button>
        <button className="px-6 py-2.5 bg-[#1E3A5A] text-white font-semibold rounded-lg hover:bg-[#152D47] transition-colors shadow-lg">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

