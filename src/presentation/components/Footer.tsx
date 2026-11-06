const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f0f0f] border-t border-[#2A2E33]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6B7280] text-[11px] tracking-[0.06em] uppercase">
            © {currentYear} WorldCounter — Todos los derechos reservados a Alex Zimmer Bonjour
          </p>
          <p className="text-[#6B7280] text-[11px] tracking-wide">
            100% local · Privado · Sin servidor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
