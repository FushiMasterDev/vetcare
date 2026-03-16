'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';
import { useAuthStore } from '@/lib/store';
import { Heart, MessageCircle, Eye, Plus, Search, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tất cả', 'Sức khoẻ', 'Dinh dưỡng', 'Huấn luyện', 'Chia sẻ', 'Hỏi đáp'];

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuthStore();
  const qc = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [keyword, setKeyword] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Chia sẻ', imageUrl: '' });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.getAll().then(r => r.data as Post[]),
  });

  const likeMutation = useMutation({
    mutationFn: (id: number) => postsApi.toggleLike(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
    onError: () => toast.error('Vui lòng đăng nhập để thích bài viết'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => postsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['posts'] }); setShowCreate(false); setNewPost({ title: '', content: '', category: 'Chia sẻ', imageUrl: '' }); toast.success('Đăng bài thành công!'); },
    onError: () => toast.error('Đăng bài thất bại'),
  });

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'Tất cả' || p.category === activeCategory;
    const matchKw = !keyword || p.title.toLowerCase().includes(keyword.toLowerCase());
    return matchCat && matchKw;
  });

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Cộng đồng VetCare</h1>
          <p className="text-green-100 text-lg mb-8">Chia sẻ kinh nghiệm và kết nối với cộng đồng yêu thú cưng</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm bài viết..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-sm focus:outline-none shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === c ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c}
            </button>
          ))}
          <div className="ml-auto">
            {isAuthenticated && (
              <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2">
                <Plus className="w-4 h-4" /> Đăng bài
              </button>
            )}
          </div>
        </div>

        {/* Create post modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Tạo bài viết mới</h3>
                <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                  placeholder="Tiêu đề bài viết..." className="input" />
                <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))} className="input">
                  {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
                <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                  placeholder="Nội dung bài viết..." rows={5} className="input resize-none" />
                <input value={newPost.imageUrl} onChange={e => setNewPost(p => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="URL hình ảnh (tuỳ chọn)" className="input" />
                <div className="flex gap-3">
                  <button onClick={() => setShowCreate(false)} className="flex-1 btn-ghost justify-center">Huỷ</button>
                  <button onClick={() => createMutation.mutate(newPost)} disabled={!newPost.title || !newPost.content || createMutation.isPending}
                    className="flex-1 btn-primary justify-center">
                    {createMutation.isPending ? 'Đang đăng...' : 'Đăng bài'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="card h-32 skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Chưa có bài viết nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(p => (
              <div key={p.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  {p.author.avatarUrl ? (
                    <img src={p.author.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold shrink-0">
                      {p.author.fullName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-gray-900">{p.author.fullName}</span>
                      {p.category && <span className="badge bg-green-100 text-green-700">{p.category}</span>}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href={`/community/${p.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.content}</p>
                  {p.imageUrl && <img src={p.imageUrl} alt="" className="mt-3 rounded-xl w-full h-48 object-cover" />}
                </Link>

                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-50">
                  <button onClick={() => isAuthenticated ? likeMutation.mutate(p.id) : toast.error('Vui lòng đăng nhập')}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${p.likedByCurrentUser ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                    <Heart className={`w-4 h-4 ${p.likedByCurrentUser ? 'fill-current' : ''}`} />
                    {p.likes}
                  </button>
                  <Link href={`/community/${p.id}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600">
                    <MessageCircle className="w-4 h-4" />{p.commentCount}
                  </Link>
                  <span className="flex items-center gap-1.5 text-sm text-gray-400 ml-auto">
                    <Eye className="w-4 h-4" />{p.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
