import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Example callback function to handle submission
const handleSubmit = async ({ images, config }) => {
  console.log('📸 Received images:', images.length);
  console.log('⚙️ Configuration:', config);
  
  // Example: Log all customized parts
  if (config.parts.length > 0) {
    console.log('\n🎨 Customized Parts:');
    config.parts.forEach(part => {
      console.log(`  - ${part.partName}: ${part.fabricColor} (state: ${part.clickState})`);
    });
  }
  
  // TODO: Send to your backend API
  // const response = await fetch('https://api.example.com/designs', {
  //   method: 'POST',
  //   body: JSON.stringify({ images, config }),
  //   headers: { 'Content-Type': 'application/json' }
  // });
  
  alert('Design submitted! Check console for details.');
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App onSubmit={handleSubmit} />
  </StrictMode>,
)
