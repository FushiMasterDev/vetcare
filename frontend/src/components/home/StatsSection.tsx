const stats = [
  { value: '50K+', label: 'Khách hàng tin tưởng' },
  { value: '120+', label: 'Bác sĩ chuyên khoa' },
  { value: '15+', label: 'Chi nhánh toàn quốc' },
  { value: '98%', label: 'Khách hàng hài lòng' },
];

export default function StatsSection() {
  return (
    <section className="bg-green-600 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-green-100 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
