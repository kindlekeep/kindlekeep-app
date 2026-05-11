import { Box, Flex, Text } from '@radix-ui/themes';
import { SiGithub, SiGoogle, SiGitlab } from 'react-icons/si';
import { Link } from 'react-router-dom';

export const Signup = () => {
  const handleSignup = (provider: string) => {
    window.location.href = `http://localhost:5247/api/auth/login/${provider}`;
  };

  return (
    <Box className="min-h-screen bg-zinc-950 font-onest text-zinc-50 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
        <Flex align="center" justify="between" className="max-w-7xl mx-auto px-6 h-16 w-full">
          <Link to="/">
            <Text className="font-righteous text-xl text-zinc-50 tracking-tight lowercase">
              kindlekeep
            </Text>
          </Link>
        </Flex>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto text-center gap-16">
        <div className="w-full flex flex-col items-start text-left border-l border-indigo-400 pl-6 py-2">
          <Text className="font-mono text-zinc-500 text-sm tracking-widest mb-4">
            [STATUS: STANDBY]
          </Text>
          <Text className="font-unbounded font-bold text-xl md:text-3xl text-zinc-50 mb-2 tracking-tight uppercase">
            ACCOUNT: PROVISION
          </Text>
          <Text className="text-zinc-400 font-onest mb-6">
            Registering your industrial footprint. Select a provider to continue.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => handleSignup('github')}
              className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 py-4 px-6 rounded-none transition-colors border border-zinc-800 focus:border-zinc-500"
            >
              <SiGithub size={18} />
              <span className="font-onest font-medium tracking-wide uppercase text-sm">GitHub</span>
            </button>
            
            <button 
              onClick={() => handleSignup('google')}
              className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 py-4 px-6 rounded-none transition-colors border border-zinc-800 focus:border-zinc-500"
            >
              <SiGoogle size={18} />
              <span className="font-onest font-medium tracking-wide uppercase text-sm">Google</span>
            </button>

            <button 
              onClick={() => handleSignup('gitlab')}
              className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 py-4 px-6 rounded-none transition-colors border border-zinc-800 focus:border-zinc-500"
            >
              <SiGitlab size={18} />
              <span className="font-onest font-medium tracking-wide uppercase text-sm">GitLab</span>
            </button>
          </div>
        </div>
      </main>
    </Box>
  );
};
