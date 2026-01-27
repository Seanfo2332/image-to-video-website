"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface CreditConfig {
  id?: string;
  workflowType: string;
  cost: number;
  label: string;
}

export default function CreditConfigPage() {
  const [configs, setConfigs] = useState<CreditConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    const res = await fetch("/api/admin/credits/config");
    if (res.ok) {
      const data = await res.json();
      setConfigs(data.configs);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/credits/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configs }),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "Credit costs updated successfully" });
      fetchConfigs();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to update" });
    }
    setIsSaving(false);
  };

  const updateConfig = (index: number, field: keyof CreditConfig, value: string | number) => {
    setConfigs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Credit Configuration</h1>
        <p className="text-neutral-400 mt-1">Set the credit cost for each workflow type</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success"
            ? "bg-green-500/10 border border-green-500/20 text-green-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Workflow Costs</h3>
        </div>

        {configs.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">
            No credit configs found. Run the seed script to create defaults.
          </p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {configs.map((config, i) => (
              <div
                key={config.workflowType}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-white/5"
              >
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Workflow Type
                  </label>
                  <p className="text-white font-mono">{config.workflowType}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={config.label}
                    onChange={(e) => updateConfig(i, "label", e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Cost (credits)
                  </label>
                  <input
                    type="number"
                    value={config.cost}
                    onChange={(e) => updateConfig(i, "cost", parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
