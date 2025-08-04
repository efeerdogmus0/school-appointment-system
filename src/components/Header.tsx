import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full bg-white py-4 shadow-md">
      <div className="container mx-auto flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Nişantaşı Nuri Akın Anadolu Lisesi Logosu"
          width={100}
          height={100}
          priority
        />
        <h1 className="text-2xl font-bold text-red-800 mt-4">
          Nişantaşı Nuri Akın Anadolu Lisesi Tanıtım Randevuları
        </h1>
        <div className="text-gray-600 mt-2">
          <p>Adres: Teşvikiye, Vali Konağı Cd. No:79, 34365 Şişli/İstanbul</p>
          <p>Telefon: (0212) 225 62 22</p>
          <p>
            Web: <a href="https://nuriakin.meb.k12.tr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nuriakin.meb.k12.tr</a>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
