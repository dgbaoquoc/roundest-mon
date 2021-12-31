import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [first, second] = getOptionsForVote();
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center pt-8">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-32 h-32 bg-red-200">{first}</div>
        <div className="p-8">VS</div>
        <div className="w-32 h-32 bg-red-200">{second}</div>
      </div>
    </div>
  );
};

export default Home;
