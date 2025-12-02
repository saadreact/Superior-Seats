import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'

const Model = ({ product3DConfig, onCustomizationChange, onSubmit }) => {

  // Example callback function to handle submission
  const handleSubmit = async ({ images, config }) => {
    // TODO: Send to your backend API
    // const response = await fetch('https://api.example.com/designs', {
    //   method: 'POST',
    //   body: JSON.stringify({ images, config }),
    //   headers: { 'Content-Type': 'application/json' }
    // });

    alert('Design submitted!');
  };

  // Extract data from API config (with fallbacks for backward compatibility)
  const modelFileUrl = product3DConfig?.model_config?.model_file_url || null;
  const availableMaterials = product3DConfig?.materials || [];
  const customizeOptions = product3DConfig?.customize_options || null;


  return (
    <>
      <App
        onSubmit={onSubmit || handleSubmit}
        modelFileUrl={modelFileUrl}
        availableMaterials={availableMaterials}
        customizeOptions={customizeOptions}
        onCustomizationChange={onCustomizationChange}
      />
    </>
  )

}

export default Model;