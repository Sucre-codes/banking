import { useNavigate } from "react-router-dom";

const HelpPage = () => {
  const navigate = useNavigate(); // ✅ Hook inside component

  return (
    <section className="card">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-semibold text-bonavy-700">Help & Support</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        <li>Use Settings to set your 4-digit security PIN.</li>
        <li>External transfers notify the beneficiary via email.</li>
        <li>Withdrawals notify your registered email address.</li>
      </ul>
    </section>
  );
};

export default HelpPage;
