import { LoginForm } from "@/components/Custom/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[#F3F5F9] -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="w-full flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
               Don and Dons
            </h1>
            <p className="text-gray-500 font-medium">Secure Banking Solution</p>
        </div>
        
        <LoginForm />

        <footer className="text-gray-400 text-xs mt-4">
          &copy; {new Date().getFullYear()} Capricorn Software Solutions. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
