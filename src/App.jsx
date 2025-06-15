import React, { useState, useEffect } from 'react';

// 아이콘 컴포넌트들
const Smartphone = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const CheckCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const UserPlus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);

// 고객 등록 폼
const RegistrationForm = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreed) {
            alert('개인정보 처리 방침에 동의해주세요.');
            return;
        }
        const newCustomer = { 
            id: `cust_${new Date().getTime()}`, 
            name, 
            phone, 
            email, 
            visits: 1 
        };
        onRegister(newCustomer);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <div className="text-center mb-6">
                <UserPlus className="mx-auto w-12 h-12 text-indigo-500 mb-2" />
                <h2 className="text-2xl font-bold text-gray-800">첫 방문을 환영합니다!</h2>
                <p className="text-gray-500 mt-1">간단한 정보 등록 후 혜택을 받으세요.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <input type="tel" placeholder="전화번호" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="agree" className="text-sm text-gray-600">
                        <a href="#" className="underline text-indigo-600">개인정보 처리 방침</a>에 동의합니다.
                    </label>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                    등록하고 적립받기
                </button>
            </form>
        </div>
    );
};

// 재방문 환영 메시지
const VisitSuccessMessage = ({ customer }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
                <span className="text-indigo-600">{customer.name}</span>님, 환영합니다!
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
                벌써 <span className="font-bold text-3xl text-orange-500 mx-1">{customer.visits}</span>번째 방문이시네요!
            </p>
            <p className="mt-4 text-sm text-gray-500">방문이 성공적으로 적립되었습니다.</p>
        </div>
    );
};

// 고객 메인 페이지 로직
const VisitPage = () => {
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedCustomer = localStorage.getItem('nfcCustomer');
        if (storedCustomer) {
            const customerData = JSON.parse(storedCustomer);
            customerData.visits += 1; 
            localStorage.setItem('nfcCustomer', JSON.stringify(customerData));
            setCustomer(customerData);
        }
        setIsLoading(false);
    }, []);

    const handleRegistration = (newCustomer) => {
        localStorage.setItem('nfcCustomer', JSON.stringify(newCustomer));
        setCustomer(newCustomer);
    };

    if (isLoading) {
        return <div className="text-center text-gray-500">고객 정보를 확인하는 중...</div>;
    }
    
    return customer ? (
        <VisitSuccessMessage customer={customer} />
    ) : (
        <RegistrationForm onRegister={handleRegistration} />
    );
};

// 전체 앱 (시뮬레이션 포함)
export default function App() {
    const [key, setKey] = useState(Date.now());

    const simulateNewScan = () => {
        localStorage.removeItem('nfcCustomer');
        setKey(Date.now());
    };
    
    const simulateExistingScan = () => {
        const existingCustomer = localStorage.getItem('nfcCustomer');
        if (!existingCustomer) {
            localStorage.setItem('nfcCustomer', JSON.stringify({
                id: 'cust_12345',
                name: '김단골',
                phone: '010-1111-2222',
                email: 'loyal.customer@example.com',
                visits: 4 
            }));
        }
        setKey(Date.now());
    };

    return (
        <div className="font-sans min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-8">
            <div className="w-full max-w-md p-4 bg-white rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-center mb-4">NFC 태그 스캔 시뮬레이션</h3>
                 <div className="flex justify-center items-center text-indigo-600 mb-4">
                    <Smartphone className="w-8 h-8"/>
                    <div className="font-mono text-2xl animate-pulse">&nbsp;(((•)))&nbsp;</div>
                    <div className="w-16 h-10 bg-gray-200 rounded-md flex items-center justify-center text-sm font-semibold">NFC</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={simulateNewScan} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                        신규 고객 스캔
                    </button>
                    <button onClick={simulateExistingScan} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                        기존 고객 스캔
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
