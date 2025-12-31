export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative font-montserrat montserrat max-w-[1600px] mx-auto authImage  justify-center flex h-screen z-1 sm:p-0">
      <div className="w-full flex-1 h-full relative hidden lg:flex items-center justify-center"></div>
      <div className="relative  flex-1 items-center overflow-y-scroll no-scrollbar bg-white w-full h-screen justify-center flex-col sm:p-0">
        {children}
      </div>
    </div>
  );
}
