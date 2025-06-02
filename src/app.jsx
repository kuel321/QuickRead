import { useState, useEffect } from 'preact/hooks';
import { parseFromHeader, cleanText } from './utils';
import './app.css';

export function App() {
  const [emails, setEmails] = useState([]);
 
  const [pageTitle, setPageTitle] = useState("Unread Emails");
  const [loadingDone, setLoadingDone] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [viewState, setViewState] = useState("list"); // list, transitioning, email, transitioning-back
  



  useEffect(() => {
    const fetchEmails = async () => {
      console.log("Fetching emails...");
      const response = await fetch('http://localhost:3000/check-emails');
      const data = await response.json();
      console.log(data);
      setEmails(data);
    };
    fetchEmails();
  }, []);

 
  const handleViewEmail = (index) => {
    setViewState("transitioning");
    setTimeout(() => {
      setSelectedIndex(index);
      setViewState("email");
    }, 400); // match CSS duration
  };
  
  const returnToList = () => {
    setViewState("transitioning-back");
    setTimeout(() => {
      setSelectedIndex(null);
      setViewState("list");
    }, 400);
  };
  
 
  useEffect(() => {
    if (emails.length > 0) {
      const timer = setTimeout(() => {
        setLoadingDone(true);
      }, 200); // Delay in ms
  
      return () => clearTimeout(timer); // cleanup
    }
  }, [emails]);
  // If an email is selected, show full view
  if (!loadingDone) {
    return <div className="spinner" />;
  }
  
  // ✅ Render full email view ONLY if selected

  
    return (
      <div>
        <div  className={`page-title ${
                viewState === "transitioning" ? "slide-out-left" :
                viewState === "list" ? "slide-in-left" : ""
              }`}>
          <h1>{selectedIndex !== null ? "" : "Unread Updates"}</h1>
        </div>
    
        <div className="emailer-main">
         
    
          {/* List View */}
          {selectedIndex === null && (
            <div
              className={`email-list ${
                viewState === "transitioning" ? "slide-out-left" :
                viewState === "list" ? "slide-in-left" : ""
              }`}
            >
              {emails.map((x, i) => {
                const { name, email } = parseFromHeader(x.from);
                const preview = cleanText(x.full_text || '').substring(0, 30);
                return (
                  <div className="email-card" data-id={i} key={i} style={{ animationDelay: `${i * 100}ms` }}>
                    <h1 className="email-title">
                      {name}<br /><span className="email-from">{email}</span>
                    </h1>
                    <pre className="email-text">
                      {preview + "-"} <button onClick={() => handleViewEmail(i)}>View</button>
                    </pre>
                    <hr />
                  </div>
                );
              })}
            </div>
          )}
    
          {/* Full Email View */}
          {selectedIndex !== null && (
            <div
              className={`full-email ${
                viewState === "transitioning-back" ? "slide-out-right" : "slide-in-right"
              }`}
            >
              <div className="email-card" data-id={selectedIndex}>
                <h1 className="email-title">
                  {parseFromHeader(emails[selectedIndex].from).name}<br />
                  <span className="email-from">
                    {parseFromHeader(emails[selectedIndex].from).email}
                  </span>
                </h1>
                <pre className="email-text">{cleanText(emails[selectedIndex].full_text)}</pre>
                <button onClick={returnToList}>Return</button>
                <hr />
              </div>
            </div>
          )}
        </div>
      </div>
    );
    

  
}
