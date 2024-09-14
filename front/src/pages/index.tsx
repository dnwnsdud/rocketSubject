
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';



export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [msg, setMsg] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const msgEndRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (e: string) => {
    router.push(router.pathname, router.asPath, { locale: e });

  };

  const chatFunc = async () => {
    if (input.trim()) {
      try {
        const res = await fetch('http://localhost:5001/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input }),
        });
        const data = await res.json();
        setMsg((prevMsg) => [...prevMsg, `You: ${input}`, `Server: ${data.response}`]);
        setInput('');
      } catch (error) {
        console.error('Fetching error', error);
      }
    }
  };

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msg]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-white shadow-md p-4">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto flex justify-between items-center">
            <h1 className="text-xl text-black font-bold">{t('title')}</h1>
            <div>
              <button
                className="text-white mr-2 px-3 py-1 bg-blue-500 rounded"
                onClick={() => changeLanguage('ko')}
              >
                한국어
              </button>
              <button
                className="text-white px-3 py-1 bg-blue-500 rounded"
                onClick={() => changeLanguage('en')}
              >
                English
              </button>
            </div>
          </div>
        </header>

        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[600px] md:h-[700px] bg-white rounded-lg shadow-lg flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {msg.map((msg, index) => (
                <div
                  key={index}
                  className={msg.startsWith('You') ? 'chat chat-end' : 'chat chat-start'}
                >
                  {msg.startsWith('You') ? (
                    <div className="chat-bubble bg-myColor text-myText">{msg.split(':')[1]}</div>
                  ) : (
                    <div className="chat-bubble text-myText">{msg.split(':')[1]}</div>
                  )}
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <div className="bg-gray-50 p-4 rounded-b-lg">
              <div className="join w-full">
                <input
                  type="text"
                  placeholder={t('placeholder')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && chatFunc()}
                  className="input input-bordered join-item flex-grow bg-white border-gray-300 text-black"
                />
                <button
                  onClick={chatFunc}
                  className="btn btn-primary join-item bg-myColor text-myText"
                >
                  {t('send')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
    }
  }
}