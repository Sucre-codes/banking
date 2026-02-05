import { NavLink } from 'react-router-dom';
import HERO from '../assets/hero.jpg'

const features = [
  {
    title: 'Instant transfers',
    description: 'Send and receive funds in real-time with zero delay.'
  },
  {
    title: 'Bank-grade security',
    description: 'Military-grade encryption protecting every transaction.'
  },
  {
    title: 'Personalized insights',
    description: 'AI-powered analytics tailored to your spending habits.'
  }
];
const LandingPage = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col justify-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-boared-500">Bank Of America</p>
          <h2 className="text-4xl font-semibold leading-tight text-bonavy-700 md:text-5xl">
            A premium digital banking experience designed for speed, clarity, and confidence.
          </h2>
          <p className="text-base text-slate-600">
            Execute seamless transfers, gain complete transaction visibility, and manage your financial instruments through our secure, intelligent banking platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <NavLink to="/register" className="btn-primary">Create your account</NavLink>
            <NavLink to="/login" className="btn-secondary">Sign in</NavLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((item) => (
              <div key={item.title} className="card">
                <p className="text-sm font-semibold text-bonavy-700">{item.title}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
       <div className="relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-boared-500/60 via-bonavy-700/80 to-bonavy-700/80" />
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">Featured</p>
        <h3 className="text-2xl font-semibold">Elite Checking</h3>
      <p className="text-sm text-white/80">Designed for global transfers and premium card access.</p>
     </div>
        <div className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-sm font-semibold">Exclusive Benefits</p>
      <p className="text-xs text-white/70">
        Premium global transfers, priority support, and elite card access with no hidden fees.
      </p>
     </div>
        </div>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-semibold text-bonavy-700">Smart savings</h3>
          <p className="text-sm text-slate-500">Track balance changes in real time, stored in cents for accuracy.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-bonavy-700">Virtual cards</h3>
          <p className="text-sm text-slate-500">Create one simulated card for safe online purchases.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-bonavy-700">Always responsive</h3>
          <p className="text-sm text-slate-500">Mobile-first layouts built for a seamless signup journey.</p>
        </div>
      </div>
      </div>
    </section>
  );
};

export default LandingPage;