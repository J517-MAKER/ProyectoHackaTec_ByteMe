import { useState } from "react";
import { User, Lock, Eye, EyeOff, Vote } from "lucide-react";

export function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<"CAEL" | "SEL" | "Supervisión">("CAEL");
  const [showPassword, setShowPassword] = useState(false);
  const [folio, setFolio] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoAutofill = () => {
    setFolio("DEMO123456");
    setPassword("demo2024");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { role: selectedRole, folio, password });
  };

  return (
    <div className="w-full h-full flex">
      {/* Left Panel - Imagery & Branding (40%) */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-[#d91a7a] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1604451372323-158c45058d10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Electoral workers"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#d91a7a]/80 via-[#c01464]/70 to-[#d91a7a]/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Top Logo */}
          <div>
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Vote className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Bottom Quote & Copyright */}
          <div className="space-y-6">
            <blockquote className="space-y-2">
              <p className="text-2xl leading-relaxed italic">
                "La democracia se fortalece con la transparencia y la participación ciudadana."
              </p>
              <footer className="text-sm text-white/80">
                Democracia y Transparencia
              </footer>
            </blockquote>

            <div className="text-xs text-white/60">
              © VigíaINE 2026 • Instituto Nacional Electoral
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form (60%) */}
      <div className="w-full lg:w-[60%] bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#c01464] flex items-center justify-center shadow-md">
                <Vote className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl text-[#1a1a1a]">
                  Instituto Nacional Electoral
                </h1>
                <p className="text-xs text-muted-foreground">VigíaINE</p>
              </div>
            </div>
          </div>

          {/* Role Selector - Segmented Control */}
          <div className="mb-8">
            <label className="block text-sm mb-3 text-[#1a1a1a]">
              Selecciona tu rol
            </label>
            <div className="bg-[#f5f5f5] rounded-xl p-1 flex gap-1">
              {(["CAEL", "SEL", "Supervisión"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`
                    flex-1 py-3 px-4 rounded-lg transition-all duration-200
                    ${
                      selectedRole === role
                        ? "bg-primary text-white shadow-md"
                        : "text-[#666] hover:text-[#333]"
                    }
                  `}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Folio Input */}
            <div>
              <label htmlFor="folio" className="block text-sm mb-2 text-[#1a1a1a]">
                Folio o Clave de Elector
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="folio"
                  type="text"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  placeholder="Ingresa tu folio"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-[#1a1a1a]">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-lg hover:bg-[#c01464] active:scale-[0.98] transition-all shadow-md mt-8"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Demo Helper */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleDemoAutofill}
              className="text-sm text-[#999] hover:text-[#666] transition-colors underline decoration-dotted underline-offset-2"
            >
              Autocompletar datos de prueba
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
