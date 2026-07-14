'use client';

import { useState, useEffect, useCallback } from 'react';

type Section = 'dashboard' | 'products' | 'productForm' | 'categories' | 'leads' | 'contacts' | 'settings';
type AdminUser = { id: string; email: string; firstName: string; lastName: string; role: string };

// ─── API Client ───
async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  return res.json();
}

// ─── Login Form ───
function LoginForm({ onLogin }: { onLogin: (user: AdminUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await apiFetch('/api/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data.success) { onLogin(data.user); }
    else { setError(data.error || 'Eroare la autentificare'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Sudofim Serv SRL</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Parola" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all disabled:opacity-50">
            {loading ? 'Se autentifica...' : 'Autentificare'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Overview ───
function DashboardOverview() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentLeads, setRecentLeads] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    apiFetch('/api/admin/dashboard/').then(data => {
      if (data.success) { setStats(data.stats); setRecentLeads(data.recentLeads || []); }
    });
  }, []);

  const cards = [
    { label: 'Total Produse', value: stats.totalProducts || 0, color: 'bg-blue-500' },
    { label: 'Produse Active', value: stats.activeProducts || 0, color: 'bg-green-500' },
    { label: 'Total Lead-uri', value: stats.totalLeads || 0, color: 'bg-purple-500' },
    { label: 'Lead-uri Azi', value: stats.newLeadsToday || 0, color: 'bg-red-500' },
    { label: 'Lead-uri Saptamana', value: stats.newLeadsWeek || 0, color: 'bg-orange-500' },
    { label: 'Mesaje Necitite', value: stats.unreadContacts || 0, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="admin-card">
            <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{c.value}</span>
            </div>
            <p className="text-gray-500 text-sm">{c.label}</p>
          </div>
        ))}
      </div>
      {recentLeads.length > 0 && (
        <div className="admin-card">
          <h3 className="font-bold text-dark mb-4">Ultimele Lead-uri</h3>
          <div className="space-y-3">
            {recentLeads.map((lead: Record<string, unknown>) => (
              <div key={lead.id as string} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-sm">{lead.name as string}</p>
                  <p className="text-gray-400 text-xs">{lead.phone as string} {lead.product ? `• ${(lead.product as Record<string, string>).title}` : ''}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase lead-${(lead.status as string).toLowerCase()}`}>
                  {lead.status as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Products Manager ───
function ProductsManager({ onEdit }: { onEdit: (id: string | null) => void }) {
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('/api/admin/products/');
    if (data.success) setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const deleteProduct = async (id: string) => {
    if (!confirm('Sigur doriti sa stergeti acest produs?')) return;
    await apiFetch(`/api/admin/products/${id}/`, { method: 'DELETE' });
    loadProducts();
  };

  const filtered = products.filter(p =>
    (p.title as string).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Produse ({products.length})</h2>
        <button onClick={() => onEdit(null)} className="admin-btn-primary">+ Adauga Produs</button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Cauta produs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
      </div>
      {loading ? <p className="text-gray-400">Se incarca...</p> : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Titlu</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Categorie</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Stare</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((p: Record<string, unknown>) => (
                <tr key={p.id as string} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 max-w-xs truncate">{p.title as string}</td>
                  <td className="py-3 px-2 text-gray-500">{(p.category as Record<string, string>)?.name}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.condition === 'NOU' ? 'badge-new' : 'badge-used'} text-white`}>
                      {p.condition as string}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {p.status as string}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button onClick={() => onEdit(p.id as string)} className="text-primary hover:underline text-xs">Editeaza</button>
                    <button onClick={() => deleteProduct(p.id as string)} className="text-red-500 hover:underline text-xs">Sterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 50 && <p className="text-gray-400 text-xs mt-2 text-center">Se afiseaza primele 50 din {filtered.length}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Product Form ───
function ProductForm({ productId, onBack }: { productId: string | null; onBack: () => void }) {
  const [categories, setCategories] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({ title: '', slug: '', condition: 'UTILIZAT', categoryId: '', description: '', status: 'ACTIVE', featured: false, metaTitle: '', metaDescription: '', images: [] as string[] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/api/admin/categories/').then(d => { if (d.success) setCategories(d.categories); });
    if (productId) {
      apiFetch(`/api/admin/products/${productId}/`).then(d => {
        if (d.success) {
          const p = d.product;
          setForm({ title: p.title, slug: p.slug, condition: p.condition, categoryId: p.categoryId, description: p.description || '', status: p.status, featured: p.featured, metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '', images: p.images || [] });
        }
      });
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = productId ? `/api/admin/products/${productId}/` : '/api/admin/products/';
    const method = productId ? 'PUT' : 'POST';
    await apiFetch(url, { method, body: JSON.stringify(form) });
    setSaving(false);
    onBack();
  };

  const updateField = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="admin-btn-outline">&larr; Inapoi</button>
        <h2 className="text-2xl font-bold text-dark">{productId ? 'Editeaza Produs' : 'Adauga Produs'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="admin-card space-y-4 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titlu *</label>
            <input type="text" required value={form.title} onChange={e => { updateField('title', e.target.value); if (!productId) updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100)); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={e => updateField('slug', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorie *</label>
            <select required value={form.categoryId} onChange={e => updateField('categoryId', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">Selecteaza...</option>
              {categories.map(c => <option key={c.id as string} value={c.id as string}>{c.name as string}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stare</label>
            <select value={form.condition} onChange={e => updateField('condition', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="NOU">Nou</option>
              <option value="UTILIZAT">Utilizat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => updateField('status', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="ACTIVE">Activ</option>
              <option value="DRAFT">Draft</option>
              <option value="INACTIVE">Inactiv</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
          <textarea rows={5} value={form.description} onChange={e => updateField('description', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} className="rounded" />
          <label htmlFor="featured" className="text-sm text-gray-700">Produs recomandat (afisat pe homepage)</label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
            <input type="text" value={form.metaTitle} onChange={e => updateField('metaTitle', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
            <input type="text" value={form.metaDescription} onChange={e => updateField('metaDescription', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="admin-btn-primary">{saving ? 'Se salveaza...' : 'Salveaza'}</button>
          <button type="button" onClick={onBack} className="admin-btn-outline">Anuleaza</button>
        </div>
      </form>
    </div>
  );
}

// ─── Leads Manager ───
function LeadsManager() {
  const [leads, setLeads] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/leads/').then(d => { if (d.success) setLeads(d.leads); setLoading(false); });
  }, []);

  const updateLead = async (id: string, status: string) => {
    await apiFetch('/api/admin/leads/', { method: 'PUT', body: JSON.stringify({ id, status }) });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Lead-uri ({leads.length})</h2>
      {loading ? <p>Se incarca...</p> : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Nume</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Telefon</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Produs</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Mesaj</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l: Record<string, unknown>) => (
                <tr key={l.id as string} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{l.name as string}</td>
                  <td className="py-3 px-2"><a href={`tel:${l.phone}`} className="text-primary hover:underline">{l.phone as string}</a></td>
                  <td className="py-3 px-2 text-gray-500 max-w-xs truncate">{l.product ? (l.product as Record<string, string>).title : '-'}</td>
                  <td className="py-3 px-2 text-gray-500 max-w-xs truncate">{(l.message as string) || '-'}</td>
                  <td className="py-3 px-2">
                    <select value={l.status as string} onChange={e => updateLead(l.id as string, e.target.value)} className="px-2 py-1 border rounded text-xs">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-2 text-gray-400 text-xs">{new Date(l.createdAt as string).toLocaleDateString('ro-RO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Categories Manager ───
function CategoriesManager() {
  const [categories, setCategories] = useState<Array<Record<string, unknown>>>([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    apiFetch('/api/admin/categories/').then(d => { if (d.success) setCategories(d.categories); });
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const data = await apiFetch('/api/admin/categories/', { method: 'POST', body: JSON.stringify({ name: newName }) });
    if (data.success) {
      setCategories(prev => [...prev, { ...data.category, _count: { products: 0 } }]);
      setNewName('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Categorii ({categories.length})</h2>
      <form onSubmit={addCategory} className="flex gap-2 mb-6">
        <input type="text" placeholder="Nume categorie noua..." value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <button type="submit" className="admin-btn-primary">Adauga</button>
      </form>
      <div className="admin-card">
        {categories.map((c: Record<string, unknown>) => (
          <div key={c.id as string} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <span className="font-medium text-sm">{c.name as string}</span>
              <span className="text-gray-400 text-xs ml-2">({(c._count as Record<string, number>)?.products || 0} produse)</span>
            </div>
            <span className="text-gray-400 text-xs">{c.slug as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Page ───
export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [section, setSection] = useState<Section>('dashboard');
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const handleLogout = async () => {
    await apiFetch('/api/auth/logout/', { method: 'POST' });
    setUser(null);
  };

  const handleEditProduct = (id: string | null) => {
    setEditProductId(id);
    setSection('productForm');
  };

  if (!user) return <LoginForm onLogin={setUser} />;

  const menuItems: { key: Section; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'products', label: 'Produse', icon: '📦' },
    { key: 'categories', label: 'Categorii', icon: '📁' },
    { key: 'leads', label: 'Lead-uri', icon: '📋' },
    { key: 'contacts', label: 'Mesaje', icon: '✉️' },
    { key: 'settings', label: 'Setari', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex pt-0">
      {/* Sidebar */}
      <aside className="w-64 bg-dark min-h-screen fixed left-0 top-0 z-50 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white font-bold text-lg">Sudofim Admin</h1>
          <p className="text-white/40 text-xs">{user.email}</p>
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`w-full text-left px-6 py-3 text-sm transition-colors flex items-center gap-3 ${
                section === item.key ? 'bg-primary text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-white/40 hover:text-white text-sm transition-colors">
            Deconectare
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {section === 'dashboard' && <DashboardOverview />}
        {section === 'products' && <ProductsManager onEdit={handleEditProduct} />}
        {section === 'productForm' && <ProductForm productId={editProductId} onBack={() => setSection('products')} />}
        {section === 'categories' && <CategoriesManager />}
        {section === 'leads' && <LeadsManager />}
        {section === 'contacts' && <div className="admin-card"><h2 className="text-xl font-bold mb-4">Mesaje Contact</h2><p className="text-gray-400">Se incarca...</p></div>}
        {section === 'settings' && <div className="admin-card"><h2 className="text-xl font-bold mb-4">Setari</h2><p className="text-gray-400">Setarile se configureaza din baza de date.</p></div>}
      </main>
    </div>
  );
}
