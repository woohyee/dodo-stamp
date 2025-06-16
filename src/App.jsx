import React, { useState, useEffect } from 'react';

// 아이콘 라이브러리 (Lucide React)
const Smartphone = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const CheckCircle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const UserPlus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);

const Loader = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// 백엔드 서버의 주소. 실제 배포 시에는 환경 변수로 관리하는 것이 좋습니다.
const API_URL = 'https://dodo-stamp-server.onrender.com';

// 고객 등록 폼
const RegistrationForm = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreed) {
      alert('Please agree to the Privacy Policy.');
      return;
    }
    setIsLoading(true);
    try {
      const customerData = { name, phone, email };
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'An unknown error occurred.');

      // 등록 성공 후, 첫 방문 기록을 위해 /api/visit 호출
      const visitResponse = await fetch(`${API_URL}/api/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: result.phone_number,
          tag_id: 'DODO-T001-Test',
        }),
      });
      const visitResult = await visitResponse.json();
      if (!visitResponse.ok)
        throw new Error(visitResult.error || 'Failed to record first visit.');

      onRegister(visitResult); // 방문 기록 후 최종 정보를 전달
    } catch (err) {
      console.error('Customer registration failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <div className="text-center mb-6">
        <UserPlus className="mx-auto w-12 h-12 text-indigo-500 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome to the Stamp Book!
        </h2>
        <p className="text-gray-500 mt-1">
          Register to collect your first stamp.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="underline text-indigo-600">
              Privacy Policy
            </a>
            .
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center disabled:bg-indigo-400"
        >
          {isLoading ? <Loader /> : 'Register & Get Stamp'}
        </button>
      </form>
    </div>
  );
};

// 재방문 환영 메시지
const VisitSuccessMessage = ({ result }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
      <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome back,{' '}
        <span className="text-indigo-600">{result.customer.name}</span>!
      </h2>
      <p className="text-gray-500 mt-2 text-lg">
        Your visit has been successfully recorded!
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Total Visits:{' '}
        <span className="font-bold text-3xl text-orange-500 mx-1">
          {result.totalVisits}
        </span>
      </p>
    </div>
  );
};

// 메인 로직 (고객 확인 기능 추가)
const VisitPage = () => {
  const [pageState, setPageState] = useState('loading'); // loading, register, success
  const [visitResult, setVisitResult] = useState(null);

  useEffect(() => {
    const processVisit = async () => {
      const storedPhone = localStorage.getItem('customerPhone');
      const tagId = 'DODO-T001-Test';

      if (!storedPhone) {
        setPageState('register');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: storedPhone, tag_id: tagId }),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || 'An unknown error occurred.');

        setVisitResult(result);
        setPageState('success');
      } catch (err) {
        console.error(err);
        localStorage.removeItem('customerPhone');
        setPageState('register');
      }
    };

    processVisit();
  }, []);

  const handleRegistrationSuccess = (result) => {
    localStorage.setItem('customerPhone', result.customer.phone_number);
    setVisitResult(result);
    setPageState('success');
  };

  if (pageState === 'loading') {
    return (
      <div className="text-center">
        <Loader /> <p className="mt-2">Verifying customer information...</p>
      </div>
    );
  }
  if (pageState === 'success') {
    return <VisitSuccessMessage result={visitResult} />;
  }
  return <RegistrationForm onRegister={handleRegistrationSuccess} />;
};

// 시뮬레이션을 위한 메인 App 컴포넌트
export default function App() {
  const [key, setKey] = useState(Date.now());

  const resetSimulation = () => {
    localStorage.removeItem('customerPhone');
    setKey(Date.now());
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-8">
      <div className="w-full max-w-md p-4 bg-white rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-center mb-4">
          NFC Tag Scan Simulation
        </h3>
        <div className="flex justify-center items-center text-indigo-600 mb-4">
          <Smartphone className="w-8 h-8" />
          <div className="font-mono text-2xl animate-pulse">
            &nbsp;(((•)))&nbsp;
          </div>
          <div className="w-16 h-10 bg-gray-200 rounded-md flex items-center justify-center text-sm font-semibold">
            NFC
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mb-2">
          Press the button to simulate a new scan.
        </p>
        <div className="grid grid-cols-1">
          <button
            onClick={resetSimulation}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Simulate New Scan (or Reset)
          </button>
        </div>
      </div>

      <div className="w-full max-w-md border-4 border-gray-800 rounded-3xl p-2 bg-gray-800 shadow-2xl">
        <div className="bg-gray-100 rounded-2xl p-4 min-h-[480px] flex items-center justify-center">
          <VisitPage key={key} />
        </div>
      </div>
    </div>
  );
}
