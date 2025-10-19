// Home.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import "../Styles/Home.css";

import tomAndJerryGif from "../../assets/tom-and-jerry.gif";
import bgImage from "../../assets/bg.png";
import logoImg from "../../assets/logo.png";

import Project from "./Project";
import Music from "./Music";
import About from "./About";
import Contact from "./Contact";

const TypingCLI = ({
  lines = [],
  typingSpeed = 60,
  deletingSpeed = 40,
  pauseBeforeDelete = 900,
  pauseBetweenLines = 600,
}) => {
  const [display, setDisplay] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const containerRef = useRef(null);
  const penRef = useRef(null);

  // Blink cursor
  useEffect(() => {
    const b = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(b);
  }, []);

  // Typing / deleting logic
  useEffect(() => {
    if (!lines || lines.length === 0) return;
    const currentLine = lines[lineIndex % lines.length];
    let timeout;

    if (!isDeleting && charIndex <= currentLine.length) {
      timeout = setTimeout(() => {
        setDisplay(currentLine.slice(0, charIndex));
        setCharIndex((ci) => ci + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex > currentLine.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
    } else if (isDeleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplay(currentLine.slice(0, charIndex));
        setCharIndex((ci) => ci - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex < 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCharIndex(0);
        setLineIndex((li) => li + 1);
      }, pauseBetweenLines);
    }

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    isDeleting,
    lineIndex,
    lines,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBetweenLines,
  ]);

  // Move pen along with typed text
  useEffect(() => {
    const container = containerRef.current;
    const pen = penRef.current;
    if (!container || !pen) return;

    const typedSpan = container.querySelector(".typedText");
    if (!typedSpan) return;

    const containerRect = container.getBoundingClientRect();
    const spanRect = typedSpan.getBoundingClientRect();
    const left = Math.max(8, spanRect.right - containerRect.left + 6);

    pen.style.transform = `translateX(${left}px)`;
  }, [display]);

  return (
    <div className="typing-cli" ref={containerRef}>
      <div className="cli-line">
        <span className="cli-prompt">nafman@localhost:~$</span>
        <span className="typedText">{display}</span>
        <span className={`cli-cursor ${blink ? "blink" : ""}`}>_</span>
        <span className="cli-pen" ref={penRef}>
          ✍️
        </span>
      </div>
    </div>
  );
};

const Home = ({ activeStack = [], onTabClick }) => {
  const inactivityTimeout = useRef(null);
  const panelContainerRef = useRef(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    if (activeStack.length > 0 && typeof onTabClick === "function") {
      inactivityTimeout.current = setTimeout(() => {
        // close the current open tab
        onTabClick(activeStack[0]);
      }, 30000); // 30 seconds
    }
  }, [activeStack, onTabClick]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    };
  }, [activeStack, resetInactivityTimer]);

  // Listen for user interactions inside the panel container to reset timer
  useEffect(() => {
    const container = panelContainerRef.current;
    if (!container) return;

    const events = ["mousemove", "mousedown", "scroll", "keydown", "touchstart"];
    const handler = () => {
      resetInactivityTimer();
    };
    events.forEach((ev) => container.addEventListener(ev, handler));
    return () => {
      events.forEach((ev) => container.removeEventListener(ev, handler));
    };
  }, [resetInactivityTimer]);

  const renderPanel = (tab) => {
    switch (tab) {
      case "project":
        return <Project />;
      case "music":
        return <Music />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return null;
    }
  };

  const cliLines = [
    "call me nafman.",
    "first and foremost,",
    "i don't work under anyone —",
    "fully freelance.",
    "i go where the pay goes;",
    "probably coding a new program,",
    "software, web or mobile app",
    "with my gee ai.",
    "or creeping behind",
    "unknown ports and ips",
    "on a server far beyond my reach.",
    "maybe i got bored",
    "and went to the studio",
    "to record a song —",
    "lol, funny but amazing.",
    "welcome to my world.",
    "cyberpunk 101.",
    "scanning ports...",
    "0/65535",
    "exploit-db:",
    "fetching payloads",
    "brute forcing ssh...",
    "(trying 1024 combos)",
    "payload compiled:",
    "nafman-shell v0.9",
    "establishing reverse tcp",
    "-> 192.168.1.12:4444",
    "hashcat: cracking sha256...",
    "24% complete (ETA: 00:12:34)",
    "audit complete:",
    "3 warnings, 0 critical",
  ];

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="content-box">
        <div className="logo-container">
          <img src={logoImg} alt="Logo" className="logo-img" />
        </div>

        <div className="remix-button" onClick={() => alert("Remix Info")}>
          {"{ Remix }"}
        </div>

        <TypingCLI
          lines={cliLines}
          typingSpeed={40}
          deletingSpeed={26}
          pauseBeforeDelete={1000}
          pauseBetweenLines={700}
        />

        <div className="main-title">
          {"Code With Nafman".split("").map((char, i) => (
            <span key={i} className="letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
          <img
            src={tomAndJerryGif}
            alt="Tom and Jerry chasing"
            className="tom-jerry-gif"
          />
        </div>

        <p className="credit">Code – With – Nafman</p>
      </div>

      {/* Only one overlay panel (if any) */}
      {activeStack.length > 0 && (
        <div
          ref={panelContainerRef}
          key={`overlay-${activeStack[0]}`}
          className="overlay-wrapper"
          style={{
            top: `120px`,
            zIndex: 10,
          }}
        >
          <div className="panel-header">
            <button
              className="close-btn"
              onClick={() => {
                if (typeof onTabClick === "function") {
                  onTabClick(activeStack[0]);
                }
              }}
            >
              ✖ Close
            </button>
          </div>
          {renderPanel(activeStack[0])}
        </div>
      )}
    </div>
  );
};

export default Home;
