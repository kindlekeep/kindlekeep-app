import { Flex, Text, Button, Card } from "@radix-ui/themes";
import { Activity } from "lucide-react";

export default function App() {
  return (
    <Flex direction="column" align="center" justify="center" className="min-h-screen p-8">
      <Card size="4" className="w-full max-w-md">
        <Flex direction="column" gap="4" align="center">
          
          <Flex align="center" justify="center" className="w-12 h-12 bg-blue-500/10 rounded-full">
            <Activity className="text-blue-500 w-6 h-6" />
          </Flex>

          <Text size="6" weight="bold" className="font-unbounded">
            KindleKeep
          </Text>
          
          <Text size="3" color="gray" className="text-center font-onest">
            Continuous Availability & Security Sentinel. Always On. Always Secure.
          </Text>

          <Button size="3" variant="solid" className="w-full mt-4 cursor-pointer">
            Initialize Engine
          </Button>

        </Flex>
      </Card>
    </Flex>
  );
}