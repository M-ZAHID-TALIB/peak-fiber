import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, CheckCircle2, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: 'white', color: '#1e293b', overflowX: 'hidden' }}>

            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 8%',
                maxWidth: '1440px',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Using the Peak Fiber Logo */}
                    <img src="/logo.jpg" alt="Peak Fiber" style={{ height: '40px', borderRadius: '8px' }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Peak Fiber</span>
                </div>

                {/* Centered Links (Hidden on mobile) */}
                <div style={{ display: 'none', gap: '40px', alignItems: 'center', '@media (min-width: 768px)': { display: 'flex' } }} className="desktop-menu">
                    {['Home', 'Package', 'Pricing', 'Find Out', 'Contact'].map(link => (
                        <a key={link} href="#" style={{ textDecoration: 'none', color: '#64748b', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.target.style.color = '#0d235c'}
                            onMouseLeave={(e) => e.target.style.color = '#64748b'}>
                            {link}
                        </a>
                    ))}
                </div>

                <div>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'white',
                            color: '#0d235c',
                            border: '1px solid #e2e8f0',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            fontSize: '0.95rem'
                        }}
                        onMouseEnter={(e) => { e.target.style.borderColor = '#0d235c'; e.target.style.background = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = 'white'; }}
                    >
                        Operations Login
                    </button>
                </div>
            </nav>

            <style>{`
                @media (min-width: 900px) { .desktop-menu { display: flex !important; } }
            `}</style>

            {/* Hero Section */}
            <div style={{ padding: '4rem 8% 2rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Left Text */}
                <div style={{ flex: '1 1 500px', paddingRight: '4rem' }}>
                    <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '1rem', letterSpacing: '0.05em' }}>Welcome</div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        marginBottom: '1.5rem',
                        color: '#0f172a'
                    }}>
                        Find The Best<br /> Internet Connection<br /> From Your City
                    </h1>
                    <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '500px' }}>
                        Peak Fiber delivers ultra-fast, reliable enterprise connectivity with 99.9% uptime. Manage your entire infrastructure with ease.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button style={{
                            padding: '14px 32px',
                            background: '#0d235c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(13, 35, 92, 0.2)'
                        }} onClick={() => navigate('/login')}>
                            Get Started
                        </button>
                        <button style={{
                            padding: '14px 32px',
                            background: 'white',
                            color: '#0d235c',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            View Details
                        </button>
                    </div>
                </div>

                {/* Right Image (Man with floating elements) */}
                <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', position: 'relative', marginTop: '40px' }}>
                    {/* Floating Wifi Icon */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '0%',
                        background: 'rgba(56, 189, 248, 0.1)',
                        padding: '12px',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        <Wifi size={32} color="#0ea5e9" />
                    </div>

                    {/* Stats Card Overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '5%',
                        background: 'white',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)',
                        border: '1px solid #f1f5f9',
                        width: '180px',
                        zIndex: 2
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <span>20 mbps</span> <span style={{ color: '#f59e0b' }}>★ 4.2</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <span>50 mbps</span> <span style={{ color: '#f59e0b' }}>★ 4.5</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: '#0d235c' }}>
                            <span>200 mbps</span> <span style={{ color: '#f59e0b' }}>★ 4.8</span>
                        </div>
                    </div>

                    <img
                        src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Happy User"
                        style={{
                            width: '100%',
                            maxWidth: '450px',
                            height: '550px',
                            objectFit: 'cover',
                            borderRadius: '200px 200px 20px 20px',
                            background: '#f1f5f9'
                        }}
                    />
                </div>
            </div>

            {/* Partner Logos Strip */}
            <div style={{ padding: '3rem 8%', textAlign: 'center', opacity: 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px', alignItems: 'center', fontSize: '1.5rem', fontWeight: '800', color: '#94a3b8', fontFamily: 'sans-serif' }}>
                    <span>Google</span>
                    <span>descript</span>
                    <span>Disney</span>
                    <span>Spotify</span>
                    <span>Microsoft</span>
                </div>
            </div>

            {/* About Section */}
            <section style={{ padding: '6rem 8%', maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '60px' }}>
                {/* Left Image (Man in suit) */}
                <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        background: '#eff6ff',
                        width: '100%',
                        maxWidth: '450px',
                        height: '500px',
                        borderRadius: '32px',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                            alt="Business Man"
                            style={{ width: '90%', height: '90%', objectFit: 'cover', borderRadius: '32px 32px 0 0' }}
                        />
                    </div>
                </div>

                {/* Right Content */}
                <div style={{ flex: '1 1 400px' }}>
                    <div style={{ color: '#0d235c', fontWeight: '700', marginBottom: '1rem' }}>About Us</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                        We Provide Best Internet<br /> Service From Others
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '2rem' }}>
                        Our cutting-edge operational dashboard gives you complete control over your network distribution. Recoveries, complaints, and staff tracking all in one place.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {[
                            'Home Broadband', '300+ Channels TV',
                            'Cell phone connection', 'Speed up to 1GB',
                            '99% Internet Uptime', 'Get fast internet box',
                            'Satellite TV', 'Free Wifi router'
                        ].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontWeight: '500' }}>
                                <CheckCircle2 size={18} color="#0d235c" fill="#eff6ff" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer (Simplified) */}
            <footer style={{ background: '#0d235c', color: 'white', padding: '4rem 8%' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/logo.jpg" alt="Peak Fiber" style={{ height: '40px', borderRadius: '8px' }} />
                        <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Peak Fiber</span>
                    </div>
                    <div style={{ opacity: 0.7 }}>&copy; 2026 Peak Fiber Networks.</div>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

export default Landing;
