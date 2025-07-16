import Head from 'next/head';
import dynamic from 'next/dynamic';

const Chat = dynamic(() => import('@/components/Chat'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Aven AI Support Agent</title>
        <meta name="description" content="Ask Aven AI your questions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Aven AI Support</h1>
          <Chat />
        </div>
      </main>
    </>
  );
}
