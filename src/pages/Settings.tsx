import { useState, useEffect } from 'react';
import { Box, Flex, Text, TextField, Switch, Button, Progress } from '@radix-ui/themes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Rocket } from 'lucide-react';
import { api } from '../lib/axios';

interface UserUsageResponse {
  currentMonitors: number;
  monitorLimit: number;
}

interface UserSettingsResponse {
  discordWebhookUrl: string | null;
  enableEmailNotifications: boolean;
}

interface UpdateSettingsRequest {
  discordWebhookUrl: string;
  enableEmailNotifications: boolean;
}

export const Settings = () => {
  const queryClient = useQueryClient();
  
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);

  const { data: usage, isLoading: usageLoading } = useQuery<UserUsageResponse>({
    queryKey: ['userUsage'],
    queryFn: async () => {
      const response = await api.get('/api/users/usage');
      return response.data;
    }
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<UserSettingsResponse>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const response = await api.get('/api/users/settings');
      return response.data;
    }
  });

  useEffect(() => {
    if (settings) {
      setDiscordWebhookUrl(settings.discordWebhookUrl || '');
      setEnableEmailNotifications(settings.enableEmailNotifications);
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      await api.put('/api/users/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    }
  });

  const handleSave = () => {
    updateSettings.mutate({
      discordWebhookUrl,
      enableEmailNotifications
    });
  };

  const usagePercentage = usage ? (usage.currentMonitors / usage.monitorLimit) * 100 : 0;

  return (
    <Box className="max-w-3xl mx-auto py-10 px-6 font-satoshi">
      <Text className="font-unbounded font-bold text-3xl text-zinc-50 block mb-8">
        Identity Hub
      </Text>

      <Box className="bg-zinc-900 border border-zinc-800 p-6 mb-8" style={{ borderRadius: 0 }}>
        <Text className="font-unbounded font-bold text-xl text-zinc-50 block mb-4">
          Budget Shield
        </Text>
        {usageLoading ? (
          <Text className="text-zinc-400 font-onest">Evaluating quotas...</Text>
        ) : usage ? (
          <Box>
            <Flex justify="between" mb="2">
              <Text className="text-zinc-300 font-onest">
                {usage.currentMonitors} of {usage.monitorLimit} monitors utilized
              </Text>
              <Text className="text-zinc-400 font-onest">
                {usagePercentage.toFixed(0)}%
              </Text>
            </Flex>
            <Progress 
              value={usagePercentage} 
              className="h-2 bg-zinc-800" 
              style={{ borderRadius: 0 }}
              color={usagePercentage >= 100 ? "red" : "blue"}
            />
          </Box>
        ) : null}
      </Box>

      <Box className="bg-zinc-900 border border-zinc-800 p-6 mb-8" style={{ borderRadius: 0 }}>
        <Text className="font-unbounded font-bold text-xl text-zinc-50 block mb-6">
          Notification Routing
        </Text>

        {settingsLoading ? (
          <Text className="text-zinc-400 font-onest">Loading configuration...</Text>
        ) : (
          <Flex direction="column" gap="5">
            <Box>
              <Text className="text-zinc-300 font-onest block mb-2">
                Discord Webhook URL
              </Text>
              <TextField.Root 
                placeholder="https://discord.com/api/webhooks/..." 
                value={discordWebhookUrl}
                onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                className="font-onest bg-zinc-950 border-zinc-800 text-zinc-50"
                style={{ borderRadius: 0 }}
              />
            </Box>

            <Flex align="center" justify="between" className="pt-4 border-t border-zinc-800">
              <Box>
                <Text className="text-zinc-50 font-onest block">
                  Resend Daily Digest
                </Text>
                <Text size="2" className="text-zinc-400 font-onest">
                  Receive critical infrastructure updates via email.
                </Text>
              </Box>
              <Switch 
                checked={enableEmailNotifications}
                onCheckedChange={setEnableEmailNotifications}
                color="blue"
              />
            </Flex>
          </Flex>
        )}
      </Box>

      <Flex justify="between" align="center">
         <Text size="2" className="text-zinc-500 font-onest">
           Maintained by <a href="https://iansebastian.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-1 transition-colors"><Rocket size={12} /> iansebastian.dev</a>
         </Text>
        <Button 
          onClick={handleSave}
          disabled={updateSettings.isPending || settingsLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-onest cursor-pointer px-6"
          style={{ borderRadius: 0 }}
        >
          {updateSettings.isPending ? 'Synchronizing...' : 'Save Configuration'}
        </Button>
      </Flex>
    </Box>
  );
};