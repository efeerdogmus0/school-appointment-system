const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-bold">İletişim Bilgileri</h2>
        <div className="text-gray-300 mt-2">
          <p>Adres: Teşvikiye, Vali Konağı Cd. No:79, 34365 Şişli/İstanbul</p>
          <p>Telefon: (0212) 225 62 22</p>
          <p>
            Web: <a href="https://nuriakin.meb.k12.tr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">nuriakin.meb.k12.tr</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
