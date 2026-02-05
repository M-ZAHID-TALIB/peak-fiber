import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, CheckCircle2, ArrowRight, Zap, Shield, Globe, Star } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', color: '#1e293b', overflowX: 'hidden' }}>

            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 8%',
                maxWidth: '1440px',
                margin: '0 auto',
                background: 'white',
                borderBottom: '1px solid #e2e8f0'
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
6rem 8% 4rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '80px', background: '#f8fafc
            {/* Hero Section */}
            <div style={{ padding: '4rem 8% 2rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Left Text */}
                <div style={{ flex: '1 1 500px' }}>
                    <div style={{ color: '#0ea5e9', fontWeight: '700', marginBottom: '1rem', letterSpacing: '0.05em', fontSize: '0.9rem', textTransform: 'uppercase' }}>⚡ Welcome to Peak Fiber</div>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '900',
                        lineHeight: '1.15',
                        marginBottom: '2rem',
                        color: '#0f172a'
                    }}>
                        Ultra-Fast Internet<br /> <span style={{ color: '#0ea5e9' }}>at Your Speed</span>
                    </h1>
                    <p style={{ color: '#64748b', lineHeight: '1.8', marginBottom: '3rem', maxWidth: '520px', fontSize: '1.05rem' }}>
                        Peak Fiber delivers blazing-fast, ultra-reliable enterprise connectivity with 99.9% uptime. Take control of your entire network with our intelligent operations dashboard.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <button style={{
                            padding: '16px 40px',
                            background: '#0ea5e9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#0284c7'; e.target.style.boxShadow = '0 12px 30px rgba(14, 165, 233, 0.4)'; }}
                        onMouseLeave={(e) => { e.target.style.background = '#0ea5e9'; e.target.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)'; }}
                        onClick={() => navigate('/login')}>
                            Get Started <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} />
                        </button>
                        <button style={{
                            padding: '16px 40px',
                            background: 'white',
                            color: '#0ea5e9',
                            border: '2px solid #0ea5e9',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#eff6ff'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'white'; }}> }}>
                    {/* Floating Wifi Icon - Top Left */}
                    <div style={{
                        position: 'absolute',
                        top: '5%',
                        left: '0%',
                        background: '#fff7ed',
                        padding: '16px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        <Zap size={32} color="#f97316" />
                    </div>

                    {/* Speed Stats Card - Bottom Right */}
                    <div style={{
                        position: 'absolute',
                        bottom: '15%',
                        right: '5%',
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.12)',
                        border: '1px solid #f1f5f9',
                        width: '200px',
                        zIndex: 2
                    }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0ea5e9', marginBottom: '12px', textTransform: 'uppercase' }}>Performance</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
                            <span>20 Mbps</span> <span style={{ color: '#10b981' }}>★ 4.2</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
                            <span>100 Mbps</span> <span style={{ color: '#10b981' }}>★ 4.6</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600', color: '#0ea5e9' }}>
                            <span>1 Gbps</span> <span style={{ color: '#10b981' }}>★ 4.9</span>
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
                            borderRadius: '24px',
                            background: '#f1f5f9',
                            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)
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
            <div style={{ padding: '4rem 8%', textAlign: 'center', background: 'white', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '2rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Trusted by leading companies</div>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '50px', alignItems: 'center', fontSize: '1.3rem', fontWeight: '700', color: '#94a3b8' }}>
                    <span>Google</span>
                    <span>Microsoft</span>
                    <span>Amazon</span>
                    <span>Spotify</span>
                    <span>Meta</span>
                </div>
            </div>

            {/* About Section */}
            <section style={{ padding: '6rem 8%', maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '80px', background: 'white' }}>
                {/* Left Image (Man in suit) */}
                <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        background: '#eff6ff',
                        width: '100%',
                        maxWidth: '450px',
                        height: '500px',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                            alt="Business Man"
                            style={{ width: '90%', height: '90%', objectFit: 'cover', borderRadius: '16px' }}
                        />
                    </div>
                </div>

                {/* Right Content */}
                <div style={{ flex: '1 1 400px' }}>
                    <div style={{ color: '#0ea5e9', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>About Peak Fiber</div>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#0f172a', marginBottom: '2rem', lineHeight: '1.2' }}>
                        We're Building the<br /><span style={{ color: '#0ea5e9' }}>Future of Connectivity</span>
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.05rem' }}>
                        Our mission is to empower ISPs with intelligent tools that simplify network management, reduce operational costs, and deliver exceptional customer experiences. With Peak Fiber, managing thousands of customers becomes effortless.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {[
                            'Smart Dashboard', 'Real-time Analytics',
                            'Customer Portal', 'Billing Automation',
                            '24/7 Monitoring', 'API Access',
                            'Multi-user Support', 'Instant Reports'
                        ].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontWeight: '600' }}>
                                <CheckCircle2 size={20} color="#10b981" fill="#d1fae5" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer (Simplified) */}
            <footer style={{ background: '#1e293b', color: 'white', padding: '6rem 8% 3rem', marginTop: '6rem' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '3rem', borderBottom: '1px solid #334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/logo.jpg" alt="Peak Fiber" style={{ height: '40px', borderRadius: '8px' }} />
                            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Peak Fiber</span>
                        </div>
                        <div style={{ display: 'flex', gap: '30px', fontSize: '0.95rem' }}>
                            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0ea5e9'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>About</a>
                            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0ea5e9'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Pricing</a>
                            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0ea5e9'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Contact</a>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                        <div style={{ opacity: 0.6 }}>&copy; 2026 Peak Fiber Networks. All rights reserved.</div>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', opacity: 0.6 }}>
                            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privacy Policy</a>
                            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Features Section */}
            <section style={{ padding: '6rem 8%', maxWidth: '1440px', margin: '0 auto', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ color: '#0ea5e9', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>✨ Why Choose Us</div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '1.5rem' }}>Powerful Features Built for You</h2>
                    <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Everything you need to manage your network operations efficiently and reliably.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    {[
                        { icon: Zap, title: 'Lightning Fast', desc: 'Speeds up to 1 Gbps with optimized routing and advanced infrastructure.' },
                        { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption and 99.9% uptime SLA for peace of mind.' },
                        { icon: Globe, title: 'Wide Coverage', desc: 'Nationwide infrastructure with reliable connectivity everywhere you need.' },
                        { icon: Wifi, title: 'Smart Management', desc: 'Intuitive dashboard to monitor and control your entire network.' },
                        { icon: CheckCircle2, title: '24/7 Support', desc: 'Dedicated support team ready to help you any time, any day.' },
                        { icon: ArrowRight, title: 'Seamless Scaling', desc: 'Grow your network without limitations. Scale as you expand.' }
                    ].map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.15)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ background: '#eff6ff', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Icon size={32} color="#0ea5e9" />
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.8rem' }}>{feature.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Pricing Section */}
            <section style={{ padding: '6rem 8%', maxWidth: '1440px', margin: '0 auto', background: 'white' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ color: '#0ea5e9', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>💰 Simple Pricing</div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '1.5rem' }}>Plans for Every Business Size</h2>
                    <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Flexible pricing with no hidden fees. Choose the plan that fits your needs.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
                    {[
                        { name: 'Starter', speed: '20 Mbps', price: '$29', features: ['Home broadband', 'Basic support', '99% uptime', 'WiFi router included'] },
                        { name: 'Professional', speed: '100 Mbps', price: '$79', features: ['Fast fiber', '24/7 support', '99.9% uptime', 'Advanced router', 'Priority service'], highlighted: true },
                        { name: 'Enterprise', speed: '1 Gbps', price: '$199', features: ['Blazing fast', 'Dedicated support', '99.99% uptime', 'Enterprise-grade', 'Custom solutions'] }
                    ].map((plan, idx) => (
                        <div key={idx} style={{
                            background: plan.highlighted ? '#0ea5e9' : 'white',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            border: plan.highlighted ? 'none' : '1px solid #e2e8f0',
                            boxShadow: plan.highlighted ? '0 20px 50px rgba(14, 165, 233, 0.3)' : '0 4px 15px rgba(0,0,0,0.06)',
                            transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                            position: plan.highlighted ? 'relative' : 'static'
                        }}>
                            {plan.highlighted && <div style={{ position: 'absolute', top: '-15px', left: '20px', background: '#f97316', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>POPULAR</div>}
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: plan.highlighted ? 'white' : '#0f172a', marginBottom: '0.5rem' }}>{plan.name}</h3>
                            <div style={{ color: plan.highlighted ? 'rgba(255,255,255,0.8)' : '#64748b', marginBottom: '1.5rem' }}>{plan.speed} Speed</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: plan.highlighted ? 'white' : '#0f172a', marginBottom: '2rem' }}>{plan.price}<span style={{ fontSize: '1rem', fontWeight: '600' }}>/month</span></div>
                            <button style={{
                                width: '100%',
                                padding: '14px',
                                background: plan.highlighted ? 'white' : '#0ea5e9',
                                color: plan.highlighted ? '#0ea5e9' : 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                marginBottom: '2rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                                Get Started
                            </button>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {plan.features.map((feature, fidx) => (
                                    <li key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: plan.highlighted ? 'rgba(255,255,255,0.9)' : '#64748b', fontWeight: '500' }}>
                                        <CheckCircle2 size={18} color={plan.highlighted ? 'rgba(255,255,255,0.9)' : '#10b981'} fill={plan.highlighted ? 'rgba(255,255,255,0.2)' : '#d1fae5'} /> {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section style={{ padding: '6rem 8%', maxWidth: '1440px', margin: '0 auto', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ color: '#0ea5e9', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>🌟 Happy Customers</div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '1.5rem' }}>What Our Clients Say</h2>
                    <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Real stories from businesses using Peak Fiber to power their operations.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                    {[
                        { name: 'Rajesh Kumar', role: 'ISP Owner', text: 'Peak Fiber\'s dashboard has transformed how I manage my network. Simple, powerful, and reliable.', rating: 5 },
                        { name: 'Priya Singh', role: 'Network Admin', text: 'The 24/7 support team is phenomenal. They solved our connectivity issue in minutes.', rating: 5 },
                        { name: 'Ahmed Hassan', role: 'Business Owner', text: 'Switched to Peak Fiber and saved 40% on operations costs. Highly recommended!', rating: 5 }
                    ].map((testimonial, idx) => (
                        <div key={idx} style={{
                            background: 'white',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={18} color="#f97316" fill="#f97316" />)}
                                </div>
                                <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem' }}>"{testimonial.text}"</p>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.3rem' }}>{testimonial.name}</h4>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

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
