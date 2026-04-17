import { ReactNode } from 'react';

type SectionProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

export default function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <div className="bg-white p-1.5 rounded-md border border-gray-200 shadow-sm">
          {icon}
        </div>
        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
