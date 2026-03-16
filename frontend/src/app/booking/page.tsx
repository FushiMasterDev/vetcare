'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { servicesApi, doctorsApi, branchesApi, appointmentsApi } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, Clock, User, MapPin, FileText, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Service, Doctor, Branch } from '@/types';

const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

const schema = z.object({
  serviceId: z.string().min(1, 'Chọn dịch vụ'),
  doctorId: z.string().min(1, 'Chọn bác sĩ'),
  branchId: z.string().min(1, 'Chọn chi nhánh'),
  appointmentDate: z.string().min(1, 'Chọn ngày khám'),
  appointmentTime: z.string().min(1, 'Chọn giờ khám'),
  petName: z.string().min(1, 'Nhập tên thú cưng'),
  petType: z.string().min(1, 'Chọn loại thú cưng'),
  reason: z.string().min(5, 'Mô tả lý do ít nhất 5 ký tự'),
  notes: z.string().optional(),
  termsAccepted: z.boolean().refine(v => v === true, 'Bạn phải chấp nhận điều khoản'),
});
type FormData = z.infer<typeof schema>;

const STEPS = ['Dịch vụ & Chi nhánh', 'Bác sĩ & Thời gian', 'Thông tin thú cưng', 'Xác nhận'];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: services } = useQuery({ queryKey: ['services'], queryFn: () => servicesApi.getAll().then(r => r.data) });
  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: () => branchesApi.getAll().then(r => r.data) });

  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: searchParams.get('serviceId') || '',
      branchId: searchParams.get('branchId') || '',
      termsAccepted: false,
    },
  });

  const watchServiceId = watch('serviceId');
  const watchBranchId = watch('branchId');
  const watchValues = watch();

  const { data: doctors } = useQuery({
    queryKey: ['doctors-service', watchServiceId],
    queryFn: () => watchServiceId ? doctorsApi.byService(Number(watchServiceId)).then(r => r.data) : doctorsApi.getAll().then(r => r.data),
    enabled: true,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => appointmentsApi.create({
      ...data,
      serviceId: Number(data.serviceId),
      doctorId: Number(data.doctorId),
      branchId: Number(data.branchId),
    }),
    onSuccess: () => setSuccess(true),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Đặt lịch thất bại'),
  });

  if (success) return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h2>
          <p className="text-gray-500 mb-6">Lịch hẹn của bạn đã được xác nhận. Chúng tôi sẽ liên hệ để nhắc lịch.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/profile/appointments')} className="btn-primary">Xem lịch hẹn</button>
            <button onClick={() => router.push('/')} className="btn-outline">Về trang chủ</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lịch khám</h1>
        <p className="text-gray-500 mb-8">Điền thông tin để đặt lịch hẹn với bác sĩ</p>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i < step ? 'bg-primary-600 border-primary-600 text-white' :
                  i === step ? 'border-primary-600 text-primary-600' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
          <div className="card p-6 space-y-5">
            {/* Step 0 */}
            {step === 0 && (
              <>
                <div>
                  <label className="label flex items-center gap-2"><FileText className="w-4 h-4 text-primary-500" />Dịch vụ <span className="text-red-500">*</span></label>
                  <select {...register('serviceId')} className="input">
                    <option value="">-- Chọn dịch vụ --</option>
                    {(services as Service[] || []).map((s: Service) => <option key={s.id} value={s.id}>{s.name} — {s.specialization}</option>)}
                  </select>
                  {errors.serviceId && <p className="text-red-500 text-xs mt-1">{errors.serviceId.message}</p>}
                </div>
                <div>
                  <label className="label flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" />Chi nhánh <span className="text-red-500">*</span></label>
                  <select {...register('branchId')} className="input">
                    <option value="">-- Chọn chi nhánh --</option>
                    {(branches as Branch[] || []).map((b: Branch) => <option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
                  </select>
                  {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
                </div>
              </>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <>
                <div>
                  <label className="label flex items-center gap-2"><User className="w-4 h-4 text-primary-500" />Bác sĩ <span className="text-red-500">*</span></label>
                  <select {...register('doctorId')} className="input">
                    <option value="">-- Chọn bác sĩ --</option>
                    {(doctors as Doctor[] || []).map((d: Doctor) => <option key={d.id} value={d.id}>BS. {d.fullName} — {d.specialization}</option>)}
                  </select>
                  {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId.message}</p>}
                </div>
                <div>
                  <label className="label flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-500" />Ngày khám <span className="text-red-500">*</span></label>
                  <input {...register('appointmentDate')} type="date" className="input" min={new Date().toISOString().split('T')[0]} />
                  {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate.message}</p>}
                </div>
                <div>
                  <label className="label flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" />Giờ khám <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {TIME_SLOTS.map(t => (
                      <label key={t} className="cursor-pointer">
                        <input type="radio" {...register('appointmentTime')} value={t} className="sr-only" />
                        <span className={`block text-center text-xs py-2 rounded-lg border transition-colors ${watchValues.appointmentTime === t ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:border-primary-300 text-gray-600'}`}>{t}</span>
                      </label>
                    ))}
                  </div>
                  {errors.appointmentTime && <p className="text-red-500 text-xs mt-1">{errors.appointmentTime.message}</p>}
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Tên thú cưng <span className="text-red-500">*</span></label>
                    <input {...register('petName')} className="input" placeholder="Mimi, Bông, ..." />
                    {errors.petName && <p className="text-red-500 text-xs mt-1">{errors.petName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Loại thú cưng <span className="text-red-500">*</span></label>
                    <select {...register('petType')} className="input">
                      <option value="">-- Chọn loại --</option>
                      {['Chó', 'Mèo', 'Thỏ', 'Chim', 'Cá', 'Hamster', 'Khác'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.petType && <p className="text-red-500 text-xs mt-1">{errors.petType.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Lý do khám / Triệu chứng <span className="text-red-500">*</span></label>
                  <textarea {...register('reason')} className="input resize-none" rows={4} placeholder="Mô tả triệu chứng, lý do cần khám..." />
                  {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
                </div>
                <div>
                  <label className="label">Ghi chú thêm</label>
                  <textarea {...register('notes')} className="input resize-none" rows={2} placeholder="Tiền sử bệnh, thuốc đang dùng, dị ứng..." />
                </div>
              </>
            )}

            {/* Step 3 — Confirmation */}
            {step === 3 && (
              <>
                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">Xác nhận thông tin đặt lịch</h3>
                  {[
                    ['Dịch vụ', (services as Service[] || []).find((s: Service) => s.id === Number(watchValues.serviceId))?.name],
                    ['Chi nhánh', (branches as Branch[] || []).find((b: Branch) => b.id === Number(watchValues.branchId))?.name],
                    ['Bác sĩ', 'BS. ' + ((doctors as Doctor[] || []).find((d: Doctor) => d.id === Number(watchValues.doctorId))?.fullName || '')],
                    ['Ngày khám', watchValues.appointmentDate],
                    ['Giờ khám', watchValues.appointmentTime],
                    ['Thú cưng', `${watchValues.petName} (${watchValues.petType})`],
                    ['Lý do', watchValues.reason],
                  ].map(([label, value]) => value && (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  <h4 className="font-semibold mb-2">Điều khoản & Lưu ý</h4>
                  <ul className="space-y-1 list-disc list-inside text-xs">
                    <li>Vui lòng đến trước giờ hẹn 10 phút để hoàn tất thủ tục.</li>
                    <li>Mang theo sổ tiêm phòng và hồ sơ bệnh án (nếu có).</li>
                    <li>Nếu cần huỷ, vui lòng thông báo trước ít nhất 2 tiếng.</li>
                    <li>VetCare không chịu trách nhiệm nếu thú cưng không được tiêm phòng đầy đủ.</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register('termsAccepted')} className="mt-0.5 w-4 h-4 rounded text-primary-600" />
                  <span className="text-sm text-gray-700">Tôi đã đọc và đồng ý với <strong>điều khoản sử dụng dịch vụ</strong> của VetCare</span>
                </label>
                {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>}
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              className="btn-ghost disabled:opacity-40">← Quay lại</button>
            {step < 3 ? (
              <button type="button" onClick={() => setStep(s => Math.min(3, s + 1))} className="btn-primary">
                Tiếp theo <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={mutation.isPending} className="btn-primary">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {mutation.isPending ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
              </button>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
