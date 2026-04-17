import { ReactNode, useRef } from 'react';
import { Heart, Thermometer, Clock, Activity, Ruler, Weight, Printer, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Vitals } from '../types';
import { Section, DataField, InputField, SelectField, TextAreaField } from './ui';

export default function SalesOrder() {
  const mockVitalsStart: Vitals = {
    value: 1.8,
    weight: 90,
    bmi: 27,
    bloodPressure: '120/080',
    pulse: 90,
    temp: 36.0,
    hemoglobin: 15.0,
    hematocrit: 43.0
  };

  const mockVitalsEnd: Vitals = {
    value: 1.8,
    weight: 90,
    bmi: 27,
    bloodPressure: '110/070',
    pulse: 88,
    temp: 35.3,
    hemoglobin: 15.0,
    hematocrit: 43.0
  };

  const orderInfo = {
    invoiceNo: '54',
    category: '01 - CONSULTORIA PREMIUM',
    client: '6597038 - TESTE PROCEDIMENTO',
    orderNumber: '6597038',
    accountManager: '2.160.916 - ADALBERTO M. COELHO',
    projectManager: '1 - SUPORTE E DESENVOLVIMENTO',
    issueDate: '09/09/2022 09:55',
    product: 'E001 - CONSULTORIA AVANÇADA',
    deliveryDate: '09/09/2022 10:05',
    quantity: 1,
    estimatedValue: 450,
    paymentTerms: '02 - Parcelado',
    installments: 3,
    installmentValue: 150,
    salesChannel: '04 - Indicação',
    status: '01 - Em Aberto',
    customerName: 'TESTE PROCEDIMENTO',
    shippingDate: '09/09/2022'
  };

  const orderRef = useRef<HTMLDivElement | null>(null);

  const handleExportPdf = async () => {
    if (!orderRef.current) return;

    const canvas = await html2canvas(orderRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(imgData, 'PNG', 20, 20, pdfWidth - 40, pdfHeight);
    doc.save('relatorio-pedido.pdf');
  };

  const handlePrintLabel = () => {
    const labelHtml = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Impressão de Etiqueta</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; }
            .label-card { inline-size: 320px; padding: 16px; border: 1px dashed #333; border-radius: 12px; }
            .label-card h2 { margin: 0 0 10px; font-size: 18px; }
            .label-card p { margin: 6px 0; line-height: 1.4; }
            .label-card strong { display: inline-block; inline-size: 110px; }
            @media print { body { margin: 0; } .label-card { box-shadow: none; border-color: #000; } }
          </style>
        </head>
        <body>
          <div class="label-card">
            <h2>Etiqueta de Entrega</h2>
            <p><strong>Pedido:</strong> ${orderInfo.orderNumber}</p>
            <p><strong>Cliente:</strong> ${orderInfo.customerName}</p>
            <p><strong>Produto:</strong> ${orderInfo.product}</p>
            <p><strong>Quantidade:</strong> ${orderInfo.quantity}</p>
            <p><strong>Data de Entrega:</strong> ${orderInfo.shippingDate}</p>
            <p><strong>Status:</strong> ${orderInfo.status === '01 - Em Aberto' ? 'Em Aberto' : orderInfo.status}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=450,height=650');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Impressão de Etiqueta</title></head><body>${labelHtml}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="space-y-6">
      <div ref={orderRef} className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm">
        <DataHeader label="Pedido" value={orderInfo.invoiceNo} />
        <DataHeader label="Categoria" value={orderInfo.category} colSpan={2} />
        <DataHeader label="Cliente" value={orderInfo.client} colSpan={2} />
        <DataHeader label="Número do Pedido" value={orderInfo.orderNumber} />
        <DataHeader label="Gerente de Conta" value={orderInfo.accountManager} colSpan={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projeção Inicial */}
        <VitalsSection title="Projeção Inicial" vitals={mockVitalsStart} type="start" />
        
        {/* Resultados Finais */}
        <VitalsSection title="Resultados Finais" vitals={mockVitalsEnd} type="end" />
      </div>

      {/* Dados do Pedido */}
      <Section title="Dados do Pedido" icon={<Activity className="h-4 w-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Gerente de Projeto" options={['1 - SUPORTE E DESENVOLVIMENTO']} selected="1 - SUPORTE E DESENVOLVIMENTO" />
              <DataField label="Data de Emissão" value="09/09/2022 09:55" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Produto/Serviço" options={['E001 - CONSULTORIA AVANÇADA']} selected="E001 - CONSULTORIA AVANÇADA" />
              <DataField label="Data de Entrega" value="09/09/2022 10:05" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Quantidade" value="1" />
              <InputField label="Valor Estimado" value="450" />
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Líquido de Reposição</h3>
            <div className="space-y-4">
              <SelectField label="Condição de Pagamento" options={['01 - À Vista', '02 - Parcelado']} selected="02 - Parcelado" />
              <div className="grid grid-cols-2 gap-2">
                <InputField label="Parcelas" value="3" />
                <InputField label="Valor por Parcela" value="150" />
              </div>
              <SelectField label="Canal de Venda" options={['04 - Indicação', '05 - Site']} selected="04 - Indicação" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
          <SelectField label="Status do Pedido" options={['01 - Em Aberto', '02 - Fechado']} selected="01 - Em Aberto" />
          <SelectField label="Canal de Venda" options={['05 - Online', '06 - Indicação']} selected="05 - Online" />
          <div className="md:col-span-2">
            <TextAreaField label="Observações do Pedido" />
          </div>
        </div>
      </Section>

      <div className="flex flex-col gap-3 md:flex-row justify-between items-start md:items-center pt-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Exportar inventário do pedido em PDF ou imprimir etiquetas com os dados do cliente e entrega.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportPdf}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Exportar PDF
          </button>
          <button
            onClick={handlePrintLabel}
            className="px-6 py-2.5 bg-[#1E3A5A] text-white font-semibold rounded-lg hover:bg-[#152D47] transition-colors shadow-lg flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir Etiqueta
          </button>
          <button className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg">
            Concluir Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

function VitalsSection({ title, vitals, type }: { title: string; vitals: Vitals; type: 'start' | 'end' }) {
  const isStart = type === 'start';
  return (
    <Section title={title} icon={isStart ? <Activity className="h-4 w-4" /> : <Clock className="h-4 w-4" />}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isStart && <VitalCard label="Valor Total" value={vitals.value} unit="M" icon={<Ruler className="h-3 w-3" />} color="blue" />}
        <VitalCard label="Desconto" value={vitals.weight} unit="%" icon={<Weight className="h-3 w-3" />} color="blue" />
        <VitalCard label="Margem" value={vitals.bmi} icon={<Activity className="h-3 w-3" />} color="amber" />
        <VitalCard label="Volume" value={vitals.bloodPressure} icon={<Heart className="h-3 w-3" />} color="red" />
        <VitalCard label="Engajamento" value={vitals.pulse} unit="pts" icon={<Activity className="h-3 w-3" />} color="indigo" />
        <VitalCard label="Prazo" value={vitals.temp} unit="d" icon={<Thermometer className="h-3 w-3" />} color="orange" />
        <VitalCard label="Meta" value={vitals.hemoglobin} icon={<Activity className="h-3 w-3" />} color="red" />
        <VitalCard label="Satisfação" value={vitals.hematocrit} icon={<Activity className="h-3 w-3" />} color="red" />
      </div>
    </Section>
  );
}

function VitalCard({ label, value, unit, icon, color }: { label: string; value: string | number; unit?: string; icon: ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <div className={`p-3 rounded-xl border ${colorMap[color]} shadow-sm space-y-1`}>
      <div className="flex items-center gap-1.5 opacity-70">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold tracking-tight">{value}</span>
        {unit && <span className="text-[10px] font-medium opacity-60">{unit}</span>}
      </div>
    </div>
  );
}

function DataHeader({ label, value, colSpan = 1 }: { label: string; value: string; colSpan?: number }) {
  return (
    <div className={`space-y-1 ${colSpan > 1 ? `lg:col-span-${colSpan}` : ''}`}>
      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">{label}</p>
      <p className="font-bold text-gray-800 break-words">{value}</p>
    </div>
  );
}
