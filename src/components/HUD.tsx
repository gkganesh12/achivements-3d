import React from 'react';
import { useStore } from '../store/useStore';
import './HUD.css';

export const HUD: React.FC = () => {
  const { activeExhibit, isAmplified, isMenuOpen, toggleMenu, clearKeys, appState, keysPressed } = useStore();
  
  // Check if any movement key is pressed
  const isMoving = keysPressed.has('ArrowUp') || keysPressed.has('ArrowDown') || 
                   keysPressed.has('ArrowLeft') || keysPressed.has('ArrowRight') ||
                   keysPressed.has('KeyW') || keysPressed.has('KeyS') || 
                   keysPressed.has('KeyA') || keysPressed.has('KeyD');

  if (appState === 'LOADING') return null;
  if (isMenuOpen) return null;

  return (
    <div className="hud-container">
      {/* Exhibit info when amplified */}
      {isAmplified && activeExhibit && (
        <div className="amplified-info">
          {activeExhibit.logo && (
            <div className="exhibit-logo">
              <img src={activeExhibit.logo} alt={`${activeExhibit.title} logo`} />
            </div>
          )}
          <h2>{activeExhibit.title}</h2>
          <p className="subtitle">{activeExhibit.subtitle}</p>
          <p className="year">{activeExhibit.year}</p>
          <p className="description">{activeExhibit.description}</p>
          
          {/* Documents and Links */}
          {activeExhibit.documents && activeExhibit.documents.length > 0 && (
            <div className="exhibit-documents">
              <h3>Documents & Links</h3>
              {activeExhibit.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`document-link ${doc.type}`}
                  onClick={(e) => {
                    if (!doc.url || doc.url === '#') {
                      e.preventDefault();
                      // Handle upload functionality here
                      alert(`Upload ${doc.name}`);
                    } else {
                      // For images and PDFs, open in new window for better viewing
                      if (doc.url.match(/\.(png|jpg|jpeg|gif|pdf)$/i)) {
                        e.preventDefault();
                        const newWindow = window.open('', '_blank');
                        if (newWindow) {
                          newWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>${doc.name}</title>
                                <style>
                                  body {
                                    margin: 0;
                                    padding: 20px;
                                    background: #ffffff;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                  }
                                  img, iframe {
                                    max-width: 100%;
                                    max-height: 100vh;
                                    object-fit: contain;
                                  }
                                </style>
                              </head>
                              <body>
                                ${doc.url.match(/\.pdf$/i) 
                                  ? `<iframe src="${doc.url}" width="100%" height="100vh" style="border: none;"></iframe>`
                                  : `<img src="${doc.url}" alt="${doc.name}" />`
                                }
                              </body>
                            </html>
                          `);
                          newWindow.document.close();
                        }
                      }
                      // For other links, let default behavior handle it
                    }
                  }}
                >
                  {doc.type === 'offer-letter' && '📄'}
                  {doc.type === 'certification' && '🏆'}
                  {doc.type === 'repository' && '📦'}
                  {doc.type === 'other' && '📎'}
                  <span>{doc.name}</span>
                  {(!doc.url || doc.url === '#') && <span className="upload-badge">Upload</span>}
                </a>
              ))}
            </div>
          )}
          
          {activeExhibit.externalLinks && activeExhibit.externalLinks.length > 0 && (
            <div className="exhibit-links">
              {activeExhibit.externalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  🔗 {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Control hints - bottom center */}
      <div className="controls-bar">
        <div className="control-group">
          <span className="control-label">Move</span>
          <div className="arrow-keys">
            <div className="arrow-row">
              <span className={`key-box ${(keysPressed.has('ArrowUp') || keysPressed.has('KeyW')) ? 'active' : ''}`}>↑</span>
            </div>
            <div className="arrow-row">
              <span className={`key-box ${(keysPressed.has('ArrowLeft') || keysPressed.has('KeyA')) ? 'active' : ''}`}>←</span>
              <span className={`key-box ${(keysPressed.has('ArrowDown') || keysPressed.has('KeyS')) ? 'active' : ''}`}>↓</span>
              <span className={`key-box ${(keysPressed.has('ArrowRight') || keysPressed.has('KeyD')) ? 'active' : ''}`}>→</span>
            </div>
          </div>
          {/* Movement indicator arrow */}
          {isMoving && (
            <div className="movement-indicator">
              <span className="movement-arrow">→</span>
            </div>
          )}
        </div>
        
        <div className="control-group">
          <span className="control-label">Menu</span>
          <span className="key-box">ESC</span>
        </div>
      </div>
      
      {/* MENU button - top right */}
      <button
        className="menu-button"
        onClick={() => {
          clearKeys();
          toggleMenu();
        }}
      >
        MENU
      </button>
    </div>
  );
};

