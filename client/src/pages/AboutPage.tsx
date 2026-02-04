const AboutPage = () => (
  <section className="card">
    <h2>About NovaBank</h2>
    <p>
      NovaBank is a simulated banking environment for demos and training. No real money moves through this system,
      and all balances are stored in cents for safety.
    </p>
    <p>
      The platform separates domain logic from transport, validates inputs centrally, and enforces balance checks on
      the backend.
    </p>
  </section>
);

export default AboutPage;
