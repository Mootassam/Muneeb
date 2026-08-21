// hooks/useCrispChat.ts
import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

const useCrispChat = () => {
  useEffect(() => {
    if (window.$crisp) {
      return;
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "9d9b6fbe-a0bc-4324-970e-9210370e6f97";
    
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (crispScript) {
        crispScript.remove();
      }
      
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:close']);
        delete window.$crisp;
        delete window.CRISP_WEBSITE_ID;
      }
    };
  }, []);
};

export default useCrispChat;