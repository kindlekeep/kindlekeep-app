import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, Text, Box, Grid, Button, Code } from '@radix-ui/themes';
import { ShieldCheck, ShieldAlert, ArrowLeft, Download, Server, Lock } from 'lucide-react';
import { api } from '../lib/axios';

interface VaultAuditDetail {
  id: string;
  sslIssuer: string | null;
  sslExpiryAt: string | null;
  hasCsp: boolean;
  hasHsts: boolean;
  hasXfo: boolean;
  hasNosniff: boolean;
  rawHeaders: string;
  createdAt: string;
}

interface VaultTargetResponse {
  monitorId: string;
  friendlyName: string;
  url: string;
  securityGrade: string;
  lastAudit: VaultAuditDetail | null;
}

const fetchVaultTargets = async (): Promise<VaultTargetResponse[]> => {
  const response = await api.get('/api/security/vault');
  return response.data;
};

export const Vault = () => {
  const { data: targets, isLoading, isError } = useQuery({
    queryKey: ['vaultTargets'],
    queryFn: fetchVaultTargets,
  });

  const [activeMonitorId, setActiveMonitorId] = useState<string | null>(null);

  const activeTarget = useMemo(() => {
    return targets?.find(t => t.monitorId === activeMonitorId) || null;
  }, [targets, activeMonitorId]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" className="h-[calc(100vh-64px)] text-zinc-400 font-onest">
        <Text>Decrypting Sentinel Vault...</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Box className="p-8 text-red-400 font-onest max-w-7xl mx-auto">
        <Text>Failed to synchronize Sentinel Vault state.</Text>
      </Box>
    );
  }

  if (activeTarget) {
    return <VaultDetailView target={activeTarget} onBack={() => setActiveMonitorId(null)} />;
  }

  return (
    <Box className="max-w-7xl mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-black font-unbounded text-zinc-50 tracking-tight">
          Sentinel Vault
        </h1>
        <Text className="text-zinc-400 mt-2 font-medium font-onest block">
          Continuous Exposure Management and Protocol Audits.
        </Text>
      </header>

      <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
        {targets?.map((target) => (
          <Box
            key={target.monitorId}
            onClick={() => setActiveMonitorId(target.monitorId)}
            className="bg-zinc-900 border border-zinc-800/50 p-6 cursor-pointer transition-all duration-200 hover:bg-zinc-800/80 hover:border-zinc-700"
          >
            <Flex justify="between" align="start" className="mb-4">
              <Box>
                <Text className="text-lg font-bold font-onest tracking-wide text-zinc-200 block truncate">
                  {target.friendlyName}
                </Text>
                <Text className="text-sm text-zinc-500 font-mono mt-1 block truncate">
                  {target.url}
                </Text>
              </Box>
              <Box className={`flex items-center justify-center w-10 h-10 border ${target.securityGrade === 'A' ? 'border-blue-500/30 bg-blue-500/10 text-blue-500 drop-shadow-[0_0_2px_rgba(59,130,246,0.8)]' : 'border-zinc-800 bg-zinc-950 text-zinc-400'}`}>
                <Text className="font-unbounded font-black text-xl">{target.securityGrade}</Text>
              </Box>
            </Flex>
            
            <Flex align="center" gap="2" className="text-xs text-zinc-500 font-mono">
              <Lock size={14} strokeWidth={1} />
              <Text>
                {target.lastAudit ? `Last Audit: ${new Date(target.lastAudit.createdAt).toLocaleDateString()}` : 'Pending Audit'}
              </Text>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

const VaultDetailView = ({ target, onBack }: { target: VaultTargetResponse, onBack: () => void }) => {
  const audit = target.lastAudit;

  const missingHeaders = useMemo(() => {
    if (!audit) return [];
    const headers = [];
    if (!audit.hasCsp) headers.push({ key: 'Content-Security-Policy', value: "default-src 'self'" });
    if (!audit.hasHsts) headers.push({ key: 'Strict-Transport-Security', value: "max-age=63072000; includeSubDomains; preload" });
    if (!audit.hasXfo) headers.push({ key: 'X-Frame-Options', value: "DENY" });
    if (!audit.hasNosniff) headers.push({ key: 'X-Content-Type-Options', value: "nosniff" });
    return headers;
  }, [audit]);

  const remediationConfig = useMemo(() => {
    if (missingHeaders.length === 0) return null;
    return JSON.stringify({
      headers: [{
        source: "/(.*)",
        headers: missingHeaders.map(h => ({ key: h.key, value: h.value }))
      }]
    }, null, 2);
  }, [missingHeaders]);

  const handleExport = () => {
    if (!remediationConfig) return;
    const blob = new Blob([remediationConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vercel.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box className="max-w-7xl mx-auto py-10 px-6 font-onest">
      <Button variant="ghost" onClick={onBack} className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors mb-8 cursor-pointer p-0">
        <ArrowLeft size={16} strokeWidth={1} />
        <Text>Return to Vault</Text>
      </Button>

      <header className="mb-8">
        <Flex align="center" gap="4">
          <Box className={`flex items-center justify-center w-16 h-16 border ${target.securityGrade === 'A' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 drop-shadow-[0_0_2px_rgba(59,130,246,0.8)]' : 'border-zinc-800 bg-zinc-950 text-zinc-400'}`}>
            <Text className="font-unbounded font-black text-3xl">{target.securityGrade}</Text>
          </Box>
          <Box>
            <h1 className="text-3xl font-black font-unbounded text-zinc-50 tracking-tight">
              {target.friendlyName}
            </h1>
            <Text className="text-zinc-400 font-mono mt-1 block">{target.url}</Text>
          </Box>
        </Flex>
      </header>

      {!audit ? (
        <Box className="bg-zinc-900 border border-zinc-800/50 p-8 text-center text-zinc-500">
          <Server size={32} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
          <Text>Audit data has not been generated for this target.</Text>
        </Box>
      ) : (
        <Grid columns={{ initial: '1', lg: '2' }} gap="8">
          <Flex direction="column" gap="8">
            <Box className="bg-zinc-950 border border-zinc-800 p-6 rounded-none">
              <Flex align="center" gap="3" className="mb-6">
                <Lock className="w-5 h-5 text-blue-500" strokeWidth={1} />
                <Text className="text-xl font-bold font-unbounded text-zinc-100">SSL Certificate Path</Text>
              </Flex>
              <Grid columns="2" gap="4" className="font-mono text-sm">
                <Box>
                  <Text className="text-zinc-500 uppercase text-xs font-bold block mb-1">Issuer Authority</Text>
                  <Text className="text-zinc-200">{audit.sslIssuer || 'Unknown or Self-Signed'}</Text>
                </Box>
                <Box>
                  <Text className="text-zinc-500 uppercase text-xs font-bold block mb-1">Expiration Date</Text>
                  <Text className={audit.sslExpiryAt && new Date(audit.sslExpiryAt) < new Date() ? 'text-red-400' : 'text-zinc-200'}>
                    {audit.sslExpiryAt ? new Date(audit.sslExpiryAt).toLocaleString() : 'N/A'}
                  </Text>
                </Box>
              </Grid>
            </Box>

            <Box className="bg-zinc-950 border border-zinc-800 p-6 rounded-none">
              <Flex align="center" gap="3" className="mb-6">
                <ShieldAlert className="w-5 h-5 text-blue-500" strokeWidth={1} />
                <Text className="text-xl font-bold font-unbounded text-zinc-100">Header Analysis</Text>
              </Flex>
              <Flex direction="column" gap="3">
                <HeaderRow label="Strict-Transport-Security" present={audit.hasHsts} />
                <HeaderRow label="Content-Security-Policy" present={audit.hasCsp} />
                <HeaderRow label="X-Frame-Options" present={audit.hasXfo} />
                <HeaderRow label="X-Content-Type-Options" present={audit.hasNosniff} />
              </Flex>
            </Box>
          </Flex>

          <Box>
            {remediationConfig ? (
              <Box className="bg-zinc-900 border border-zinc-800 p-6 rounded-none h-full">
                <Flex align="center" justify="between" className="mb-6">
                  <Box>
                    <Text className="text-xl font-bold font-unbounded text-zinc-100 block">Actionable Intelligence</Text>
                    <Text className="text-sm text-zinc-400 mt-1">Recommended Vercel Configuration</Text>
                  </Box>
                  <Button 
                    onClick={handleExport} 
                    className="bg-zinc-100 text-zinc-950 hover:bg-white cursor-pointer font-bold rounded-none px-4 py-2 flex items-center gap-2"
                  >
                    <Download size={16} strokeWidth={1.5} />
                    Export Fix
                  </Button>
                </Flex>
                <Box className="bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
                  <Code variant="ghost" className="text-zinc-300 whitespace-pre font-mono text-sm block">
                    {remediationConfig}
                  </Code>
                </Box>
              </Box>
            ) : (
              <Box className="bg-zinc-900 border border-zinc-800 p-6 rounded-none flex flex-col items-center justify-center h-full text-center">
                <ShieldCheck size={48} strokeWidth={1} className="text-blue-500 mb-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <Text className="text-xl font-bold font-unbounded text-zinc-100 block">Optimal Posture</Text>
                <Text className="text-sm text-zinc-400 mt-2">All primary security headers are actively enforced.</Text>
              </Box>
            )}
          </Box>
        </Grid>
      )}
    </Box>
  );
};

const HeaderRow = ({ label, present }: { label: string; present: boolean }) => (
  <Flex align="center" justify="between" className="p-3 bg-zinc-900 border border-zinc-800/50">
    <Text className="text-zinc-300 font-mono text-sm">{label}</Text>
    {present ? (
      <ShieldCheck className="text-blue-500" size={18} strokeWidth={1.5} />
    ) : (
      <ShieldAlert className="text-orange-500 drop-shadow-[0_0_2px_rgba(249,115,22,0.8)]" size={18} strokeWidth={1.5} />
    )}
  </Flex>
);