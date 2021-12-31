import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center pt-8">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-32 h-32 bg-red-200 " />
        <div className="p-8">VS</div>
        <div className="w-32 h-32 bg-red-200" />
      </div>
    </div>
  );
};

export default Home;
