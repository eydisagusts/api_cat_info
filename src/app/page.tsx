"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

const RefreshButton = ({ onRefresh }: { onRefresh: () => void }) => {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg border border-blue-700 shadow-lg"
      onClick={onRefresh}
    >
      Refresh
    </button>
  );
};

const ApiComponent = () => {
  const [catValues, setCatValues] = useState<{ url: string; id: string; fact: string | null }[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getCatData = useCallback(async () => {
    try { 
      const rawData = await fetch("https://api.thecatapi.com/v1/images/search?limit=9"); // Shrek API gekk brösulega, fékk bara corse og unauthenticated errors. Er þá bara með cats api.
      if (!rawData.ok) {
        throw new Error(`Something went wrong, error code: ${rawData.status}`);
      }
      const parsedData = await rawData.json();

      // Cat API var með .gif files eða slíkt, vildi filtera það út svo að ég fái bara myndir.
      const filteredData = parsedData.filter((cat: { url: string }) => 
        cat.url.endsWith('.png') || cat.url.endsWith('.jpg') || cat.url.endsWith('.jpeg')
      );

      // limit=9 virkaði ekki, fékk alltaf 10 myndir sama hvað. Prófaði þá að nota slice og þá gekk þetta.
      setCatValues(filteredData.slice(0, 9).map((cat: { url: string; id: string }) => ({ ...cat, fact: null })));
    } catch (e) {
      console.error('Error: ', e);
    }
  }, []);

  useEffect(() => {
    getCatData();
  }, [getCatData]);

  const getCatFacts = useCallback(async () => {
    try {
      const catFactsRawData = await fetch('https://catfact.ninja/fact?max_length=50'); // í assignment þá settiru held ég óvart Shrek API-inn í bæði cat facts og shrek images. Þannig að ég fann bara einhvern cat facts api og notaði hann. Veit ekki hvort að þetta sé sá sami og þú varst með.
      if (!catFactsRawData.ok) {
        throw new Error(`Something went wrong, error code: ${catFactsRawData.status}`);
      }
      const parsedData = await catFactsRawData.json();
      return parsedData.fact;
    } catch (e) {
      console.error('Error: ', e);
      return '';
    }
  }, []);

  const handleOnClick = async (id: string) => {
    const newCatValues = [...catValues];
    const clickedCat = newCatValues.find(cat => cat.id === id);

    if (clickedCat) {
      setLoadingId(id);
      const fact = await getCatFacts();
      clickedCat.fact = fact;
      setCatValues(newCatValues);
      setLoadingId(null);
    }
  };

  // Gerði fyrst (!catValues) en þá hvarf Loading... textinn, kemur bara upp ef ég set þetta upp svona. Væri gaman að heyra ef þú hefur einhver comment á það
  if (catValues.length === 0) { 
    return (
      <div className="text-2xl flex items-center justify-center mt-52">
        <span>Loading</span>
        <span className="animate-dot-bounce [animation-delay:-0.3s]">.</span>
        <span className="animate-dot-bounce2 [animation-delay:-0.15s]">.</span>
        <span className="animate-dot-bounce3">.</span>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-3 gap-4 mt-20">
        {catValues.map((cat) => (
          <div key={cat.id} className="w-[100px] h-[100px] m-2 relative overflow-hidden border rounded-[12px]">
            <Image
              src={cat.url}
              alt="Cat image"
              width={100}
              height={100}
              className="object-cover cursor-pointer"
              priority={true}
              style={{ width: "100%", height: "100%" }}
              onClick={() => handleOnClick(cat.id)} />
            {loadingId === cat.id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 text-white text-xs">
                Loading...
              </div>
            )}
            {cat.fact && loadingId !== cat.id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 text-white text-xs">
                {cat.fact}
              </div>
            )}
          </div>
        ))}
        <RefreshButton onRefresh={getCatData} />
      </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col col-span-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-3 items-center sm:items-start">
        <ApiComponent />
      </main>
    </div>
  );
}

// Refresh Button - Fann þetta fyrst: window.location.reload, veit ekki hversu sniðugt það væri samt (Sjá kóða fyrir neðan)
// Ef ég er með stærra prógram þá vil ég kannski ekki að heila síðan loadist uppá nýtt í hvert skipti sem smellt er á refresh
// Væri gaman að heyra hvað ykkur finnst. Myndu þið nota þetta í einhverjum tilfellum?

/*
const RefreshButton = () => {
  return (
    <button
      type="button"
      className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg border border-blue-700 shadow:lg"
      onClick={() => window.location.reload()} 
    >
      Refresh
    </button>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col col-span-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-3 items-center sm:items-start">
        <ApiComponent />
        <RefreshButton />
      </main>
    </div>
  );
}
*/