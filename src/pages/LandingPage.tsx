import { Box, Flex, Text } from '@radix-ui/themes';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
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
        
        {/* Kindle Scan Section */}
        <div className="w-full">
          <Text className="font-unbounded text-4xl md:text-6xl font-bold mb-4 tracking-tight text-zinc-50 block">
            Precision Scavenger
          </Text>
          <Text className="text-zinc-400 text-lg md:text-xl mb-12 font-onest block">
            Enter a Kindle ID to begin monitoring telemetric data.
          </Text>
          
          <Box className="w-full relative">
            <div className="flex items-stretch border border-zinc-700 bg-zinc-900 focus-within:border-zinc-500 transition-colors rounded-none">
              <div className="flex items-center pl-4 pr-2">
                <Search className="text-zinc-500 w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Kindle Scan..." 
                className="flex-1 bg-transparent border-none outline-none text-zinc-50 py-4 px-2 rounded-none placeholder:text-zinc-600 font-onest"
              />
              <button className="bg-zinc-100 text-zinc-950 hover:bg-zinc-300 font-bold px-8 transition-colors rounded-none font-onest">
                SCAN
              </button>
            </div>
          </Box>
        </div>

        {/* Portal Links */}
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link 
            to="/login"
            className="flex-1 py-4 px-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 font-onest font-medium tracking-wide uppercase text-sm transition-colors border border-zinc-800 hover:border-blue-500 rounded-none text-center"
          >
            Enter Command Center
          </Link>
          <Link 
            to="/signup"
            className="flex-1 py-4 px-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 font-onest font-medium tracking-wide uppercase text-sm transition-colors border border-zinc-800 hover:border-indigo-400 rounded-none text-center"
          >
            Deploy New Account
          </Link>
        </div>

      </main>
    </Box>
  );
};

