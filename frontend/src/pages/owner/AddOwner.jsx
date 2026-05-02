import React, { useState } from 'react';
import { Scissors, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import AdminKeyGate from '../../components/admin/AdminKeyGate';
import OwnerCreationForm from '../../components/admin/OwnerCreationForm';
import CreationResult from '../../components/admin/CreationResult';

const CITY_OPTIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];
const CATEGORY_OPTIONS = [{ value: 'men', label: "Men's Grooming" }, { value: 'women', label: "Women's Beauty" }, { value: 'spa', label: 'Spa & Wellness' }, { value: 'home', label: 'Home Service' }];

const AddOwner = () => {
    const [adminKey, setAdminKey] = useState('');
    const [keyInput, setKeyInput] = useState('');
    const [keyError, setKeyError] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', salonName: '', city: '', category: 'spa' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleKeySubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/create-owner', {}, { headers: { 'x-admin-secret': keyInput }, validateStatus: (s) => s < 500 });
            setAdminKey(keyInput);
        } catch { setKeyError('Incorrect admin secret key. Please try again.'); }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (result) setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/admin/create-owner', form, { headers: { 'x-admin-secret': adminKey } });
            setResult({ success: true, message: response.data.message, data: response.data.data });
            setForm({ name: '', email: '', password: '', salonName: '', city: '', category: 'spa' });
        } catch (err) {
            if (err.response?.status === 401) { setAdminKey(''); setKeyError('Session expired. Re-enter key.'); }
            setResult({ success: false, message: err.response?.data?.message || 'Something went wrong.' });
        } finally { setLoading(false); }
    };

    if (!adminKey) return <AdminKeyGate keyInput={keyInput} setKeyInput={setKeyInput} keyError={keyError} setKeyError={setKeyError} showKey={showKey} setShowKey={setShowKey} handleKeySubmit={handleKeySubmit} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"><Scissors className="w-6 h-6 text-orange-500" /></div>
                    <div><p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Admin Panel</p><h1 className="text-3xl font-black text-gray-900">Add New Salon Owner</h1></div>
                    <div className="ml-auto flex items-center gap-3"><span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100"><ShieldCheck className="w-3.5 h-3.5" /> Authenticated</span><button onClick={() => setAdminKey('')} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Sign Out</button></div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        {result && (
                            <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${result.success ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                {result.success ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-500" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />}
                                <span>{result.message}</span>
                            </div>
                        )}
                        <OwnerCreationForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} showPassword={showPassword} setShowPassword={setShowPassword} CITY_OPTIONS={CITY_OPTIONS} CATEGORY_OPTIONS={CATEGORY_OPTIONS} setForm={setForm} />
                    </div>
                    <div className="space-y-5">
                        <CreationResult result={result} />
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5"><p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Security Note</p><p className="text-sm text-amber-800">Passwords are hashed with bcrypt before storage. The admin secret key is only stored in your server's <code>.env</code> file and never exposed to the frontend.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOwner;
