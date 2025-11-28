import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'

const Model = ({ product3DConfig }) => {

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

  // Extract data from API config (with fallbacks for backward compatibility)
  const modelFileUrl = product3DConfig?.model_config?.model_file_url || null;
  const availableMaterials = product3DConfig?.materials || [];
  const customizeOptions = product3DConfig?.customize_options || null;

  // Log received data for debugging
  if (product3DConfig) {
    console.log('📦 Main.jsx received product3DConfig:', {
      productId: product3DConfig.product?.id,
      productName: product3DConfig.product?.name,
      modelUrl: modelFileUrl,
      materialsCount: availableMaterials.length,
      hasOptions: !!customizeOptions,
    });
  } else {
    console.log('⚠️ Main.jsx - No product3DConfig provided, using defaults');
  }

  return (
    <>
      <App
        onSubmit={handleSubmit}
        modelFileUrl={modelFileUrl}
        availableMaterials={availableMaterials}
        customizeOptions={customizeOptions}
      />
    </>
  )

}

export default Model;