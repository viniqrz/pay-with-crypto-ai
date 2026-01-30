import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import {
  Coins,
  Send,
  Palette,
  Loader2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Wallet,
  Info,
  CheckCircle2,
  Lock,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { cn } from "./lib/utils";

const paymentSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valid amount required",
  }),
  currency: z.enum(["ETH", "USDC"]),
  pixKey: z.string().min(5, "Valid Pix Key required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

function PaymentUI() {
  const { applyTheme, isLoading: themeLoading, theme } = useTheme();
  const [themePrompt, setThemePrompt] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "quote" | "success">("form");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "500",
      currency: "USDC",
      pixKey: "",
    },
  });

  const selectedCurrency = watch("currency");

  const handleGetQuote = async (values: PaymentFormValues) => {
    setLoading(true);
    setQuote(null);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/quote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(values.amount),
            currency: values.currency,
          }),
        },
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to get quote");
      }

      setQuote(data);
      setStep("quote");
    } catch (err: any) {
      console.error("Failed to get quote", err);
      setError(err.message || "Failed to get quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Rigid Layout Background - separated from content */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background is handled by index.css body styles, but we can add rigid mesh/grid here if needed later */}
      </div>

      {/* Top Navigation Wrapper - Fixed Height, Full Width */}
      <div className="fixed top-0 left-0 right-0 h-20 flex items-center justify-center z-50 px-6">
        <div className="w-full max-w-7xl flex items-center justify-between glass-panel rounded-full px-6 py-3 shadow-lg backdrop-blur-xl bg-black/20 border border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              style={{ backgroundColor: theme.primary }}
            >
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-black tracking-tight text-white text-xl hidden sm:block">
              LIQUIDITY<span className="font-light opacity-50">PRO</span>
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Globe size={12} /> GLOBAL SETTLEMENT ACTIVE
            </div>
            <div className="h-6 w-px bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2">
              <div className="relative group">
                <input
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  placeholder="AI Theme Engine..."
                  className="glass-input border border-white/10 rounded-full text-xs font-medium px-4 h-9 w-32 sm:w-48 focus:border-indigo-500 outline-none text-white transition-all placeholder:text-white/20"
                />
                <div className="absolute right-1 top-1 bottom-1">
                  <button
                    onClick={() => applyTheme(themePrompt)}
                    disabled={themeLoading}
                    className="h-full px-2 text-white/40 hover:text-white transition-colors rounded-full"
                  >
                    {themeLoading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Palette size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Strictly Centered */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28 lg:pt-32">
        <motion.div
          layout
          className="w-full max-w-[520px] glass-panel overflow-hidden relative shadow-2xl ring-1 ring-white/10"
          style={{ borderRadius: `calc(${theme.radius} * 1.5)` }}
        >
          {/* Subtle Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5">
            <motion.div
              className="h-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              style={{ backgroundColor: theme.primary }}
              animate={{
                width:
                  step === "form" ? "33%" : step === "quote" ? "66%" : "100%",
              }}
            />
          </div>

          <div className="p-12 sm:p-16 pt-20 sm:pt-24">
            <AnimatePresence mode="wait">
              {step === "form" && (
                <form
                  key="form"
                  onSubmit={handleSubmit(handleGetQuote)}
                  className="space-y-12 flex flex-col items-center justify-center gap-1"
                >
                  <div className="space-y-3 my-6 text-center sm:text-left">
                    <h2 className="text-4xl font-black text-white tracking-tight">
                      Payment Settlement
                    </h2>
                    <p className="text-sm font-medium text-slate-400">
                      Convert crypto to instant BRL via treasury float.
                    </p>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-4 bg-white/5 p-10 rounded-[var(--radius)] border border-white/5 relative group transition-colors hover:bg-white/[0.07] glass-panel shadow-inner">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 absolute top-6 left-10">
                        Amount to Settle
                      </label>
                      <Input
                        placeholder="0,00"
                        {...register("amount")}
                        error={errors.amount?.message}
                        className="text-6xl font-black tracking-tighter bg-transparent border-none px-0 h-24 placeholder:text-white/10 focus:shadow-none focus:ring-0 text-right pr-2 !mt-10 shadow-none"
                      />
                      <span className="absolute bottom-10 left-10 text-sm font-bold text-white/30 pointer-events-none">
                        BRL
                      </span>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Liquidation Asset
                      </label>
                      <div className="grid grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => setValue("currency", "ETH")}
                          className={cn(
                            "glass-panel p-6 border transition-all flex flex-col items-center justify-center gap-3 h-32 relative overflow-hidden group",
                            selectedCurrency === "ETH"
                              ? "bg-indigo-500/10 border-indigo-500/50"
                              : "border-white/5 hover:border-white/10 hover:bg-white/5",
                          )}
                          style={{
                            borderRadius: theme.radius,
                            borderColor:
                              selectedCurrency === "ETH"
                                ? theme.primary
                                : undefined,
                          }}
                        >
                          <div
                            className={cn(
                              "w-12 h-8 rounded-xl flex items-center justify-center transition-all",
                              selectedCurrency === "ETH"
                                ? "text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110"
                                : "bg-white/5 text-slate-400 group-hover:bg-white/10",
                            )}
                            style={{
                              backgroundColor:
                                selectedCurrency === "ETH"
                                  ? theme.primary
                                  : undefined,
                            }}
                          >
                            <Coins size={24} />
                          </div>
                          <div className="text-center z-10">
                            <p className="text-sm font-black text-white">
                              Ethereum
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              ETH
                            </p>
                          </div>
                          {selectedCurrency === "ETH" && (
                            <motion.div
                              layoutId="active-ring"
                              className="absolute inset-0 border-2 border-indigo-500 rounded-[inherit] opacity-50"
                              style={{ borderColor: theme.primary }}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setValue("currency", "USDC")}
                          className={cn(
                            "glass-panel p-6 border transition-all flex flex-col items-center justify-center gap-3 h-32 relative overflow-hidden group",
                            selectedCurrency === "USDC"
                              ? "bg-indigo-500/10 border-indigo-500/50"
                              : "border-white/5 hover:border-white/10 hover:bg-white/5",
                          )}
                          style={{
                            borderRadius: theme.radius,
                            borderColor:
                              selectedCurrency === "USDC"
                                ? theme.primary
                                : undefined,
                          }}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                              selectedCurrency === "USDC"
                                ? "text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110"
                                : "bg-white/5 text-slate-400 group-hover:bg-white/10",
                            )}
                            style={{
                              backgroundColor:
                                selectedCurrency === "USDC"
                                  ? theme.primary
                                  : undefined,
                            }}
                          >
                            <Send size={24} />
                          </div>
                          <div className="text-center z-10">
                            <p className="text-sm font-black text-white">
                              USD Coin
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              USDC
                            </p>
                          </div>
                          {selectedCurrency === "USDC" && (
                            <motion.div
                              layoutId="active-ring"
                              className="absolute inset-0 border-2 border-indigo-500 rounded-[inherit] opacity-50"
                              style={{ borderColor: theme.primary }}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    <Input
                      label="Recipient Pix Key"
                      placeholder="E-mail, CPF, or Random Key"
                      {...register("pixKey")}
                      error={errors.pixKey?.message}
                      className="text-center focus:text-center placeholder:text-center"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold text-center w-full uppercase tracking-widest"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    className="w-full text-lg h-16 mt-8 shadow-xl"
                    size="lg"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Review Liquidity Quote"
                    )}
                  </Button>
                </form>
              )}

              {step === "quote" && quote && (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="space-y-8"
                >
                  <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      Review Quote
                    </h2>
                    <p className="text-sm font-medium text-slate-400">
                      Live market rates with AI risk adjustment.
                    </p>
                  </div>

                  <div
                    className="bg-black/40 border border-white/10 p-8 space-y-8 relative overflow-hidden ring-1 ring-white/5"
                    style={{ borderRadius: theme.radius }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />

                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                          You Send
                        </p>
                        <h3 className="text-4xl font-black tracking-tighter text-white">
                          {quote.finalCryptoAmount.toFixed(6)}{" "}
                          <span className="text-white/40 font-light text-2xl ml-1">
                            {quote.cryptoCurrency}
                          </span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center justify-end gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                          <Lock size={10} /> Rate Locked
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
                      <div className="flex justify-between text-xs font-bold items-center">
                        <span className="text-slate-500 uppercase tracking-widest">
                          Base Payout
                        </span>
                        <span className="text-white text-lg">
                          R$ {quote.amountBrl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold items-center">
                        <span className="text-slate-500 uppercase tracking-widest">
                          AI Risk Premium
                        </span>
                        <span className="text-emerald-400">
                          +{(quote.spread * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div
                      className="p-4 border border-white/10 bg-white/5 flex items-center gap-4 group hover:bg-white/[0.07] transition-colors"
                      style={{ borderRadius: theme.radius }}
                    >
                      <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                        <Wallet size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Treasury Destination
                        </p>
                        <p className="text-xs font-mono text-white truncate opacity-90">
                          {quote.depositAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={() => setStep("form")}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-[2] h-12"
                        onClick={handleConfirm}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Initiate Settlement"
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-10"
                >
                  <div className="inline-flex relative mt-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-28 h-28 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.5)] z-10"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <CheckCircle2 size={56} />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 blur-3xl opacity-50 -z-10"
                      style={{ backgroundColor: theme.primary }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white tracking-tight">
                      Confirmed
                    </h2>
                    <p className="text-slate-400 font-medium text-lg">
                      BRL Settlement dispatched to the Pix network.
                    </p>
                  </div>

                  <div
                    className="bg-white/5 p-8 border border-white/10"
                    style={{ borderRadius: theme.radius }}
                  >
                    <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      <span>Settlement Mode</span>
                      <span className="text-white flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                        <Zap size={12} className="text-amber-400" /> Float
                        Instant
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("form")}
                  >
                    Close & Start New
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Corporate Footprint - Fixed at bottom of flow, but inside scrollable area if needed */}
        <div className="mt-16 flex flex-col items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-8 text-white/50">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Institutional Liquidity
            </span>
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Tier 1 Settlement
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PaymentUI />
    </ThemeProvider>
  );
}

export default App;
