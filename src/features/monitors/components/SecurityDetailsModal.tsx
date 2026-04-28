import { Dialog, Flex, Text, Box, Code, Button } from '@radix-ui/themes';
import { ShieldCheck, ShieldAlert, Copy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { useMemo } from 'react';

export interface SecurityAuditResponse {
  hasCsp: boolean;
  hasHsts: boolean;
  hasXfo: boolean;
  hasNosniff: boolean;
  sslIssuer: string | null;
  sslExpiryAt: string | null;
  rawHeaders: string | null;
}

interface SecurityDetailsModalProps {
  monitorId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SecurityDetailsModal = ({ monitorId, isOpen, onOpenChange }: SecurityDetailsModalProps) => {
  const { data: audit, isLoading, error } = useQuery<SecurityAuditResponse>({
    queryKey: ['securityAudit', monitorId],
    queryFn: async () => {
      const response = await api.get(`/api/monitors/${monitorId}/audit`);
      return response.data;
    },
    enabled: isOpen,
  });

  const { grade, missingHeaders } = useMemo(() => {
    if (!audit) return { grade: 'U', missingHeaders: [] };
    
    const headers = [
      { key: 'Content-Security-Policy', value: "default-src 'self'", present: audit.hasCsp },
      { key: 'Strict-Transport-Security', value: "max-age=63072000; includeSubDomains; preload", present: audit.hasHsts },
      { key: 'X-Frame-Options', value: "DENY", present: audit.hasXfo },
      { key: 'X-Content-Type-Options', value: "nosniff", present: audit.hasNosniff }
    ];

    const presentCount = headers.filter(h => h.present).length;
    const calculatedGrade = presentCount === 4 ? 'A' : presentCount === 3 ? 'B' : presentCount === 2 ? 'C' : presentCount === 1 ? 'D' : 'F';
    const missing = headers.filter(h => !h.present);

    return { grade: calculatedGrade, missingHeaders: missing };
  }, [audit]);

  const daysRemaining = useMemo(() => {
    if (!audit?.sslExpiryAt) return null;
    const diffTime = Math.abs(new Date(audit.sslExpiryAt).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [audit]);

  const blueprintJson = useMemo(() => {
    if (missingHeaders.length === 0) return '';
    return JSON.stringify({
      headers: [
        {
          source: "/(.*)",
          headers: missingHeaders.map(h => ({ key: h.key, value: h.value }))
        }
      ]
    }, null, 2);
  }, [missingHeaders]);

  const copyToClipboard = async () => {
    if (blueprintJson) {
      await navigator.clipboard.writeText(blueprintJson);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content 
        className="bg-zinc-900 border border-zinc-800 rounded-none font-onest"
        style={{ borderRadius: 0, backgroundColor: '#18181B', borderColor: '#27272A' }}
        maxWidth="600px"
        aria-describedby={undefined}
      >
        <Dialog.Title className="font-unbounded font-bold text-zinc-50 mb-4">
          Sentinel Vault
        </Dialog.Title>
        <Dialog.Description className="sr-only">
          Detailed security audit results
        </Dialog.Description>

        {isLoading && <Text className="text-zinc-400">Executing deep scan...</Text>}
        {error && <Text className="text-red-400">Failed to retrieve security audit.</Text>}

        {audit && (
          <Flex direction="column" gap="5">
            <Flex align="center" justify="between" className="p-6 border border-zinc-800 bg-zinc-950">
              <Box>
                <Text size="2" className="text-zinc-400 block mb-1 font-onest">Current Grade</Text>
                <Text className="font-unbounded text-6xl text-zinc-50 font-black">{grade}</Text>
              </Box>
              <Box className="text-right">
                <Text size="2" className="text-zinc-400 block mb-1 font-onest">SSL Integrity</Text>
                <Text className="block text-zinc-50 font-onest">{audit.sslIssuer || 'Unknown Issuer'}</Text>
                <Text size="2" className={`font-onest ${daysRemaining && daysRemaining < 14 ? 'text-red-400' : 'text-blue-400'}`}>
                  {daysRemaining !== null ? `${daysRemaining} Days Remaining` : 'No Expiry Data'}
                </Text>
              </Box>
            </Flex>

            <Box>
              <Text size="3" className="font-bold text-zinc-50 mb-3 block font-onest">Defense Checklist</Text>
              <Flex direction="column" gap="2">
                <HeaderStatusItem label="Content-Security-Policy" isPresent={audit.hasCsp} />
                <HeaderStatusItem label="Strict-Transport-Security" isPresent={audit.hasHsts} />
                <HeaderStatusItem label="X-Frame-Options" isPresent={audit.hasXfo} />
                <HeaderStatusItem label="X-Content-Type-Options" isPresent={audit.hasNosniff} />
              </Flex>
            </Box>

            {missingHeaders.length > 0 && (
              <Box>
                <Flex align="center" justify="between" className="mb-2">
                  <Text size="3" className="font-bold text-zinc-50 block font-onest">Blueprint Generator (vercel.json)</Text>
                  <Button variant="ghost" className="text-zinc-400 cursor-pointer font-onest" onClick={copyToClipboard}>
                    <Copy size={16} />
                    Copy
                  </Button>
                </Flex>
                <Box className="bg-zinc-950 border border-zinc-800 p-4 relative">
                  <Code variant="ghost" className="text-zinc-300 whitespace-pre overflow-x-auto block font-mono">
                    {blueprintJson}
                  </Code>
                </Box>
              </Box>
            )}
          </Flex>
        )}

        <Flex gap="3" mt="5" justify="end">
          <Dialog.Close>
            <Button variant="soft" className="bg-zinc-800 text-zinc-50 cursor-pointer rounded-none font-onest" style={{ borderRadius: 0 }}>
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const HeaderStatusItem = ({ label, isPresent }: { label: string, isPresent: boolean }) => (
  <Flex align="center" justify="between" className="p-3 border border-zinc-800 bg-zinc-900">
    <Text className="text-zinc-300 font-onest">{label}</Text>
    {isPresent ? (
      <ShieldCheck className="text-green-500" size={20} />
    ) : (
      <ShieldAlert className="text-red-500" size={20} />
    )}
  </Flex>
);