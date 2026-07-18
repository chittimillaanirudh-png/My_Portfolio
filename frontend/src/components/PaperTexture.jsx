import React from 'react';

export default function PaperTexture() {
  return (
    <>
      {/* Complete paper background texture with no filters */}
      <div 
        id="paper-texture"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `url("https://res.cloudinary.com/dqsl62kr9/image/upload/v1784382906/ChatGPT_Image_Jul_18_2026_07_23_48_PM_fxxmql.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    </>
  );
}
