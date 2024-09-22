export default function Hero() {
  return (
    <div
      className="hero min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md bg-white bg-opacity-70 p-6 rounded-lg shadow-lg">
          <h1 className="mb-5 text-5xl font-bold text-gray-900">Hello there</h1>
          <p className="mb-5 text-gray-800">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button className="btn btn-primary bg-gray-700">Get Started</button>
        </div>
      </div>
    </div>
  );
}
