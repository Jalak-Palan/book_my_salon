import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Camera, Scissors, Clock, CheckCircle2, Loader2, Star, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

import StepBar from '../../components/onboarding/StepBar';
import BasicInfoStep from '../../components/onboarding/BasicInfoStep';
import AddressStep from '../../components/onboarding/AddressStep';
import PhotosStep from '../../components/onboarding/PhotosStep';
import ServicesStep from '../../components/onboarding/ServicesStep';
import TimingsStep from '../../components/onboarding/TimingsStep';

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Photos', icon: Camera },
  { id: 4, title: 'Services', icon: Scissors },
  { id: 5, title: 'Time Slots', icon: Clock },
];

const DEFAULT_SERVICES = [
  { name: 'Haircut', price: '' },
  { name: 'Beard', price: '' },
  { name: 'Hair Color', price: '' },
  { name: 'Spa', price: '' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_TIMINGS = DAYS.map(day => ({ day, open: '10:00', close: '20:00', isClosed: false }));

const SalonOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const [basic, setBasic] = useState({ ownerName: user?.name || '', salonName: '', email: user?.email || '', mobile1: '', mobile2: '', seats: 1 });
  const [address, setAddress] = useState({ salonAddress: '', ownerAddress: '', city: '', landmark: '', pincode: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [timings, setTimings] = useState(DEFAULT_TIMINGS);
  const [slotConfig, setSlotConfig] = useState({ duration: 30, gap: 5 });

  useEffect(() => {
    if (!user) { navigate('/owner-login'); return; }
    const fetchExistingDetails = async () => {
      setLoadingDetails(true);
      try {
        const res = await API.get('/owner-details/me');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setBasic({ ownerName: d.ownerName, salonName: d.salonName, email: d.email, mobile1: d.mobile1, mobile2: d.mobile2 || '', seats: d.seats || 1 });
          setAddress({ salonAddress: d.salonAddress, ownerAddress: d.ownerAddress || '', city: d.city, landmark: d.landmark || '', pincode: d.pincode });
          setImagePreviews(d.images || []);
          setServices(d.services?.length ? d.services : DEFAULT_SERVICES);
          setTimings(d.timings?.length ? d.timings : DEFAULT_TIMINGS);
          setSlotConfig(d.slotConfig || { duration: 30, gap: 5 });
          setIsEditMode(true);
        }
      } catch (err) { console.error('Fetch Details Error:', err); } finally { setLoadingDetails(false); }
    };
    fetchExistingDetails();
  }, [user, navigate]);

  const handleBasic = e => setBasic({ ...basic, [e.target.name]: e.target.value });
  const handleAddress = e => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    if (name === 'pincode' && value.length === 6) fetchCityFromPincode(value);
  };

  const fetchCityFromPincode = async (pin) => {
    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
      if (res.data?.[0]?.Status === 'Success') {
        const city = res.data[0].PostOffice[0].Division || res.data[0].PostOffice[0].District;
        setAddress(prev => ({ ...prev, city }));
      }
    } catch (err) { console.warn('Pincode fetch failed', err); }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles([...imageFiles, ...files]);
    setImagePreviews([...imagePreviews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = idx => {
    setImageFiles(imageFiles.filter((_, i) => i !== idx));
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!basic.ownerName || !basic.salonName || !basic.email || !basic.mobile1) return 'Please fill all required fields';
      if (basic.mobile1.length !== 10) return 'Mobile 1 must be exactly 10 digits';
      if (Number(basic.seats) < 1) return 'Minimum 1 seat required';
    }
    if (step === 2) {
      if (!address.salonAddress || !address.city || !address.pincode) return 'Address and city are required';
      if (address.pincode.length !== 6) return 'Pincode must be 6 digits';
    }
    if (step === 3) {
      if (imagePreviews.length < 2 && imageFiles.length === 0 && !isEditMode) return 'At least 2 photos are required';
      if (imagePreviews.length < 2) return 'At least 2 photos are required';
    }
    if (step === 4) {
      const active = services.filter(s => s.name && s.price !== '');
      if (active.length === 0) return 'Add at least one service';
    }
    return null;
  };

  const next = () => {
    const validationError = validateStep();
    if (validationError) { setError(validationError); return; }
    setError(''); setStep(s => s + 1);
  };
  const back = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const formData = new FormData();
      Object.entries(basic).forEach(([k, v]) => formData.append(k, v));
      Object.entries(address).forEach(([k, v]) => formData.append(k, v));
      imageFiles.forEach(file => formData.append('images', file));
      const activeServices = services.filter(s => s.name && s.price !== '');
      formData.append('services', JSON.stringify(activeServices.map(s => ({ name: s.name, price: Number(s.price) }))));
      formData.append('timings', JSON.stringify(timings));
      formData.append('slotConfig', JSON.stringify({ duration: Number(slotConfig.duration), gap: Number(slotConfig.gap) }));
      const endpoint = isEditMode ? '/owner-details/update' : '/owner-details/create';
      const method = isEditMode ? 'put' : 'post';
      await API[method](endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true); setTimeout(() => navigate('/owner-dashboard'), 2500);
    } catch (err) { setError(err.response?.data?.message || 'Submission failed. Please try again.'); } finally { setSubmitting(false); }
  };

  if (loadingDetails) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Salon Setup Complete!</h2>
        <p className="text-gray-500 font-medium tracking-wide">Redirecting to your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-black px-4 py-2 rounded-full mb-4 uppercase tracking-widest"><Star size={12} /> Salon Setup</div>
          <h1 className="text-4xl font-black text-gray-900">Configure Your Salon</h1>
          <p className="text-gray-500 font-medium mt-2">Finish these 5 steps to start receiving bookings.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <StepBar steps={steps} current={step} />
          {error && <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium"><AlertCircle size={16} /> {error}</div>}
          {step === 1 && <BasicInfoStep basic={basic} handleBasic={handleBasic} />}
          {step === 2 && <AddressStep address={address} handleAddress={handleAddress} />}
          {step === 3 && <PhotosStep imagePreviews={imagePreviews} handleImages={handleImages} removeImage={removeImage} />}
          {step === 4 && <ServicesStep services={services} handleServiceChange={(idx, field, value) => { const updated = [...services]; updated[idx][field] = value; setServices(updated); }} addService={() => setServices([...services, { name: '', price: '' }])} removeService={idx => setServices(services.filter((_, i) => i !== idx))} defaultServicesLength={DEFAULT_SERVICES.length} />}
          {step === 5 && <TimingsStep timings={timings} handleTimingChange={(idx, field, value) => { const updated = [...timings]; updated[idx][field] = value; setTimings(updated); }} slotConfig={slotConfig} setSlotConfig={setSlotConfig} />}
          <div className="flex gap-3 mt-10">
            {step > 1 && <button onClick={back} className="flex-1 py-3.5 border-2 border-gray-100 font-black text-sm rounded-2xl hover:bg-gray-50 flex justify-center items-center gap-2"><ChevronLeft size={18} /> Back</button>}
            <button onClick={step < 5 ? next : handleSubmit} disabled={submitting} className="flex-1 py-3.5 bg-gray-900 hover:bg-gray-700 text-white font-black text-sm rounded-2xl flex justify-center items-center gap-2 shadow-xl group">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : step < 5 ? <>Next <ChevronRight size={18} className="group-hover:translate-x-1 duration-200" /></> : 'Finish Setup'}
            </button>
          </div>
          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-6">Page {step} of 5</p>
        </div>
      </div>
    </div>
  );
};

export default SalonOnboarding;
